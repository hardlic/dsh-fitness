// v0.3.1 面板 API 功能自检：任意日期 / 任意周（throwaway DSH_HOME）
import { rmSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const HOME = join(tmpdir(), 'dsh-fitness-panel-test')
rmSync(HOME, { recursive: true, force: true })
mkdirSync(HOME, { recursive: true })
process.env.DSH_HOME = HOME

const { apply: applyTool } = await import('../lib/index.js')
const { apply: applyPanel } = await import('../ui/index.js')

const registered = {}
applyTool({
  logger: { info() {}, warn() {} },
  inject(_n, fn) { fn({ tools: { register(t) { registered[t.name] = t } } }) },
  on() {},
})
const tool = registered.fitness_log
await tool.execute({ action: 'log', exercise: '卧推', sets: 4, reps: 8, weightKg: 60 })
const shift = (n) => {
  const d = new Date(); d.setDate(d.getDate() - n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const past = shift(12)
await tool.execute({ action: 'log', date: past, exercise: '深蹲', sets: 5, reps: 5, weightKg: 100 })

const routes = {}
applyPanel({
  effect(fn) { fn() },
  webServer: { register(r) { routes[r.path] = r.handler } },
})
const get = async (q) => {
  let body = ''
  const res = { writeHead() {}, end(b) { body = b } }
  await routes['/fitness-panel/api/data']({ url: '/fitness-panel/api/data' + q }, res)
  await new Promise((r) => setTimeout(r, 60))
  return JSON.parse(body)
}

// 1) 默认（今天）
let d = await get('?days=30')
console.log('default:', d.ok, 'today=', d.today, 'sel.date=', d.sel.date, 'selRows=', d.sel.rows.length, 'week0=', d.week[0].date)

// 2) 12 天前的那天 + 那一周
d = await get(`?days=30&date=${past}&anchor=${past}`)
console.log('past day:', d.sel.date, 'rows=', d.sel.rows.length, d.sel.rows[0]?.exercise, 'weekday=', d.sel.weekday)
console.log('past week:', d.week[0].date, '→', d.week[6].date, 'trainedDays=', d.week.filter((x) => x.trained).length)
const hasPast = d.week.some((x) => x.date === past && x.trained)
console.log('past week contains past trained day:', hasPast)

// 3) 无效参数回退今天
d = await get('?days=30&date=abc&anchor=9999-99-99')
console.log('fallback:', d.sel.date === d.today, 'week0 is current monday:', d.week[0].date <= d.today && d.today <= d.week[6].date)

// 4) history 仍在（流水列表用）
d = await get('?days=30')
console.log('history groups:', d.history.length, 'dates:', d.history.map((g) => g.date).join(','))

if (!hasPast) { console.error('FAIL: past week missing trained day'); process.exit(1) }
console.log('OK v0.3.1')
