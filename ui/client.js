window.__ModuleLoader__.load({
  id: '@local/fitness-panel',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useState, useEffect, useMemo, useRef } = React

    const CSS = `
.fp-root{height:100%;overflow:auto;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.55}
.fp-wrap{max-width:1040px;margin:0 auto;padding:20px 28px 40px;display:flex;flex-direction:column;gap:14px;box-sizing:border-box}
.fp-head{display:flex;align-items:center;gap:8px}
.fp-head h1{font-size:18px;font-weight:650;margin:0;letter-spacing:.3px}
.fp-streak{font-size:12px;color:#fff;background:var(--dsw-alias-brand-primary);border-radius:999px;padding:2px 10px;font-weight:600}
.fp-tabs{display:flex;gap:2px;border-bottom:1px solid var(--dsw-alias-border-l1);margin:2px 0 2px}
.fp-tab{position:relative;border:0;background:transparent;color:var(--dsw-alias-label-secondary);padding:9px 14px;font:inherit;font-size:13px;cursor:pointer;transition:color .18s}
.fp-tab:hover{color:var(--dsw-alias-label-primary)}
.fp-tab.on{color:var(--dsw-alias-brand-primary);font-weight:600}
.fp-tab.on:after{content:"";position:absolute;left:12px;right:12px;bottom:-1px;height:2px;border-radius:2px;background:var(--dsw-alias-brand-primary);animation:tabIn .22s ease}
@keyframes tabIn{from{transform:scaleX(.3);opacity:.4}to{transform:scaleX(1);opacity:1}}
.fp-card{background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:14px;padding:16px 18px;animation:fadeUp .28s ease both}
@keyframes fadeUp{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
.fp-sec{font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary);margin:12px 0 6px;letter-spacing:.2px;display:flex;align-items:center;gap:8px}
.fp-sec:first-child{margin-top:0}
.fp-sec .sp{flex:1}
.fp-mini{font-size:11.5px;font-weight:400;color:var(--dsw-alias-label-secondary)}
.fp-bar{height:6px;border-radius:6px;background:var(--dsw-alias-bg-layer-2);overflow:hidden}
.fp-bar>i{display:block;height:100%;border-radius:6px;background:var(--dsw-alias-brand-primary);transition:width .45s cubic-bezier(.2,.8,.2,1)}
.fp-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.fp-stat{text-align:center;padding:4px 0}
.fp-stat b{display:block;font-size:22px;font-weight:650;line-height:1.2;font-variant-numeric:tabular-nums}
.fp-stat span{font-size:12px;color:var(--dsw-alias-label-secondary)}
.fp-week{display:flex;gap:8px}
.fp-day{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 0 8px;border-radius:12px;border:1px solid transparent;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:12px;line-height:1.2;transition:background .16s,color .16s,transform .12s}
.fp-day:hover{background:var(--dsw-alias-bg-layer-2)}
.fp-day:active{transform:scale(.96)}
.fp-day .n{font-size:17px;font-weight:600;color:var(--dsw-alias-label-primary)}
.fp-day.today{color:var(--dsw-alias-brand-primary)}
.fp-day.today .n{color:var(--dsw-alias-brand-primary)}
.fp-day.sel{background:var(--dsw-alias-brand-primary);color:#fff;box-shadow:0 4px 14px rgba(47,111,237,.25)}
.fp-day.sel .n{color:#fff}
.fp-day .d{width:5px;height:5px;border-radius:50%;background:var(--dsw-alias-brand-primary);transition:background .16s}
.fp-day .d.hide{background:transparent}
.fp-day.sel .d{background:#fff}
.fp-row{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid var(--dsw-alias-border-l1);transition:background .14s}
.fp-row:last-child{border-bottom:none}
.fp-row:hover{background:var(--dsw-alias-bg-layer-2)}
.fp-row .ring{width:22px;height:22px;border-radius:50%;border:2px solid var(--dsw-alias-border-l2);display:flex;align-items:center;justify-content:center;font-size:12px;flex:none;margin-top:1px;transition:border-color .2s,color .2s,transform .2s}
.fp-row .ring.done{border-color:var(--dsw-alias-state-success-primary);color:var(--dsw-alias-state-success-primary);font-weight:700;animation:pop .3s ease}
@keyframes pop{0%{transform:scale(.7)}60%{transform:scale(1.12)}100%{transform:scale(1)}}
.fp-row .body{flex:1;min-width:0}
.fp-row .t1{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.fp-row .name{font-size:13.5px;font-weight:600;line-height:1.35}
.fp-row .time{font-size:11.5px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}
.fp-row .meta{font-size:12px;color:var(--dsw-alias-label-secondary);margin-top:2px;line-height:1.45;white-space:normal;overflow-wrap:anywhere}
.fp-row .tag{display:inline-block;font-size:10.5px;color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l1);border-radius:6px;padding:0 5px;vertical-align:1px}
.fp-row .ops{flex:none;display:flex;gap:6px;align-items:center}
.fp-btn{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:9px;padding:4px 12px;font:inherit;font-size:13px;cursor:pointer;line-height:1.4;transition:background .15s,border-color .15s,transform .08s,box-shadow .15s}
.fp-btn:hover{background:var(--dsw-alias-bg-layer-2)}
.fp-btn:active{transform:scale(.97)}
.fp-btn.primary{background:var(--dsw-alias-brand-primary);border-color:transparent;color:#fff}
.fp-btn.primary:hover{box-shadow:0 4px 14px rgba(47,111,237,.3)}
.fp-btn:disabled{opacity:.5;cursor:default;transform:none}
.fp-btn.sm{padding:2px 9px;font-size:12px;border-radius:8px}
.fp-btn.x{color:var(--dsw-alias-state-error-primary);border-color:transparent;background:transparent;padding:4px 6px}
.fp-btn.ghost{border-color:transparent;background:transparent;color:var(--dsw-alias-label-secondary)}
.fp-input,.fp-select{flex:1;min-width:0;border:1px solid var(--dsw-alias-border-l2);border-radius:9px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);padding:7px 10px;font:inherit;font-size:13px;transition:border-color .16s,box-shadow .16s}
.fp-input:focus,.fp-select:focus{outline:none;border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 3px rgba(47,111,237,.15)}
.fp-form{display:flex;flex-direction:column;gap:8px;margin-top:12px}
.fp-line{display:flex;gap:8px;align-items:center}
.fp-hint{font-size:12px;color:var(--dsw-alias-label-secondary);line-height:1.55}
.fp-err{font-size:12.5px;color:var(--dsw-alias-state-error-primary);animation:fadeUp .2s ease}
.fp-empty{font-size:12.5px;color:var(--dsw-alias-label-secondary);padding:8px 0}
.fp-plan{display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}
.fp-plan:last-child{border-bottom:none}
.fp-plan .nm{font-size:13px;font-weight:600;flex:none}
.fp-plan .wd{font-size:10.5px;color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l1);border-radius:6px;padding:1px 5px;flex:none}
.fp-plan .wd.on{color:#fff;background:var(--dsw-alias-brand-primary);border-color:transparent}
.fp-plan .items{flex:1;min-width:0;font-size:12px;color:var(--dsw-alias-label-secondary);line-height:1.45;white-space:normal;overflow-wrap:anywhere}
.fp-tip{font-size:12.5px;line-height:1.55;padding:7px 0 7px 10px;border-left:2px solid var(--dsw-alias-border-l2);margin-bottom:4px;transition:border-color .2s}
.fp-tip.start,.fp-tip.balance{border-left-color:var(--dsw-alias-brand-primary)}
.fp-tip.warn{border-left-color:var(--dsw-alias-state-warn-primary)}
.fp-tip.plan{border-left-color:var(--dsw-alias-state-idle-primary)}
.fp-tip.load,.fp-tip.done{border-left-color:var(--dsw-alias-state-success-primary)}
.fp-tip.principle{border-left-color:var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary)}
.fp-toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:60;max-width:80%;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);border-radius:11px;padding:8px 16px;font-size:13px;box-shadow:0 8px 30px rgba(0,0,0,.18);animation:toastIn .24s ease}
@keyframes toastIn{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}
.fp-plan-card{animation:fadeUp .3s ease both}
.fp-plan-card .head{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.fp-plan-card .head .sp{flex:1}
.fp-row-item{display:flex;gap:6px;align-items:center;margin-bottom:6px;animation:fadeUp .2s ease both}
.fp-row-item .n{width:34px;text-align:right;font-size:11px;color:var(--dsw-alias-label-secondary);flex:none}
@media (max-width:640px){.fp-wrap{padding:12px 14px 24px;gap:10px}.fp-card{padding:12px 14px}.fp-stats{grid-template-columns:repeat(2,1fr)}.fp-day{padding:8px 0 6px}.fp-head h1{font-size:16px}}
`

    function FitnessIcon({ size }) {
      const s = size || 16
      return h('svg', { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
        h('path', { d: 'M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11' }),
      )
    }

    const WD = ['一', '二', '三', '四', '五', '六', '日']
    const WD_CN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const WEEKDAYS = ['每天', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
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
    const itemStr = (e) => `${e.exercise || ''} ${e.sets || 1}组${e.reps ? '×' + e.reps : ''}${e.weightKg ? ' @' + e.weightKg + 'kg' : ''}`

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

    const emptyPlan = () => ({ id: null, name: '', weekday: '每天', rows: [{ exercise: '', sets: 4, reps: 8, weightKg: '' }] })

    function FitnessPage() {
      const [tab, setTab] = useState('day')
      const [days, setDays] = useState(30)
      const [data, setData] = useState(null)
      const [sel, setSel] = useState(null)
      const [err, setErr] = useState('')
      const [busy, setBusy] = useState(false)
      const [qName, setQName] = useState('')
      const [qSpec, setQSpec] = useState('')
      const [toast, setToast] = useState(null)
      const [editing, setEditing] = useState(null)
      const toastTimer = useRef(null)

      const notify = (msg) => {
        setToast(msg)
        if (toastTimer.current) clearTimeout(toastTimer.current)
        toastTimer.current = setTimeout(() => setToast(null), 2600)
      }
      useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

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

      const post = async (path, body, okMsg) => {
        setBusy(true)
        try {
          const r = await fetch('/fitness-panel/api/' + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}) })
          const d = await r.json().catch(() => ({}))
          if (!d.ok) setErr(d.message || '操作失败')
          else { setErr(''); if (okMsg) notify(d.message || okMsg) }
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

      // 合并：计划项 ↔ 记录（一行一事项）
      const planGroups = []
      for (const p of selPlans) {
        let items = []
        try { items = JSON.parse(p.exercises || '[]') } catch { items = [] }
        const rows = items.map((it) => {
          const recs = selRows.filter((r) => r.exercise === it.exercise)
          const doneSets = recs.reduce((a, r) => a + Number(r.sets || 0), 0)
          return {
            planId: p.id, exercise: it.exercise, sets: it.sets, reps: it.reps, weightKg: it.weightKg,
            recs, doneSets, complete: doneSets >= (it.sets || 1),
            time: recs.length ? hhmm(recs[0].createdAt) : '',
            actual: recs.map(setStr).join(' + '),
          }
        })
        planGroups.push({ id: p.id, name: p.name, rows })
      }
      const planRows = planGroups.flatMap((g) => g.rows)
      const planExercises = new Set(planRows.map((r) => r.exercise))
      const extraRows = selRows.filter((r) => !planExercises.has(r.exercise))
      const pending = planRows.filter((r) => !r.complete)
      const doneRows = planRows.filter((r) => r.complete)
      const total = planRows.length + extraRows.length
      const doneCount = doneRows.length + extraRows.length
      const pct = total ? Math.round((doneCount / total) * 100) : 0
      const weekInfo = data?.weekInfo || { daysTrained: 0, volume: 0, planItemsDone: 0, planItemsTotal: 0 }
      const stats = data?.stats || null

      const addQuick = async () => {
        const spec = parseSpec(qSpec)
        if (!qName.trim()) { setErr('先填动作名'); return }
        if (!spec) { setErr('组次写法不对，例：4x8@60 或 12,10,8@40'); return }
        const d = await post('quick-log', { date: selected, exercise: qName.trim(), sets: spec.sets, reps: spec.reps, weightKg: spec.weightKg }, '已记录')
        if (d && d.ok) { setQName(''); setQSpec('') }
      }
      const checkItem = (it) => post('check-item', { exercise: it.exercise, sets: it.sets, reps: it.reps, weightKg: it.weightKg }, '打卡成功')
      const checkPlan = async (g) => {
        for (const it of g.rows.filter((r) => !r.complete)) {
          await post('check-item', { exercise: it.exercise, sets: it.sets, reps: it.reps, weightKg: it.weightKg })
        }
        notify(`${g.name} 已全部打卡`)
      }
      const savePlan = async () => {
        if (!editing) return
        const rows = editing.rows.filter((r) => String(r.exercise || '').trim())
        if (!editing.name.trim()) { setErr('计划名不能为空'); return }
        if (!rows.length) { setErr('至少加一个动作'); return }
        const body = {
          name: editing.name.trim(), weekday: editing.weekday,
          exercises: rows.map((r) => ({ exercise: String(r.exercise).trim(), sets: Number(r.sets) || 1, reps: r.reps === '' ? null : Number(r.reps), weightKg: r.weightKg === '' ? null : Number(r.weightKg) })),
        }
        const d = editing.id ? await post('plan-update', { id: editing.id, ...body }, '计划已更新') : await post('plan-add', body, '计划已创建')
        if (d && d.ok) setEditing(null)
      }
      const removePlan = async (p) => {
        if (!window.confirm(`删除计划「${p.name}」？`)) return
        await post('plan-remove', { id: p.id }, '计划已删除')
      }

      // ---------- 日程页：渲染辅助 ----------
      const planMeta = (it) => `${it.sets}组${it.reps ? '×' + it.reps : ''}${it.weightKg ? ' @' + it.weightKg + 'kg' : ''}` + (it.doneSets ? ` · 已${it.doneSets}组` : '')

      const pendingRow = (it) => h('div', { key: 'p' + it.exercise, className: 'fp-row' },
        h('span', { className: 'ring' }, ''),
        h('span', { className: 'body' },
          h('span', { className: 't1' }, h('span', { className: 'name' }, it.exercise)),
          h('span', { className: 'meta', style: { display: 'block' } }, planMeta(it))),
        h('span', { className: 'ops' },
          h('button', { type: 'button', className: 'fp-btn primary sm', disabled: busy, onClick: () => checkItem(it) }, '打卡')))

      const pendingGroup = (g) => h('div', { key: 'g' + g.id },
        h('div', { className: 'fp-sec', style: { fontWeight: 600 } }, g.name,
          h('span', { className: 'sp' }),
          h('button', { type: 'button', className: 'fp-btn sm ghost', disabled: busy, onClick: () => checkPlan(g) }, '全部打卡')),
        g.rows.filter((r) => !r.complete).map(pendingRow))

      const doneRow = (it) => h('div', { key: 'd' + it.exercise, className: 'fp-row' },
        h('span', { className: 'ring done' }, '✓'),
        h('span', { className: 'body' },
          h('span', { className: 't1' },
            h('span', { className: 'name' }, it.exercise),
            it.time ? h('span', { className: 'time' }, it.time) : null),
          h('span', { className: 'meta', style: { display: 'block' } }, it.actual || '已完成')),
        h('span', { className: 'ops' }))

      const extraRow = (r) => h('div', { key: 'x' + r.id, className: 'fp-row' },
        h('span', { className: 'ring done' }, '✓'),
        h('span', { className: 'body' },
          h('span', { className: 't1' },
            h('span', { className: 'name' }, r.exercise),
            r.createdAt ? h('span', { className: 'time' }, hhmm(r.createdAt)) : null),
          h('span', { className: 'meta', style: { display: 'block' } }, setStr(r) + (r.note ? ' ｜' + r.note : '') + (volOf(r) > 0 ? ' · ' + Math.round(volOf(r)) + 'kg' : ''))),
        h('span', { className: 'ops' },
          h('button', { type: 'button', className: 'fp-btn x', disabled: busy, onClick: () => post('unlog', { id: r.id }, '已撤销'), title: '撤销' }, '✕')))

      const renderDay = () => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 14 } },
        h('div', { className: 'fp-card' },
          h('div', { className: 'fp-week' }, (data?.week || []).map((d, i) => h('button', {
            type: 'button', key: d.date,
            className: ['fp-day', d.date === today ? 'today' : '', d.date === selected ? 'sel' : ''].join(' ').trim(),
            onClick: () => setSel(d.date),
            title: d.date + (d.trained ? ' · 已训练' : ''),
          },
            h('span', null, WD[i]),
            h('span', { className: 'n' }, d.date === today ? '今' : d.date.slice(8)),
            h('i', { className: ['d', d.trained ? '' : 'hide'].join(' ') })))),
          h('div', { className: 'fp-sec', style: { marginTop: 14 } },
            `${selected || ''} ${selWd}${isToday ? ' · 今天' : ''}`,
            h('span', { className: 'sp' }),
            h('span', { className: 'fp-mini' }, total ? `完成 ${doneCount}/${total}` : '')),
          h('div', { className: 'fp-bar' }, h('i', { style: { width: pct + '%' } })),
          pending.length ? h('div', null,
            h('div', { className: 'fp-sec' }, `待完成 ${pending.length}`),
            planGroups.filter((g) => g.rows.some((r) => !r.complete)).map(pendingGroup)) : null,
          doneCount ? h('div', null,
            h('div', { className: 'fp-sec' }, `已完成 ${doneCount}`),
            doneRows.map(doneRow),
            extraRows.map(extraRow)) : null,
          !total ? h('div', { className: 'fp-empty' }, isToday ? '今天没有安排，也没有记录' : '这天没有记录') : null,
          h('div', { className: 'fp-form' },
            h('div', { className: 'fp-line' },
              h('input', { className: 'fp-input', style: { flex: '1 1 44%' }, type: 'text', placeholder: '动作', value: qName, onChange: (e) => setQName(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') addQuick() } }),
              h('input', { className: 'fp-input', type: 'text', placeholder: '4x8@60', value: qSpec, onChange: (e) => setQSpec(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') addQuick() } }),
              h('button', { type: 'button', className: 'fp-btn primary', disabled: busy, onClick: addQuick }, '记录')),
            h('div', { className: 'fp-hint' }, '4x8@60 = 4组8次60kg · 12,10,8@40 = 递减'))),
        h('div', { className: 'fp-card' },
          h('div', { className: 'fp-stats' },
            h('div', { className: 'fp-stat' }, h('b', null, String(stats ? stats.dayCount : 0)), h('span', null, `${days}天训练`)),
            h('div', { className: 'fp-stat' }, h('b', null, String(stats ? stats.totalSets : 0)), h('span', null, '总组数')),
            h('div', { className: 'fp-stat' }, h('b', null, stats && stats.volume > 0 ? fmtVol(stats.volume) : '—'), h('span', null, '总容量')),
            h('div', { className: 'fp-stat' }, h('b', null, `${weekInfo.daysTrained}/7`), h('span', null, '本周打卡')))),
        (data?.advice || []).length ? h('div', { className: 'fp-card' },
          h('div', { className: 'fp-sec' }, '健身建议'),
          (data.advice || []).map((a, i) => h('div', { key: i, className: 'fp-tip ' + (a.kind || '') }, a.text))) : null)

      // ---------- 训练计划页 ----------
      const renderPlans = () => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 14 } },
        h('div', { className: 'fp-card' },
          h('div', { className: 'fp-sec' }, h('span', null, '我的训练计划'), h('span', { className: 'sp' }),
            h('button', { type: 'button', className: 'fp-btn primary sm', onClick: () => { setEditing(emptyPlan()); setErr('') } }, '+ 新建计划')),
          (data?.plans || []).length ? (data.plans || []).map((p) => {
            let items = []
            try { items = JSON.parse(p.exercises || '[]') } catch { items = [] }
            const on = p.weekday === '每天' || p.weekday === (data?.weekday || '')
            return h('div', { key: p.id, className: 'fp-plan' },
              h('span', { className: 'nm' }, p.name),
              h('span', { className: 'wd' + (on ? ' on' : '') }, on ? '今天' : p.weekday),
              h('span', { className: 'items' }, items.map((e) => itemStr(e)).join(' · ')),
              h('span', { className: 'ops' },
                h('button', { type: 'button', className: 'fp-btn sm', onClick: () => { setEditing({ id: p.id, name: p.name, weekday: p.weekday, rows: items.map((e) => ({ exercise: e.exercise, sets: e.sets || 1, reps: e.reps == null ? '' : e.reps, weightKg: e.weightKg == null ? '' : e.weightKg })) }); setErr('') } }, '编辑'),
                h('button', { type: 'button', className: 'fp-btn sm x', onClick: () => removePlan(p) }, '删除')))
          }) : h('div', { className: 'fp-empty' }, '还没有训练计划，点右上「+ 新建计划」')),

        editing ? h('div', { className: 'fp-card fp-plan-card' },
          h('div', { className: 'fp-sec' }, editing.id ? `编辑计划 #${editing.id}` : '新建计划', h('span', { className: 'sp' }),
            h('button', { type: 'button', className: 'fp-btn sm ghost', onClick: () => { setEditing(null); setErr('') } }, '取消')),
          h('div', { className: 'fp-line', style: { marginBottom: 8 } },
            h('input', { className: 'fp-input', style: { flex: '1 1 50%' }, type: 'text', placeholder: '计划名（如 练胸日）', value: editing.name, onChange: (e) => setEditing({ ...editing, name: e.target.value }) }),
            h('select', { className: 'fp-select', style: { flex: '0 0 120px' }, value: editing.weekday, onChange: (e) => setEditing({ ...editing, weekday: e.target.value }) },
              WEEKDAYS.map((w) => h('option', { key: w, value: w }, w)))),
          editing.rows.map((r, i) => h('div', { key: i, className: 'fp-row-item' },
            h('span', { className: 'n' }, `#${i + 1}`),
            h('input', { className: 'fp-input', style: { flex: '1 1 40%' }, type: 'text', placeholder: '动作', value: r.exercise, onChange: (e) => { const rows = editing.rows.slice(); rows[i] = { ...r, exercise: e.target.value }; setEditing({ ...editing, rows }) } }),
            h('input', { className: 'fp-input', style: { flex: '0 0 64px' }, type: 'number', min: 1, placeholder: '组', value: r.sets, onChange: (e) => { const rows = editing.rows.slice(); rows[i] = { ...r, sets: e.target.value }; setEditing({ ...editing, rows }) } }),
            h('input', { className: 'fp-input', style: { flex: '0 0 64px' }, type: 'number', min: 0, placeholder: '次', value: r.reps, onChange: (e) => { const rows = editing.rows.slice(); rows[i] = { ...r, reps: e.target.value }; setEditing({ ...editing, rows }) } }),
            h('input', { className: 'fp-input', style: { flex: '0 0 76px' }, type: 'number', min: 0, step: 0.5, placeholder: 'kg', value: r.weightKg, onChange: (e) => { const rows = editing.rows.slice(); rows[i] = { ...r, weightKg: e.target.value }; setEditing({ ...editing, rows }) } }),
            h('button', { type: 'button', className: 'fp-btn x', disabled: editing.rows.length <= 1, onClick: () => { const rows = editing.rows.slice(); rows.splice(i, 1); setEditing({ ...editing, rows }) } }, '✕'))),
          h('div', { className: 'fp-line', style: { marginTop: 8 } },
            h('button', { type: 'button', className: 'fp-btn sm', onClick: () => setEditing({ ...editing, rows: [...editing.rows, { exercise: '', sets: 3, reps: 10, weightKg: '' }] }) }, '+ 添加动作'),
            h('span', { style: { flex: 1 } }),
            h('button', { type: 'button', className: 'fp-btn primary', disabled: busy, onClick: savePlan }, editing.id ? '保存修改' : '创建计划'))) : null,
        h('div', { className: 'fp-hint' }, '提示：星期选「每天」会在每一天的日程里出现；多个计划按星期自动叠加，日程页会按计划分组显示。'))

      return h('div', { className: 'fp-root' },
        h('style', null, CSS),
        h('div', { className: 'fp-wrap' },
          h('div', { className: 'fp-head' },
            h(FitnessIcon, { size: 17 }),
            h('h1', null, '健身'),
            data && data.streak > 0 ? h('span', { className: 'fp-streak', title: '连续打卡天数' }, `🔥 ${data.streak} 天`) : null,
            h('div', { style: { flex: 1 } }),
            h('span', { className: 'fp-mini' }, `${days}天`)),
          err ? h('div', { className: 'fp-err', role: 'alert' }, err) : null,
          h('div', { className: 'fp-tabs' },
            h('button', { type: 'button', className: ['fp-tab', tab === 'day' ? 'on' : ''].join(' '), onClick: () => setTab('day') }, '日程'),
            h('button', { type: 'button', className: ['fp-tab', tab === 'plans' ? 'on' : ''].join(' '), onClick: () => setTab('plans') }, '训练计划')),
          tab === 'day' ? renderDay() : renderPlans(),
          toast ? h('div', { className: 'fp-toast', role: 'status' }, toast) : null))
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
