'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/* ─── Pricing data ─────────────────────────────────────────────────────── */

const LIST_MONTHLY = 69

const PLANS = {
  monthly: {
    label: 'Monthly', months: 1, rate: 69, save: null, badge: null,
    term: 'Rolling monthly', period: 'per month',
    blurb: 'No long commitment. A good way to see how it fits your studio.',
  },
  quarterly: {
    label: 'Quarterly', months: 3, rate: 59, save: 'Save 14%', badge: 'Most popular',
    term: '3-month term', period: 'every 3 months',
    blurb: 'A lower rate with a short commitment. Where most studios start.',
  },
  annual: {
    label: 'Annual', months: 12, rate: 49, save: 'Save 29%', badge: 'Best value',
    term: '12-month term', period: 'per year',
    blurb: 'The lowest founding rate, locked in for the year ahead.',
  },
} as const

type Term = keyof typeof PLANS

type IconName =
  | 'calendar' | 'trend' | 'card' | 'funnel' | 'chart' | 'users' | 'check' | 'shield'
  | 'lock' | 'gift' | 'printer' | 'pencil' | 'plus' | 'x' | 'arrow' | 'tag' | 'sparkle'

const FEATURES: [IconName, string, string][] = [
  ['calendar', 'Scheduling & calendar',        'Book, reschedule and track every session in one view.'],
  ['trend',    'Client tracking & progress',   'Goals, body metrics, workout logs and wellness trends.'],
  ['card',     'Payments & invoicing',         'Know who has paid and who hasn\'t, at a glance.'],
  ['funnel',   'Lead pipeline (CRM)',          'From enquiry to signed client. Nothing falls through.'],
  ['chart',    'Performance analytics',        'Adherence and trends, not buried in chat threads.'],
  ['users',    'Unlimited trainers & clients', 'No per-seat fees, ever. Grow without the bill growing.'],
]

/* ─── Quote line model ─────────────────────────────────────────────────── */

type Kind = 'once' | 'recurring'
type Status = 'charge' | 'waived' | 'removed'

type Extra = { id: string; label: string; amount: number; kind: Kind; status: Status; custom: boolean }
type Discount = { id: string; label: string; mode: 'pct' | 'fixed'; value: number; scope: Kind }

const DEFAULT_EXTRAS: Extra[] = [
  { id: 'onboard', label: 'Onboarding & data migration',      amount: 150, kind: 'once', status: 'waived', custom: false },
  { id: 'call',    label: '1:1 setup call with the founder',  amount: 75,  kind: 'once', status: 'waived', custom: false },
  { id: 'support', label: 'Priority support, first 90 days',  amount: 90,  kind: 'once', status: 'waived', custom: false },
]

const STEPS: [string, string][] = [
  ['plan', 'Plan'],
  ['included', 'Included'],
  ['quote', 'Quote'],
  ['signup', 'Sign'],
]

const gbp = (n: number) =>
  '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const uid = () => Math.random().toString(36).slice(2, 9)

const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

/* ─── Small pieces ─────────────────────────────────────────────────────── */

const ICONS: Record<IconName, React.ReactNode> = {
  calendar: <><rect x="3" y="4.5" width="18" height="16.5" rx="2.5" /><path d="M16 2.5v4M8 2.5v4M3 10h18" /></>,
  trend:    <><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
  card:     <><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M2.5 10h19M6.5 15h3" /></>,
  funnel:   <path d="M3.5 4.5h17l-6.5 8v6l-4 2v-8z" />,
  chart:    <><path d="M3.5 3.5v17h17" /><path d="M8 16v-4M12.5 16V8M17 16v-6" /></>,
  users:    <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 4.7a3.5 3.5 0 0 1 0 6.6M18.5 14.8c1.8.9 3 2.9 3 5.7" /></>,
  check:    <path d="M5 12.5l4.5 4.5L19 7.5" />,
  shield:   <><path d="M12 3l8 3v6c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6z" /><path d="M8.8 12.2l2.2 2.2 4.2-4.3" /></>,
  lock:     <><rect x="4.5" y="10.5" width="15" height="10.5" rx="2.5" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></>,
  gift:     <><rect x="3" y="8" width="18" height="4.5" rx="1" /><path d="M12 8v13M5 12.5V21h14v-8.5" /><path d="M12 8C10 8 7 7.5 7 5.5S10 3.5 12 8zM12 8c2 0 5-.5 5-2.5S14 3.5 12 8z" /></>,
  printer:  <><path d="M6.5 9V3.5h11V9" /><rect x="3" y="9" width="18" height="8" rx="2" /><path d="M6.5 14h11v6.5h-11z" /></>,
  pencil:   <><path d="M4 20h4L19.5 8.5l-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></>,
  plus:     <path d="M12 5v14M5 12h14" />,
  x:        <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  arrow:    <path d="M5 12h14M13 6l6 6-6 6" />,
  tag:      <><path d="M3.5 12.5V4h8.5l9 9-8.5 8.5z" /><circle cx="8" cy="8.5" r="1.4" /></>,
  sparkle:  <path d="M12 3l1.8 5.4L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.6z" />,
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  )
}

/** Eases a number towards its new value so totals glide rather than jump. */
function useTween(value: number, ms = 500) {
  const [shown, setShown] = useState(value)
  const current = useRef(value)
  useEffect(() => {
    const from = current.current
    if (from === value) return
    const start = performance.now()
    let raf = 0
    const step = (t: number) => {
      const k = Math.min((t - start) / ms, 1)
      const v = from + (value - from) * (1 - Math.pow(1 - k, 3))
      current.current = v
      setShown(v)
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, ms])
  return shown
}

function Money({ value, className }: { value: number; className?: string }) {
  const [whole, pence] = gbp(value).split('.')
  return (
    <span className={className}>
      {whole}<span className="pence">.{pence}</span>
    </span>
  )
}

function SectionHead({ n, kicker, title, sub }: { n: number; kicker: string; title: string; sub?: string }) {
  return (
    <div className="sec-head">
      <div className="sec-kicker"><span className="sec-n">{String(n).padStart(2, '0')}</span>{kicker}</div>
      <h2 className="sec-title">{title}</h2>
      {sub && <p className="sec-sub">{sub}</p>}
    </div>
  )
}

const rowMotion = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.22 },
}

/* ─── Page ─────────────────────────────────────────────────────────────── */

export default function OfferPage() {
  const [term, setTerm] = useState<Term>('quarterly')
  const [extras, setExtras] = useState<Extra[]>(DEFAULT_EXTRAS)
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [editing, setEditing] = useState(false)

  const [studio, setStudio] = useState('')
  const [contact, setContact] = useState('')
  const [ref, setRef] = useState('')
  const [issued, setIssued] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [activeStep, setActiveStep] = useState('plan')

  // Dates are set on the client so server and client render the same markup.
  useEffect(() => {
    const now = new Date()
    const until = new Date(now)
    until.setDate(until.getDate() + 14)
    setIssued(fmtDate(now))
    setValidUntil(fmtDate(until))
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActiveStep(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' },
    )
    STEPS.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const plan = PLANS[term]

  const totals = useMemo(() => {
    const listSub = LIST_MONTHLY * plan.months
    const termSaving = listSub - plan.rate * plan.months
    const charged = extras.filter(e => e.status === 'charge')
    const recurringExtras = charged.filter(e => e.kind === 'recurring').reduce((s, e) => s + e.amount, 0)
    const onceExtras = charged.filter(e => e.kind === 'once').reduce((s, e) => s + e.amount, 0)

    // Recurring discounts come off the recurring subtotal; one-off discounts
    // come off whatever is left on the first payment.
    const recurringBase = listSub - termSaving + recurringExtras
    const discAmounts: Record<string, number> = {}
    let recurringDisc = 0
    for (const d of discounts.filter(d => d.scope === 'recurring')) {
      const amt = Math.min(
        d.mode === 'pct' ? (recurringBase * d.value) / 100 : d.value,
        Math.max(recurringBase - recurringDisc, 0),
      )
      discAmounts[d.id] = amt
      recurringDisc += amt
    }
    const recurringTotal = Math.max(recurringBase - recurringDisc, 0)

    const firstBase = recurringTotal + onceExtras
    let onceDisc = 0
    for (const d of discounts.filter(d => d.scope === 'once')) {
      const amt = Math.min(
        d.mode === 'pct' ? (firstBase * d.value) / 100 : d.value,
        Math.max(firstBase - onceDisc, 0),
      )
      discAmounts[d.id] = amt
      onceDisc += amt
    }
    const dueToday = Math.max(firstBase - onceDisc, 0)
    const waivedValue = extras.filter(e => e.status === 'waived').reduce((s, e) => s + e.amount, 0)

    return {
      listSub, termSaving, onceExtras, waivedValue, discAmounts, recurringTotal, dueToday,
      subtotal: listSub + recurringExtras + onceExtras,
      discountTotal: termSaving + recurringDisc + onceDisc,
      totalSaved: termSaving + waivedValue + recurringDisc + onceDisc,
    }
  }, [plan, extras, discounts])

  const dueShown = useTween(totals.dueToday)
  const renewShown = useTween(totals.recurringTotal)
  const savedShown = useTween(totals.totalSaved)

  const updateExtra = (id: string, patch: Partial<Extra>) =>
    setExtras(xs => xs.map(x => (x.id === id ? { ...x, ...patch } : x)))
  const deleteExtra = (id: string) => setExtras(xs => xs.filter(x => x.id !== id))
  const addCharge = () =>
    setExtras(xs => [...xs, { id: uid(), label: 'Additional item', amount: 0, kind: 'once', status: 'charge', custom: true }])

  const updateDiscount = (id: string, patch: Partial<Discount>) =>
    setDiscounts(ds => ds.map(d => (d.id === id ? { ...d, ...patch } : d)))
  const deleteDiscount = (id: string) => setDiscounts(ds => ds.filter(d => d.id !== id))
  const addDiscount = () =>
    setDiscounts(ds => [...ds, { id: uid(), label: 'Founding discount', mode: 'pct', value: 10, scope: 'once' }])

  const visibleExtras = extras.filter(e => editing || e.status !== 'removed')
  const featuredExtras = extras.filter(e => !e.custom && e.status !== 'removed')
  const kindTag = (k: Kind) => (k === 'once' ? 'One-off' : 'Recurring')
  const renewsDifferently = Math.abs(totals.dueToday - totals.recurringTotal) > 0.005
  const monthsWord = plan.months === 1 ? 'first month' : `first ${plan.months} months`

  return (
    <div className="offer">
      <style>{CSS}</style>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="hero">
        <div className="topbar">
          <a href="/" className="logo">DNI <span>Studio</span></a>
          <span className="topbar-tag no-print"><Icon name="sparkle" size={13} /> Founding offer</span>
        </div>
        <div className="hero-body no-print">
          <p className="eyebrow">Operations software for fitness studios</p>
          <h1>Run your studio on one tool, <em>not five.</em></h1>
          <p className="hero-sub">
            Replace WhatsApp, spreadsheets and scattered apps with a single system built for personal trainers.
          </p>
          <ul className="trust">
            <li><Icon name="shield" size={16} /> 30-day money-back guarantee</li>
            <li><Icon name="lock" size={16} /> Founding rate locked in</li>
            <li><Icon name="users" size={16} /> Unlimited trainers &amp; clients</li>
          </ul>
        </div>
      </header>

      {/* ── Stepper ──────────────────────────────────────────── */}
      <nav className="stepper no-print" aria-label="Offer steps">
        <ol>
          {STEPS.map(([id, label], i) => {
            const idx = STEPS.findIndex(([s]) => s === activeStep)
            const state = i < idx ? 'done' : i === idx ? 'current' : ''
            return (
              <li key={id} className={state}>
                <a href={`#${id}`}>
                  <span className="dot">{i < idx ? <Icon name="check" size={12} /> : i + 1}</span>
                  <span className="lbl">{label}</span>
                </a>
              </li>
            )
          })}
        </ol>
      </nav>

      <main className="main">
        {/* ── 01 Plan ────────────────────────────────────────── */}
        <section id="plan" className="sec selection">
          <SectionHead
            n={1} kicker="Your plan" title="How would you like to be billed?"
            sub="Longer commitments unlock a lower founding rate. Your full breakdown is built below."
          />
          <div className="plans" role="radiogroup" aria-label="Billing term">
            {(Object.keys(PLANS) as Term[]).map(t => {
              const p = PLANS[t]
              const on = term === t
              return (
                <button key={t} role="radio" aria-checked={on} className={`plan ${on ? 'on' : ''}`} onClick={() => setTerm(t)}>
                  {p.badge && <span className="plan-badge">{p.badge}</span>}
                  <span className="plan-check">{on && <Icon name="check" size={13} />}</span>
                  <span className="plan-term">{p.term}</span>
                  <span className="plan-name">{p.label}</span>
                  <span className="plan-blurb">{p.blurb}</span>
                  <span className={`plan-save ${p.save ? '' : 'muted'}`}>{p.save ?? 'Standard rate'}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── 02 Included ────────────────────────────────────── */}
        <section id="included" className="sec selection">
          <SectionHead
            n={2} kicker="What's included" title="Everything your studio runs on"
            sub="Every plan includes the full platform. No tiers, no add-on modules."
          />
          <div className="features">
            {FEATURES.map(([icon, name, detail]) => (
              <div className="feature" key={name}>
                <span className="f-icon"><Icon name={icon} size={19} /></span>
                <div>
                  <div className="f-name">{name}</div>
                  <div className="f-det">{detail}</div>
                </div>
              </div>
            ))}
          </div>

          {featuredExtras.length > 0 && (
            <div className="extras">
              <div className="extras-head">
                <span className="extras-icon"><Icon name="gift" size={20} /></span>
                <div>
                  <div className="extras-title">Founding studio extras</div>
                  <div className="extras-sub">
                    {totals.waivedValue > 0
                      ? <>{gbp(totals.waivedValue)} of setup and support, included at no cost.</>
                      : <>Hands-on setup and support for your first months.</>}
                  </div>
                </div>
              </div>
              <ul className="extras-list">
                {featuredExtras.map(x => (
                  <li key={x.id}>
                    <span className="ex-check"><Icon name="check" size={14} /></span>
                    <span className="ex-name">{x.label}</span>
                    {x.status === 'waived' ? (
                      <span className="ex-val num"><s>{gbp(x.amount)}</s> <b>Free</b></span>
                    ) : (
                      <span className="ex-val num">{gbp(x.amount)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* ── 03 Quote ───────────────────────────────────────── */}
        <section id="quote" className="sec">
          <div className="quote-head">
            <SectionHead n={3} kicker="Your quote" title="Here's your founding quote" />
            <button
              className={`edit-toggle no-print ${editing ? 'on' : ''}`}
              onClick={() => setEditing(e => !e)}
              aria-pressed={editing}
            >
              <Icon name={editing ? 'check' : 'pencil'} size={14} />
              {editing ? 'Done' : 'Adjust quote'}
            </button>
          </div>

          <article className={`paper ${editing ? 'editing' : ''}`}>
            <AnimatePresence initial={false}>
              {editing && (
                <motion.div
                  className="presenter no-print"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="presenter-inner">
                    <Icon name="pencil" size={14} />
                    <span><strong>Adjusting.</strong> Charge, waive or remove lines, change amounts, and add discounts or charges.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="paper-head">
              <div className="brand-block">
                <span className="mark">D</span>
                <div>
                  <div className="brand">DNI <span>Studio</span></div>
                  <div className="addr">DNI Ltd, trading as DNI Analytics · 78a Deacon Road, London NW2 5QJ · Company no. 15630271</div>
                </div>
              </div>
              <div className="doc-type">
                <div className="doc-label">Quote</div>
                <input className="doc-ref num" placeholder="DNI-2026-XXX" value={ref} onChange={e => setRef(e.target.value)} aria-label="Reference" />
              </div>
            </div>

            <div className="meta">
              <div className="meta-cell">
                <label className="mlabel" htmlFor="q-studio">Prepared for</label>
                <input id="q-studio" className="minput" placeholder="Studio name" value={studio} onChange={e => setStudio(e.target.value)} />
              </div>
              <div className="meta-cell">
                <label className="mlabel" htmlFor="q-contact">Attention</label>
                <input id="q-contact" className="minput" placeholder="Owner or contact" value={contact} onChange={e => setContact(e.target.value)} />
              </div>
              <div className="meta-cell">
                <span className="mlabel">Issued</span>
                <span className="mval num">{issued || '—'}</span>
              </div>
              <div className="meta-cell">
                <span className="mlabel">Valid until</span>
                <span className="mval num">{validUntil || '—'}</span>
              </div>
            </div>

            <table className="lines">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="col-type">Type</th>
                  <th className="col-amt">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="l-main">DNI Studio platform, {plan.label.toLowerCase()} plan</div>
                    <div className="l-sub num">{`${plan.months} ${plan.months === 1 ? 'month' : 'months'} × ${gbp(LIST_MONTHLY)} list price`}</div>
                  </td>
                  <td className="col-type"><span className="pill">Recurring</span></td>
                  <td className="col-amt num">{gbp(totals.listSub)}</td>
                </tr>

                <AnimatePresence initial={false}>
                  {totals.termSaving > 0 && (
                    <motion.tr key="term-saving" className="credit" {...rowMotion}>
                      <td>
                        <div className="l-main">{plan.label} founding rate</div>
                        <div className="l-sub num">{`${gbp(plan.rate)}/mo instead of ${gbp(LIST_MONTHLY)}/mo`}</div>
                      </td>
                      <td className="col-type"><span className="pill">Recurring</span></td>
                      <td className="col-amt num">−{gbp(totals.termSaving)}</td>
                    </motion.tr>
                  )}

                  {visibleExtras.map(x => (
                    <motion.tr key={x.id} className={x.status} {...rowMotion}>
                      <td>
                        {editing && x.custom ? (
                          <input className="ctl ctl-wide" value={x.label} onChange={e => updateExtra(x.id, { label: e.target.value })} aria-label="Item description" />
                        ) : (
                          <div className="l-main">{x.label}</div>
                        )}
                        {!editing && x.status === 'waived' && <div className="l-sub">Included free for founding studios</div>}
                        {editing && (
                          <div className="ctls no-print">
                            <div className="seg" role="group" aria-label="Charge status">
                              {(['charge', 'waived', 'removed'] as Status[]).map(s => (
                                <button key={s} className={x.status === s ? 'on' : ''} onClick={() => updateExtra(x.id, { status: s })}>
                                  {s === 'charge' ? 'Charge' : s === 'waived' ? 'Waive' : 'Remove'}
                                </button>
                              ))}
                            </div>
                            {x.custom && (
                              <>
                                <select className="ctl" value={x.kind} onChange={e => updateExtra(x.id, { kind: e.target.value as Kind })} aria-label="Charge type">
                                  <option value="once">One-off</option>
                                  <option value="recurring">Recurring</option>
                                </select>
                                <button className="icon-btn" onClick={() => deleteExtra(x.id)} aria-label="Delete item"><Icon name="x" size={14} /></button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="col-type"><span className="pill">{kindTag(x.kind)}</span></td>
                      <td className="col-amt num">
                        {editing ? (
                          <span className="ctl-money">
                            <span>£</span>
                            <input
                              type="number" min={0} step="0.01" className="ctl ctl-amt num"
                              value={x.amount}
                              onChange={e => updateExtra(x.id, { amount: Math.max(0, Number(e.target.value) || 0) })}
                              aria-label="Amount"
                            />
                          </span>
                        ) : x.status === 'waived' ? (
                          <span className="waived-amt"><s>{gbp(x.amount)}</s><b>Free</b></span>
                        ) : (
                          gbp(x.amount)
                        )}
                      </td>
                    </motion.tr>
                  ))}

                  {discounts.map(d => (
                    <motion.tr key={d.id} className="credit" {...rowMotion}>
                      <td>
                        {editing ? (
                          <>
                            <input className="ctl ctl-wide" value={d.label} onChange={e => updateDiscount(d.id, { label: e.target.value })} aria-label="Discount name" />
                            <div className="ctls no-print">
                              <input
                                type="number" min={0} step="0.01" className="ctl ctl-amt num"
                                value={d.value}
                                onChange={e => {
                                  const v = Math.max(0, Number(e.target.value) || 0)
                                  updateDiscount(d.id, { value: d.mode === 'pct' ? Math.min(v, 100) : v })
                                }}
                                aria-label="Discount value"
                              />
                              <div className="seg" role="group" aria-label="Discount type">
                                <button className={d.mode === 'pct' ? 'on' : ''} onClick={() => updateDiscount(d.id, { mode: 'pct', value: Math.min(d.value, 100) })}>%</button>
                                <button className={d.mode === 'fixed' ? 'on' : ''} onClick={() => updateDiscount(d.id, { mode: 'fixed' })}>£</button>
                              </div>
                              <select className="ctl" value={d.scope} onChange={e => updateDiscount(d.id, { scope: e.target.value as Kind })} aria-label="Applies to">
                                <option value="once">First payment only</option>
                                <option value="recurring">Every payment</option>
                              </select>
                              <button className="icon-btn" onClick={() => deleteDiscount(d.id)} aria-label="Delete discount"><Icon name="x" size={14} /></button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="l-main"><Icon name="tag" size={13} /> {d.label}</div>
                            <div className="l-sub">
                              {`${d.mode === 'pct' ? `${d.value}%` : gbp(d.value)} off ${d.scope === 'once' ? 'your first payment' : 'every payment'}`}
                            </div>
                          </>
                        )}
                      </td>
                      <td className="col-type"><span className="pill">{kindTag(d.scope)}</span></td>
                      <td className="col-amt num">−{gbp(totals.discAmounts[d.id] ?? 0)}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            <AnimatePresence initial={false}>
              {editing && (
                <motion.div
                  className="add-row no-print"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="add-inner">
                    <button className="add-btn" onClick={addDiscount}><Icon name="tag" size={14} /> Add discount</button>
                    <button className="add-btn" onClick={addCharge}><Icon name="plus" size={14} /> Add charge</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="sums num">
              <div className="sum"><span>Subtotal</span><span>{gbp(totals.subtotal)}</span></div>
              {totals.discountTotal > 0 && (
                <div className="sum credit-text"><span>Discounts</span><span>−{gbp(totals.discountTotal)}</span></div>
              )}
            </div>

            <div className="perf" aria-hidden="true" />

            <div className="total">
              <div className="total-main">
                <div>
                  <div className="t-kicker">Total due today</div>
                  <div className="t-note">
                    {`Covers your ${monthsWord}${totals.onceExtras > 0 ? ' plus one-off items' : ''}`}
                  </div>
                </div>
                <Money value={dueShown} className="t-num num" />
              </div>

              <div className="t-stats num">
                <div className="t-stat">
                  <span className="ts-l">{renewsDifferently ? 'Then' : 'Renews at'}</span>
                  <span className="ts-v">{gbp(renewShown)}</span>
                  <span className="ts-s">{plan.period}</span>
                </div>
                <div className="t-stat">
                  <span className="ts-l">Works out at</span>
                  <span className="ts-v">{gbp(renewShown / plan.months)}</span>
                  <span className="ts-s">per month</span>
                </div>
                <div className="t-stat gold">
                  <span className="ts-l">You save</span>
                  <span className="ts-v">{gbp(savedShown)}</span>
                  <span className="ts-s">in founding value</span>
                </div>
              </div>

              <div className="no-print">
                <button
                  className="cta"
                  onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Accept quote &amp; continue <Icon name="arrow" size={17} />
                </button>
                <p className="t-lock"><Icon name="lock" size={13} /> Your founding rate stays fixed for as long as you stay subscribed.</p>
              </div>
            </div>
          </article>

          <div className="assure">
            <div className="as-item">
              <span className="as-icon"><Icon name="shield" size={20} /></span>
              <div><strong>30-day money-back</strong><span>Not the right fit? Full refund, no hoops.</span></div>
            </div>
            <div className="as-item">
              <span className="as-icon"><Icon name="lock" size={20} /></span>
              <div><strong>Price locked in</strong><span>Your founding rate never goes up.</span></div>
            </div>
            <div className="as-item">
              <span className="as-icon"><Icon name="users" size={20} /></span>
              <div><strong>Hands-on setup</strong><span>We migrate your data and get you running.</span></div>
            </div>
          </div>
        </section>

        {/* ── 04 Sign up ─────────────────────────────────────── */}
        <section id="signup" className="sec">
          <SectionHead
            n={4} kicker="Sign up" title="Lock in your founding rate"
            sub="Complete your studio details and sign. Reference and dates are taken from the quote above."
          />
          <div className="card">
            <div className="summary-chip num">
              <span><b>{plan.label}</b> plan</span>
              <span className="sep" />
              <span><b>{gbp(totals.dueToday)}</b> due today</span>
              <span className="sep" />
              <span>Then {gbp(totals.recurringTotal)} {plan.period}</span>
            </div>

            <div className="fields">
              <div className="field"><label htmlFor="s-studio">Studio name</label><input id="s-studio" type="text" value={studio} onChange={e => setStudio(e.target.value)} /></div>
              <div className="field"><label htmlFor="s-contact">Owner / contact</label><input id="s-contact" type="text" value={contact} onChange={e => setContact(e.target.value)} /></div>
              <div className="field span2"><label htmlFor="s-addr">Address</label><input id="s-addr" type="text" autoComplete="street-address" /></div>
              <div className="field half"><label htmlFor="s-city">City</label><input id="s-city" type="text" autoComplete="address-level2" /></div>
              <div className="field half"><label htmlFor="s-post">Postcode</label><input id="s-post" type="text" autoComplete="postal-code" /></div>
              <div className="field full"><label htmlFor="s-email">Email</label><input id="s-email" type="email" autoComplete="email" /></div>
            </div>

            <p className="agree">By signing below, the Customer accepts the quote above and agrees to the Terms &amp; Conditions, which form part of this agreement.</p>

            <div className="signs">
              <div className="sign">
                <div className="sign-area"><span className="sign-x">×</span></div>
                <div className="sign-label">Studio signature &amp; date</div>
              </div>
              <div className="sign">
                <div className="sign-area"><span className="sign-x">×</span></div>
                <div className="sign-label">DNI Studio, authorised signatory</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Terms ──────────────────────────────────────────── */}
        <section id="terms" className="sec terms-sec">
          <div className="terms">
            <h2 className="terms-title">Terms &amp; Conditions of Service</h2>
            <p className="terms-intro">These terms govern the provision of the DNI Studios software platform (&quot;the Service&quot;) by DNI Ltd, trading as DNI Analytics, a company registered in England and Wales under company number 15630271, registered office 78a Deacon Road, London NW2 5QJ (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) to the studio named above (&quot;the Customer&quot;, &quot;you&quot;). By signing the offer sheet or by accessing or using the Service, you agree to be bound by these terms.</p>

            <div className="clauses">
              {CLAUSES.map(clause => (
                <div className="clause" key={clause.num}>
                  <h3><span>{clause.num}</span>{clause.title}</h3>
                  {clause.paras.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              ))}
            </div>
          </div>

          <div className="print-wrap no-print">
            <button className="print-btn" onClick={() => window.print()}>
              <Icon name="printer" size={17} /> Print quote &amp; agreement
            </button>
          </div>
        </section>
      </main>

      <footer className="foot no-print">
        <a href="/" className="logo small">DNI <span>Studio</span></a>
        <span>© {new Date().getFullYear()} DNI Ltd · Registered in England &amp; Wales, no. 15630271</span>
      </footer>
    </div>
  )
}

/* ─── Terms content ────────────────────────────────────────────────────── */

const CLAUSES = [
  { num: '1.', title: 'Subscription & Payment', paras: [
    'The Service is provided on a monthly subscription basis at the price stated above. Your price is fixed for as long as your subscription remains continuously active, in accordance with the Founding Customer Guarantee.',
    'Payment is due monthly in advance by the method agreed at sign-up. Where payment is not received within 7 days of the due date, we may suspend access to the Service until payment is made.',
  ]},
  { num: '2.', title: 'Term & Cancellation', paras: [
    'This is a rolling agreement with no fixed minimum term beyond the billing cycle selected. You may cancel at any time by providing 14 days\' written notice. Cancellation takes effect at the end of the then-current billing period.',
    'No refunds are issued for partial billing periods. Founding price status is lost if a subscription lapses for more than 30 consecutive days and is later reinstated.',
  ]},
  { num: '3.', title: 'Data & Privacy', paras: [
    'You retain ownership of all client and business data entered into the Service. We process this data solely to provide the Service and will not sell or share it with third parties for marketing purposes.',
    'Upon cancellation, you may request a full export of your data within 30 days. After this period, data may be permanently deleted from our systems.',
  ]},
  { num: '4.', title: 'Service Availability', paras: [
    'We aim to maintain high availability of the Service but do not guarantee uninterrupted access. Scheduled maintenance will be communicated in advance where reasonably possible.',
    'As an early-stage platform, features may be added, modified, or occasionally withdrawn as the product develops, in which case we will give reasonable notice of any change materially affecting your use.',
  ]},
  { num: '5.', title: 'Acceptable Use', paras: [
    'You agree to use the Service only for lawful purposes connected with the operation of a fitness training business, and not to attempt to reverse-engineer, resell, or sublicense the Service without prior written consent.',
  ]},
  { num: '6.', title: 'Intellectual Property', paras: [
    'All software, design, and branding associated with the Service remain the exclusive property of DNI Ltd. Nothing in this agreement transfers any intellectual property rights to the Customer.',
  ]},
  { num: '7.', title: 'Limitation of Liability', paras: [
    'The Service is provided on an "as is" basis. To the fullest extent permitted by law, our total liability arising from or in connection with this agreement is limited to the total fees paid by you in the 3 months preceding the claim.',
    'We are not liable for indirect, incidental, or consequential losses, including loss of profits, data, or business opportunity, except where such liability cannot be excluded by law.',
  ]},
  { num: '8.', title: 'Termination', paras: [
    'We may suspend or terminate access immediately in cases of non-payment, breach of these terms, or misuse of the Service. Either party may terminate this agreement for convenience in accordance with Clause 2.',
  ]},
  { num: '9.', title: 'Governing Law', paras: [
    'This agreement is governed by the laws of England and Wales, and the parties submit to the exclusive jurisdiction of the courts of England and Wales in respect of any dispute arising from it.',
  ]},
]

/* ─── Styles ───────────────────────────────────────────────────────────── */

const CSS = `
.offer {
  --ink: #13110e; --ink-2: #1c1915; --ink-3: #2a261f;
  --paper: #faf8f4; --cream: #f4efe4; --cream-2: #ece5d5;
  --line: #e6dfcf; --line-soft: #f0ebdf;
  --text: #2a2722; --muted: #6f685b; --faint: #9a9283;
  --gold: #c9a86a; --gold-d: #a6824f; --gold-l: #e4cf9f;
  --green: #0e6a47; --green-bg: #eef6f1;
  --display: var(--font-display), Georgia, 'Times New Roman', serif;
  --sans: var(--font-inter), 'Helvetica Neue', Arial, sans-serif;
  background: var(--paper); color: var(--text); font-family: var(--sans);
  min-height: 100vh; -webkit-font-smoothing: antialiased;
}
body { background: #faf8f4; }
.offer .num { font-variant-numeric: tabular-nums; }
.offer button { font-family: inherit; }
.offer :focus-visible { outline: 2px solid var(--gold-d); outline-offset: 2px; }

/* Hero */
.hero {
  position: relative; overflow: hidden; color: #f6f1e6; padding: 0 20px 76px;
  background:
    radial-gradient(900px 420px at 50% -8%, rgba(201,168,106,.22), transparent 65%),
    radial-gradient(600px 300px at 90% 110%, rgba(201,168,106,.08), transparent 70%),
    var(--ink);
}
.hero::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
  background-size: 56px 56px;
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 20%, transparent 75%);
          mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 20%, transparent 75%);
}
.hero::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201,168,106,.6), transparent);
}
.topbar {
  position: relative; z-index: 1; max-width: 1040px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between; padding: 22px 0;
}
.logo {
  font-family: var(--display); font-size: 21px; font-weight: 600; letter-spacing: .2px;
  color: #f6f1e6; text-decoration: none;
}
.logo span { color: var(--gold); font-style: italic; }
.logo.small { font-size: 17px; color: var(--ink); }
.topbar-tag {
  display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600;
  letter-spacing: 1.4px; text-transform: uppercase; color: var(--gold-l);
  border: 1px solid rgba(201,168,106,.35); background: rgba(201,168,106,.08);
  border-radius: 999px; padding: 6px 12px;
}
.hero-body { position: relative; z-index: 1; max-width: 760px; margin: 0 auto; text-align: center; padding-top: 48px; }
.eyebrow { font-size: 11.5px; letter-spacing: 2.4px; text-transform: uppercase; color: var(--gold); font-weight: 600; }
.hero h1 {
  font-family: var(--display); font-weight: 500; font-size: clamp(38px, 6vw, 62px);
  line-height: 1.04; letter-spacing: -.02em; margin: 18px 0 18px; color: #fbf7ee;
}
.hero h1 em { font-style: italic; color: var(--gold); font-weight: 400; }
.hero-sub { font-size: 16.5px; line-height: 1.6; color: #bdb5a5; max-width: 520px; margin: 0 auto; }
.trust { list-style: none; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 26px; margin-top: 34px; }
.trust li { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: #d9d1c0; }
.trust svg { color: var(--gold); }

/* Stepper */
.stepper {
  position: sticky; top: 0; z-index: 20;
  background: rgba(250,248,244,.86); backdrop-filter: saturate(160%) blur(12px);
  -webkit-backdrop-filter: saturate(160%) blur(12px);
  border-bottom: 1px solid var(--line);
}
.stepper ol { list-style: none; display: flex; justify-content: center; gap: 0; max-width: 760px; margin: 0 auto; padding: 12px 16px; }
.stepper li { flex: 1; display: flex; align-items: center; }
.stepper li:not(:last-child)::after { content: ""; flex: 1; height: 1px; background: var(--line); margin: 0 10px; }
.stepper li.done:not(:last-child)::after { background: var(--gold-d); }
.stepper a { display: inline-flex; align-items: center; gap: 8px; text-decoration: none; color: var(--faint); font-size: 13px; font-weight: 500; white-space: nowrap; }
.stepper .dot {
  width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;
  font-size: 11.5px; font-weight: 700; border: 1px solid var(--line); background: #fff; color: var(--faint);
  transition: all .25s ease;
}
.stepper li.current a { color: var(--ink); }
.stepper li.current .dot { background: var(--ink); border-color: var(--ink); color: var(--gold-l); box-shadow: 0 0 0 4px rgba(201,168,106,.18); }
.stepper li.done a { color: var(--muted); }
.stepper li.done .dot { background: var(--gold-d); border-color: var(--gold-d); color: #fff; }

/* Layout */
.main { max-width: 920px; margin: 0 auto; padding: 0 20px; }
.sec { padding: 72px 0 0; scroll-margin-top: 56px; }
.sec-head { margin-bottom: 28px; }
.sec-kicker {
  display: inline-flex; align-items: center; gap: 10px; font-size: 11.5px; font-weight: 600;
  letter-spacing: 1.8px; text-transform: uppercase; color: var(--gold-d);
}
.sec-n { font-family: var(--display); font-style: italic; font-size: 14px; letter-spacing: 0; color: var(--faint); }
.sec-title { font-family: var(--display); font-weight: 500; font-size: clamp(28px, 3.6vw, 36px); line-height: 1.15; letter-spacing: -.015em; color: var(--ink); margin-top: 8px; }
.sec-sub { font-size: 15px; line-height: 1.6; color: var(--muted); margin-top: 10px; max-width: 560px; }

/* Plans */
.plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.plan {
  position: relative; display: flex; flex-direction: column; align-items: flex-start; text-align: left;
  background: #fff; color: var(--text); border: 1px solid var(--line); border-radius: 18px;
  padding: 26px 22px 22px; cursor: pointer;
  box-shadow: 0 1px 2px rgba(19,17,14,.04);
  transition: transform .2s ease, box-shadow .25s ease, border-color .2s ease, background .25s ease, color .25s ease;
}
.plan:hover { transform: translateY(-2px); border-color: #d6c9a8; box-shadow: 0 14px 30px -18px rgba(19,17,14,.28); }
.plan.on {
  background: linear-gradient(160deg, #221e18 0%, var(--ink) 60%); color: #efe8da; border-color: var(--ink);
  box-shadow: 0 22px 40px -22px rgba(19,17,14,.6), inset 0 0 0 1px rgba(201,168,106,.25);
}
.plan-badge {
  position: absolute; top: -11px; left: 20px; font-size: 10.5px; font-weight: 700; letter-spacing: 1.1px;
  text-transform: uppercase; padding: 5px 10px; border-radius: 999px;
  background: linear-gradient(135deg, var(--gold-l), var(--gold)); color: var(--ink);
  box-shadow: 0 4px 10px -4px rgba(166,130,79,.6);
}
.plan-check {
  position: absolute; top: 22px; right: 20px; width: 22px; height: 22px; border-radius: 50%;
  border: 1.5px solid #d4cbb6; display: inline-flex; align-items: center; justify-content: center;
  transition: all .2s ease;
}
.plan.on .plan-check { background: var(--gold); border-color: var(--gold); color: var(--ink); }
.plan-term { font-size: 11px; font-weight: 600; letter-spacing: 1.3px; text-transform: uppercase; color: var(--faint); }
.plan.on .plan-term { color: var(--gold); }
.plan-name { font-family: var(--display); font-size: 30px; font-weight: 500; letter-spacing: -.01em; color: var(--ink); margin-top: 6px; }
.plan.on .plan-name { color: #fbf7ee; }
.plan-blurb { font-size: 13.5px; line-height: 1.55; color: var(--muted); margin-top: 10px; flex: 1; }
.plan.on .plan-blurb { color: #b9b09f; }
.plan-save {
  margin-top: 18px; font-size: 12px; font-weight: 700; color: var(--green); background: var(--green-bg);
  padding: 5px 10px; border-radius: 999px;
}
.plan-save.muted { color: var(--muted); background: var(--cream); font-weight: 600; }
.plan.on .plan-save { background: rgba(201,168,106,.14); color: var(--gold-l); }

/* Features */
.features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.feature {
  display: flex; gap: 14px; align-items: flex-start; background: #fff; border: 1px solid var(--line-soft);
  border-radius: 14px; padding: 18px 18px 18px 16px;
}
.f-icon {
  flex-shrink: 0; width: 38px; height: 38px; border-radius: 11px; display: inline-flex; align-items: center; justify-content: center;
  color: var(--gold-d); background: linear-gradient(145deg, #fbf6ea, #f1e7d1); border: 1px solid #ece0c4;
}
.f-name { font-size: 14.5px; font-weight: 600; color: var(--ink); line-height: 1.3; }
.f-det { font-size: 13px; line-height: 1.5; color: var(--muted); margin-top: 4px; }

.extras {
  margin-top: 20px; border-radius: 16px; padding: 22px 24px;
  background: linear-gradient(135deg, #fbf6ea, #f4ecda); border: 1px solid #e9dcbc;
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr); gap: 20px 32px; align-items: center;
}
.extras-head { display: flex; gap: 14px; align-items: center; }
.extras-icon {
  flex-shrink: 0; width: 44px; height: 44px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center;
  background: var(--ink); color: var(--gold);
}
.extras-title { font-family: var(--display); font-size: 20px; font-weight: 500; color: var(--ink); }
.extras-sub { font-size: 13px; color: var(--muted); margin-top: 3px; line-height: 1.45; }
.extras-list { list-style: none; }
.extras-list li { display: flex; align-items: center; gap: 10px; padding: 8px 0; font-size: 13.5px; border-bottom: 1px dashed #e0d1ae; }
.extras-list li:last-child { border-bottom: none; }
.ex-check { color: var(--green); display: inline-flex; }
.ex-name { flex: 1; color: var(--ink); }
.ex-val { white-space: nowrap; color: var(--ink); font-weight: 600; }
.ex-val s { color: var(--faint); font-weight: 400; margin-right: 6px; }
.ex-val b { color: var(--green); font-size: 11.5px; letter-spacing: .6px; text-transform: uppercase; }

/* Quote heading row */
.quote-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
.quote-head .sec-head { margin-bottom: 28px; }
.edit-toggle {
  margin-bottom: 30px; display: inline-flex; align-items: center; gap: 7px; flex-shrink: 0;
  border: 1px solid var(--line); background: #fff; color: var(--muted); border-radius: 999px;
  font-size: 12.5px; font-weight: 600; padding: 8px 14px; cursor: pointer; transition: all .2s ease;
}
.edit-toggle:hover { border-color: var(--gold-d); color: var(--ink); }
.edit-toggle.on { background: var(--ink); color: var(--gold-l); border-color: var(--ink); }

/* Paper */
.paper {
  position: relative; background: #fff; border-radius: 20px; overflow: hidden;
  border: 1px solid var(--line);
  box-shadow: 0 1px 0 rgba(255,255,255,.8) inset, 0 2px 4px rgba(19,17,14,.03), 0 30px 60px -30px rgba(19,17,14,.28);
  transition: box-shadow .25s ease, border-color .25s ease;
}
.paper::before {
  content: ""; position: absolute; top: 0; left: 0; right: 0; height: 3px; z-index: 1;
  background: linear-gradient(90deg, var(--gold-d), var(--gold-l), var(--gold-d));
}
.paper.editing { border-color: var(--gold-d); box-shadow: 0 0 0 4px rgba(201,168,106,.16), 0 30px 60px -30px rgba(19,17,14,.28); }
.presenter { overflow: hidden; background: repeating-linear-gradient(-45deg, #fbf5e6, #fbf5e6 10px, #f7efd9 10px, #f7efd9 20px); }
.presenter-inner { display: flex; align-items: center; gap: 10px; padding: 14px 32px 12px; font-size: 12.5px; color: #6b5532; }
.presenter-inner strong { color: var(--ink); }

.paper-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; padding: 34px 36px 26px; }
.brand-block { display: flex; gap: 14px; align-items: center; min-width: 0; }
.mark {
  flex-shrink: 0; width: 44px; height: 44px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center;
  background: var(--ink); color: var(--gold); font-family: var(--display); font-size: 22px; font-style: italic;
}
.brand { font-family: var(--display); font-size: 20px; font-weight: 600; color: var(--ink); }
.brand span { color: var(--gold-d); font-style: italic; }
.addr { font-size: 11.5px; color: var(--faint); margin-top: 3px; line-height: 1.5; }
.doc-type { text-align: right; flex-shrink: 0; }
.doc-label { font-family: var(--display); font-size: 34px; font-weight: 400; font-style: italic; color: var(--ink); line-height: 1; letter-spacing: -.01em; }
.doc-ref {
  margin-top: 8px; width: 150px; text-align: right; border: none; border-bottom: 1px dashed var(--line);
  background: transparent; font-family: inherit; font-size: 12.5px; color: var(--muted); padding: 3px 0; letter-spacing: .5px;
}
.doc-ref:focus { outline: none; border-bottom-color: var(--gold-d); color: var(--ink); }

.meta {
  display: grid; grid-template-columns: 1.3fr 1.3fr 1fr 1fr; margin: 0 36px; border: 1px solid var(--line-soft);
  border-radius: 12px; background: #fcfbf8;
}
.meta-cell { padding: 14px 16px; min-width: 0; }
.meta-cell + .meta-cell { border-left: 1px solid var(--line-soft); }
.mlabel { display: block; font-size: 10.5px; font-weight: 600; letter-spacing: 1.1px; text-transform: uppercase; color: var(--faint); margin-bottom: 6px; }
.mval { font-size: 14px; color: var(--ink); font-weight: 500; }
.minput {
  width: 100%; border: none; background: transparent; font-family: inherit; font-size: 14px; font-weight: 500;
  color: var(--ink); padding: 0; border-bottom: 1px dashed transparent;
}
.minput::placeholder { color: #bdb4a2; font-weight: 400; }
.minput:hover { border-bottom-color: var(--line); }
.minput:focus { outline: none; border-bottom-color: var(--gold-d); }

/* Lines table */
.lines { width: 100%; border-collapse: collapse; margin-top: 22px; }
.lines th {
  font-size: 10.5px; font-weight: 600; letter-spacing: 1.1px; text-transform: uppercase; color: var(--faint);
  text-align: left; padding: 12px 10px; border-bottom: 1px solid var(--line);
}
.lines td { padding: 16px 10px; border-bottom: 1px solid var(--line-soft); vertical-align: top; font-size: 14px; }
.lines th:first-child, .lines td:first-child { padding-left: 36px; }
.lines th:last-child, .lines td:last-child { padding-right: 36px; }
.lines .col-type { width: 110px; }
.lines .col-amt { text-align: right; white-space: nowrap; width: 150px; color: var(--ink); font-weight: 500; }
.l-main { font-weight: 600; color: var(--ink); display: flex; align-items: center; gap: 6px; }
.l-sub { font-size: 12.5px; color: var(--faint); margin-top: 3px; }
.pill {
  display: inline-block; font-size: 10.5px; font-weight: 600; letter-spacing: .5px; text-transform: uppercase;
  color: var(--muted); background: var(--cream); border-radius: 6px; padding: 3px 8px; white-space: nowrap;
}
.lines tr.credit .col-amt, .credit-text { color: var(--green); }
.lines tr.credit .l-main svg { color: var(--green); }
.waived-amt { display: inline-flex; align-items: baseline; gap: 8px; }
.waived-amt s { color: #bfb6a4; font-weight: 400; font-size: 13px; }
.waived-amt b { color: var(--green); font-size: 11.5px; letter-spacing: .7px; text-transform: uppercase; }
.lines tr.removed td { opacity: .42; }
.lines tr.removed .l-main, .lines tr.removed .ctl-wide { text-decoration: line-through; }

/* Editing controls */
.ctls { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 10px; }
.seg { display: inline-flex; padding: 2px; border-radius: 9px; background: var(--cream); border: 1px solid var(--line); }
.seg button {
  border: none; background: transparent; color: var(--muted); font-size: 12px; font-weight: 600;
  padding: 5px 10px; border-radius: 7px; cursor: pointer; transition: all .15s ease;
}
.seg button:hover { color: var(--ink); }
.seg button.on { background: #fff; color: var(--ink); box-shadow: 0 1px 2px rgba(19,17,14,.12), 0 0 0 1px var(--line); }
.ctl {
  border: 1px solid var(--line); border-radius: 9px; background: #fff; font-family: inherit;
  font-size: 13px; color: var(--ink); padding: 7px 10px; transition: border-color .15s ease, box-shadow .15s ease;
}
.ctl:focus { outline: none; border-color: var(--gold-d); box-shadow: 0 0 0 3px rgba(201,168,106,.2); }
.ctl-wide { width: 100%; max-width: 360px; font-weight: 600; font-size: 14px; }
.ctl-amt { width: 92px; text-align: right; }
.ctl-money { display: inline-flex; align-items: center; gap: 6px; color: var(--faint); }
.icon-btn {
  border: none; background: transparent; color: var(--faint); width: 30px; height: 30px; border-radius: 8px;
  display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
}
.icon-btn:hover { background: #fbeeee; color: #a23b3b; }
.add-row { overflow: hidden; }
.add-inner { display: flex; gap: 10px; flex-wrap: wrap; padding: 16px 36px; border-bottom: 1px solid var(--line-soft); }
.add-btn {
  display: inline-flex; align-items: center; gap: 7px; border: 1px dashed #cdbf9f; background: #fdfbf6; color: var(--muted);
  font-size: 13px; font-weight: 600; padding: 9px 14px; border-radius: 10px; cursor: pointer; transition: all .15s ease;
}
.add-btn:hover { border-style: solid; border-color: var(--gold-d); color: var(--ink); background: #fff; }

/* Sums + perforation */
.sums { padding: 20px 36px 26px; margin-left: auto; max-width: 380px; }
.sum { display: flex; justify-content: space-between; font-size: 14px; padding: 5px 0; color: var(--muted); }
.perf { position: relative; height: 0; border-top: 2px dashed var(--line); margin: 0 22px; }
.perf::before, .perf::after {
  content: ""; position: absolute; top: -12px; width: 22px; height: 22px; border-radius: 50%;
  background: var(--paper); border: 1px solid var(--line);
}
.perf::before { left: -34px; }
.perf::after { right: -34px; }

/* Total */
.total { padding: 30px 36px 32px; background: #fff; }
.total-main { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; flex-wrap: wrap; }
.t-kicker { font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--gold-d); }
.t-note { font-size: 13.5px; color: var(--muted); margin-top: 6px; }
.t-num { font-family: var(--display); font-weight: 500; font-size: clamp(48px, 7vw, 68px); line-height: .95; letter-spacing: -.03em; color: var(--ink); }
.t-num .pence { font-size: .5em; letter-spacing: 0; color: var(--muted); }
.t-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 26px; }
.t-stat { background: #fcfbf8; border: 1px solid var(--line-soft); border-radius: 12px; padding: 14px 16px; display: flex; flex-direction: column; gap: 2px; }
.ts-l { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--faint); }
.ts-v { font-size: 19px; font-weight: 600; color: var(--ink); margin-top: 2px; }
.ts-s { font-size: 12px; color: var(--muted); }
.t-stat.gold { background: linear-gradient(135deg, #fbf6ea, #f4ecda); border-color: #ecdfc1; }
.t-stat.gold .ts-v { color: var(--green); }
.cta {
  margin-top: 24px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 17px 20px; border: none; border-radius: 14px; cursor: pointer;
  background: var(--ink); color: #fbf7ee; font-size: 16px; font-weight: 600; letter-spacing: .1px;
  box-shadow: 0 14px 28px -14px rgba(19,17,14,.7), inset 0 1px 0 rgba(255,255,255,.08);
  transition: transform .15s ease, box-shadow .2s ease, background .2s ease;
}
.cta svg { color: var(--gold); transition: transform .2s ease; }
.cta:hover { transform: translateY(-1px); background: #000; box-shadow: 0 18px 32px -14px rgba(19,17,14,.75); }
.cta:hover svg { transform: translateX(3px); }
.t-lock { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 12.5px; color: var(--faint); margin-top: 12px; }

/* Assurances */
.assure { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 22px; }
.as-item { display: flex; gap: 12px; align-items: flex-start; padding: 16px; border-radius: 14px; border: 1px solid var(--line-soft); background: #fff; }
.as-icon { flex-shrink: 0; color: var(--green); display: inline-flex; width: 36px; height: 36px; border-radius: 10px; align-items: center; justify-content: center; background: var(--green-bg); }
.as-item strong { display: block; font-size: 14px; color: var(--ink); }
.as-item span { font-size: 12.5px; color: var(--muted); line-height: 1.45; }

/* Sign up */
.card { background: #fff; border: 1px solid var(--line); border-radius: 20px; padding: 30px 32px 32px; box-shadow: 0 20px 50px -34px rgba(19,17,14,.3); }
.summary-chip {
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; font-size: 13px; color: var(--muted);
  background: var(--cream); border-radius: 12px; padding: 12px 16px; margin-bottom: 24px;
}
.summary-chip b { color: var(--ink); }
.summary-chip .sep { width: 4px; height: 4px; border-radius: 50%; background: #cfc4ab; }
.fields { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.field { display: flex; flex-direction: column; grid-column: span 2; min-width: 0; }
.field.half { grid-column: span 1; }
.field.full { grid-column: 1 / -1; }
.field label { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--faint); margin-bottom: 7px; }
.field input {
  border: 1px solid var(--line); border-radius: 10px; background: #fcfbf8; padding: 12px 13px; font-size: 14.5px;
  font-family: inherit; color: var(--ink); transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
}
.field input:hover { border-color: #d8ccb0; }
.field input:focus { outline: none; background: #fff; border-color: var(--gold-d); box-shadow: 0 0 0 3px rgba(201,168,106,.2); }
.agree { font-size: 13px; color: var(--muted); line-height: 1.6; margin: 24px 0 18px; }
.signs { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.sign-area { height: 84px; border-radius: 12px; background: #fcfbf8; border: 1px solid var(--line-soft); position: relative; }
.sign-area::after { content: ""; position: absolute; left: 36px; right: 18px; bottom: 22px; height: 1px; background: #cfc4ab; }
.sign-x { position: absolute; left: 16px; bottom: 16px; font-size: 18px; color: var(--faint); }
.sign-label { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--faint); margin-top: 9px; }

/* Terms */
.terms-sec { padding-top: 56px; }
.terms { border-top: 1px solid var(--line); padding-top: 40px; }
.terms-title { font-family: var(--display); font-weight: 500; font-size: 24px; color: var(--ink); }
.terms-intro { font-size: 13px; line-height: 1.7; color: var(--muted); margin: 12px 0 28px; max-width: 760px; }
.clauses { columns: 2; column-gap: 40px; }
.clause { break-inside: avoid; margin-bottom: 20px; }
.clause h3 { font-size: 14px; font-weight: 600; color: var(--ink); display: flex; gap: 8px; margin-bottom: 6px; }
.clause h3 span { font-family: var(--display); font-style: italic; color: var(--gold-d); font-weight: 500; }
.clause p { font-size: 12.5px; line-height: 1.65; color: #4d483f; margin-bottom: 6px; }
.print-wrap { display: flex; justify-content: center; padding: 28px 0 8px; }
.print-btn {
  display: inline-flex; align-items: center; gap: 9px; border: 1px solid var(--line); background: #fff; color: var(--ink);
  font-size: 14px; font-weight: 600; padding: 12px 20px; border-radius: 12px; cursor: pointer; transition: all .15s ease;
}
.print-btn:hover { border-color: var(--gold-d); box-shadow: 0 8px 18px -12px rgba(19,17,14,.4); }

.foot {
  max-width: 920px; margin: 56px auto 0; padding: 26px 20px 40px; border-top: 1px solid var(--line);
  display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;
  font-size: 12.5px; color: var(--faint);
}

/* Responsive */
@media (max-width: 820px) {
  .plans, .features, .assure { grid-template-columns: 1fr; }
  .plans { gap: 20px; }
  .extras { grid-template-columns: 1fr; }
  .meta { grid-template-columns: 1fr 1fr; }
  .meta-cell:nth-child(3) { border-left: none; }
  .meta-cell:nth-child(n+3) { border-top: 1px solid var(--line-soft); }
  .clauses { columns: 1; }
}
@media (max-width: 600px) {
  .hero { padding-bottom: 56px; }
  .hero-body { padding-top: 28px; }
  .hero-sub { font-size: 15px; }
  .trust { flex-direction: column; align-items: center; gap: 10px; }
  .stepper .lbl { display: none; }
  .stepper li:not(:last-child)::after { margin: 0 6px; }
  .stepper li.current .lbl { display: inline; }
  .sec { padding-top: 56px; }
  .quote-head { flex-direction: column; align-items: flex-start; gap: 0; }
  .quote-head .sec-head { margin-bottom: 14px; }
  .edit-toggle { margin-bottom: 18px; }
  .paper { border-radius: 16px; }
  .paper-head { padding: 26px 20px 20px; flex-direction: column; gap: 18px; }
  .doc-type { text-align: left; }
  .doc-ref { text-align: left; }
  .meta { margin: 0 20px; }
  .lines th:first-child, .lines td:first-child { padding-left: 20px; }
  .lines th:last-child, .lines td:last-child { padding-right: 20px; }
  .lines .col-type { display: none; }
  .lines .col-amt { width: auto; }
  .presenter-inner, .add-inner { padding-left: 20px; padding-right: 20px; }
  .sums { padding: 18px 20px 22px; max-width: none; }
  .perf { margin: 0 10px; }
  .perf::before { left: -22px; } .perf::after { right: -22px; }
  .total { padding: 26px 20px 24px; }
  .t-stats { grid-template-columns: 1fr 1fr; }
  .t-stat.gold { grid-column: span 2; }
  .card { padding: 22px 18px 24px; border-radius: 16px; }
  .fields { grid-template-columns: 1fr 1fr; }
  .field, .field.span2, .field.full { grid-column: span 2; }
  .field.half { grid-column: span 1; }
  .signs { grid-template-columns: 1fr; }
  .foot { flex-direction: column; text-align: center; }
}

@media (prefers-reduced-motion: reduce) {
  .offer *, .offer *::before, .offer *::after { transition: none !important; animation: none !important; }
}

/* Print: the quote, sign-up and terms only */
@media print {
  .no-print, .selection, .stepper { display: none !important; }
  body, .offer { background: #fff; }
  .hero { padding: 0 0 12px; background: #fff; color: var(--ink); }
  .hero::before, .hero::after { display: none; }
  .hero .logo { color: var(--ink); }
  .main { max-width: none; padding: 0 12mm; }
  .sec { padding-top: 16px; }
  .sec-sub { display: none; }
  .paper, .card { box-shadow: none; break-inside: avoid; }
  .perf::before, .perf::after { display: none; }
  .lines tr.removed { display: none; }
  .minput, .doc-ref { border-bottom-color: transparent !important; }
  .terms-sec { break-before: page; }
  .paper::before, .t-stat.gold, .extras-icon, .mark { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`
