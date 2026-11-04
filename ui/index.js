// Host half of @local/fitness-panel v0.2: dashboard API over the dsh-fitness
// SQLite store. Reads for the board; a few narrow writes for quick logging
// and one-tap check-off so the panel is usable without leaving the browser.
import { DatabaseSync } from 'node:sqlite'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { existsSync } from 'node:fs'

export const inject = ['webServer']

const PREFIX = '/fitness-panel/api'
const DSH_HOME = process.env.DSH_HOME || join(homedir(), '.dsh')
const DB_FILE = join(DSH_HOME, 'dsh-fitness', 'fitness.sqlite')
const WEEKDAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const pad = (n) => String(n).padStart(2, '0')
const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const todayKey = () => keyOf(new Date())
const daysAgoKey = (days) => {
  const d = new Date()
  d.setDate(d.getDate() - Math.max(0, Number(days) - 1))
  return keyOf(d)
}
const todayWeekday = () => WEEKDAY_NAMES[new Date().getDay()]

/** 本周（周一~周日）的 7 个日期 key。 */
function weekKeys(base = new Date()) {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate())
  const offset = (d.getDay() + 6) % 7 // 周一 = 0
  d.setDate(d.getDate() - offset)
  const out = []
  for (let i = 0; i < 7; i++) {
    out.push(keyOf(d))
    d.setDate(d.getDate() + 1)
  }
  return out
}

function openDb(readOnly) {
  if (!existsSync(DB_FILE)) return null
  return new DatabaseSync(DB_FILE, { readOnly: Boolean(readOnly) })
}

const volumeOf = (r) => (Number(r.sets) || 0) * (Number(r.reps) || 0) * (Number(r.weightKg) || 0)

/** 连续打卡：从今天（今天没练就看昨天）往前数，连续有训练记录的天数。 */
function streakOf(rows) {
  const has = new Set(rows.map((r) => r.date))
  if (!has.size) return 0
  const cursor = new Date()
  if (!has.has(keyOf(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!has.has(keyOf(cursor))) return 0
  }
  let n = 0
  while (has.has(keyOf(cursor))) {
    n++
    cursor.setDate(cursor.getDate() - 1)
  }
  return n
}

const GROUPS = [
  { key: '推', re: /卧推|肩推|推举|飞鸟|夹胸|臂屈伸|三头|双杠|俯卧撑|胸/ },
  { key: '拉', re: /划船|引体|下拉|硬拉|弯举|二头|面拉|耸肩|背/ },
  { key: '腿', re: /深蹲|腿举|腿弯举|腿屈伸|弓步|小腿|提踵|臀|硬拉|罗马尼亚/ },
]
function groupOf(name) {
  const s = String(name || '')
  for (const g of GROUPS) if (g.re.test(s)) return g.key
  return '其他'
}

function buildAdvice(db, { planToday, planDoneRatio }) {
  const tips = []
  const days7 = daysAgoKey(7)
  const days14 = daysAgoKey(14)
  const now = db.prepare('SELECT COUNT(DISTINCT date) AS d FROM sets WHERE date>=?').get(days7)
  const weekVol = db.prepare('SELECT COALESCE(SUM(COALESCE(sets,1)*COALESCE(reps,0)*COALESCE(weightKg,0)),0) AS v FROM sets WHERE date>=?').get(days7).v
  const prevVol = db.prepare('SELECT COALESCE(SUM(COALESCE(sets,1)*COALESCE(reps,0)*COALESCE(weightKg,0)),0) AS v FROM sets WHERE date>=? AND date<?').get(days14, days7).v
  const trainedDays = Number(now.d || 0)

  if (trainedDays === 0) tips.push({ kind: 'start', text: '本周还没练。目标先定「每周 2~3 练」，从今天练 30 分钟也算数，别一上来就冲 5 练。' })
  else if (trainedDays >= 6) tips.push({ kind: 'warn', text: `这 7 天里练了 ${trainedDays} 天。肌肉是在休息时长大的——明天安排一个完全休息日。` })

  const pending = []
  for (const p of planToday) for (const it of p.items) if (!it.complete) pending.push(`${it.exercise} 还差 ${(it.sets || 1) - it.done} 组`)
  if (pending.length) tips.push({ kind: 'plan', text: `今天计划没完成：${pending.slice(0, 3).join('、')}${pending.length > 3 ? ' 等' : ''}。能补就补，只剩一组也值得做。` })

  const lastSeen = db.prepare('SELECT exercise, MAX(date) AS last FROM sets GROUP BY exercise').all()
  const todayMs = new Date(todayKey() + 'T00:00:00').getTime()
  const stale = []
  for (const r of lastSeen) {
    const gap = Math.round((todayMs - new Date(r.last + 'T00:00:00').getTime()) / 86400000)
    if (gap >= 10) stale.push({ exercise: r.exercise, gap })
  }
  stale.sort((a, b) => b.gap - a.gap)
  if (stale.length) tips.push({ kind: 'idle', text: `「${stale[0].exercise}」已经 ${stale[0].gap} 天没练了，别让它掉队——下次训练优先安排它。` })

  const recent = db.prepare('SELECT DISTINCT exercise FROM sets WHERE date>=?').all(days14).map((r) => r.exercise)
  if (recent.length) {
    const covered = new Set(recent.map(groupOf))
    const missing = ['推', '拉', '腿'].filter((g) => !covered.has(g))
    if (missing.length === 3) tips.push({ kind: 'balance', text: '最近两周的动作看不出推/拉/腿分类——动作名带上关键词（卧推、划船、深蹲）我就能帮你评估平衡。' })
    else if (missing.length) tips.push({ kind: 'balance', text: `最近两周缺「${missing.join('、')}」类动作，补上才能全身均衡，别只练喜欢的。` })
  }

  if (weekVol > 0 && prevVol > 0) {
    const delta = Math.round(((weekVol - prevVol) / prevVol) * 100)
    if (delta >= 20) tips.push({ kind: 'load', text: `本周容量比上周高了 ${delta}%，涨得有点猛——保持每组留 1~2 次余力，下周稳住别再加量。` })
    else if (delta <= -20) tips.push({ kind: 'load', text: `本周容量比上周低了 ${Math.abs(delta)}%——状态不好就练轻点，别硬顶，恢复也是训练的一部分。` })
  }
  if (planDoneRatio != null && planDoneRatio === 1) tips.push({ kind: 'done', text: '今天的计划全部完成了 ✅ 记录保持住，明天继续。' })

  tips.push({ kind: 'principle', text: '渐进超负荷：同一个动作，本周比上周多 1 次或多半档重量（约 2.5%）就算进步，别指望一周翻倍。' })
  tips.push({ kind: 'principle', text: '吃得够：增肌期每天蛋白质约体重×1.6~2.0g，睡眠 7~8 小时；这两条比多练一组重要得多。' })
  return tips.slice(0, 6)
}

function snapshot(days) {
  const today = todayKey()
  const from = daysAgoKey(days)
  const db = openDb(true)
  if (!db) {
    return { ok: true, found: false, today, weekday: todayWeekday(), days, week: weekKeys(), weekInfo: null, streak: 0, todayRows: [], plans: [], planToday: [], advice: [], stats: null, history: [] }
  }
  try {
    const todayRows = db.prepare('SELECT id, date, exercise, sets, reps, weightKg, note, createdAt FROM sets WHERE date=? ORDER BY id').all(today)
    const plans = db.prepare('SELECT id, name, weekday, exercises FROM plans ORDER BY id').all()
    const doneCount = {}
    for (const r of todayRows) doneCount[r.exercise] = (doneCount[r.exercise] || 0) + Number(r.sets || 0)
    const planToday = []
    for (const p of plans) {
      if (p.weekday !== '每天' && p.weekday !== todayWeekday()) continue
      let items = []
      try { items = JSON.parse(p.exercises || '[]') } catch { items = [] }
      planToday.push({
        id: p.id, name: p.name, weekday: p.weekday,
        items: items.map((e) => ({
          exercise: e.exercise, sets: e.sets, reps: e.reps, weightKg: e.weightKg,
          done: doneCount[e.exercise] || 0,
          complete: (doneCount[e.exercise] || 0) >= (e.sets || 1),
        })),
      })
    }
    const total = db.prepare('SELECT COUNT(*) AS entries, COALESCE(SUM(sets),0) AS totalSets, COUNT(DISTINCT date) AS dayCount FROM sets WHERE date>=?').get(from)
    const byExercise = db.prepare(`SELECT exercise, COUNT(*) AS entries, SUM(sets) AS sets,
        SUM(COALESCE(sets,1)*COALESCE(reps,0)*COALESCE(weightKg,0)) AS volume
        FROM sets WHERE date>=? GROUP BY exercise ORDER BY volume DESC`).all(from)
    const historyRows = db.prepare('SELECT id, date, exercise, sets, reps, weightKg, note, createdAt FROM sets WHERE date>=? ORDER BY date DESC, id DESC LIMIT 300').all(from)
    const byDate = new Map()
    for (const r of historyRows) {
      if (!byDate.has(r.date)) byDate.set(r.date, { date: r.date, rows: [], volume: 0 })
      const g = byDate.get(r.date)
      g.rows.push(r)
      g.volume += volumeOf(r)
    }
    const history = [...byDate.values()].map((g) => ({ ...g, volume: Math.round(g.volume) }))

    // 本周（周一起算）：每天是否有训练、当天容量
    const wk = weekKeys()
    const weekMap = new Map()
    for (const r of db.prepare('SELECT date, exercise, sets, reps, weightKg FROM sets WHERE date>=?').all(wk[0])) {
      const cur = weekMap.get(r.date) || { date: r.date, rows: 0, volume: 0, exercises: [] }
      cur.rows++
      cur.volume += volumeOf(r)
      if (!cur.exercises.includes(r.exercise)) cur.exercises.push(r.exercise)
      weekMap.set(r.date, cur)
    }
    const week = wk.map((k) => {
      const w = weekMap.get(k) || { rows: 0, volume: 0, exercises: [] }
      return { date: k, trained: w.rows > 0, rows: w.rows, volume: Math.round(w.volume), exercises: w.exercises }
    })
    const weekInfo = {
      daysTrained: week.filter((d) => d.trained).length,
      volume: week.reduce((a, d) => a + d.volume, 0),
      planItemsTotal: planToday.reduce((a, p) => a + p.items.length, 0),
      planItemsDone: planToday.reduce((a, p) => a + p.items.filter((i) => i.complete).length, 0),
    }

    // 连续打卡天数
    const streak = streakOf(db.prepare('SELECT DISTINCT date FROM sets ORDER BY date DESC').all())

    const planItemsTotal = planToday.reduce((a, p) => a + p.items.length, 0)
    const planItemsDone = planToday.reduce((a, p) => a + p.items.filter((i) => i.complete).length, 0)
    const advice = buildAdvice(db, { planToday, planDoneRatio: planItemsTotal ? planItemsDone / planItemsTotal : null })

    return {
      ok: true, found: true, today, weekday: todayWeekday(), days,
      week, weekInfo, streak,
      todayRows, plans, planToday, advice,
      stats: {
        days,
        entries: total.entries,
        totalSets: total.totalSets,
        dayCount: total.dayCount,
        volume: Math.round(byExercise.reduce((a, r) => a + (r.volume || 0), 0)),
        byExercise: byExercise.map((r) => ({ exercise: r.exercise, entries: r.entries, sets: r.sets, volume: Math.round(r.volume || 0) })),
      },
      history,
    }
  } finally {
    try { db.close() } catch {}
  }
}

/* ---------- 写入（快速记录 / 一键打卡 / 撤销） ---------- */

function insertSets(date, exercise, sets, reps, weightKg, note) {
  const db = openDb(false)
  if (!db) throw new Error('还没有训练数据库：先用 fitness_log 记一次，或让助手记一条')
  try {
    const info = db.prepare('INSERT INTO sets (date, exercise, sets, reps, weightKg, note) VALUES (?,?,?,?,?,?)')
      .run(String(date), String(exercise), Math.max(1, Number(sets) || 1), reps == null ? null : Number(reps), weightKg == null ? null : Number(weightKg), note ? String(note) : null)
    return Number(info.lastInsertRowid)
  } finally { try { db.close() } catch {} }
}

function deleteSets(id) {
  const db = openDb(false)
  if (!db) throw new Error('数据库不存在')
  try { return db.prepare('DELETE FROM sets WHERE id=?').run(Number(id)).changes } finally { try { db.close() } catch {} }
}

function send(res, code, obj) {
  const body = JSON.stringify(obj)
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(body) })
  res.end(body)
}

async function readBody(req) {
  const chunks = []
  for await (const c of req) chunks.push(c)
  if (!chunks.length) return {}
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { return {} }
}

export function apply(ctx) {
  const answer = (res, fn) => {
    Promise.resolve().then(fn)
      .then((r) => { if (r !== undefined) send(res, 200, r) })
      .catch((error) => send(res, 200, { ok: false, message: String(error && error.message ? error.message : error) }))
  }
  const route = (path, handler) =>
    ctx.effect(() => ctx.webServer.register({ kind: 'exact', path: PREFIX + path, handler: (req, res) => answer(res, () => handler(req, res)) }), 'fitness-panel: ' + path)

  route('/data', async (req) => {
    let days = 30
    try { days = Math.min(365, Math.max(1, Number(new URL(req.url, 'http://x').searchParams.get('days')) || 30)) } catch {}
    return snapshot(days)
  })

  // 快速记录：{ date?, exercise, sets, reps?, weightKg?, note? }
  route('/quick-log', async (req) => {
    const b = await readBody(req)
    const exercise = String(b.exercise || '').trim()
    if (!exercise) return { ok: false, message: '动作名不能为空' }
    const date = /^\d{4}-\d{2}-\d{2}$/.test(String(b.date || '')) ? String(b.date) : todayKey()
    const id = insertSets(date, exercise, b.sets, b.reps, b.weightKg, b.note)
    return { ok: true, id, date, message: `记好了：${date} ${exercise}` }
  })

  // 一键打卡：按计划动作写一条完整 sets 记录 { planId?, exercise, sets, reps?, weightKg? }
  route('/check-item', async (req) => {
    const b = await readBody(req)
    const exercise = String(b.exercise || '').trim()
    if (!exercise) return { ok: false, message: '动作名不能为空' }
    const id = insertSets(todayKey(), exercise, b.sets, b.reps, b.weightKg, 'panel:计划打卡')
    return { ok: true, id, message: `打卡 ✅ ${exercise}` }
  })

  // 撤销一条记录
  route('/unlog', async (req) => {
    const b = await readBody(req)
    const changed = deleteSets(b.id)
    return changed ? { ok: true } : { ok: false, message: '没有这条记录' }
  })
}
