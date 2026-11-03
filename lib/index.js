/**
 * dsh-fitness —— 健身打卡插件的宿主半（无 UI，Agent 工具）。
 *
 * 本地优先：SQLite 存 $DSH_HOME/dsh-fitness/fitness.sqlite。
 * 一行一条记录：date | exercise | sets | reps | weightKg | note | createdAt
 */

import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

const DSH_HOME = process.env.DSH_HOME || join(homedir(), '.dsh')
const DB_DIR = join(DSH_HOME, 'dsh-fitness')
const DB_FILE = join(DB_DIR, 'fitness.sqlite')

function db() {
  mkdirSync(DB_DIR, { recursive: true })
  const d = new DatabaseSync(DB_FILE)
  d.exec(`CREATE TABLE IF NOT EXISTS sets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    exercise TEXT NOT NULL,
    sets INTEGER NOT NULL DEFAULT 1,
    reps INTEGER,
    weightKg REAL,
    note TEXT,
    createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  )`)
  d.exec(`CREATE INDEX IF NOT EXISTS idx_sets_date ON sets(date)`)
  d.exec(`CREATE INDEX IF NOT EXISTS idx_sets_exercise ON sets(exercise)`)
  d.exec(`CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    weekday TEXT NOT NULL DEFAULT '每天',
    exercises TEXT NOT NULL DEFAULT '[]',
    createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  )`)
  return d
}

const WEEKDAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function todayWeekday() {
  return WEEKDAY_NAMES[new Date().getDay()]
}

function pad(n) {
  return String(n).padStart(2, '0')
}

/** 本地时区今天 YYYY-MM-DD */
function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** 往前推 days 天的 YYYY-MM-DD（含今天） */
function daysAgoKey(days) {
  const d = new Date()
  d.setDate(d.getDate() - Math.max(0, Number(days) - 1))
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function validDate(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''))
}

function rowText(r) {
  const weight = r.weightKg != null ? ` @${r.weightKg}kg` : ''
  const reps = r.reps != null ? `×${r.reps}` : ''
  return `- ${r.date} ${r.exercise} ${r.sets}组${reps}${weight}${r.note ? ` ｜${r.note}` : ''}`
}

/* ---------- cordis 插件入口 ---------- */

function apply(ctx) {
  const log = (msg) => ctx.logger?.info?.(`[fitness] ${msg}`)

  ctx.inject(['tools'], (toolScoped) => {
    toolScoped.tools.register({
      name: 'fitness_log',
      description:
        '健身打卡：记录和查询训练。' +
        'action=log 记一次（exercise 动作名，sets 组数，reps 每组次数，weightKg 重量，date 可省=今天，note 备注）；' +
        'action=today 看今天；action=history 查历史（exercise 筛动作，days 往前看几天）；' +
        'action=stats 本周统计（总组数、总容量、动作榜）。容量 = 组数×次数×重量。' +
        '计划：action=plan_add 建计划（name 计划名，weekday 周一~周日或每天，exercises 动作列表）；plan_list 看计划；plan_remove 删计划（id）；plan_today 今天该练什么+完成对照。',
      parameters: {
        type: 'object',
        properties: {
          action: { type: 'string', enum: ['log', 'today', 'history', 'stats', 'plan_add', 'plan_list', 'plan_remove', 'plan_today'], description: '要做的动作。' },
          exercise: { type: 'string', description: '动作名，如 卧推 / 深蹲。' },
          sets: { type: 'number', description: 'log：组数。' },
          reps: { type: 'number', description: 'log：每组次数。' },
          weightKg: { type: 'number', description: 'log：重量（kg）。' },
          date: { type: 'string', description: 'log：YYYY-MM-DD，默认今天。' },
          days: { type: 'number', description: 'history/stats：往前看几天，默认 7。' },
          note: { type: 'string', description: 'log：备注，可省。' },
          name: { type: 'string', description: 'plan_add：计划名，如 练胸日。' },
          weekday: { type: 'string', description: 'plan_add：周一~周日 或 每天，默认每天。' },
          exercises: { type: 'array', items: { type: 'object', properties: { exercise: { type: 'string' }, sets: { type: 'number' }, reps: { type: 'number' }, weightKg: { type: 'number' } }, required: ['exercise'], additionalProperties: false }, description: 'plan_add：动作列表。' },
          id: { type: 'number', description: 'plan_remove：计划 id。' },
        },
        required: ['action'],
        additionalProperties: false,
      },
      output: {
        schema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'], additionalProperties: false },
        render(_args, value) {
          return [{ type: 'text', text: String((value && value.text) || '') }]
        },
      },
      presentCall(args) {
        return { card: 'terminal', title: `fitness_log ${String((args && args.action) || '')}`.trim() }
      },
      async execute(args) {
        const action = String((args && args.action) || '').toLowerCase()
        const d = db()

        if (action === 'log') {
          const exercise = String(args.exercise || '').trim()
          if (!exercise) return { text: 'log 需要 exercise（动作名）' }
          const date = validDate(args.date) ? String(args.date) : todayKey()
          const sets = Math.max(1, Number(args.sets) || 1)
          const reps = Number.isFinite(Number(args.reps)) && args.reps != null ? Number(args.reps) : null
          const weightKg = Number.isFinite(Number(args.weightKg)) && args.weightKg != null ? Number(args.weightKg) : null
          const note = String(args.note || '').trim() || null
          d.prepare('INSERT INTO sets (date, exercise, sets, reps, weightKg, note) VALUES (?,?,?,?,?,?)').run(date, exercise, sets, reps, weightKg, note)
          const count = d.prepare('SELECT COUNT(*) AS n FROM sets WHERE date=?').get(date).n
          return { text: `打卡 ✅ ${date} ${exercise} ${sets}组${reps ? `×${reps}` : ''}${weightKg ? ` @${weightKg}kg` : ''}${note ? ` ｜${note}` : ''}（今天已记 ${count} 条）` }
        }

        if (action === 'today') {
          const rows = d.prepare('SELECT * FROM sets WHERE date=? ORDER BY id').all(todayKey())
          if (!rows.length) return { text: `今天（${todayKey()}）还没训练记录，练起来！` }
          return { text: [`今天（${todayKey()}）：`, ...rows.map(rowText)].join('\n') }
        }

        if (action === 'history') {
          const days = Math.min(365, Math.max(1, Number(args.days) || 7))
          const from = daysAgoKey(days)
          const exercise = String(args.exercise || '').trim()
          const rows = exercise
            ? d.prepare('SELECT * FROM sets WHERE date>=? AND exercise LIKE ? ORDER BY date DESC, id DESC').all(from, `%${exercise}%`)
            : d.prepare('SELECT * FROM sets WHERE date>=? ORDER BY date DESC, id DESC').all(from)
          if (!rows.length) return { text: `最近 ${days} 天没有${exercise ? `「${exercise}」` : ''}记录` }
          return { text: [`最近 ${days} 天${exercise ? `「${exercise}」` : ''}共 ${rows.length} 条：`, ...rows.map(rowText)].join('\n') }
        }

        if (action === 'stats') {
          const days = Math.min(365, Math.max(1, Number(args.days) || 7))
          const from = daysAgoKey(days)
          const total = d.prepare('SELECT COUNT(*) AS entries, COALESCE(SUM(sets),0) AS totalSets FROM sets WHERE date>=?').get(from)
          const byExercise = d.prepare(`SELECT exercise, COUNT(*) AS entries, SUM(sets) AS sets,
              SUM(COALESCE(sets,1)*COALESCE(reps,0)*COALESCE(weightKg,0)) AS volume
              FROM sets WHERE date>=? GROUP BY exercise ORDER BY volume DESC`).all(from)
          if (!byExercise.length) return { text: `最近 ${days} 天没有训练记录` }
          const lines = byExercise.map((r) => {
            const vol = r.volume > 0 ? `，容量 ${Math.round(r.volume)}kg` : ''
            return `- ${r.exercise}：${r.entries} 条 ${r.sets} 组${vol}`
          })
          return { text: [`最近 ${days} 天：${total.entries} 条记录，共 ${total.totalSets} 组`, '', ...lines].join('\n') }
        }

        if (action === 'plan_add') {
          const name = String(args.name || '').trim()
          if (!name) return { text: 'plan_add 需要 name（计划名）' }
          const weekdayRaw = String(args.weekday || '每天').trim()
          const weekday = WEEKDAY_NAMES.includes(weekdayRaw) ? weekdayRaw : '每天'
          const list = Array.isArray(args.exercises) ? args.exercises.filter((e) => e && String(e.exercise || '').trim()) : []
          if (!list.length) return { text: 'plan_add 需要 exercises（至少一个动作：exercise 必填，sets/reps/weightKg 可选）' }
          const clean = list.map((e) => ({
            exercise: String(e.exercise).trim(),
            sets: Math.max(1, Number(e.sets) || 1),
            reps: e.reps != null && Number.isFinite(Number(e.reps)) ? Number(e.reps) : null,
            weightKg: e.weightKg != null && Number.isFinite(Number(e.weightKg)) ? Number(e.weightKg) : null,
          }))
          const info = d.prepare('INSERT INTO plans (name, weekday, exercises) VALUES (?,?,?)').run(name, weekday, JSON.stringify(clean))
          const detail = clean.map((e) => `${e.exercise}${e.sets}组${e.reps ? `×${e.reps}` : ''}${e.weightKg ? ` @${e.weightKg}kg` : ''}`).join('、')
          return { text: `计划建好 ✅ #${info.lastInsertRowid} ${name}（${weekday}）：${detail}` }
        }

        if (action === 'plan_list') {
          const rows = d.prepare('SELECT * FROM plans ORDER BY id').all()
          if (!rows.length) return { text: '还没有训练计划，plan_add 建一个' }
          const lines = rows.map((p) => {
            const list = JSON.parse(p.exercises || '[]')
            const detail = list.map((e) => `${e.exercise}${e.sets}组${e.reps ? `×${e.reps}` : ''}${e.weightKg ? ` @${e.weightKg}kg` : ''}`).join('、')
            return `- #${p.id} ${p.name}（${p.weekday}）：${detail}`
          })
          return { text: ['训练计划：', ...lines].join('\n') }
        }

        if (action === 'plan_remove') {
          const id = Number(args.id)
          if (!Number.isInteger(id)) return { text: 'plan_remove 需要 id（plan_list 里看）' }
          const row = d.prepare('SELECT * FROM plans WHERE id=?').get(id)
          if (!row) return { text: `找不到计划 #${id}` }
          d.prepare('DELETE FROM plans WHERE id=?').run(id)
          return { text: `已删计划 #${id} ${row.name}` }
        }

        if (action === 'plan_today') {
          const today = todayKey()
          const wd = todayWeekday()
          const rows = d.prepare('SELECT * FROM plans ORDER BY id').all()
          const todays = rows.filter((p) => p.weekday === '每天' || p.weekday === wd)
          const doneRows = d.prepare('SELECT * FROM sets WHERE date=? ORDER BY id').all(today)
          const doneCount = {}
          for (const r of doneRows) doneCount[r.exercise] = (doneCount[r.exercise] || 0) + Number(r.sets || 0)
          if (!todays.length) return { text: `今天（${today} ${wd}）没有安排的计划` }
          const lines = []
          for (const p of todays) {
            lines.push(`#️⃣ ${p.name}（${p.weekday}）`)
            for (const e of JSON.parse(p.exercises || '[]')) {
              const done = doneCount[e.exercise] || 0
              const ok = done >= e.sets ? ' ✅' : ` ⭕已${done}组`
              lines.push(`  - ${e.exercise} ${e.sets}组${e.reps ? `×${e.reps}` : ''}${e.weightKg ? ` @${e.weightKg}kg` : ''}${ok}`)
            }
          }
          return { text: [`今天（${today} ${wd}）该练：`, ...lines].join('\n') }
        }

        return { text: `不认识的动作：${action}` }
      },
    })
  })

  log('dsh-fitness ready')
}

export { apply }
