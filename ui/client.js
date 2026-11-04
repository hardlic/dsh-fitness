window.__ModuleLoader__.load({
  id: '@local/fitness-panel',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useState, useEffect, useMemo } = React

    const CSS = `

.fp-root{height:100%;overflow:auto;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.55}
.fp-wrap{max-width:1040px;margin:0 auto;padding:20px 28px 32px;display:flex;flex-direction:column;gap:14px;box-sizing:border-box}
.fp-head{display:flex;align-items:center;gap:8px}
.fp-head h1{font-size:18px;font-weight:650;margin:0;flex:1;letter-spacing:.3px}
.fp-streak{font-size:12px;color:#fff;background:var(--dsw-alias-brand-primary);border-radius:999px;padding:2px 10px;font-weight:600}
.fp-card{background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:14px;padding:16px 18px}
.fp-sec{font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary);margin:12px 0 6px;letter-spacing:.2px}
.fp-sec:first-child{margin-top:0}
.fp-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.fp-stat{text-align:center;padding:4px 0}
.fp-stat b{display:block;font-size:22px;font-weight:650;line-height:1.2;font-variant-numeric:tabular-nums}
.fp-stat span{font-size:12px;color:var(--dsw-alias-label-secondary)}
.fp-week{display:flex;gap:8px}
.fp-day{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 0 8px;border-radius:12px;border:1px solid transparent;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:12px;line-height:1.2}
.fp-day:hover{background:var(--dsw-alias-bg-layer-2)}
.fp-day .n{font-size:17px;font-weight:600;color:var(--dsw-alias-label-primary)}
.fp-day.today{color:var(--dsw-alias-brand-primary)}
.fp-day.today .n{color:var(--dsw-alias-brand-primary)}
.fp-day.sel{background:var(--dsw-alias-brand-primary);color:#fff}
.fp-day.sel .n{color:#fff}
.fp-day .d{width:5px;height:5px;border-radius:50%;background:var(--dsw-alias-brand-primary)}
.fp-day .d.hide{background:transparent}
.fp-day.sel .d{background:#fff}
.fp-row{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}
.fp-row:last-child{border-bottom:none}
.fp-row .ring{width:22px;height:22px;border-radius:50%;border:2px solid var(--dsw-alias-border-l2);display:flex;align-items:center;justify-content:center;font-size:12px;flex:none;margin-top:1px}
.fp-row .ring.done{border-color:var(--dsw-alias-state-success-primary);color:var(--dsw-alias-state-success-primary);font-weight:700}
.fp-row .body{flex:1;min-width:0}
.fp-row .t1{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.fp-row .name{font-size:13.5px;font-weight:600;line-height:1.35}
.fp-row .time{font-size:11.5px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}
.fp-row .meta{font-size:12px;color:var(--dsw-alias-label-secondary);margin-top:2px;line-height:1.45;white-space:normal;overflow-wrap:anywhere}
.fp-row .tag{display:inline-block;font-size:10.5px;color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l1);border-radius:6px;padding:0 5px;vertical-align:1px}
.fp-row .ops{flex:none;display:flex;gap:6px;align-items:center}
.fp-btn{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:9px;padding:4px 12px;font:inherit;font-size:13px;cursor:pointer;line-height:1.4}
.fp-btn:hover{background:var(--dsw-alias-bg-layer-2)}
.fp-btn.primary{background:var(--dsw-alias-brand-primary);border-color:transparent;color:#fff}
.fp-btn:disabled{opacity:.5;cursor:default}
.fp-btn.x{color:var(--dsw-alias-state-error-primary);border-color:transparent;background:transparent;padding:4px 6px}
.fp-input{flex:1;min-width:0;border:1px solid var(--dsw-alias-border-l2);border-radius:9px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);padding:7px 10px;font:inherit;font-size:13px}
.fp-input:focus{outline:1px solid var(--dsw-alias-brand-primary)}
.fp-form{display:flex;flex-direction:column;gap:8px;margin-top:12px}
.fp-line{display:flex;gap:8px}
.fp-hint{font-size:12px;color:var(--dsw-alias-label-secondary);line-height:1.55}
.fp-err{font-size:12.5px;color:var(--dsw-alias-state-error-primary)}
.fp-empty{font-size:12.5px;color:var(--dsw-alias-label-secondary);padding:8px 0}
.fp-plan{display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}
.fp-plan:last-child{border-bottom:none}
.fp-plan .nm{font-size:13px;font-weight:600;flex:none}
.fp-plan .wd{font-size:10.5px;color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l1);border-radius:6px;padding:1px 5px;flex:none}
.fp-plan .wd.on{color:#fff;background:var(--dsw-alias-brand-primary);border-color:transparent}
.fp-plan .items{flex:1;min-width:0;font-size:12px;color:var(--dsw-alias-label-secondary);line-height:1.45;white-space:normal;overflow-wrap:anywhere}
.fp-tip{font-size:12.5px;line-height:1.55;padding:7px 0 7px 10px;border-left:2px solid var(--dsw-alias-border-l2);margin-bottom:4px}
.fp-tip.start,.fp-tip.balance{border-left-color:var(--dsw-alias-brand-primary)}
.fp-tip.warn{border-left-color:var(--dsw-alias-state-warn-primary)}
.fp-tip.plan{border-left-color:var(--dsw-alias-state-idle-primary)}
.fp-tip.load,.fp-tip.done{border-left-color:var(--dsw-alias-state-success-primary)}
.fp-tip.principle{border-left-color:var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary)}
@media (max-width:640px){.fp-wrap{padding:12px 14px 20px;gap:10px}.fp-card{padding:12px 14px}.fp-stats{grid-template-columns:repeat(2,1fr)}.fp-day{padding:8px 0 6px}.fp-head h1{font-size:16px}}
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
