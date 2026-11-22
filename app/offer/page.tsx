'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import BrandLogo from '../../components/BrandLogo'

/* ─── Pricing data ─────────────────────────────────────────────────────── */

const LIST_MONTHLY = 69

const PLANS = {
  monthly:   { label: 'Monthly',   months: 1,  rate: 69, off: null,      tag: null,           perk: 'Full price, maximum flexibility', term: 'Rolling, cancel anytime', period: 'per month' },
  quarterly: { label: 'Quarterly', months: 3,  rate: 59, off: '14% OFF', tag: 'Most popular', perk: null,                             term: 'Billed every 3 months',   period: 'every 3 months' },
  annual:    { label: 'Annual',    months: 12, rate: 49, off: '29% OFF', tag: 'Best value',   perk: 'Over 3 months free',             term: 'Billed once a year',      period: 'per year' },
} as const

type Term = keyof typeof PLANS

// What a plan keeps in the studio's pocket over a year, against monthly.
const yearlySaving = (rate: number) => (LIST_MONTHLY - rate) * 12

const FEATURES: { name: string; detail: string; icon: keyof typeof FEATURE_ICONS; tone: string }[] = [
  { name: 'Scheduling & calendar',        detail: 'Book, reschedule and track every session', icon: 'calendar', tone: '#2f7bff' },
  { name: 'Client tracking & progress',   detail: 'Goals, metrics, workout logs and trends',  icon: 'trend',    tone: '#8b5cff' },
  { name: 'Payments & invoicing',         detail: 'See who has paid at a glance',             icon: 'card',     tone: '#16a37b' },
  { name: 'Lead pipeline (CRM)',          detail: 'From enquiry to signed client',            icon: 'funnel',   tone: '#ff4fa3' },
  { name: 'Performance analytics',        detail: 'Adherence and trends in one place',        icon: 'chart',    tone: '#ff8a3d' },
  { name: 'Unlimited trainers & clients', detail: 'No per-seat fees, ever',                   icon: 'users',    tone: '#111318' },
]

const FEATURE_ICONS = {
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M8 3v4M16 3v4M3.5 10h17M8 14h3" /></>,
  trend:    <><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
  card:     <><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M2.5 10h19M6.5 15h3" /></>,
  funnel:   <path d="M3.5 4.5h17l-6.5 8v6l-4 2v-8z" />,
  chart:    <><path d="M4 20V10M10 20V4M16 20v-7M21 20H3" /></>,
  users:    <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 4.7a3.5 3.5 0 0 1 0 6.6M18.5 14.8c1.8.9 3 2.9 3 5.2" /></>,
}

/* ─── Quote line model ─────────────────────────────────────────────────── */

type Kind = 'once' | 'recurring'
type Status = 'charge' | 'waived' | 'removed'

type Extra = { id: string; label: string; amount: number; kind: Kind; status: Status; custom: boolean }
type Discount = { id: string; label: string; mode: 'pct' | 'fixed'; value: number; scope: Kind }

const DEFAULT_EXTRAS: Extra[] = [
  { id: 'onboard', label: 'Onboarding & data migration',     amount: 150, kind: 'once', status: 'waived', custom: false },
  { id: 'call',    label: '1:1 setup call with the founder', amount: 75,  kind: 'once', status: 'waived', custom: false },
  { id: 'support', label: 'Priority support, first 90 days', amount: 90,  kind: 'once', status: 'waived', custom: false },
]

const gbp = (n: number) =>
  '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const uid = () => Math.random().toString(36).slice(2, 9)

/* Invoice number: DNI-<studio code>-<YYMMDD>-<plan><fingerprint>
   e.g. DNI-IRN-261122-Q7KX3. The studio code comes from the name, the
   fingerprint is a short hash of the client's details, so the same client
   on the same day and plan always gets the same number. */
const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
function fingerprint(text: string, len = 4) {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0 }
  let out = ''
  for (let i = 0; i < len; i++) { out += CROCKFORD[h & 31]; h >>>= 5 }
  return out
}
function studioCode(name: string) {
  const words = name.toUpperCase().replace(/[^A-Z0-9 ]/g, ' ').split(/\s+/).filter(Boolean)
  if (!words.length) return 'NEW'
  const code = words.length >= 3 ? words.map(w => w[0]).join('') : words[0]
  return (code + (words[1] ?? '') + 'XXX').slice(0, 3)
}
function invoiceNumber(f: { studio: string; contact: string; email: string; postcode: string; term: Term; date: Date | null }) {
  const d = f.date ?? new Date(0)
  const ymd = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0')
  const norm = (v: string) => v.trim().toLowerCase().replace(/\s+/g, '')
  const seed = [f.studio, f.contact, f.email, f.postcode, ymd, f.term].map(norm).join('|')
  return `DNI-${studioCode(f.studio)}-${ymd}-${f.term[0].toUpperCase()}${fingerprint(seed)}`
}

const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

/* ─── Small pieces ─────────────────────────────────────────────────────── */

/** Eases a number towards its new value so the total glides rather than jumps. */
function useTween(value: number, ms = 450) {
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

/* ─── Page ─────────────────────────────────────────────────────────────── */

export default function OfferPage() {
  const [term, setTerm] = useState<Term>('quarterly')
  const [extras, setExtras] = useState<Extra[]>(DEFAULT_EXTRAS)
  const [discounts, setDiscounts] = useState<Discount[]>([])

  const [studio, setStudio] = useState('')
  const [contact, setContact] = useState('')
  const [ref, setRef] = useState('')
  const [email, setEmail] = useState('')
  const [postcode, setPostcode] = useState('')
  const [issuedAt, setIssuedAt] = useState<Date | null>(null)
  const issued = issuedAt ? fmtDate(issuedAt) : ''

  // Dates are set on the client so server and client render the same markup.
  useEffect(() => {
    setIssuedAt(new Date())
  }, [])

  const plan = PLANS[term]
  const autoRef = issuedAt ? invoiceNumber({ studio, contact, email, postcode, term, date: issuedAt }) : ''

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

    return {
      listSub, termSaving, onceExtras, discAmounts, recurringTotal,
      dueToday: Math.max(firstBase - onceDisc, 0),
      subtotal: listSub + recurringExtras + onceExtras,
      waivedValue: extras.filter(e => e.status === 'waived').reduce((s, e) => s + e.amount, 0),
      discountTotal: termSaving + recurringDisc + onceDisc,
    }
  }, [plan, extras, discounts])

  const dueShown = useTween(totals.dueToday)

  const updateExtra = (id: string, patch: Partial<Extra>) =>
    setExtras(xs => xs.map(x => (x.id === id ? { ...x, ...patch } : x)))
  const deleteExtra = (id: string) => setExtras(xs => xs.filter(x => x.id !== id))
  const addCharge = () =>
    setExtras(xs => [...xs, { id: uid(), label: 'Additional item', amount: 0, kind: 'once', status: 'charge', custom: true }])

  const updateDiscount = (id: string, patch: Partial<Discount>) =>
    setDiscounts(ds => ds.map(d => (d.id === id ? { ...d, ...patch } : d)))
  const deleteDiscount = (id: string) => setDiscounts(ds => ds.filter(d => d.id !== id))
  const addDiscount = () =>
    setDiscounts(ds => [...ds, { id: uid(), label: 'Discount', mode: 'pct', value: 10, scope: 'once' }])

  const visibleExtras = extras
  const kindWord = (k: Kind) => (k === 'once' ? 'One-off' : 'Recurring')
  const monthsWord = plan.months === 1 ? 'first month' : `first ${plan.months} months`

  return (
    <div className="offer">
      <style>{CSS}</style>

      {/* ── Sheet 1: invoice ─────────────────────────────── */}
      <article className="sheet">
        <header className="letterhead">
          <BrandLogo height={54} />
          <div className="lh-title">
            <h1 className="doc-title">Invoice</h1>
            <div className="lh-sub">Founding studio offer</div>
          </div>
        </header>

        <div className="sheet-body">
        <div className="parties">
          <section className="panel">
            <h2 className="label">Billed to</h2>
            <dl>
              <div className="p-row">
                <dt><label htmlFor="bt-studio">Studio</label></dt>
                <dd><input id="bt-studio" className="p-input strong" placeholder="Studio name" autoComplete="organization" value={studio} onChange={e => setStudio(e.target.value)} /></dd>
              </div>
              <div className="p-row">
                <dt><label htmlFor="bt-contact">Name</label></dt>
                <dd><input id="bt-contact" className="p-input" placeholder="Owner or contact" autoComplete="name" value={contact} onChange={e => setContact(e.target.value)} /></dd>
              </div>
              <div className="p-row">
                <dt><label htmlFor="bt-addr">Address</label></dt>
                <dd><input id="bt-addr" className="p-input" placeholder="Street address" autoComplete="street-address" /></dd>
              </div>
              <div className="p-row">
                <dt><label htmlFor="bt-city">City</label></dt>
                <dd className="p-split">
                  <input id="bt-city" className="p-input" placeholder="City" autoComplete="address-level2" />
                  <input className="p-input" placeholder="Postcode" autoComplete="postal-code" aria-label="Postcode" value={postcode} onChange={e => setPostcode(e.target.value)} />
                </dd>
              </div>
              <div className="p-row">
                <dt><label htmlFor="bt-email">Email</label></dt>
                <dd><input id="bt-email" className="p-input" type="email" placeholder="name@studio.com" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></dd>
              </div>
              <div className="p-row">
                <dt><label htmlFor="bt-phone">Phone</label></dt>
                <dd><input id="bt-phone" className="p-input" type="tel" placeholder="Phone number" autoComplete="tel" /></dd>
              </div>
            </dl>
          </section>

          <section className="panel">
            <h2 className="label">Invoice details</h2>
            <dl className="num">
              <div className="p-row">
                <dt><label htmlFor="inv-ref">Invoice no.</label></dt>
                <dd className="ref-cell">
                  <input id="inv-ref" className="p-input ref-input" placeholder={autoRef || 'Generating…'} value={ref || autoRef} spellCheck={false}
                    onChange={e => setRef(e.target.value === autoRef ? '' : e.target.value)} />
                  {ref && <button type="button" className="ref-tag" onClick={() => setRef('')} title="Go back to the generated number">Reset</button>}
                </dd>
              </div>
              <div className="p-row"><dt>Issued</dt><dd>{issued || '—'}</dd></div>
              <div className="p-row"><dt>Plan</dt><dd>{plan.label}</dd></div>
              <div className="p-row"><dt>Billing</dt><dd>{plan.term}</dd></div>
              <div className="p-row"><dt>Payment</dt><dd>Due on acceptance</dd></div>
            </dl>
          </section>
        </div>

        {/* Billing */}
        <section className="part selection" id="plan">
          <h2 className="label">Billing</h2>
          <div className="plans" role="radiogroup" aria-label="Billing term">
            {(Object.keys(PLANS) as Term[]).map(t => {
              const p = PLANS[t]
              const on = term === t
              return (
                <button key={t} role="radio" aria-checked={on} className={`plan ${on ? 'on' : ''}`} onClick={() => setTerm(t)}>
                  {p.tag && <span className={`plan-tag ${t}`}>{p.tag}</span>}
                  <span className="radio" aria-hidden="true" />
                  <span className="plan-name">{p.label}</span>
                  <span className="plan-price num">
                    {p.rate < LIST_MONTHLY && <s className="plan-was">£{LIST_MONTHLY}</s>}
                    <strong>£{p.rate}</strong><span className="plan-per">/mo</span>
                  </span>
                  <span className="plan-term">{p.term}</span>
                  <span className="plan-foot">
                    {p.off && <span className="plan-save">{p.off}</span>}
                    {p.rate < LIST_MONTHLY
                      ? <span className="plan-keep">Keep £{yearlySaving(p.rate)} a year</span>
                      : <span className="plan-keep muted">{p.perk}</span>}
                  </span>
                  {p.rate < LIST_MONTHLY && p.perk && <span className="plan-perk">{p.perk}</span>}
                </button>
              )
            })}
          </div>
          {term !== 'annual' && (
            <button type="button" className="nudge no-print" onClick={() => setTerm('annual')}>
              <span className="nudge-dot" aria-hidden="true" />
              <span>
                You&rsquo;re leaving <strong>£{yearlySaving(PLANS.annual.rate) - yearlySaving(plan.rate)} a year</strong> on the table.
                {' '}Switch to Annual and pay £{PLANS.annual.rate}/mo instead of £{plan.rate}.
              </span>
              <span className="nudge-go">Switch &rarr;</span>
            </button>
          )}
        </section>

        {/* Included */}
        <section className="part selection" id="included">
          <h2 className="label">Included in every plan</h2>
          <div className="inc">
            <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
              <defs>
                <linearGradient id="inc-silver" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffffff" /><stop offset=".5" stopColor="#c9cdd3" /><stop offset="1" stopColor="#7d838c" />
                </linearGradient>
              </defs>
            </svg>
            <div className="inc-head">
              <div>
                <div className="inc-kicker">The complete platform</div>
                <h3 className="inc-title">Everything you need.<br /><span>Nothing held back.</span></h3>
              </div>
              <div className="inc-count num">
                <strong>6</strong>
                <span>core modules<br />on every plan</span>
              </div>
            </div>
            <ul className="features">
              {FEATURES.map((f, i) => (
                <li key={f.name}>
                  <div className="f-top">
                    <span className="f-icon" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="url(#inc-silver)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">{FEATURE_ICONS[f.icon]}</svg>
                    </span>
                    <span className="f-num num">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <span className="f-name">{f.name}</span>
                  <span className="f-det">{f.detail}</span>
                </li>
              ))}
            </ul>
            <div className="inc-foot">
              {['No tiers', 'No add-ons', 'No per-seat fees', 'Every update included'].map(t => (
                <span key={t}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="part" id="quote">


          <table className="lines">
            <thead>
              <tr><th><h2 className="th-title">Your investment</h2></th><th className="amt">Amount</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="l-main">DNI Studios platform, {plan.label.toLowerCase()}</div>
                  <div className="l-sub num">{`${plan.months} ${plan.months === 1 ? 'month' : 'months'} at ${gbp(LIST_MONTHLY)} · Recurring`}</div>
                </td>
                <td className="amt num">{gbp(totals.listSub)}</td>
              </tr>

              {totals.termSaving > 0 && (
                <tr>
                  <td>
                    <div className="l-main">{plan.label} rate</div>
                    <div className="l-sub num">{`${gbp(plan.rate)} a month instead of ${gbp(LIST_MONTHLY)} · Recurring`}</div>
                  </td>
                  <td className="amt num">−{gbp(totals.termSaving)}</td>
                </tr>
              )}

              {visibleExtras.map(x => (
                <tr key={x.id} className={x.status === 'removed' ? 'removed' : ''}>
                  <td>
                    {x.custom ? (
                      <>
                        <input className="ctl ctl-wide no-print" value={x.label} onChange={e => updateExtra(x.id, { label: e.target.value })} aria-label="Item description" />
                        <div className="l-main print-only">{x.label}</div>
                      </>
                    ) : (
                      <div className="l-main">{x.label}</div>
                    )}
                    <div className="l-sub">
                      {x.status === 'waived' ? 'Free for founding studios only' : x.status === 'removed' ? 'Removed' : kindWord(x.kind)}
                    </div>
                    {x.custom && (
                      <div className="ctls no-print">
                        <select className="ctl" value={x.kind} onChange={e => updateExtra(x.id, { kind: e.target.value as Kind })} aria-label="Charge type">
                          <option value="once">One-off</option>
                          <option value="recurring">Recurring</option>
                        </select>
                        <button className="link-btn" onClick={() => deleteExtra(x.id)}>Delete</button>
                      </div>
                    )}
                  </td>
                  <td className="amt num">
                    <span className="ctl-money no-print">
                      <span>£</span>
                      <input
                        type="number" min={0} step="0.01" className="ctl ctl-amt num" value={x.amount}
                        onChange={e => updateExtra(x.id, { amount: Math.max(0, Number(e.target.value) || 0) })}
                        aria-label={`${x.label} amount`}
                      />
                    </span>
                                        <span className="print-only">
                      {x.status === 'waived' ? 'Included' : gbp(x.amount)}
                    </span>
                  </td>
                </tr>
              ))}

              {discounts.map(d => (
                <tr key={d.id}>
                  <td>
                    <input className="ctl ctl-wide no-print" value={d.label} onChange={e => updateDiscount(d.id, { label: e.target.value })} aria-label="Discount name" />
                    <div className="l-main print-only">{d.label}</div>
                    <div className="l-sub">
                      {`${d.mode === 'pct' ? `${d.value}%` : gbp(d.value)} off ${d.scope === 'once' ? 'the first payment' : 'every payment'}`}
                    </div>
                    <div className="ctls no-print">
                      <input
                        type="number" min={0} step="0.01" className="ctl ctl-amt num" value={d.value}
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
                      <button className="link-btn" onClick={() => deleteDiscount(d.id)}>Delete</button>
                    </div>
                  </td>
                  <td className="amt num">−{gbp(totals.discAmounts[d.id] ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="summary">
            <div className="summary-note">
              <div className="bank">
                <h3>Pay by bank transfer</h3>
                <dl className="num">
                  <div><dt>Bank</dt><dd>Monzo</dd></div>
                  <div><dt>Account name</dt><dd>DNI Ltd</dd></div>
                  <div><dt>Sort code</dt><dd>04-00-03</dd></div>
                  <div><dt>Account no.</dt><dd>98336645</dd></div>
                  <div className="bank-ref"><dt>Reference</dt><dd>{ref || autoRef || 'Your invoice number'}</dd></div>
                </dl>
              </div>
              <h3>Payment terms</h3>
              <p>Due on acceptance. Covered by a 30-day money-back guarantee, and your rate stays fixed for as long as you stay subscribed.</p>
              <p className="fair-use">Unlimited clients and trainers. Photo, video and voice-note uploads are subject to a fair-use storage policy; we will contact you before any limit affects your account.</p>
            </div>
            <div className="sum-card num">
              <div className="t-row"><span>Subtotal</span><span>{gbp(totals.subtotal)}</span></div>
              {totals.discountTotal > 0 && (
                <div className="t-row"><span>Discounts</span><span>−{gbp(totals.discountTotal)}</span></div>
              )}
              <div className="t-due">
                <div className="t-due-label">Due today</div>
                <div className="t-due-num">{gbp(dueShown)}</div>
                <div className="t-due-note">{`Covers your ${monthsWord}${totals.onceExtras > 0 ? ' and one-off items' : ''}`}</div>
              </div>
              <div className="t-then">
                <span>Then <strong>{gbp(totals.recurringTotal)}</strong> {plan.period}</span>
                {plan.months > 1 && <span className="t-then-sub">{`${gbp(totals.recurringTotal / plan.months)} a month`}</span>}
              </div>
              {totals.discountTotal + totals.waivedValue > 0 && (
                <div className="t-saved">
                  <span>You&rsquo;re saving</span>
                  <strong>{gbp(totals.discountTotal + totals.waivedValue)}</strong>
                </div>
              )}
              <button className="cta no-print" onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}>
                Lock in my founding rate
              </button>
              <div className="cta-trust no-print">30-day money-back guarantee &middot; Rate fixed while you stay</div>
            </div>
          </div>
        </section>

        {/* Acceptance */}
        <section className="part" id="signup">
          <h2 className="label">Acceptance</h2>
          <p className="agree">By signing, {studio ? <strong>{studio}</strong> : 'the studio named above'} accepts this invoice and the Terms &amp; Conditions that follow, which form part of this agreement.</p>

          <div className="signs">
            <div><div className="sign-line" /><div className="sign-label">Studio signature &amp; date</div></div>
            <div>
              <div className="sign-line signed">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/signature.png" alt="Signed for DNI Studios" className="sign-img" />
                {issued && <span className="sign-date">{issued}</span>}
              </div>
              <div className="sign-label">For DNI Studios</div>
            </div>
          </div>
        </section>
        </div>

        <footer className="sheet-foot">
          <span>Thank you for choosing DNI Studios.</span>
          <span>dnianalytics.com</span>
        </footer>
      </article>

      {/* ── Sheet 2: terms ─────────────────────────────────── */}
      <article className="sheet terms" id="terms">
        <h2 className="terms-title">Terms &amp; Conditions of Service</h2>
        <p className="terms-intro">These terms govern the provision of the DNI Studios software platform (&quot;the Service&quot;) by DNI Ltd, trading as DNI Analytics, a company registered in England and Wales under company number 15630271, registered office 78a Deacon Road, London NW2 5QJ (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) to the studio named above (&quot;the Customer&quot;, &quot;you&quot;). By signing the offer sheet or by accessing or using the Service, you agree to be bound by these terms.</p>
        <div className="clauses">
          {CLAUSES.map(clause => (
            <div className="clause" key={clause.num}>
              <h3>{clause.num} {clause.title}</h3>
              {clause.paras.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          ))}
        </div>
      </article>

      <div className="print-wrap no-print">
        <button className="print-btn" onClick={() => window.print()}>Print invoice</button>
      </div>

      <footer className="foot no-print">© {new Date().getFullYear()} DNI Ltd · Registered in England &amp; Wales, no. 15630271</footer>
    </div>
  )
}

/* ─── Terms content ────────────────────────────────────────────────────── */

const CLAUSES = [
  { num: '1.', title: 'Subscription & Payment', paras: [
    'The Service is provided on a subscription basis at the price and billing cycle (monthly, quarterly or annual) stated in this invoice. Your price is fixed for as long as your subscription remains continuously active, in accordance with the Founding Customer Guarantee.',
    'Payment for each billing cycle is due in advance, at the start of that cycle, by the method agreed at sign-up. Where payment is not received within 7 days of the due date, we may suspend access to the Service until payment is made.',
  ]},
  { num: '2.', title: 'Term & Cancellation', paras: [
    'This is a rolling agreement with no fixed minimum term beyond the billing cycle selected. You may cancel at any time by providing 14 days\' written notice. Cancellation takes effect at the end of the then-current billing period.',
    'Your first payment is covered by a 30-day money-back guarantee: cancel within 30 days of it and we will refund it in full, no questions asked. After that, no refunds are issued for partial billing periods. Founding price status is lost if a subscription lapses for more than 30 consecutive days and is later reinstated.',
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
  --ink: #111318; --text: #2a2d33; --muted: #6c717a; --faint: #9a9fa8;
  --line: #e6e7ea; --line-soft: #f0f1f3; --bg: #eceef1;
  --steel-1: #23262c; --steel-2: #121418; --silver: #c9cdd3;
  --sans: var(--font-inter), 'Helvetica Neue', Arial, sans-serif;
  background:
    radial-gradient(1200px 500px at 50% -200px, #ffffff 0%, transparent 70%),
    var(--bg);
  color: var(--text); font-family: var(--sans);
  min-height: 100vh; padding: 40px 16px 56px; -webkit-font-smoothing: antialiased;
}
body { background: #eceef1; }
.offer .num { font-variant-numeric: tabular-nums; }
.offer button { font-family: inherit; }
.offer :focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }


/* Sheet */
.sheet {
  max-width: 860px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden;
  box-shadow: 0 0 0 1px rgba(17,19,24,.04), 0 2px 4px rgba(17,19,24,.04), 0 30px 70px -30px rgba(17,19,24,.35);
}
.sheet + .sheet { margin-top: 28px; }
.sheet-body { padding: 0 56px 56px; }

/* Letterhead: brushed graphite with a polished edge */
.letterhead {
  position: relative; display: flex; align-items: center; justify-content: space-between; gap: 24px;
  padding: 40px 56px 38px; color: #e8eaee;
  background:
    radial-gradient(140% 160% at 0% 0%, #30343c 0%, var(--steel-1) 35%, var(--steel-2) 75%, #0a0b0d 100%);
}
.letterhead::before {
  content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .7;
  background: repeating-linear-gradient(90deg, rgba(255,255,255,.022) 0 1px, transparent 1px 3px);
}
.letterhead::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 2px;
  background: linear-gradient(90deg, #5c626b, #f2f4f7 30%, #8a9099 50%, #e4e7eb 70%, #5c626b);
}
.letterhead > * { position: relative; }
.lh-title { text-align: right; }
.doc-title {
  font-family: var(--sans); font-weight: 600; font-size: 30px; line-height: 1;
  letter-spacing: .38em; margin-right: -.38em; text-transform: uppercase;
  background: linear-gradient(180deg, #ffffff 0%, #dfe2e6 40%, #8f959e 52%, #e9ecef 78%, #b9bec5 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,.45));
}
.lh-sub { margin-top: 12px; font-size: 11px; font-weight: 500; letter-spacing: .24em; text-transform: uppercase; color: #8d939c; }

/* Section labels */
.label {
  display: flex; align-items: center; gap: 14px; font-family: var(--sans); font-size: 11px; font-weight: 600;
  letter-spacing: .14em; text-transform: uppercase; color: var(--faint); margin: 0 0 16px;
}
.label::after { content: ""; flex: 1; height: 1px; background: var(--line); }

/* Billed to / details panels */
.parties { display: grid; grid-template-columns: 1.3fr 1fr; gap: 16px; margin-top: 32px; align-items: start; }
.panel {
  border: 1px solid var(--line); border-radius: 14px; padding: 16px 18px 8px;
  background: linear-gradient(180deg, #ffffff, #fbfbfc);
}
.panel .label { margin-bottom: 2px; }
.p-row {
  display: grid; grid-template-columns: 76px 1fr; align-items: center; gap: 10px;
  padding: 4px 0; border-top: 1px solid var(--line-soft); min-height: 32px;
}
.p-row:first-child { border-top: none; }
.p-row dt { font-size: 12px; color: var(--faint); }
.p-row dd { font-size: 13.5px; color: var(--ink); min-width: 0; }
.p-split { display: grid; grid-template-columns: 1fr 100px; gap: 10px; }
.p-input {
  width: 100%; border: 1px solid transparent; background: transparent; border-radius: 8px;
  font: inherit; font-size: 13.5px; color: var(--ink); padding: 4px 8px; margin: -4px -8px;
  width: calc(100% + 16px); transition: background .15s ease, border-color .15s ease;
}
.p-split .p-input { width: calc(100% + 16px); }
.ref-cell { display: flex; align-items: center; gap: 4px; }
.ref-input { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px !important; letter-spacing: -.01em; font-weight: 600; flex: 1; min-width: 0; }
.ref-tag { flex-shrink: 0; font: inherit; font-size: 9px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: 2px 6px; border-radius: 999px; border: 1px solid var(--line); background: #fff; color: var(--faint); cursor: pointer; }
.ref-tag.auto { cursor: default; color: #2f7bff; border-color: rgba(47,123,255,.25); background: rgba(47,123,255,.06); }
@media print { .ref-tag { display: none; } }
.p-input.strong { font-weight: 600; font-size: 14.5px; }
.p-input::placeholder { color: #c2c6cc; font-weight: 400; }
.p-input:hover { background: #f5f6f8; }
.p-input:focus { outline: none; background: #fff; border-color: #c9cdd3; box-shadow: 0 0 0 3px rgba(17,19,24,.06); }

.part { margin-top: 48px; scroll-margin-top: 24px; }

/* Plans */
.plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.plan {
  position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 3px; text-align: left;
  background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 18px 18px 16px 46px;
  cursor: pointer; color: var(--text); transition: border-color .15s ease, box-shadow .2s ease, background .2s ease, transform .15s ease;
}
.plan:hover { border-color: #cfd2d7; transform: translateY(-1px); }
.plan.on {
  background: radial-gradient(140% 160% at 0% 0%, #30343c 0%, var(--steel-1) 40%, var(--steel-2) 100%);
  border-color: var(--steel-2); box-shadow: 0 14px 28px -16px rgba(17,19,24,.6), inset 0 1px 0 rgba(255,255,255,.08);
}
.radio {
  position: absolute; left: 18px; top: 20px; width: 16px; height: 16px; border-radius: 50%;
  border: 1.5px solid #cfd2d7; transition: all .15s ease;
}
.plan.on .radio { border-color: #e8eaee; background: radial-gradient(#e8eaee 0 3.5px, transparent 4px); }
.plan-name { font-size: 15px; font-weight: 600; color: var(--ink); }
.plan-term { font-size: 13px; color: var(--muted); }
.plan-price { display: flex; align-items: baseline; gap: 6px; margin-top: 6px; color: var(--ink); }
.plan-price strong { font-size: 30px; font-weight: 700; letter-spacing: -.03em; line-height: 1; }
.plan-per { font-size: 13px; color: var(--muted); }
.plan-was { font-size: 15px; color: var(--faint); text-decoration-color: #e5484d; text-decoration-thickness: 2px; }
.plan-foot { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.plan-save { font-size: 11.5px; font-weight: 800; letter-spacing: .04em; color: #fff; background: linear-gradient(180deg, #2fbf71, #16a35a); border-radius: 6px; padding: 3px 8px; box-shadow: 0 4px 10px -4px rgba(22,163,90,.6); }
.plan-keep { font-size: 12.5px; font-weight: 600; color: #16a35a; }
.plan-keep.muted { color: var(--faint); font-weight: 500; }
.plan-perk { font-size: 12px; color: var(--muted); margin-top: 2px; }
.plan-tag { position: absolute; top: -10px; right: 14px; font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 4px 9px; border-radius: 999px; color: #fff; background: #111318; box-shadow: 0 6px 14px -6px rgba(17,19,24,.6); }
.plan-tag.annual { background: linear-gradient(90deg, #ff8a3d, #ff4fa3); box-shadow: 0 6px 14px -6px rgba(255,79,163,.7); }
.plan.on .plan-tag.quarterly { background: linear-gradient(90deg, #2f7bff, #8b5cff); }
.plan.on .plan-name, .plan.on .plan-price { color: #fff; }
.plan.on .plan-term, .plan.on .plan-per, .plan.on .plan-perk { color: #9ba1aa; }
.plan.on .plan-was { color: #7d838c; }
.plan.on .plan-keep { color: #5be39a; }
.plan.on .plan-keep.muted { color: #9ba1aa; }
.plans { padding-top: 10px; }
.nudge {
  margin-top: 14px; width: 100%; display: flex; align-items: center; gap: 12px; text-align: left; cursor: pointer;
  font: inherit; font-size: 13.5px; color: #7a4a12; padding: 12px 16px; border-radius: 12px;
  background: linear-gradient(90deg, #fff7ec, #fff1f6); border: 1px solid #ffd9b3; transition: transform .15s ease, box-shadow .2s ease;
}
.nudge:hover { transform: translateY(-1px); box-shadow: 0 10px 24px -14px rgba(255,138,61,.7); }
.nudge strong { color: #c2410c; }
.nudge-dot { width: 8px; height: 8px; flex-shrink: 0; border-radius: 50%; background: #ff8a3d; box-shadow: 0 0 0 4px rgba(255,138,61,.2); animation: nudge-pulse 1.8s ease-in-out infinite; }
.nudge-go { margin-left: auto; flex-shrink: 0; font-weight: 700; color: #c2410c; }
@keyframes nudge-pulse { 50% { box-shadow: 0 0 0 7px rgba(255,138,61,0); } }

/* Features: one brushed-steel panel, matching the letterhead and totals */
.inc {
  position: relative; overflow: hidden; border-radius: 18px; color: #c8ccd2;
  background: radial-gradient(120% 140% at 0% 0%, #30343c 0%, var(--steel-1) 38%, var(--steel-2) 78%, #0a0b0d 100%);
  box-shadow: 0 30px 60px -30px rgba(17,19,24,.75), inset 0 1px 0 rgba(255,255,255,.09);
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.inc::before {
  content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .8;
  background: repeating-linear-gradient(90deg, rgba(255,255,255,.022) 0 1px, transparent 1px 3px);
}
.inc::after {
  content: ""; position: absolute; top: 0; left: 8%; right: 8%; height: 1px; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent);
}
.inc > * { position: relative; }
.inc-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; padding: 30px 32px 26px; }
.inc-kicker { font-size: 10.5px; font-weight: 600; letter-spacing: .24em; text-transform: uppercase; color: #8d939c; }
.inc-title {
  margin-top: 10px; font-size: 28px; font-weight: 600; line-height: 1.12; letter-spacing: -.025em;
  background: linear-gradient(180deg, #ffffff 0%, #e2e5e9 50%, #a7adb5 100%); -webkit-background-clip: text; background-clip: text; color: transparent;
}
.inc-title span { background: linear-gradient(180deg, #9aa0a8, #5f656e); -webkit-background-clip: text; background-clip: text; color: transparent; }
.inc-count { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.inc-count strong {
  font-size: 54px; font-weight: 600; line-height: .9; letter-spacing: -.04em;
  background: linear-gradient(180deg, #ffffff 0%, #e2e5e9 45%, #8d939c 62%, #eef0f2 100%); -webkit-background-clip: text; background-clip: text; color: transparent;
}
.inc-count span { font-size: 11.5px; line-height: 1.4; color: #8d939c; letter-spacing: .02em; }

.features {
  list-style: none; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
  background: rgba(255,255,255,.07); border-top: 1px solid rgba(255,255,255,.07); border-bottom: 1px solid rgba(255,255,255,.07);
}
.features li {
  position: relative; display: flex; flex-direction: column; gap: 5px; padding: 24px 26px 26px;
  background: linear-gradient(180deg, rgba(23,25,30,.96), rgba(16,18,22,.96)); transition: background .35s ease;
}
.features li::before {
  content: ""; position: absolute; inset: 0; opacity: 0; transition: opacity .35s ease; pointer-events: none;
  background: radial-gradient(260px circle at 30% 0%, rgba(255,255,255,.07), transparent 70%);
}
.features li:hover::before { opacity: 1; }
.f-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.f-icon {
  width: 46px; height: 46px; border-radius: 13px; display: inline-flex; align-items: center; justify-content: center;
  background: linear-gradient(180deg, #2a2d34, #15171b);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.14), inset 0 -1px 0 rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.06), 0 10px 20px -10px rgba(0,0,0,.8);
}
.f-num { font-size: 11px; letter-spacing: .14em; color: #5f656e; }
.f-name { font-size: 15px; font-weight: 600; color: #f1f3f5; letter-spacing: -.01em; }
.f-det { font-size: 13px; color: #8d939c; line-height: 1.5; }
.inc-foot { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 26px; padding: 18px 24px 20px; font-size: 12px; color: #9ba1aa; letter-spacing: .02em; }
.inc-foot span { display: inline-flex; align-items: center; gap: 7px; }
.inc-foot svg { color: #e3e6ea; }

/* Line items */
.lines { width: 100%; border-collapse: collapse; }
.lines th {
  font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--faint);
  text-align: left; padding: 0 0 12px; border-bottom: 1px solid var(--ink);
}
.lines td { padding: 15px 0; border-bottom: 1px solid var(--line-soft); vertical-align: top; font-size: 14.5px; }
.lines .amt { text-align: right; white-space: nowrap; padding-left: 24px; color: var(--ink); font-weight: 500; }
.th-title { font: inherit; letter-spacing: inherit; }
.l-main { color: var(--ink); font-weight: 500; }
.l-sub { font-size: 13px; color: var(--faint); margin-top: 3px; }
.struck { color: var(--faint); margin-right: 6px; font-weight: 400; }
.lines tr.removed td { opacity: .4; }
.lines tr.removed .l-main { text-decoration: line-through; }

.ctls { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 10px; }
.seg { display: inline-flex; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
.seg button { border: none; background: #fff; color: var(--muted); font-size: 12.5px; padding: 6px 11px; cursor: pointer; }
.seg button + button { border-left: 1px solid var(--line); }
.seg button.on { background: var(--ink); color: #fff; }
.ctl { border: 1px solid var(--line); border-radius: 8px; background: #fff; font: inherit; font-size: 13.5px; color: var(--ink); padding: 6px 10px; }
.ctl:focus { outline: none; border-color: var(--ink); }
.ctl-wide { width: 100%; max-width: 340px; }
.ctl-amt { width: 96px; text-align: right; }
.link-btn { border: none; background: transparent; color: var(--muted); font-size: 13px; cursor: pointer; padding: 6px 4px; }
.link-btn:hover { color: var(--ink); text-decoration: underline; }

/* Summary */
.summary { display: grid; grid-template-columns: 1fr 340px; gap: 32px; align-items: end; margin-top: 28px; }
.summary-note h3 { font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--faint); margin-bottom: 8px; }
.bank { border: 1px solid var(--line); border-radius: 14px; padding: 16px 18px 10px; margin-bottom: 24px; max-width: 380px; background: #fafbfc; }
.bank dl > div { display: grid; grid-template-columns: 110px 1fr; gap: 10px; padding: 7px 0; border-top: 1px solid var(--line-soft); font-size: 13.5px; }
.bank dl > div:first-child { border-top: none; }
.bank dt { color: var(--faint); font-size: 12.5px; }
.bank dd { color: var(--ink); font-weight: 600; letter-spacing: .02em; }
.bank-ref dd { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px; }
.summary-note p.fair-use { margin-top: 10px; font-size: 11.5px; color: var(--faint); }
.summary-note p { font-size: 13px; line-height: 1.65; color: var(--muted); max-width: 300px; }
.sum-card {
  position: relative; overflow: hidden; border-radius: 16px; padding: 22px 24px 24px; color: #c8ccd2;
  background: radial-gradient(140% 140% at 0% 0%, #30343c 0%, var(--steel-1) 40%, var(--steel-2) 100%);
  box-shadow: 0 24px 50px -24px rgba(17,19,24,.7), inset 0 1px 0 rgba(255,255,255,.08);
}
.sum-card::before {
  content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .7;
  background: repeating-linear-gradient(90deg, rgba(255,255,255,.022) 0 1px, transparent 1px 3px);
}
.sum-card > * { position: relative; }
.t-row { display: flex; justify-content: space-between; font-size: 13.5px; color: #9ba1aa; padding: 3px 0; }
.t-row span:last-child { color: #e3e6ea; }
.t-due { margin-top: 14px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,.12); }
.t-due-label { font-size: 11px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: #9ba1aa; }
.t-due-num {
  font-size: 44px; font-weight: 600; line-height: 1.05; letter-spacing: -.02em; margin-top: 8px;
  background: linear-gradient(180deg, #ffffff 0%, #e2e5e9 45%, #9aa0a8 60%, #eef0f2 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.t-due-note { font-size: 12.5px; color: #8d939c; margin-top: 6px; }
.t-then { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-size: 13px; color: #9ba1aa; margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,.08); }
.t-then strong { color: #e3e6ea; font-weight: 600; }
.t-then-sub { color: #8d939c; font-size: 12.5px; white-space: nowrap; }
.cta {
  margin-top: 20px; width: 100%; border: none; border-radius: 11px; cursor: pointer;
  font-size: 14.5px; font-weight: 600; letter-spacing: .02em; color: var(--ink); padding: 14px 20px;
  background: linear-gradient(180deg, #ffffff 0%, #e6e8eb 50%, #c5c9cf 100%);
  box-shadow: 0 1px 0 rgba(255,255,255,.6) inset, 0 6px 16px -6px rgba(0,0,0,.6);
  transition: transform .15s ease, filter .15s ease;
}
.cta:hover { transform: translateY(-1px); filter: brightness(1.04); }


/* Always-on editing helpers */
.print-only { display: none; }
.amt-note { font-size: 12px; color: #16a35a; margin-top: 6px; font-weight: 800; letter-spacing: .04em; }
.amt-note s { color: var(--faint); font-weight: 500; margin-right: 4px; letter-spacing: 0; }
.t-saved { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding: 10px 12px; border-radius: 10px; background: rgba(91,227,154,.1); border: 1px solid rgba(91,227,154,.25); font-size: 13px; color: #a7f0c8; }
.t-saved strong { color: #5be39a; font-size: 15px; }
.cta-trust { margin-top: 10px; text-align: center; font-size: 11.5px; color: #8d939c; }
.ctl-money { display: inline-flex; align-items: center; gap: 6px; color: var(--faint); }
.add { display: flex; gap: 10px; padding: 16px 0 0; }
.add-btn {
  border: 1px dashed #cfd2d7; background: #fafbfc; color: var(--muted); font-size: 13px; font-weight: 500;
  padding: 8px 14px; border-radius: 10px; cursor: pointer; transition: all .15s ease;
}
.add-btn:hover { border-style: solid; border-color: var(--ink); color: var(--ink); background: #fff; }
.print-wrap { max-width: 860px; margin: 28px auto 0; display: flex; justify-content: center; }
.print-btn {
  border: none; border-radius: 12px; cursor: pointer; font-size: 14.5px; font-weight: 600; letter-spacing: .02em;
  color: #eef0f2; padding: 14px 34px;
  background: radial-gradient(140% 160% at 0% 0%, #30343c 0%, var(--steel-1) 40%, var(--steel-2) 100%);
  box-shadow: 0 14px 30px -16px rgba(17,19,24,.7), inset 0 1px 0 rgba(255,255,255,.08);
  transition: transform .15s ease;
}
.print-btn:hover { transform: translateY(-1px); }

/* Acceptance */
.agree { font-size: 13px; line-height: 1.6; color: var(--muted); margin: 4px 0 48px; }
.agree strong { color: var(--ink); font-weight: 600; }
.signs { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
.sign-line { border-bottom: 1px solid var(--ink); height: 72px; }
.sign-line.signed { position: relative; display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; }
.sign-img { height: 84px; width: auto; margin: 0 0 -10px 12px; transform: rotate(-4deg); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.sign-date { font-size: 12.5px; color: var(--muted); padding-bottom: 6px; }
.sign-label { font-size: 12.5px; color: var(--muted); margin-top: 8px; }

.sheet-foot {
  display: flex; justify-content: space-between; gap: 16px; padding: 18px 56px;
  border-top: 1px solid var(--line-soft); background: #fafbfc; font-size: 12.5px; color: var(--faint);
}

/* Terms */
.terms { padding: 52px 56px 56px; }
.terms-title { font-weight: 600; font-size: 20px; letter-spacing: .02em; color: var(--ink); }
.terms-intro { font-size: 13px; line-height: 1.7; color: var(--muted); margin: 14px 0 32px; }
.clauses { columns: 2; column-gap: 40px; }
.clause { break-inside: avoid; margin-bottom: 20px; }
.clause h3 { font-size: 13.5px; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
.clause p { font-size: 12.5px; line-height: 1.65; color: var(--muted); margin-bottom: 6px; }

.foot { max-width: 860px; margin: 28px auto 0; text-align: center; font-size: 12px; color: var(--faint); }

/* Small screens */
@media (max-width: 760px) {
  .offer { padding: 14px 10px 32px; }
  .sheet { border-radius: 14px; }
  .letterhead { flex-direction: column; align-items: flex-start; padding: 28px 22px 26px; gap: 22px; }
  .lh-title { text-align: left; }
  .doc-title { font-size: 26px; }
  .sheet-body { padding: 0 20px 40px; }
  .parties { grid-template-columns: 1fr; margin-top: 28px; }
  .panel { padding: 16px 16px 8px; }
  .p-row { grid-template-columns: 70px 1fr; }
  .part { margin-top: 40px; }
  .plans { grid-template-columns: 1fr; gap: 18px; }
  .features { grid-template-columns: 1fr 1fr; }
  .inc-head { flex-direction: column; align-items: flex-start; padding: 24px 22px 20px; }
  .inc-title { font-size: 23px; }
  .features li { padding: 20px; }
  .summary { grid-template-columns: 1fr; gap: 20px; }
  .signs { grid-template-columns: 1fr; gap: 24px; }
  .sheet-foot { padding: 16px 20px; flex-direction: column; gap: 4px; }
  .terms { padding: 32px 20px 36px; }
  .clauses { columns: 1; }
}

@media (max-width: 480px) {
  .features { grid-template-columns: 1fr; }
  .features li { display: grid; grid-template-columns: 46px 1fr; column-gap: 16px; row-gap: 3px; padding: 18px 20px; }
  .f-top { grid-row: span 2; margin: 0; }
  .f-num { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .offer *, .offer *::before, .offer *::after { transition: none !important; }
}

/* Print: the invoice and terms, without the choosing steps or controls */
@media print {
  .no-print, .selection { display: none !important; }
  .offer, body { background: #fff; padding: 0; }
  .sheet { box-shadow: none; max-width: none; border-radius: 0; }
  .sheet + .sheet { margin-top: 0; }
  .lines tr.removed { display: none; }
  .p-input::placeholder { color: transparent; }
  .letterhead, .sum-card, .plan.on { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .print-only { display: inline; }
  div.print-only { display: block; }
  .terms { break-before: page; }
}
`
