window.__ModuleLoader__.load({
  id: '@local/fitness-panel',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useState, useEffect, useMemo } = React

    const CSS = `
.fp-root{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:12px}
.fp-wrap{width:100%;max-width:520px;margin:0 auto;padding:14px 12px 24px;display:flex;flex-direction:column;gap:10px;box-sizing:border-box}
.fp-head{display:flex;align-items:center;gap:6px;padding:0 2px}
.fp-head h1{font-size:14px;font-weight:600;margin:0;flex:1}
.fp-streak{font-size:10px;color:#fff;background:var(--dsw-alias-brand-primary);border-radius:9px;padding:1px 7px;font-weight:600;line-height:1.6}
.fp-card{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:10px;padding:10px 12px}
.fp-sec{font-size:10px;font-weight:600;color:var(--dsw-alias-label-secondary);letter-spacing:.5px;text-transform:uppercase;margin:8px 0 4px}
.fp-sec:first-child{margin-top:0}
.fp-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}
.fp-stat{text-align:center;padding:2px 0}
.fp-stat b{display:block;font-size:14px;font-weight:600;line-height:1.25}
.fp-stat span{font-size:10px;color:var(--dsw-alias-label-secondary)}
.fp-week{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}
.fp-day{display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 0 5px;border-radius:9px;border:1px solid transparent;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:10px;line-height:1.1}
.fp-day:hover{background:var(--dsw-alias-bg-layer-2)}
.fp-day .n{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary)}
.fp-day.today{color:var(--dsw-alias-brand-primary)}
.fp-day.today .n{color:var(--dsw-alias-brand-primary)}
.fp-day.sel{background:var(--dsw-alias-brand-primary);color:#fff}
.fp-day.sel .n{color:#fff}
.fp-day .d{width:4px;height:4px;border-radius:50%;background:var(--dsw-alias-brand-primary)}
.fp-day .d.hide{background:transparent}
.fp-day.sel .d{background:#fff}
.fp-row{display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}
.fp-row:last-child{border-bottom:none}
.fp-row .ring{width:18px;height:18px;border-radius:50%;border:2px solid var(--dsw-alias-border-l2);display:flex;align-items:center;justify-content:center;font-size:10px;flex:none;margin-top:1px}
.fp-row .ring.done{border-color:var(--dsw-alias-state-success-primary);color:var(--dsw-alias-state-success-primary);font-weight:700}
.fp-row .body{flex:1;min-width:0}
.fp-row .t1{display:flex;align-items:baseline;gap:6px}
.fp-row .name{font-size:12px;font-weight:600;line-height:1.3}
.fp-row .time{font-size:10px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}
.fp-row .meta{font-size:10px;color:var(--dsw-alias-label-secondary);margin-top:1px;line-height:1.4}
.fp-row .tag{display:inline-block;font-size:9px;color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l1);border-radius:5px;padding:0 4px;margin-left:4px;vertical-align:1px}
.fp-row .ops{flex:none;display:flex;gap:4px;align-items:center;margin-top:1px}
.fp-btn{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:7px;padding:2px 8px;font-size:11px;cursor:pointer;line-height:1.5}
.fp-btn:hover{background:var(--dsw-alias-bg-layer-2)}
.fp-btn.primary{background:var(--dsw-alias-brand-primary);border-color:transparent;color:#fff}
.fp-btn:disabled{opacity:.5;cursor:default}
.fp-btn.x{color:var(--dsw-alias-state-error-primary);border-color:transparent;background:transparent;padding:2px 4px}
.fp-input{flex:1;min-width:0;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);padding:4px 7px;font-size:12px}
.fp-input:focus{outline:1px solid var(--dsw-alias-brand-primary)}
.fp-form{display:flex;flex-direction:column;gap:5px;margin-top:8px}
.fp-line{display:flex;gap:5px}
.fp-hint{font-size:10px;color:var(--dsw-alias-label-secondary);line-height:1.5;padding:0 2px}
.fp-err{font-size:11px;color:var(--dsw-alias-state-error-primary);padding:0 2px}
.fp-empty{font-size:11px;color:var(--dsw-alias-label-secondary);padding:6px 0}
.fp-plan{display:flex;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}
.fp-plan:last-child{border-bottom:none}
.fp-plan .nm{font-size:12px;font-weight:600;flex:none}
.fp-plan .wd{font-size:9px;color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l1);border-radius:5px;padding:0 4px}
.fp-plan .wd.on{color:#fff;background:var(--dsw-alias-brand-primary);border-color:transparent}
.fp-plan .items{flex:1;min-width:0;font-size:10px;color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fp-tip{font-size:11px;line-height:1.5;padding:5px 0 5px 8px;border-left:2px solid var(--dsw-alias-border-l2);margin-bottom:3px}
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
    const fmtVol = (v) => (v >= 1000 ? (Math.round(v / 100) / 10) + 't' : Math.round(v) + 'kg')
    const wdOf = (dateStr) => WD_CN[new Date(dateStr + 'T00:00:00').getDay()]
    const hhmm = (iso) => {
      if (!iso) return ''
      const d = new Date(iso)
      if (Number.isNaN(d.getTime())) return ''
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    }
    const setStr = (r) => `${Number(r.sets) || 1}组${r.reps ? '×' + r.reps : ''}${r.weightKg ? '@' + r.weightKg + 'kg' : ''}`
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
      return { sets: reps.length, reps: Math.round(reps.reduce((a, b) => a + b, 0) / reps.length), weightKg }
    }

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
      const isToday = selected === today
      const selWd = selected ? wdOf(selected) : ''

      const selRows = useMemo(() => {
        const g = (data?.history || []).find((x) => x.date === selected)
        return g ? g.rows : []
      }, [data, selected])

      const selPlans = (data?.plans || []).filter((p) => p.weekday === '每天' || p.weekday === selWd)

      // 合并：计划项 ↔ 已有记录（同一动作只成一行，「一行一事项」）
      const planRows = []
      for (const p of selPlans) {
        let items = []
        try { items = JSON.parse(p.exercises || '[]') } catch { items = [] }
        for (const it of items) {
          const recs = selRows.filter((r) => r.exercise === it.exercise)
          const doneSets = recs.reduce((a, r) => a + Number(r.sets || 0), 0)
          planRows.push({
            planId: p.id, planName: p.name, exercise: it.exercise,
            sets: it.sets, reps: it.reps, weightKg: it.weightKg,
            recs, doneSets, complete: doneSets >= (it.sets || 1),
            time: recs.length ? hhmm(recs[0].createdAt) : '',
            actual: recs.map(setStr).join(' + '),
          })
        }
      }
      const planExercises = new Set(planRows.map((r) => r.exercise))
      const extraRows = selRows.filter((r) => !planExercises.has(r.exercise))

      const pending = planRows.filter((r) => !r.complete)
      const doneRows = planRows.filter((r) => r.complete)
      const weekInfo = data?.weekInfo || { daysTrained: 0, volume: 0, planItemsDone: 0, planItemsTotal: 0 }
      const stats = data?.stats || null

      const addQuick = async () => {
        const spec = parseSpec(qSpec)
        if (!qName.trim()) { setErr('先填动作名'); return }
        if (!spec) { setErr('组次写法不对，例：4x8@60 或 12,10,8@40'); return }
        const d = await post('quick-log', { date: selected, exercise: qName.trim(), sets: spec.sets, reps: spec.reps, weightKg: spec.weightKg })
        if (d && d.ok) { setQName(''); setQSpec('') }
      }
      const checkItem = (it) => post('check-item', { exercise: it.exercise, sets: it.sets, reps: it.reps, weightKg: it.weightKg })

      // ---------- 渲染 ----------
      const dayCard = h('div', { className: 'fp-card' },
        h('div', { className: 'fp-sec' }, `${selected || ''} ${selWd}${isToday ? ' · 今天' : ''}`),
        pending.length ? h('div', null,
          h('div', { className: 'fp-sec' }, `待完成 ${pending.length}`),
          pending.map((it, i) => h('div', { key: 'p' + i, className: 'fp-row' },
            h('span', { className: 'ring' }, ''),
            h('span', { className: 'body' },
              h('span', { className: 't1' },
                h('span', { className: 'name' }, it.exercise),
                it.planName ? h('span', { className: 'tag' }, it.planName) : null),
              h('span', { className: 'meta', style: { display: 'block' } },
                `${it.sets}组${it.reps ? '×' + it.reps : ''}${it.weightKg ? ' @' + it.weightKg + 'kg' : ''}` + (it.doneSets ? ` · 已${it.doneSets}组` : ''))),
            h('span', { className: 'ops' }, h('button', { type: 'button', className: 'fp-btn primary', disabled: busy, onClick: () => checkItem(it) }, '打卡'))))) : null,
        doneRows.length || extraRows.length ? h('div', null,
          h('div', { className: 'fp-sec' }, `已完成 ${doneRows.length + extraRows.length}`),
          doneRows.map((it, i) => h('div', { key: 'd' + i, className: 'fp-row' },
            h('span', { className: 'ring done' }, '✓'),
            h('span', { className: 'body' },
              h('span', { className: 't1' },
                h('span', { className: 'name' }, it.exercise),
                it.time ? h('span', { className: 'time' }, it.time) : null,
                it.planName ? h('span', { className: 'tag' }, it.planName) : null),
              h('span', { className: 'meta', style: { display: 'block' } }, it.actual || '已完成')),
            h('span', { className: 'ops' }))),
          extraRows.map((r) => h('div', { key: 'x' + r.id, className: 'fp-row' },
            h('span', { className: 'ring done' }, '✓'),
            h('span', { className: 'body' },
              h('span', { className: 't1' },
                h('span', { className: 'name' }, r.exercise),
                r.createdAt ? h('span', { className: 'time' }, hhmm(r.createdAt)) : null),
              h('span', { className: 'meta', style: { display: 'block' } }, setStr(r) + (r.note ? ' ｜' + r.note : '') + (volOf(r) > 0 ? ' · ' + Math.round(volOf(r)) + 'kg' : ''))),
            h('span', { className: 'ops' }, h('button', { type: 'button', className: 'fp-btn x', disabled: busy, onClick: () => post('unlog', { id: r.id }), title: '撤销' }, '✕'))))) : null,
        !pending.length && !doneRows.length && !extraRows.length ? h('div', { className: 'fp-empty' }, isToday ? '今天没有安排，也没有记录' : '这天没有记录') : null,
        h('div', { className: 'fp-form' },
          h('div', { className: 'fp-line' },
            h('input', { className: 'fp-input', style: { flex: '1 1 44%' }, type: 'text', placeholder: '动作', value: qName, onChange: (e) => setQName(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') addQuick() } }),
            h('input', { className: 'fp-input', type: 'text', placeholder: '4x8@60', value: qSpec, onChange: (e) => setQSpec(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') addQuick() } }),
            h('button', { type: 'button', className: 'fp-btn primary', disabled: busy, onClick: addQuick }, '记录')),
          h('div', { className: 'fp-hint' }, '4x8@60 = 4组8次60kg · 12,10,8@40 = 递减')))

      return h('div', { className: 'fp-root' },
        h('style', null, CSS),
        h('div', { className: 'fp-wrap' },
          h('div', { className: 'fp-head' },
            h(FitnessIcon, { size: 15 }),
            h('h1', null, '健身'),
            h('div', { style: { flex: 1 } }),
            data && data.streak > 0 ? h('span', { className: 'fp-streak', title: '连续打卡天数' }, `🔥 ${data.streak} 天`) : null),
          err ? h('div', { className: 'fp-err', role: 'alert' }, err) : null,
          h('div', { className: 'fp-card' },
            h('div', { className: 'fp-week' }, (data?.week || []).map((d, i) => h('button', {
              type: 'button', key: d.date,
              className: ['fp-day', d.date === today ? 'today' : '', d.date === selected ? 'sel' : ''].join(' ').trim(),
              onClick: () => setSel(d.date),
              title: d.date + (d.trained ? ' · 已训练' : ''),
            },
              h('span', null, WD[i]),
              h('span', { className: 'n' }, d.date === today ? '今' : d.date.slice(8)),
              h('i', { className: ['d', d.trained ? '' : 'hide'].join(' ') }))))),
          data && data.found === false ? h('div', { className: 'fp-card' }, h('div', { className: 'fp-empty' },
            '还没有训练数据。跟小鲸说「记一下 卧推 4组 8次 60公斤」，或直接在这里记录。')) : null,
          dayCard,
          h('div', { className: 'fp-card' },
            h('div', { className: 'fp-stats' },
              h('div', { className: 'fp-stat' }, h('b', null, String(stats ? stats.dayCount : 0)), h('span', null, `${days}天训练`)),
              h('div', { className: 'fp-stat' }, h('b', null, String(stats ? stats.totalSets : 0)), h('span', null, '总组数')),
              h('div', { className: 'fp-stat' }, h('b', null, stats && stats.volume > 0 ? fmtVol(stats.volume) : '—'), h('span', null, '总容量')),
              h('div', { className: 'fp-stat' }, h('b', null, `${weekInfo.daysTrained}/7`), h('span', null, '本周打卡')))),
          (data?.plans || []).length ? h('div', { className: 'fp-card' },
            h('div', { className: 'fp-sec' }, '训练计划'),
            (data.plans || []).map((p) => {
              let items = []
              try { items = JSON.parse(p.exercises || '[]') } catch { items = [] }
              const on = p.weekday === '每天' || p.weekday === selWd
              return h('div', { key: p.id, className: 'fp-plan' },
                h('span', { className: 'nm' }, p.name),
                h('span', { className: 'wd' + (on ? ' on' : '') }, on ? '今天' : p.weekday),
                h('span', { className: 'items' }, items.map((e) => e.exercise).join(' · ')))
            })) : null,
          (data?.advice || []).length ? h('div', { className: 'fp-card' },
            h('div', { className: 'fp-sec' }, '健身建议'),
            (data.advice || []).map((a, i) => h('div', { key: i, className: 'fp-tip ' + (a.kind || '') }, a.text))) : null,
          h('div', { className: 'fp-hint' }, '数据来自本机 fitness.sqlite；这里能记录/撤销，在 QQ 里跟小鲸说也一样。')))
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
