// Host half of @local/fitness-panel: read-only dashboard API over the
// dsh-fitness SQLite store (no writes, no cloud).
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
const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
const daysAgoKey = (days) => {
  const d = new Date()
  d.setDate(d.getDate() - Math.max(0, Number(days) - 1))
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
const todayWeekday = () => WEEKDAY_NAMES[new Date().getDay()]

function openDb() {
  if (!existsSync(DB_FILE)) return null
  return new DatabaseSync(DB_FILE, { readOnly: true })
}

function snapshot(days) {
  const today = todayKey()
  const from = daysAgoKey(days)
  const db = openDb()
  if (!db) {
    return { ok: true, found: false, today, weekday: todayWeekday(), days, todayRows: [], plans: [], planToday: [], advice: [], stats: null, history: [] }
  }
  try {
    const todayRows = db.prepare('SELECT id, date, exercise, sets, reps, weightKg, note FROM sets WHERE date=? ORDER BY id').all(today)
    const plans = db.prepare('SELECT id, name, weekday, exercises FROM plans ORDER BY id').all()
    const planToday = []
    const doneCount = {}
    for (const r of todayRows) doneCount[r.exercise] = (doneCount[r.exercise] || 0) + Number(r.sets || 0)
    for (const p of plans) {
      if (p.weekday !== '每天' && p.weekday !== todayWeekday()) continue
      let items = []
      try { items = JSON.parse(p.exercises || '[]') } catch { items = [] }
      planToday.push({
        id: p.id, name: p.name, weekday: p.weekday,
        items: items.map((e) => ({
          exercise: e.exercise,
          sets: e.sets,
          reps: e.reps,
          weightKg: e.weightKg,
          done: doneCount[e.exercise] || 0,
          complete: (doneCount[e.exercise] || 0) >= (e.sets || 1),
        })),
      })
    }
    const total = db.prepare('SELECT COUNT(*) AS entries, COALESCE(SUM(sets),0) AS totalSets, COUNT(DISTINCT date) AS dayCount FROM sets WHERE date>=?').get(from)
    const byExercise = db.prepare(`SELECT exercise, COUNT(*) AS entries, SUM(sets) AS sets,
        SUM(COALESCE(sets,1)*COALESCE(reps,0)*COALESCE(weightKg,0)) AS volume
        FROM sets WHERE date>=? GROUP BY exercise ORDER BY volume DESC`).all(from)
    const historyRows = db.prepare('SELECT id, date, exercise, sets, reps, weightKg, note FROM sets WHERE date>=? ORDER BY date DESC, id DESC LIMIT 300').all(from)
    const byDate = new Map()
    for (const r of historyRows) {
      if (!byDate.has(r.date)) byDate.set(r.date, { date: r.date, rows: [], volume: 0 })
      const g = byDate.get(r.date)
      g.rows.push(r)
      g.volume += (Number(r.sets) || 0) * (Number(r.reps) || 0) * (Number(r.weightKg) || 0)
    }
    const history = [...byDate.values()].map((g) => ({ ...g, volume: Math.round(g.volume) }))
    // ---------- 健身建议：从数据里算出来，不硬编死话 ----------
    const advice = buildAdvice(db, { today, planToday, plans, byExercise, total })
    return {
      ok: true,
      found: true,
      today,
      weekday: todayWeekday(),
      days,
      todayRows,
      plans,
      planToday,
      advice,
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

/** 推/拉/腿 部位归类（按动作名关键词，认不准的算其他）。 */
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

function buildAdvice(db, { planToday, byExercise }) {
  const tips = []
  const days7 = daysAgoKey(7)
  const days14 = daysAgoKey(14)
  const now = db.prepare('SELECT COUNT(DISTINCT date) AS d, COALESCE(SUM(sets),0) AS s FROM sets WHERE date>=?').get(days7)
  const weekVol = db.prepare('SELECT COALESCE(SUM(COALESCE(sets,1)*COALESCE(reps,0)*COALESCE(weightKg,0)),0) AS v FROM sets WHERE date>=?').get(days7).v
  const prevVol = db.prepare('SELECT COALESCE(SUM(COALESCE(sets,1)*COALESCE(reps,0)*COALESCE(weightKg,0)),0) AS v FROM sets WHERE date>=? AND date<?').get(days14, days7).v
  const trainedDays = Number(now.d || 0)

  if (trainedDays === 0) {
    tips.push({ kind: 'start', text: '本周还没练。目标先定「每周 2~3 练」，从今天练 30 分钟也算数，别一上来就冲 5 练。' })
  } else if (trainedDays >= 6) {
    tips.push({ kind: 'warn', text: `这 7 天里练了 ${trainedDays} 天。肌肉是在休息时长大的——明天安排一个完全休息日。` })
  }

  const pending = []
  for (const p of planToday) {
    for (const it of p.items) {
      if (!it.complete) pending.push(`${it.exercise} 还差 ${(it.sets || 1) - it.done} 组`)
    }
  }
  if (pending.length) tips.push({ kind: 'plan', text: `今天计划没完成：${pending.slice(0, 3).join('、')}${pending.length > 3 ? ' 等' : ''}。能补就补，只剩一组也值得做。` })

  // 动作休眠：最近 21 天练过的动作，多久没碰了
  const lastSeen = db.prepare('SELECT exercise, MAX(date) AS last FROM sets GROUP BY exercise').all()
  const stale = []
  const todayMs = new Date(todayKey() + 'T00:00:00').getTime()
  for (const r of lastSeen) {
    const gap = Math.round((todayMs - new Date(r.last + 'T00:00:00').getTime()) / 86400000)
    if (gap >= 10) stale.push({ exercise: r.exercise, gap })
  }
  stale.sort((a, b) => b.gap - a.gap)
  if (stale.length) {
    const s = stale[0]
    tips.push({ kind: 'idle', text: `「${s.exercise}」已经 ${s.gap} 天没练了，别让它掉队——下次训练优先安排它。` })
  }

  // 部位平衡（近 14 天动作覆盖）
  const recent = db.prepare('SELECT DISTINCT exercise FROM sets WHERE date>=?').all(days14).map((r) => r.exercise)
  if (recent.length) {
    const covered = new Set(recent.map(groupOf))
    const missing = ['推', '拉', '腿'].filter((g) => !covered.has(g))
    if (missing.length === 3) {
      tips.push({ kind: 'balance', text: '最近两周的动作看不出推/拉/腿分类——给动作起名时带上关键词（卧推、划船、深蹲）我就能帮你评估平衡。' })
    } else if (missing.length) {
      tips.push({ kind: 'balance', text: `最近两周缺「${missing.join('、')}」类动作，补上才能全身均衡，别只练喜欢的。` })
    }
  }

  // 容量趋势（本周 vs 上周）
  if (weekVol > 0 && prevVol > 0) {
    const delta = Math.round(((weekVol - prevVol) / prevVol) * 100)
    if (delta >= 20) tips.push({ kind: 'load', text: `本周容量比上周高了 ${delta}%，涨得有点猛——保持每组留 1~2 次余力，下周稳住别再加量。` })
    else if (delta <= -20) tips.push({ kind: 'load', text: `本周容量比上周低了 ${Math.abs(delta)}%——状态不好就练轻点，别硬顶，恢复也是训练的一部分。` })
  }

  // 渐进原则（常驻两条）
  tips.push({ kind: 'principle', text: '渐进超负荷：同一个动作，本周比上周多 1 次或多半档重量（约 2.5%）就算进步，别指望一周翻倍。' })
  tips.push({ kind: 'principle', text: '吃得够：增肌期每天蛋白质约体重×1.6~2.0g，睡眠 7~8 小时；这两条比多练一组重要得多。' })
  return tips.slice(0, 6)
}

function send(res, code, obj) {
  const body = JSON.stringify(obj)
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(body) })
  res.end(body)
}

export function apply(ctx) {
  const answer = (res, fn) => {
    Promise.resolve().then(fn)
      .then((r) => { if (r !== undefined) send(res, 200, r) })
      .catch((error) => send(res, 200, { ok: false, message: String(error && error.message ? error.message : error) }))
  }
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: PREFIX + '/data',
    handler: (req, res) => answer(res, () => {
      let days = 30
      try { days = Math.min(365, Math.max(1, Number(new URL(req.url, 'http://x').searchParams.get('days')) || 30)) } catch {}
      return snapshot(days)
    }),
  }), 'fitness-panel: /data 路由')
}
