window.__ModuleLoader__.load({
  id: '@local/fitness-panel',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useState, useEffect, useMemo } = React

    const CSS = `
.fp-root{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:13px}
.fp-wrap{max-width:560px;width:100%;margin:0 auto;padding:20px 16px 32px;display:flex;flex-direction:column;gap:14px}
.fp-head{display:flex;align-items:center;gap:8px}
.fp-head h1{font-size:16px;font-weight:600;margin:0;flex:1}
.fp-tabs{display:flex;gap:6px}
.fp-tab{border:1px solid var(--dsw-alias-border-l1);background:transparent;color:var(--dsw-alias-label-secondary);border-radius:8px;padding:3px 10px;font-size:12px;cursor:pointer}
.fp-tab.on{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-weight:600}
.fp-card{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:12px;padding:14px}
.fp-card-title{font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary);margin:0 0 10px;text-transform:uppercase;letter-spacing:.4px}
.fp-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.fp-stat{text-align:center;padding:6px 0}
.fp-stat b{display:block;font-size:16px;font-weight:600}
.fp-stat span{font-size:11px;color:var(--dsw-alias-label-secondary)}
.fp-ev{display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}
.fp-ev:last-child{border-bottom:none}
.fp-ev .fp-name{font-weight:600;min-width:64px}
.fp-ev .fp-detail{flex:1;min-width:0;color:var(--dsw-alias-label-secondary)}
.fp-ev .fp-vol{flex:none;font-size:11px;color:var(--dsw-alias-label-secondary)}
.fp-plan-item{display:flex;align-items:center;gap:8px;padding:4px 0}
.fp-plan-item .fp-pname{flex:1}
.fp-plan-item .fp-state{flex:none;font-size:11px;color:var(--dsw-alias-label-secondary)}
.fp-plan-item .fp-state.ok{color:var(--dsw-alias-state-success-primary)}
.fp-sess{display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}
.fp-sess:last-child{border-bottom:none}
.fp-sess .fp-date{flex:none;font-size:12px;color:var(--dsw-alias-label-secondary);min-width:84px}
.fp-sess .fp-body{flex:1;min-width:0;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fp-sess .fp-vol{flex:none;font-size:11px;color:var(--dsw-alias-label-secondary)}
.fp-hint{font-size:11px;color:var(--dsw-alias-label-secondary);line-height:1.5}
.fp-err{font-size:12px;color:var(--dsw-alias-state-error-primary)}
.fp-empty{font-size:12px;color:var(--dsw-alias-label-secondary);padding:8px 0}
.fp-btn{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:8px;padding:3px 10px;font-size:12px;cursor:pointer}
.fp-btn:hover{background:var(--dsw-alias-bg-layer-2)}
.fp-plan-row{padding:7px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}
.fp-plan-row:last-child{border-bottom:none}
.fp-plan-head{display:flex;align-items:center;gap:8px}
.fp-plan-name{font-weight:600;font-size:13px}
.fp-plan-wd{font-size:11px;color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l2);border-radius:6px;padding:0 6px}
.fp-plan-wd.on{color:#fff;background:var(--dsw-alias-brand-primary);border-color:transparent}
.fp-plan-items{display:flex;flex-wrap:wrap;gap:4px;margin-top:5px}
.fp-chip{font-size:11px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);border-radius:6px;padding:1px 7px}
.fp-tip{font-size:12px;line-height:1.55;padding:6px 0 6px 10px;border-left:2px solid var(--dsw-alias-border-l2);margin-bottom:4px}
.fp-tip.start,.fp-tip.balance{border-left-color:var(--dsw-alias-brand-primary)}
.fp-tip.warn{border-left-color:var(--dsw-alias-state-warn-primary)}
.fp-tip.plan{border-left-color:var(--dsw-alias-state-idle-primary)}
.fp-tip.load{border-left-color:var(--dsw-alias-state-success-primary)}
.fp-tip.principle{border-left-color:var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary)}
`

    function FitnessIcon({ size }) {
      const s = size || 16
      return h('svg', { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
        h('path', { d: 'M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11' }),
      )
    }

    const setStr = (r) => `${Number(r.sets) || 1}组${r.reps ? '×' + r.reps : ''}${r.weightKg ? ' @' + r.weightKg + 'kg' : ''}`
    const volOf = (r) => (Number(r.sets) || 0) * (Number(r.reps) || 0) * (Number(r.weightKg) || 0)

    function FitnessPage() {
      const [days, setDays] = useState(30)
      const [data, setData] = useState(null)
      const [err, setErr] = useState('')
      const [busy, setBusy] = useState(false)

      const load = (d) => {
        setBusy(true)
        fetch(`/fitness-panel/api/data?days=${d || days}`)
          .then((r) => r.json())
          .then((d) => { setErr(d.ok === false ? (d.message || '读取失败') : ''); setData(d) })
          .catch(() => setErr('接口没连上'))
          .finally(() => setBusy(false))
      }
      useEffect(() => { load(days) }, [days])

      const stats = data?.stats || null
      const planToday = data?.planToday || []
      const todayRows = data?.todayRows || []
      const history = data?.history || []

      return h('div', { className: 'fp-root' },
        h('style', null, CSS),
        h('div', { className: 'fp-wrap' },
          h('div', { className: 'fp-head' },
            h(FitnessIcon, { size: 18 }),
            h('h1', null, '健身'),
            h('div', { className: 'fp-tabs' },
              [7, 30, 90].map((d) => h('button', {
                key: d, type: 'button', className: ['fp-tab', days === d ? 'on' : ''].join(' '),
                onClick: () => setDays(d), disabled: busy,
              }, d + '天')))),
          err ? h('div', { className: 'fp-err', role: 'alert' }, err) : null,
          data && data.found === false
            ? h('div', { className: 'fp-card' }, h('div', { className: 'fp-empty' },
              '还没有训练数据。去 QQ 跟小鲸说一声，比如「记一下 卧推 4组 8次 60公斤」，这里就会出现你的训练画报了。'))
            : null,
          stats ? h('div', { className: 'fp-card' },
            h('div', { className: 'fp-card-title' }, `近 ${stats.days} 天`),
            h('div', { className: 'fp-stats' },
              h('div', { className: 'fp-stat' }, h('b', null, String(stats.dayCount)), h('span', null, '训练天数')),
              h('div', { className: 'fp-stat' }, h('b', null, String(stats.totalSets)), h('span', null, '总组数')),
              h('div', { className: 'fp-stat' }, h('b', null, stats.volume > 0 ? (Math.round(stats.volume / 100) / 10) + 't' : '—'), h('span', null, '总容量')))) : null,
          (data?.plans || []).length ? h('div', { className: 'fp-card' },
            h('div', { className: 'fp-card-title' }, '训练计划'),
            (data.plans || []).map((p) => {
              let items = []
              try { items = JSON.parse(p.exercises || '[]') } catch { items = [] }
              const isToday = p.weekday === '每天' || p.weekday === (data.weekday || '')
              return h('div', { key: p.id, className: 'fp-plan-row' },
                h('div', { className: 'fp-plan-head' },
                  h('span', { className: 'fp-plan-name' }, p.name),
                  h('span', { className: 'fp-plan-wd' + (isToday ? ' on' : '') }, isToday ? '今天' : p.weekday)),
                h('div', { className: 'fp-plan-items' }, items.map((e, i) => h('span', { key: i, className: 'fp-chip' },
                  `${e.exercise}${e.sets ? ' ' + e.sets + '×' + (e.reps || '?') : ''}${e.weightKg ? ' @' + e.weightKg + 'kg' : ''}`))))
            })) : null,
          h('div', { className: 'fp-card' },
            h('div', { className: 'fp-card-title' }, `今日计划 · ${data?.weekday || ''}`),
            planToday.length ? planToday.map((p) => h('div', { key: p.id },
              h('div', { style: { fontSize: 12, fontWeight: 600, margin: '6px 0 2px' } }, p.name),
              p.items.map((it, i) => h('div', { key: i, className: 'fp-plan-item' },
                h('span', { className: 'fp-pname' }, `${it.exercise} ${setStr(it)}`),
                h('span', { className: 'fp-state' + (it.complete ? ' ok' : '') }, it.complete ? '✅ 完成' : `⭕ 已${it.done}组`)))))
              : h('div', { className: 'fp-empty' }, '今天没有安排——休息日，好好恢复 🛌')),
          h('div', { className: 'fp-card' },
            h('div', { className: 'fp-card-title' }, `今天 · ${data?.today || ''}${todayRows.length ? ` · ${todayRows.length} 条` : ''}`),
            todayRows.length
              ? todayRows.map((r) => h('div', { key: r.id, className: 'fp-ev' },
                h('span', { className: 'fp-name' }, r.exercise),
                h('span', { className: 'fp-detail' }, setStr(r) + (r.note ? ` ｜${r.note}` : '')),
                h('span', { className: 'fp-vol' }, volOf(r) > 0 ? Math.round(volOf(r)) + 'kg' : '')))
              : h('div', { className: 'fp-empty' }, '今天还没训练。练完跟小鲸说一声，或在这里的聊天里让我记。')),
          stats && stats.byExercise.length ? h('div', { className: 'fp-card' },
            h('div', { className: 'fp-card-title' }, '动作榜'),
            stats.byExercise.slice(0, 8).map((e) => h('div', { key: e.exercise, className: 'fp-ev' },
              h('span', { className: 'fp-name' }, e.exercise),
              h('span', { className: 'fp-detail' }, `${e.entries} 条记录 · ${e.sets} 组`),
              h('span', { className: 'fp-vol' }, e.volume > 0 ? Math.round(e.volume) + 'kg' : '')))) : null,
          h('div', { className: 'fp-card' },
            h('div', { className: 'fp-card-title' }, '训练历史'),
            history.length
              ? history.map((g) => h('div', { key: g.date, className: 'fp-sess' },
                h('span', { className: 'fp-date' }, g.date + (g.date === data?.today ? ' 今天' : '')),
                h('span', { className: 'fp-body' }, g.rows.map((r) => r.exercise).join(' · ')),
                h('span', { className: 'fp-vol' }, g.volume > 0 ? Math.round(g.volume) + 'kg' : '')))
              : h('div', { className: 'fp-empty' }, `近 ${days} 天没有记录`)),
          (data?.advice || []).length ? h('div', { className: 'fp-card' },
            h('div', { className: 'fp-card-title' }, '健身建议'),
            (data.advice || []).map((a, i) => h('div', { key: i, className: 'fp-tip ' + (a.kind || '') }, a.text))) : null,
          h('div', { className: 'fp-hint' },
            '记录方式：QQ 里跟小鲸说「记一下 卧推 4组 8次 60公斤」；或直接跟我说「帮我记训练」。数据来自她的 fitness.sqlite，本面板只读。')))
    }

    const inject = ['slots']
    function apply(ctx) {
      const slots = ctx.get('slots')
      if (slots === undefined) return
      slots.inject('main', () => slots.register({ name: 'main', key: 'fitness-panel' }, FitnessPage))
      slots.inject('sidebar.panellist', () => slots.register({ name: 'sidebar.panellist', id: 'fitness-panel', order: 31, label: () => '健身' }, FitnessIcon))
    }

    const module = { exports: {} }
    module.exports.apply = apply
    module.exports.inject = inject
    module.exports.FitnessPage = FitnessPage
    module.exports.FitnessIcon = FitnessIcon
    return module.exports
  },
})
