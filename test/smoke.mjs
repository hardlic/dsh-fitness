import { apply } from '../lib/index.js'

const registered = {}
const fakeCtx = {
  logger: { info() {}, warn() {} },
  inject(_names, fn) {
    fn({ tools: { register(t) { registered[t.name] = t } } })
  },
  on() {},
}
apply(fakeCtx)
const tool = registered.fitness_log
if (!tool) throw new Error('fitness_log 未注册')

const show = async (label, args) => console.log(`【${label}】`, (await tool.execute(args)).text)

await show('记一组', { action: 'log', exercise: '卧推', sets: 4, reps: 8, weightKg: 60, note: '最后一组力竭' })
await show('再记', { action: 'log', exercise: '深蹲', sets: 5, reps: 5, weightKg: 80 })
await show('今天', { action: 'today' })
await show('历史-卧推', { action: 'history', exercise: '卧推' })
await show('统计', { action: 'stats' })
await show('缺动作', { action: 'log' })
await show('建计划', { action: 'plan_add', name: '练胸日', weekday: '每天', exercises: [{ exercise: '卧推', sets: 4, reps: 8, weightKg: 60 }, { exercise: '夹胸', sets: 3, reps: 12 }] })
await show('计划列表', { action: 'plan_list' })
await show('今天该练', { action: 'plan_today' })
await show('再补一组', { action: 'log', exercise: '卧推', sets: 4, reps: 8, weightKg: 62 })
await show('今天该练2', { action: 'plan_today' })
await show('删计划', { action: 'plan_remove', id: 1 })
await show('计划列表2', { action: 'plan_list' })
