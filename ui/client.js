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
.fp-badge{font-size:11px;color:#fff;background:var(--dsw-alias-brand-primary);border-radius:10px;padding:2px 8px;font-weight:600}
.fp-tabs{display:flex;gap:6px}
.fp-tab{border:1px solid var(--dsw-alias-border-l1);background:transparent;color:var(--dsw-alias-label-secondary);border-radius:8px;padding:3px 10px;font-size:12px;cursor:pointer}
.fp-tab.on{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-weight:600}
.fp-card{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:12px;padding:14px}
.fp-card-title{font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary);margin:0 0 10px;text-transform:uppercase;letter-spacing:.4px}
.fp-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.fp-stat{text-align:center;padding:6px 0}
.fp-stat b{display:block;font-size:16px;font-weight:600}
.fp-stat span{font-size:11px;color:var(--dsw-alias-label-secondary)}
.fp-week{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.fp-day{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 0 7px;border-radius:10px;border:1px solid transparent;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:11px}
.fp-day:hover{background:var(--dsw-alias-bg-layer-2)}
.fp-day .n{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary);line-height:1.1}
.fp-day.today{color:var(--dsw-alias-brand-primary)}
.fp-day.today .n{color:var(--dsw-alias-brand-primary)}
.fp-day.sel{background:var(--dsw-alias-brand-primary);color:#fff}
.fp-day.sel .n{color:#fff}
.fp-day .dot{width:4px;height:4px;border-radius:50%;background:var(--dsw-alias-brand-primary)}
.fp-day.sel .dot{background:#fff}
.fp-day .dot.hidden{background:transparent}
.fp-day .vol{font-size:9px;opacity:.8}
.fp-timeline{display:flex;flex-direction:column;gap:2px}
.fp-row{display:flex;align-items:center;gap:9px;padding:8px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}
.fp-row:last-child{border-bottom:none}
.fp-row .dotline{display:flex;flex-direction:column;align-items:center;gap:2px;flex:none}
.fp-row .ring{width:22px;height:22px;border-radius:50%;border:2px solid var(--dsw-alias-border-l2);display:flex;align-items:center;justify-content:center;font-size:11px;flex:none}
.fp-row .ring.done{border-color:var(--dsw-alias-state-success-primary);color:var(--dsw-alias-state-success-primary);font-weight:700}
.fp-row .body{flex:1;min-width:0}
.fp-row .name{font-size:13px;font-weight:600;line-height:1.3}
.fp-row .meta{font-size:11px;color:var(--dsw-alias-label-secondary);margin-top:1px}
.fp-row .ops{flex:none;display:flex;gap:4px}
.fp-btn{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:8px;padding:3px 9px;font-size:12px;cursor:pointer;line-height:1.4}
.fp-btn:hover{background:var(--dsw-alias-bg-layer-2)}
.fp-btn.primary{background:var(--dsw-alias-brand-primary);border-color:transparent;color:#fff}
.fp-btn.primary:disabled,.fp-btn:disabled{opacity:.5;cursor:default}
.fp-btn.danger{color:var(--dsw-alias-state-error-primary)}
.fp-input{flex:1;min-width:0;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);padding:5px 8px;font-size:13px}
.fp-input:focus{outline:1px solid var(--dsw-alias-brand-primary)}
.fp-form{display:flex;flex-direction:column;gap:6px;margin-top:10px}
.fp-line{display:flex;gap:6px}
.fp-hint{font-size:11px;color:var(--dsw-alias-label-secondary);line-height:1.5}
.fp-err{font-size:12px;color:var(--dsw-alias-state-error-primary)}
.fp-empty{font-size:12px;color:var(--dsw-alias-label-secondary);padding:8px 0}
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
.fp-tip.load,.fp-tip.done{border-left-color:var(--dsw-alias-state-success-primary)}
.fp-tip.principle{border-left-color:var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary)}
`

    function FitnessIcon({ size }) {
      const s = size || 16
      return h('svg', { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
        h('path', { d: 'M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11' }),
      )
    }

    const WD = ['一', '二', '三', '四', '五', '六', '日']
    const WD_CN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const setStr = (r) => `${Number(r.sets) || 1}组${r.reps ? '×' + r.reps : ''}${r.weightKg ? ' @' + r.weightKg + 'kg' : ''}`
    const volOf = (r) => (Number(r.sets) || 0) * (Number(r.reps) || 0) * (Number(r.weightKg) || 0)

    /** "4x8@60" / "12,10,8@40" → { sets, reps, weightKg } | null */
    function parseSpec(input) {
      const s = String(input || '').trim().replace(/×|x|X/g, 'x')
      if (!s) return null
      const m = s.match(/^([\d\s,x]+?)(?:@?\s*([\d.]+)\s*kg?)?$/)
      if (!m) return null
      const weightKg = m[2] !== undefined && m[2] !== '' ? Number(m[2]) : null
      const body = m[1].replace(/\s/g, '')
      const rep = body.match(/^(\d+)x(\d+)$/)
      if (rep) return { sets: Number(rep[1]), reps: Number(rep[2]), weightKg }
      const reps = body.split(',').map(Number).filter((n) => Number.isFinite(n) && n > 0)
      if (!reps.length) return null
      const total = reps.reduce((a, b) => a + b, 0)
      return { sets: reps.length, reps: Math.round(total / reps.length), weightKg }
    }

    const wdOf = (dateStr) => WD_CN[new Date(dateStr + 'T00:00:00').getDay()]
    const fmtVol = (v) => v > 0 ? (v >= 1000 ? (Math.round(v / 100) / 10) + 't' : Math.round(v) + 'kg') : '—'

    function FitnessPage() {
      const [days, setDays] = useState(30)
      const [data, setData] = useState(null)
      const [sel, setSel] = useState(null)
      const [err, setErr] = useState('')
      const [busy, setBusy] = useState(false)
      const [qName, setQName] = useState('')
      const [qSpec, setQSpec] = useState('')

      const load = (d) => {
        fetch(`/fitness-panel/api/data?days=${d || days}`)
          .then((r) => r.json())
          .then((d2) => {
            setErr(d2.ok === false ? (d2.message || '读取失败') : '')
            setData(d2)
            if (!sel && d2.today) setSel(d2.today)
          })
          .catch(() => setErr('接口没连上'))
      }
      useEffect(() => { load(days) }, [days])

      const post = async (path, body) => {
        setBusy(true)
        try {
          const r = await fetch('/fitness-panel/api/' + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}) })
          const d = await r.json().catch(() => ({}))
          if (!d.ok) setErr(d.message || '操作失败')
          else setErr('')
          await load()
          return d
        } catch { setErr('接口没连上') } finally { setBusy(false) }
      }

      const today = data?.today || null
      const selected = sel || today
      const byDate = useMemo(() => {
        const map = new Map()
        for (const g of data?.history || []) map.set(g.date, g)
        return map
      }, [data])
      const selGroup = selected ? byDate.get(selected) : null
      const selRows = selGroup ? selGroup.rows : []
      const plans = data?.plans || []
      const selWd = selected ? wdOf(selected) : ''
      const selPlans = plans.filter((p) => p.weekday === '每天' || p.weekday === selWd)
      const doneCount = {}
      for (const r of selRows) doneCount[r.exercise] = (doneCount[r.exercise] || 0) + Number(r.sets || 0)
      const planItems = []
      for (const p of selPlans) {
        let items = []
        try { items = JSON.parse(p.exercises || '[]') } catch { items = [] }
        for (const it of items) planItems.push({ planId: p.id, planName: p.name, exercise: it.exercise, sets: it.sets, reps: it.reps, weightKg: it.weightKg, done: doneCount[it.exercise] || 0 })
      }
      const weekInfo = data?.weekInfo || { daysTrained: 0, volume: 0, planItemsTotal: 0, planItemsDone: 0 }
      const stats = data?.stats || null

      const addQuick = async () => {
        const spec = parseSpec(qSpec)
        if (!qName.trim()) { setErr('先填动作名'); return }
        if (!spec) { setErr('组次写法不对，例：4x8@60 或 12,10,8@40'); return }
        const d = await post('quick-log', { date: selected, exercise: qName.trim(), sets: spec.sets, reps: spec.reps, weightKg: spec.weightKg })
        if (d && d.ok) { setQName(''); setQSpec('') }
      }

      const checkItem = async (it) => {
        await post('check-item', { exercise: it.exercise, sets: it.sets, reps: it.reps, weightKg: it.weightKg })
      }

      return h('div', { className: 'fp-root' },
        h('style', null, CSS),
        h('div', { className: 'fp-wrap' },
          h('div', { className: 'fp-head' },
            h(FitnessIcon, { size: 18 }),
            h('h1', null, '健身'),
            data && data.streak > 0 ? h('span', { className: 'fp-badge', title: '连续打卡天数' }, `🔥 ${data.streak} 天`) : null,
            h('div', { style: { flex: 1 } }),
            h('div', { className: 'fp-tabs' }, [7, 30, 90].map((d) => h('button', {
              key: d, type: 'button', className: ['fp-tab', days === d ? 'on' : ''].join(' '),
              onClick: () => setDays(d), disabled: busy,
            }, d + '天')))),
          err ? h('div', { className: 'fp-err', role: 'alert' }, err) : null,
          data && data.found === false ? h('div', { className: 'fp-card' }, h('div', { className: 'fp-empty' },
            '还没有训练数据。去 QQ 跟小鲸说一声「记一下 卧推 4组 8次 60公斤」，或直接在这里记录。')) : null,

          h('div', { className: 'fp-card' },
            h('div', { className: 'fp-card-title' }, '本周 · 点日期查看'),
            h('div', { className: 'fp-week' }, (data?.week || []).map((d, i) => h('button', {
              type: 'button', key: d.date,
              className: ['fp-day', d.date === today ? 'today' : '', d.date === selected ? 'sel' : ''].join(' ').trim(),
              onClick: () => setSel(d.date),
              title: d.date + (d.trained ? ' 已训练' : ''),
            },
              h('span', null, WD[i]),
              h('span', { className: 'n' }, d.date.slice(8)),
              h('span', { className: 'vol' }, d.volume > 0 ? fmtVol(d.volume) : ' '),
              h('i', { className: ['dot', d.trained ? '' : 'hidden'].join(' ') }))))),

          h('div', { className: 'fp-card' },
            h('div', { className: 'fp-card-title' }, `${selected || ''} · ${selWd}${selected === today ? ' · 今天' : ''}`),
            h('div', { className: 'fp-timeline' },
              planItems.map((it, i) => h('div', { key: 'p' + i, className: 'fp-row' },
                h('span', { className: ['ring', (doneCount[it.exercise] || 0) >= (it.sets || 1) ? 'done' : ''].join(' ') }, (doneCount[it.exercise] || 0) >= (it.sets || 1) ? '✓' : ''),
                h('span', { className: 'body' },
                  h('span', { className: 'name', style: { display: 'block' } }, it.exercise),
                  h('span', { className: 'meta', style: { display: 'block' } }, `计划 ${it.sets}组${it.reps ? '×' + it.reps : ''}${it.weightKg ? ' @' + it.weightKg + 'kg' : ''} · 已${doneCount[it.exercise] || 0}组`)
                ),
                h('span', { className: 'ops' },
                  (doneCount[it.exercise] || 0) < (it.sets || 1) ? h('button', { type: 'button', className: 'fp-btn primary', disabled: busy, onClick: () => checkItem(it) }, '打卡') : null)
              )),
              selRows.map((r) => h('div', { key: 'r' + r.id, className: 'fp-row' },
                h('span', { className: 'ring done' }, '✓'),
                h('span', { className: 'body' },
                  h('span', { className: 'name', style: { display: 'block' } }, r.exercise),
                  h('span', { className: 'meta', style: { display: 'block' } }, setStr(r) + (r.note ? ' ｜' + r.note : '') + (volOf(r) > 0 ? ' · ' + Math.round(volOf(r)) + 'kg' : ''))),
                h('span', { className: 'ops' }, h('button', { type: 'button', className: 'fp-btn danger', disabled: busy, onClick: () => post('unlog', { id: r.id }), title: '撤销这条' }, '✕'))))
            ),
            !planItems.length && !selRows.length ? h('div', { className: 'fp-empty' }, hiEmpty(selected, today)) : null,
            h('div', { className: 'fp-form' },
              h('div', { className: 'fp-line' },
                h('input', { className: 'fp-input', style: { flex: '1 1 46%' }, type: 'text', placeholder: '动作（如 卧推）', value: qName, onChange: (e) => setQName(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') addQuick() } }),
                h('input', { className: 'fp-input', type: 'text', placeholder: '4x8@60', value: qSpec, onChange: (e) => setQSpec(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') addQuick() } }),
                h('button', { type: 'button', className: 'fp-btn primary', disabled: busy, onClick: addQuick }, '+记')),
              h('div', { className: 'fp-hint' }, `记到 ${selected || ''}；写法：4x8@60（4组8次60kg）、12,10,8@40（递减）`))),

          h('div', { className: 'fp-card' },
            h('div', { className: 'fp-card-title' }, `近 ${days} 天`),
            h('div', { className: 'fp-stats' },
              h('div', { className: 'fp-stat' }, h('b', null, String(stats ? stats.dayCount : 0)), h('span', null, '训练天数')),
              h('div', { className: 'fp-stat' }, h('b', null, String(stats ? stats.totalSets : 0)), h('span', null, '总组数')),
              h('div', { className: 'fp-stat' }, h('b', null, stats && stats.volume > 0 ? (Math.round(stats.volume / 100) / 10) + 't' : '—'), h('span', null, '总容量')),
              h('div', { className: 'fp-stat' }, h('b', null, `${weekInfo.daysTrained}/7`), h('span', null, '本周打卡')))),

          plans.length ? h('div', { className: 'fp-card' },
            h('div', { className: 'fp-card-title' }, '训练计划'),
            plans.map((p) => {
              let items = []
              try { items = JSON.parse(p.exercises || '[]') } catch { items = [] }
              const isToday = p.weekday === '每天' || p.weekday === (data?.weekday || '')
              return h('div', { key: p.id, className: 'fp-plan-row' },
                h('div', { className: 'fp-plan-head' },
                  h('span', { className: 'fp-plan-name' }, p.name),
                  h('span', { className: 'fp-plan-wd' + (isToday ? ' on' : '') }, isToday ? '今天' : p.weekday)),
                h('div', { className: 'fp-plan-items' }, items.map((e, i) => h('span', { key: i, className: 'fp-chip' },
                  `${e.exercise}${e.sets ? ' ' + e.sets + '×' + (e.reps || '?') : ''}${e.weightKg ? ' @' + e.weightKg + 'kg' : ''}`))))
            })) : null,

          stats && stats.byExercise.length ? h('div', { className: 'fp-card' },
            h('div', { className: 'fp-card-title' }, '动作榜'),
            stats.byExercise.slice(0, 8).map((e) => h('div', { className: 'fp-row' },
              h('span', { className: 'body' },
                h('span', { className: 'name', style: { display: 'block' } }, e.exercise),
                h('span', { className: 'meta', style: { display: 'block' } }, `${e.entries} 条 · ${e.sets} 组`)),
              h('span', { className: 'meta' }, e.volume > 0 ? Math.round(e.volume) + 'kg' : '')))) : null,

          (data?.advice || []).length ? h('div', { className: 'fp-card' },
            h('div', { className: 'fp-card-title' }, '健身建议'),
            (data.advice || []).map((a, i) => h('div', { key: i, className: 'fp-tip ' + (a.kind || '') }, a.text))) : null,

          h('div', { className: 'fp-hint' },
            '数据来自 fitness.sqlite；这里可以直接记录/撤销，聊里跟小鲸说也一样。')))
    }

    function hiEmpty(sel, today) {
      return sel === today ? '今天还没有记录，动起来！' : '这天没有记录'
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
