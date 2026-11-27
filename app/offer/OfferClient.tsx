'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import BrandLogo from '../../components/BrandLogo'
import SignaturePad, { SIGNATURE_PAD_CSS } from '../../components/SignaturePad'

/* ─── Pricing data ─────────────────────────────────────────────────────── */

const LIST_MONTHLY = 79

const PLANS = {
  monthly:   { label: 'Monthly',   months: 1,  rate: 79, off: null,      tag: null,           perk: 'Full price, maximum flexibility', term: 'Rolling monthly, no lock-in', period: 'per month' },
  quarterly: { label: 'Quarterly', months: 3,  rate: 69, off: '13% OFF', tag: 'Most popular', perk: null,                             term: 'Billed every 3 months',   period: 'every 3 months' },
  annual:    { label: 'Annual',    months: 12, rate: 59, off: '25% OFF', tag: 'Best value',   perk: 'Over 3 months free',             term: 'Billed once a year',      period: 'per year' },
} as const

type Term = keyof typeof PLANS

// What a plan keeps in the studio's pocket over a year, against monthly.
const yearlySaving = (rate: number) => (LIST_MONTHLY - rate) * 12

const FEATURES: { name: string; detail: string; icon: keyof typeof FEATURE_ICONS }[] = [
  { name: 'Scheduling & calendar', detail: 'Bookings, calendar invites and automatic reminders', icon: 'calendar' },
  { name: 'Client tracking & progress', detail: 'Workouts, body metrics and before / after photos', icon: 'trend' },
  { name: 'Payments & invoicing', detail: 'Card payments, packages and who\'s paid at a glance', icon: 'card' },
  { name: 'Lead pipeline (CRM)', detail: 'Every enquiry tracked, with automated follow-ups', icon: 'funnel' },
  { name: 'Performance analytics', detail: 'Adherence, attendance and studio KPIs', icon: 'chart' },
  { name: 'Unlimited trainers & clients', detail: 'Branded client app, no per-seat fees', icon: 'users' },
]


// Feedback credit: £1 off the next bill per fix or new feature suggested, capped per month.
const FEEDBACK_CREDIT = 1
const FEEDBACK_CREDIT_CAP = 10

// Social media credit: £5 off every month for taking part in our social media content (see Terms, clause 9).
const SOCIAL_CREDIT = 5

// Trust badges under the bank card. Only claims that are true today:
//  - cancel any time: Terms clause 3
//  - GDPR: processor terms in Terms clause 6 (register with the ICO to keep this true)
//  - export: built into the app and Terms clause 6
//  - encryption: HTTPS/TLS with HSTS in transit; MongoDB Atlas and Cloudflare R2 encrypt at rest
//  - isolation: every query is scoped to the studio at the storage layer
//  - registered company: Companies House no. 15630271
// Add your ICO registration number to ICO_REG_NO once you have it and an
// "ICO registered" badge appears.
const ICO_REG_NO = ''
const TRUST_BADGES: { label: string; icon: React.ReactNode }[] = [
  { label: 'Cancel any time', icon: <><path d="M20 12a8 8 0 1 1-2.4-5.7" /><path d="M20 4.5V9h-4.5" /></> },
  { label: 'GDPR compliant', icon: <><path d="M12 2.8 19.5 5.6v5.9c0 4.9-3.2 8.4-7.5 9.7-4.3-1.3-7.5-4.8-7.5-9.7V5.6z" /><path d="M9 11.8 11.2 14 15.2 9.8" /></> },
  { label: 'Fully encrypted', icon: <><rect x="5" y="10.5" width="14" height="10" rx="2.6" /><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7" /><path d="M12 14.4v2.4" /></> },
  { label: 'Isolated studio data', icon: <><rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.8" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="1.8" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="1.8" /><rect x="13" y="13" width="7.5" height="7.5" rx="1.8" /></> },
  { label: 'UK registered', icon: <><path d="M3.5 9.2 12 4l8.5 5.2" /><path d="M5.5 10.5v7M9.8 10.5v7M14.2 10.5v7M18.5 10.5v7" /><path d="M3.5 20.3h17" /></> },
  { label: 'Founder-led support', icon: <><path d="M4.5 12.5v-1a7.5 7.5 0 0 1 15 0v1" /><rect x="3.5" y="12.5" width="4" height="6" rx="1.6" /><rect x="16.5" y="12.5" width="4" height="6" rx="1.6" /><path d="M18.5 18.5c0 1.3-1.4 2-4 2" /></> },
  ...(ICO_REG_NO ? [{ label: `ICO registered · ${ICO_REG_NO}`, icon: <><rect x="4.5" y="3.5" width="15" height="17" rx="2.2" /><path d="M8 8.5h8M8 12h8M8 15.5h5" /></> }] : []),
]

const EXTRAS = ['AI Coach (fair use)', 'Diet & meal plans', 'Form-check video review', 'Messaging & voice notes', 'Community feed & leaderboard']

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

type Extra = { id: string; label: string; amount: number; list: number; qty: number; kind: Kind; status: Status; custom: boolean }
type Discount = { id: string; label: string; mode: 'pct' | 'fixed'; value: number; scope: Kind }

const DEFAULT_EXTRAS: Extra[] = [
  { id: 'onboard', label: 'Onboarding & data migration',     amount: 149, list: 149, qty: 0, kind: 'once', status: 'charge', custom: false },
  { id: 'call',    label: '1:1 setup call with the team',    amount: 39,  list: 39, qty: 0, kind: 'once', status: 'charge', custom: false },
]

// Whole pounds by default (£441); pence only when there are some (£273.60).
const gbp = (n: number) => {
  const whole = Math.abs(n - Math.round(n)) < 0.005
  return '£' + n.toLocaleString('en-GB', { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 })
}

const uid = () => Math.random().toString(36).slice(2, 9)

/* Invoice number: DNI-<studio code><3-char fingerprint>, short enough to type as a bank reference.
   e.g. DNI-ITG7KX. The studio code comes from the name, the
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
  return `DNI-${studioCode(f.studio)}${fingerprint(seed, 3)}`
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

/* Discount in the bill: shows "Add" until set; type 20% or 50. */
function DiscountField({ amount, current, onSet }: { amount: number; current: string; onSet: (raw: string) => void }) {
  const [editing, setEditing] = useState(false)
  if (!editing) {
    return amount > 0
      ? <button type="button" className="amt-edit" onClick={() => setEditing(true)} aria-label="Edit discount">−{gbp(amount)}</button>
      : <button type="button" className="b-add no-print" onClick={() => setEditing(true)}>+ Add</button>
  }
  return (
    <input autoFocus className="b-disc-input" defaultValue={current} placeholder="20% or £50" aria-label="Discount, as a percentage or amount"
      onBlur={e => { onSet(e.target.value); setEditing(false) }}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') (e.target as HTMLInputElement).blur() }} />
  )
}

/* Looks like a plain amount; click it to edit. */
function EditableAmount({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const [editing, setEditing] = useState(false)
  if (!editing) {
    return <button type="button" className="amt-edit" onClick={() => setEditing(true)} aria-label={`Edit ${label}`}>{gbp(value)}</button>
  }
  return (
    <input autoFocus type="number" min={0} step="0.01" className="amt-input num" defaultValue={value} aria-label={label}
      onFocus={e => { const v = e.target.value; e.target.value = ''; e.target.value = v }}
      onBlur={e => { onChange(Math.max(0, Number(e.target.value) || 0)); setEditing(false) }}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') (e.target as HTMLInputElement).blur() }} />
  )
}

/* Quantity: − n + on screen, just the number in print. 0 takes the line off the bill. */
function QtyStepper({ value, onChange, label, min = 0, max = 99 }: { value: number; onChange: (v: number) => void; label: string; min?: number; max?: number }) {
  return (
    <>
      <span className="qty no-print" role="group" aria-label={`${label} quantity`}>
        <button type="button" className="qty-btn" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Fewer ${label}`}>−</button>
        <span className="qty-n num">{value}</span>
        <button type="button" className="qty-btn" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${label}`}>+</button>
      </span>
      <span className="print-only num">{value}</span>
    </>
  )
}

/* Yes/no switch: polished-metal knob in a deep track that lights up green when on. */
function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <>
      <button type="button" role="switch" aria-checked={on} aria-label={label} className={`sw no-print ${on ? 'on' : ''}`} onClick={() => onChange(!on)}>
        <span className="sw-knob" />
      </button>
      <span className="print-only">{on ? 'Yes' : 'No'}</span>
    </>
  )
}

/* ─── Page ─────────────────────────────────────────────────────────────── */

export type BankDetails = { bankName: string; sortCode: string; accountNumber: string; accountName: string }

export default function OfferClient({ bank }: { bank: BankDetails }) {
  const [term, setTerm] = useState<Term>('quarterly')
  const [extras, setExtras] = useState<Extra[]>(DEFAULT_EXTRAS)
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [feedbackOn, setFeedbackOn] = useState(false)
  const [socialOn, setSocialOn] = useState(false)
  // Credits sit behind a subtle chevron; a credit that's switched on stays visible.
  const [creditsOpen, setCreditsOpen] = useState(false)

  const [studio, setStudio] = useState('')
  const [contact, setContact] = useState('')
  const [ref, setRef] = useState('')
  const [email, setEmail] = useState('')
  const [postcode, setPostcode] = useState('')
  const [city, setCity] = useState('')
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
    const charged = extras.filter(e => e.status === 'charge' && e.qty > 0)
    const recurringExtras = charged.filter(e => e.kind === 'recurring').reduce((s, e) => s + e.amount * e.qty, 0)
    const onceExtras = charged.filter(e => e.kind === 'once').reduce((s, e) => s + e.amount * e.qty, 0)

    // Recurring discounts come off the recurring subtotal; one-off discounts
    // come off whatever is left on the first payment.
    // Feedback credits come off the subscription, capped per month of the term.
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
    // Social media credit: £5 for every month in the billing cycle, on every bill.
    const socialCredit = socialOn ? Math.min(SOCIAL_CREDIT * plan.months, Math.max(recurringBase - recurringDisc, 0)) : 0
    recurringDisc += socialCredit
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
    // Social media credit: one-off, off today's payment only.

    return {
      listSub, termSaving, onceExtras, discAmounts, recurringTotal, socialCredit,
      // What each renewal costs from the next period on (feedback credits come off later bills, so not included).
      recurringOngoing: Math.max(recurringBase - recurringDisc, 0),
      dueToday: Math.max(firstBase - onceDisc, 0),
      subtotal: listSub + recurringExtras + onceExtras,
      waivedValue: charged.reduce((s, e) => s + Math.max(e.list - e.amount, 0) * e.qty, 0),
      setupList: charged.reduce((s, e) => s + Math.max(e.list, e.amount) * e.qty, 0),
      discountTotal: termSaving + recurringDisc + onceDisc,
    }
  }, [plan, extras, discounts, socialOn])

  const dueShown = totals.dueToday // no count-up: a ticking total made prices feel like they were climbing

  const [signOpen, setSignOpen] = useState(false)
  // Terms are collapsed on screen (always printed in full as page 2).
  const [termsOpen, setTermsOpen] = useState(false)
  const openTerms = () => { setTermsOpen(true); setTimeout(() => document.getElementById('terms')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60) }
  // The signature pad's Terms link asks the page to open them.
  useEffect(() => {
    const onOpen = () => openTerms()
    window.addEventListener('dni:open-terms', onOpen)
    return () => window.removeEventListener('dni:open-terms', onOpen)
  }, [])
  const [clientSig, setClientSig] = useState<{ src: string; at: Date } | null>(null)

  // The one negotiable discount in the bill: "20%" or "50" / "£50", off today's payment.
  const manual = discounts.find(d => d.id === 'manual')
  const setManual = (raw: string) => {
    const t = raw.trim().replace(/[£,\s]/g, '')
    const n = parseFloat(t.replace('%', ''))
    if (!t || !(n > 0)) { setDiscounts(ds => ds.filter(d => d.id !== 'manual')); return }
    const isPct = t.endsWith('%')
    const d: Discount = { id: 'manual', label: 'Discount', mode: isPct ? 'pct' : 'fixed', value: isPct ? Math.min(n, 100) : n, scope: 'once' }
    setDiscounts(ds => [...ds.filter(x => x.id !== 'manual'), d])
  }

  const updateExtra = (id: string, patch: Partial<Extra>) =>
    setExtras(xs => xs.map(x => (x.id === id ? { ...x, ...patch } : x)))
  const deleteExtra = (id: string) => setExtras(xs => xs.filter(x => x.id !== id))
  const addCharge = () =>
    setExtras(xs => [...xs, { id: uid(), label: 'Additional item', amount: 0, list: 0, qty: 1, kind: 'once', status: 'charge', custom: true }])


  const visibleExtras = extras
  const kindWord = (k: Kind) => (k === 'once' ? 'One-off' : 'Recurring')

  return (
    <div className="offer">
      <style>{CSS + SIGNATURE_PAD_CSS}</style>
      <SignaturePad open={signOpen} onClose={() => setSignOpen(false)} signer={contact || studio} reference={ref || autoRef}
        onSign={src => { setClientSig({ src, at: new Date() }); setSignOpen(false); setTimeout(() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350) }} />

      {/* ── Sheet 1: invoice ─────────────────────────────── */}
      <article className="sheet">
        <header className="letterhead">
          <BrandLogo height={54} />
          <div className="lh-title">
            <h1 className="doc-title">Proposal</h1>
            <div className="lh-sub">Founding studio offer</div>
          </div>
        </header>

        <div className="sheet-body">
        <div className="parties">
          <section className="panel bt">
            <h2 className="label">Prepared for</h2>
            <dl>
              <div className="p-row">
                <dd><input id="bt-studio" aria-label="Studio" className="p-input bt-studio" placeholder="Studio name" autoComplete="organization" value={studio} onChange={e => setStudio(e.target.value)} /></dd>
              </div>
              <div className="p-row">
                <dd><input id="bt-contact" aria-label="Contact" className="p-input" placeholder="Full name" autoComplete="name" value={contact} onChange={e => setContact(e.target.value)} /></dd>
              </div>
              <div className="p-row">
                <dd><input id="bt-addr" aria-label="Address" className="p-input" placeholder="Street address" autoComplete="street-address" /></dd>
              </div>
              <div className="p-row">
                <dd className="bt-split">
                  <input id="bt-city" aria-label="City" className="p-input" placeholder="City" autoComplete="address-level2" value={city} onChange={e => setCity(e.target.value)} />
                  <input className="p-input bt-post" placeholder="Postcode" aria-label="Postcode" autoComplete="postal-code" value={postcode} onChange={e => setPostcode(e.target.value)} />
                </dd>
              </div>
              <div className="p-row">
                <dd><input id="bt-email" aria-label="Email" className="p-input" type="email" placeholder="Email address" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></dd>
              </div>
              <div className="p-row">
                <dd><input id="bt-phone" aria-label="Phone" className="p-input" type="tel" placeholder="Mobile" autoComplete="tel" /></dd>
              </div>
            </dl>
          </section>

          <section className="panel">
            <h2 className="label">Proposal details</h2>
            <dl className="num">
              <div className="p-row">
                <dt><label htmlFor="inv-ref">Reference</label></dt>
                <dd className="ref-cell">
                  <input id="inv-ref" className="p-input ref-input" placeholder={autoRef || 'Generating…'} value={ref || autoRef} spellCheck={false}
                    onChange={e => setRef(e.target.value === autoRef ? '' : e.target.value)} />
                  {ref && <button type="button" className="ref-tag" onClick={() => setRef('')} title="Go back to the generated number">Reset</button>}
                </dd>
              </div>
              <div className="p-row"><dt>Issued</dt><dd>{issued || '—'}</dd></div>
              <div className="p-row"><dt>Plan</dt><dd>{plan.label}</dd></div>
              <div className="p-row"><dt>Billing</dt><dd>{plan.term}</dd></div>
              <div className="p-row"><dt>Payment</dt><dd>Bank transfer</dd></div>
              <div className="p-row"><dt>Prepared by</dt><dd>Darshan Mashru</dd></div>
            </dl>
          </section>
        </div>


        {/* Quote */}
        <section className="part" id="quote">


          <table className="lines">
            <thead>
              <tr><th>
                <div className="th-plan">
                  <h2 className="th-title">Your plan</h2>
                  {/* Billing term switch, compact, in the header row. */}
                  <div className="seg no-print" role="radiogroup" aria-label="Billing term">
                    {(Object.keys(PLANS) as Term[]).map(t => {
                      const p = PLANS[t]
                      const on = term === t
                      return (
                        <button key={t} type="button" role="radio" aria-checked={on} className={`seg-opt ${on ? 'on' : ''}`} onClick={() => setTerm(t)}>
                          <span className="seg-name">{p.label}</span>
                          <span className="seg-price num">£{p.rate}{p.off ? <em>−{p.off.replace('% OFF', '%')}</em> : null}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </th><th className="qty-col">Qty</th><th className="amt">Amount</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="l-main">DNI Studios PT Portal + Client Portal</div>
                  <div className="l-sub num">{`${plan.months} ${plan.months === 1 ? 'month' : 'months'} at ${gbp(plan.rate)} · Recurring`}</div>
                  <ul className="l-incl" aria-label="Included">
                    {[...FEATURES.map(f => f.name), ...EXTRAS].map(name => (
                      <li key={name}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                        {name}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="qty-col num">1</td>
                <td className="amt num">
                  {gbp(plan.rate * plan.months)}
                  {plan.rate < LIST_MONTHLY && (
                    <div className="amt-note">Save {gbp((LIST_MONTHLY - plan.rate) * plan.months)}</div>
                  )}
                </td>
              </tr>

              {visibleExtras.map(x => (
                <tr key={x.id} className={`compact ${x.status === 'removed' ? 'removed' : x.qty === 0 ? 'optional' : ''}`}>
                  <td>
                    {x.custom ? (
                      <>
                        <input className="ctl ctl-wide no-print" value={x.label} onChange={e => updateExtra(x.id, { label: e.target.value })} aria-label="Item description" />
                        <div className="l-main print-only">{x.label}</div>
                      </>
                    ) : (
                      <div className="l-main">{x.label}{x.qty === 0 && <span className="opt-tag">Optional</span>}</div>
                    )}
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
                  <td className="qty-col">
                    <QtyStepper value={x.qty} label={x.label} onChange={v => updateExtra(x.id, { qty: v })} />
                  </td>
                  <td className="amt num">
                    {x.qty > 1 ? (
                      gbp(x.amount * x.qty)
                    ) : (
                      <>
                        <span className="no-print">
                          <EditableAmount value={x.amount} label={`${x.label} amount`} onChange={v => updateExtra(x.id, { amount: v })} />
                        </span>
                        <span className="print-only">
                          {x.qty === 0 ? '—' : x.amount === 0 && x.list > 0 ? 'Waived' : gbp(x.amount)}
                        </span>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              <tr className="credits-toggle no-print">
                <td colSpan={3}>
                  <button type="button" onClick={() => setCreditsOpen(o => !o)} aria-expanded={creditsOpen} aria-label={creditsOpen ? 'Hide credits' : 'Show credits'}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                      style={{ transform: creditsOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </td>
              </tr>

              {(creditsOpen || feedbackOn) && <tr className={feedbackOn ? '' : 'optional'}>
                <td>
                  <div className="l-main">Feedback credit{!feedbackOn && <span className="opt-tag">Optional</span>}</div>
                  <div className="l-sub" style={{ whiteSpace: 'nowrap' }}>{`${gbp(FEEDBACK_CREDIT)} off per fix or feature you suggest, up to ${gbp(FEEDBACK_CREDIT_CAP)}/month`}</div>
                </td>
                <td className="qty-col"><Switch on={feedbackOn} onChange={setFeedbackOn} label="Feedback credit" /></td>
                <td className="amt num">{feedbackOn ? 'Included' : '—'}<div className="amt-sub">from next bill</div></td>
              </tr>}

              {(creditsOpen || socialOn) && <tr className={socialOn ? '' : 'optional'}>
                <td>
                  <div className="l-main">Social media feature{!socialOn && <span className="opt-tag">Optional</span>}</div>
                  <div className="l-sub" style={{ whiteSpace: 'nowrap' }}>{`Take part in our social media videos, ${gbp(SOCIAL_CREDIT)} off every month`}</div>
                </td>
                <td className="qty-col"><Switch on={socialOn} onChange={setSocialOn} label="Social media feature" /></td>
                <td className="amt num">{socialOn ? `−${gbp(SOCIAL_CREDIT)}/mo` : '—'}<div className="amt-sub">every month</div></td>
              </tr>}

            </tbody>
            <tfoot>
              <tr className="tot-row">
                <td colSpan={3}><div className="tot-inner"><div>
                  <div className="tot-label">Total due today</div>
                  <div className="tot-adj">
                    {totals.waivedValue > 0 && <span className="tot-chip">Founding discount −{gbp(totals.waivedValue)}</span>}
                    {totals.socialCredit > 0 && <span className="tot-chip">Social media credit −{gbp(totals.socialCredit)}</span>}
                    <span className="tot-chip b-disc">
                      Discount{manual && manual.mode === 'pct' ? ` ${manual.value}%` : ''}
                      <DiscountField
                        amount={manual ? totals.discAmounts[manual.id] ?? 0 : 0}
                        current={manual ? (manual.mode === 'pct' ? `${manual.value}%` : String(manual.value)) : ''}
                        onSet={setManual}
                      />
                    </span>
                  </div>
                </div><span className="tot-num t-due-num num">{gbp(dueShown)}</span></div></td>
              </tr>
            </tfoot>
          </table>

          <div className="p2-wrap">
          <div className="p2-head print-only" aria-hidden="true">
            <BrandLogo height={26} />
            <div className="p2-meta">
              <span>Proposal <b>{ref || autoRef}</b></span>
              {studio && <span>{studio}</span>}
            </div>
          </div>
          <div className="summary">
            <div className="summary-note">
              <div className="bank-wrap">
                <div className="bcard" role="group" aria-label="Bank transfer details">
                  <div className="bcard-top">
                    <span className="bcard-bank">{bank.bankName}</span>
                    <svg className="bcard-nfc" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                      <path d="M8.5 7.5a6 6 0 0 1 0 9M12 5a9.5 9.5 0 0 1 0 14M15.5 2.5a13 13 0 0 1 0 19" />
                    </svg>
                  </div>
                  <span className="bcard-chip" aria-hidden="true" />
                  <div className="bcard-nums">
                    <div><span className="bcard-k">Sort code</span><span className="bcard-v">{bank.sortCode}</span></div>
                    <div><span className="bcard-k">Account no.</span><span className="bcard-v">{bank.accountNumber}</span></div>
                  </div>
                  <div className="bcard-foot">
                    <div><span className="bcard-k">Account name</span><span className="bcard-name">{bank.accountName}</span></div>
                    <div className="right"><span className="bcard-k">Reference</span><span className="bcard-ref">{ref || autoRef || 'Reference'}</span></div>
                  </div>
                </div>
              </div>
              {/* Reassurance: every badge here is backed by the terms below or by how the app works. */}
              <div className="trust">
                <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
                  <defs>
                    <linearGradient id="trust-silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f7e7bd" /><stop offset=".5" stopColor="#d4b27a" /><stop offset="1" stopColor="#9c7a45" /></linearGradient>
                    <linearGradient id="trust-emerald" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fbefc9" /><stop offset=".35" stopColor="#e2c48a" /><stop offset=".65" stopColor="#b8914f" /><stop offset="1" stopColor="#f0d9a2" /></linearGradient>
                    <linearGradient id="trust-rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff6dc" /><stop offset=".5" stopColor="#a9854b" /><stop offset="1" stopColor="#f3dfae" /></linearGradient>
                  </defs>
                </svg>
                <div className="trust-main">
                  <span className="trust-seal" aria-hidden="true">
                    <svg width="30" height="33" viewBox="0 0 24 27" fill="none">
                      <path d="M12 1.5 21.5 5v7.2c0 6.3-4.1 10.9-9.5 12.6C6.6 23.1 2.5 18.5 2.5 12.2V5z" fill="url(#trust-emerald)" stroke="url(#trust-rim)" strokeWidth="1.3" />
                      <path d="M12 3.4 19.6 6.2v6c0 2.6-.8 4.8-2.2 6.5" stroke="rgba(255,255,255,.35)" strokeWidth=".8" fill="none" />
                      <path d="M7.8 13.2 10.8 16.2 16.4 10.4" stroke="#1a1408" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <div className="trust-eyebrow">Our promise</div>
                    <div className="trust-title">30-day money-back guarantee</div>
                    <div className="trust-sub">Not right for your studio? Full refund of your first subscription payment.</div>
                  </div>
                </div>
                <div className="trust-grid">
                  {TRUST_BADGES.map(b => (
                    <div key={b.label} className="trust-badge">
                      <span className="trust-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="url(#trust-silver)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{b.icon}</svg></span>
                      <span>{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* Acceptance */}
        <section className="part" id="signup">
          <p className="agree">By signing, {studio ? <strong>{studio}</strong> : 'the client named above'} accepts this proposal and the <button type="button" className="terms-link" onClick={openTerms}>Terms &amp; Conditions</button> that follow, which form part of this agreement.</p>

          <div className="signs">
            <div>
              <button type="button" className={`sign-line client-sign ${clientSig ? 'has-sig' : ''}`} onClick={() => setSignOpen(true)}
                aria-label={clientSig ? 'Signed. Tap to sign again' : 'Tap to sign'}>
                {clientSig ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={clientSig.src} src={clientSig.src} alt="Client signature" className="client-sig-img" />
                ) : (
                  <span className="tap-sign no-print">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 3.5l4 4L8 20l-5 1 1-5z" /></svg>
                    Tap to sign
                  </span>
                )}
              </button>
              <div className="sign-label">{clientSig ? `Signed ${fmtDate(clientSig.at)}` : 'Client signature & date'}</div>
            </div>
            <div>
              <div className="sign-line signed">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/signature.png" alt="Signed for DNI Studios" className="sign-img" />
              </div>
              <div className="sign-label">For DNI Studios</div>
            </div>
          </div>
        </section>
        </div>

        <footer className="sheet-foot">
          <div>
            <div className="sf-thanks">Thank you for choosing DNI Studios.</div>
            <div className="sf-co">DNI Ltd &middot; Registered in England &amp; Wales, no. 15630271 &middot; 78a Deacon Road, London NW2 5QJ</div>
          </div>
          <span className="sf-web">dnianalytics.com</span>
        </footer>
      </article>

      {/* ── Sheet 2: terms ─────────────────────────────────── */}
      <div className="terms-toggle no-print">
        <button type="button" onClick={() => (termsOpen ? setTermsOpen(false) : openTerms())}>
          {termsOpen ? 'Hide Terms & Conditions' : 'View full Terms & Conditions'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: termsOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}><path d="m6 9 6 6 6-6" /></svg>
        </button>
      </div>
      <article className={`sheet terms ${termsOpen ? '' : 'terms-collapsed'}`} id="terms">
        <h2 className="terms-title">Terms &amp; Conditions of Service</h2>
        <p className="terms-intro">These terms govern the provision of the DNI Studios software platform (&quot;the Service&quot;) by DNI Ltd, trading as DNI Analytics, a company registered in England and Wales under company number 15630271, registered office 78a Deacon Road, London NW2 5QJ (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) to the client named above (&quot;the Customer&quot;, &quot;you&quot;). By signing the offer sheet or by accessing or using the Service, you agree to be bound by these terms.</p>
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
        <button className="print-btn" onClick={() => window.print()}>Print proposal</button>
      </div>

      <footer className="foot no-print">© {new Date().getFullYear()} DNI Ltd · Registered in England &amp; Wales, no. 15630271</footer>
    </div>
  )
}

/* ─── Terms content ────────────────────────────────────────────────────── */

const CLAUSES = [
  { num: '1.', title: 'Business Use', paras: [
    'You confirm that you are entering into this agreement in the course of your business (including as a sole trader or independent personal trainer) and not as a consumer. Consumer protection legislation that applies only to consumers does not apply to this agreement.',
  ]},
  { num: '2.', title: 'Subscription, Fees & Payment', paras: [
    'The Service is provided on a subscription basis at the price and billing cycle (monthly, quarterly or annual) stated in this proposal. We may change our prices by giving you at least 30 days’ written notice; any change applies from your next billing cycle after that notice, and you may cancel before it takes effect. All prices exclude VAT, which will be added where applicable.',
    'Subscription fees are payable in advance at the start of each billing cycle. One-off fees are payable on acceptance of this proposal. Where any payment is more than 7 days overdue, we may suspend access to the Service until it is paid in full, and we may charge interest and compensation on late payments under the Late Payment of Commercial Debts (Interest) Act 1998.',
  ]},
  { num: '3.', title: 'Term, Cancellation & Refunds', paras: [
    'This is a rolling agreement that renews automatically at the end of each billing cycle. You may cancel at any time by giving at least 14 days\' written notice before your next renewal date; cancellation takes effect at the end of the then-current billing period. No refunds are given for unused time in a billing period, including on annual and quarterly plans.',
    'Money-back guarantee: if you cancel within 30 days of your first payment, we will refund the subscription fee from that first payment in full. One-off fees for onboarding, setup calls or custom work are non-refundable once that work has started.',
  ]},
  { num: '4.', title: 'Your Responsibilities', paras: [
    'You are responsible for all activity under your account, for keeping login details secure, for the accuracy and lawfulness of all data you and your staff enter, and for ensuring your trainers and clients use the Service in line with these terms.',
    'You are solely responsible for the training, nutrition, health and coaching services you provide to your clients, and for holding appropriate qualifications and insurance for them.',
  ]},
  { num: '5.', title: 'No Health, Medical or Professional Advice', paras: [
    'The Service is a business management tool. Workout programmes, meal plans, progress data and any content generated by AI features are provided for information and convenience only and do not constitute medical, nutritional, health or professional advice. AI-generated content may be inaccurate or incomplete and must be reviewed by a suitably qualified professional before being relied on or shared with any client.',
    'We accept no responsibility for any injury, illness or loss suffered by you or your clients arising from training, nutrition or other advice delivered using the Service.',
  ]},
  { num: '6.', title: 'Data Protection', paras: [
    'For personal data about your clients and staff that you enter into the Service, you are the data controller and we act as your data processor under UK GDPR and the Data Protection Act 2018. We will process that data only on your documented instructions to provide the Service, keep it confidential, apply appropriate technical and organisational security measures, use only sub-processors bound by equivalent obligations (such as our hosting and email providers), assist you with data subject requests where reasonably required, notify you without undue delay of any personal data breach, and delete or return the data at the end of the agreement.',
    'Some data you may record, such as health, body-measurement and menstrual-cycle information, is special category data. You are responsible for having a lawful basis, including explicit consent where required, and for giving your clients appropriate privacy information before recording it.',
    'You retain ownership of your data. We will not sell it or share it with third parties for marketing. On cancellation you may request a full export within 30 days, after which your data may be permanently deleted.',
  ]},
  { num: '7.', title: 'Fair Use & Storage', paras: [
    'Unlimited trainers and clients are included. Uploads of photos, video and voice notes are subject to fair use. If your usage materially exceeds typical use for a studio of your size, we will contact you to agree a reasonable solution, which may include archiving older media or an additional storage charge, before any limit is applied.',
  ]},
  { num: '8.', title: 'Custom Changes & Feature Requests', paras: [
    'Priority feature requests and custom changes are delivered at our reasonable discretion as to scope, design and timing. We have no obligation to build any particular feature. All software, features and improvements we create, including those made at your request, remain our property and may be made available to other customers.',
  ]},
  { num: '9.', title: 'Social Media Credit', paras: [
    'If you choose the Social Media Credit in this proposal, you receive £5 off your subscription for every month of each billing cycle while you take part. In return, you agree to take part in social media content with us: making yourself and your studio available for filming (for example short videos, photos and testimonials about how you use the Service) at least once every three months, at a reasonable time agreed with us, at your studio or remotely.',
    'You grant us a non-exclusive, royalty-free, worldwide licence to use, edit and publish that content, including your name, likeness, voice and studio name, in our marketing on any channel. You are responsible for getting the consent of anyone else who appears, such as your staff or clients, and we will not show any client personal data from the Service on screen. After the credit ends, we will stop using content featuring you in new posts within 30 days of your written request, but we are not required to remove content already published.',
    'You may stop taking part at any time by giving us 14 days\' written notice; the credit then ends from your next billing cycle. If you do not take part when reasonably asked, we may end the credit from your next billing cycle by giving you notice. The credit cannot exceed your subscription fee, has no cash value and does not affect any other part of this agreement.',
  ]},
  { num: '10.', title: 'Service Availability & Changes', paras: [
    'We aim to keep the Service available but do not guarantee uninterrupted or error-free operation. Planned maintenance will be communicated in advance where reasonably possible. We are not responsible for outages or failures of third-party services, networks or devices outside our control.',
    'As an early-stage platform, features may be added, changed or withdrawn as the product develops. We will give reasonable notice of any change that materially reduces the core functionality you use.',
  ]},
  { num: '11.', title: 'Acceptable Use', paras: [
    'You must use the Service only for lawful purposes connected with your fitness business. You must not copy, reverse-engineer, resell, sublicense or attempt to gain unauthorised access to the Service, or upload unlawful, infringing or harmful content.',
  ]},
  { num: '12.', title: 'Intellectual Property & Confidentiality', paras: [
    'All software, design, branding and know-how associated with the Service remain the exclusive property of DNI Ltd. You receive a non-exclusive, non-transferable licence to use the Service during your subscription. Each party will keep the other\'s confidential information confidential and use it only for the purposes of this agreement.',
  ]},
  { num: '13.', title: 'Limitation of Liability', paras: [
    'Nothing in this agreement limits liability for death or personal injury caused by negligence, for fraud or fraudulent misrepresentation, or any other liability that cannot be limited by law.',
    'Subject to that, the Service is provided "as is", and we are not liable for any loss of profits, revenue, business, goodwill, anticipated savings or data, or for any indirect or consequential loss. Our total liability arising from or in connection with this agreement, whether in contract, tort (including negligence) or otherwise, is limited to the total fees paid by you in the 12 months before the event giving rise to the claim.',
  ]},
  { num: '14.', title: 'Indemnity', paras: [
    'You will indemnify us against any claims, losses and costs (including reasonable legal fees) arising from claims by your clients, staff or any third party in connection with the services you provide to them, the data or content you upload, or your breach of these terms or of data protection law.',
  ]},
  { num: '15.', title: 'Suspension & Termination', paras: [
    'We may suspend or terminate your access immediately if you fail to pay any amount when due, materially breach these terms, misuse the Service, or become insolvent. Either party may end this agreement by cancellation under Clause 3. Clauses 5, 6, 12, 13, 14 and 17 survive termination.',
  ]},
  { num: '16.', title: 'Changes to These Terms', paras: [
    'We may update these terms by giving you at least 30 days\' written notice. Changes will not alter your founding subscription price. If you do not accept a change, you may cancel before it takes effect.',
  ]},
  { num: '17.', title: 'General', paras: [
    'This agreement, comprising this proposal and these terms, is the entire agreement between us and supersedes any prior discussions. Neither party is liable for delays caused by events beyond its reasonable control. If any provision is found unenforceable, the remainder continues in effect. No failure or delay in exercising a right is a waiver of it. You may not assign this agreement without our consent. No third party has rights under it. Signatures given electronically are valid and binding.',
    'This agreement is governed by the laws of England and Wales, and the courts of England and Wales have exclusive jurisdiction over any dispute arising from it.',
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
.lh-meta { flex-basis: 100%; display: grid; grid-template-columns: 1.1fr 1fr 1.2fr auto; gap: 24px; align-items: end;
  padding-top: 22px; border-top: 1px solid rgba(255,255,255,.09); }
.lh-meta span { display: block; font-size: 10px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: #7d838c; margin-bottom: 6px; }
.lh-meta b { display: block; font-size: 14px; font-weight: 500; color: #e8eaee; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lh-meta b.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; letter-spacing: .04em; }
.lh-due { text-align: right; }
.lh-due b { font-size: 30px; font-weight: 600; letter-spacing: -.02em; line-height: 1;
  background: linear-gradient(180deg, #ffffff 0%, #e2e5e9 45%, #9aa0a8 60%, #eef0f2 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
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
  display: flex; align-items: center; gap: 12px; font-family: var(--sans); font-size: 11px; font-weight: 700;
  letter-spacing: .2em; text-transform: uppercase; color: var(--ink); margin: 0 0 18px;
}
.part > .label::before { content: ""; width: 18px; height: 2px; border-radius: 2px; background: linear-gradient(90deg, #111318, #8a9099); }
.label::after { content: ""; flex: 1; height: 1px; background: var(--line); }

/* Billed to / details panels */
.parties { display: grid; grid-template-columns: 1.3fr 1fr; gap: 40px; margin-top: 32px; align-items: stretch; }
.panel {
  border: 1px solid var(--line); border-radius: 14px; padding: 16px 18px 8px;
  background: linear-gradient(180deg, #ffffff, #fbfbfc);
}
.panel { overflow: hidden; }
.panel .label {
  margin: -16px -18px 8px; padding: 12px 18px; color: #c9cdd3; letter-spacing: .2em;
  background: radial-gradient(140% 160% at 0% 0%, #30343c 0%, var(--steel-1) 35%, var(--steel-2) 75%, #0a0b0d 100%);
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.panel .label::after { display: none; }
.p-row {
  display: grid; grid-template-columns: 76px 1fr; align-items: center; gap: 10px;
  padding: 4px 0; border-top: 1px solid var(--line-soft); min-height: 32px;
}
.p-row:first-child { border-top: none; }
.bt .p-row { grid-template-columns: 1fr; }
.p-row dt { font-size: 12px; color: var(--faint); }
.p-row dd { font-size: 13.5px; color: var(--ink); min-width: 0; }
.bt .bt-studio { font-family: var(--font-display), Georgia, serif !important; font-size: 15.5px; font-weight: 600; letter-spacing: -.005em; }
.bt-split { display: grid; grid-template-columns: minmax(0, 1fr) 92px; gap: 10px; }
.bt-split .p-input { width: calc(100% + 16px); }
.bt .p-input::placeholder { color: #cdd1d6; }
.bt .bt-post::placeholder { color: #b8bdc4; }
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
#quote.part { margin-top: 22px; }

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

/* Features: light panel in the invoice's own style, steel icon tiles echo the letterhead */
.inc {
  position: relative; overflow: hidden; border-radius: 16px; background: #fff;
  border: 1px solid var(--line); box-shadow: 0 1px 2px rgba(17,19,24,.04), 0 18px 40px -28px rgba(17,19,24,.25);
}
.inc > * { position: relative; }
.inc-head {
  position: relative; display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; padding: 26px 28px 22px;
  color: #e8eaee; background: radial-gradient(140% 160% at 0% 0%, #30343c 0%, var(--steel-1) 35%, var(--steel-2) 75%, #0a0b0d 100%);
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.inc-head::before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .7;
  background: repeating-linear-gradient(90deg, rgba(255,255,255,.022) 0 1px, transparent 1px 3px); }
.inc-head > * { position: relative; }
.inc-kicker { font-size: 10.5px; font-weight: 600; letter-spacing: .22em; text-transform: uppercase; color: #8d939c; }
.inc-title {
  margin-top: 8px; font-size: 24px; font-weight: 600; line-height: 1.15; letter-spacing: -.025em;
  background: linear-gradient(180deg, #ffffff 0%, #e2e5e9 50%, #a7adb5 100%); -webkit-background-clip: text; background-clip: text; color: transparent;
}
.inc-title span { background: linear-gradient(180deg, #9aa0a8, #5f656e); -webkit-background-clip: text; background-clip: text; color: transparent; }
.inc-count { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.inc-count strong {
  font-size: 48px; font-weight: 600; line-height: .9; letter-spacing: -.04em;
  background: linear-gradient(180deg, #ffffff 0%, #e2e5e9 45%, #8d939c 62%, #eef0f2 100%); -webkit-background-clip: text; background-clip: text; color: transparent;
}
.inc-count span { font-size: 11.5px; line-height: 1.4; color: #9ba1aa; }

.features {
  list-style: none; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
  background: var(--line-soft); border-top: 1px solid var(--line-soft); border-bottom: 1px solid var(--line-soft);
}
.features > li { position: relative; display: grid; grid-template-columns: 40px 1fr; column-gap: 14px; row-gap: 2px; align-items: start; padding: 18px 20px; background: #fff; transition: background .25s ease; }
.features > li .f-icon { grid-row: span 2; margin: 0; }
.features > li:hover { background: #fafbfc; }
.f-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
.f-icon {
  width: 40px; height: 40px; border-radius: 11px; display: inline-flex; align-items: center; justify-content: center;
  background: radial-gradient(140% 140% at 0% 0%, #3a3e46 0%, var(--steel-1) 45%, var(--steel-2) 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.14), 0 8px 16px -8px rgba(17,19,24,.55);
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.f-num { font-size: 11px; letter-spacing: .14em; color: #c2c6cc; }
.f-name { font-size: 14.5px; font-weight: 600; color: var(--ink); letter-spacing: -.01em; }
.f-det { font-size: 13px; color: var(--muted); line-height: 1.5; }
.f-points { list-style: none; margin: 12px 0 0; padding: 12px 0 0; border-top: 1px dashed var(--line); display: grid; gap: 7px; }
.f-points li { position: relative; padding-left: 20px; font-size: 12.5px; color: var(--text); line-height: 1.4; }
.f-points li::before {
  content: ""; position: absolute; left: 0; top: 2px; width: 13px; height: 13px; border-radius: 50%;
  background: #16a35a url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12.5l4.5 4.5L19 7.5'/%3E%3C/svg%3E") center / 9px no-repeat;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.inc-extras { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 18px 24px; border-bottom: 1px solid var(--line-soft); }
.inc-extras-label { font-size: 10.5px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: var(--faint); margin-right: 6px; }
.inc-pill { font-size: 12.5px; font-weight: 500; color: var(--ink); padding: 6px 12px; border-radius: 999px; background: #f4f5f7; border: 1px solid var(--line); }
.inc-foot { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 24px; padding: 14px 24px; background: #fafbfc; font-size: 12px; color: var(--muted); }
.inc-foot span { display: inline-flex; align-items: center; gap: 7px; }
.inc-foot svg { color: #16a35a; }

/* Line items */
.lines { width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid var(--line); border-radius: 14px; overflow: hidden; }
.lines th {
  font-size: 10.5px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: #c9cdd3;
  text-align: left; padding: 13px 20px; border-bottom: none; background: transparent;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.lines td { padding: 15px 20px; border-top: 1px solid var(--line-soft); vertical-align: top; font-size: 14.5px; background: #fff; }
.lines tbody tr:first-child td { border-top: none; }
.lines tbody tr:nth-child(even) td { background: #fafbfc; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.lines th.amt { color: #c9cdd3; }
.lines thead { background: linear-gradient(180deg, #23262c 0%, #16181c 55%, #0f1013 100%); box-shadow: inset 0 1px 0 rgba(255,255,255,.07), inset 0 -1px 0 rgba(0,0,0,.6);
  -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.l-incl { list-style: none; margin: 12px 0 2px; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px 18px; }
.l-incl li { display: flex; align-items: center; gap: 7px; font-size: 13px; color: var(--muted); }
.l-incl svg { color: #16a35a; flex-shrink: 0; }
@media (max-width: 560px) { .l-incl { grid-template-columns: 1fr; } }
.lines tbody tr.credits-toggle td { padding: 0; background: #fff; text-align: center; }
.credits-toggle button { display: flex; justify-content: center; align-items: center; width: 100%; padding: 4px 0; border: 0; background: none; color: #c3c8cf; cursor: pointer; line-height: 0; }
.credits-toggle button:hover { color: #8a9099; }
.lines .qty-col { text-align: center; white-space: nowrap; width: 1%; color: var(--ink); font-weight: 600; padding-left: 12px; padding-right: 0; }
.lines th.qty-col { color: #c9cdd3; }
.amt-sub { font-size: 11px; font-weight: 500; color: var(--faint); margin-top: 3px; }
.sw { position: relative; width: 44px; height: 26px; border-radius: 9px; border: 1px solid var(--line); padding: 0; cursor: pointer; vertical-align: top;
  background: #fff; transition: background .2s ease, border-color .2s ease; }
.sw.on { background: #111318; border-color: #111318; }
.sw-knob { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 6px; background: #d5d9df; transition: transform .2s ease, background .2s ease; }
.sw.on .sw-knob { transform: translateX(18px); background: #fff; }
.sw:focus-visible { outline: 2px solid #6d5dfc; outline-offset: 3px; }
.qty { display: inline-flex; align-items: center; border: 1px solid var(--line); border-radius: 9px; overflow: hidden; background: #fff; }
.qty-btn { all: unset; cursor: pointer; width: 26px; height: 26px; display: grid; place-items: center; font-size: 15px; color: var(--muted); }
.qty-btn:hover:not(:disabled) { background: #f1f3f5; color: var(--ink); }
.qty-btn:disabled { opacity: .3; cursor: default; }
.qty-n { min-width: 22px; text-align: center; font-size: 14px; }
.lines .amt { text-align: right; white-space: nowrap; padding-left: 24px; color: var(--ink); font-weight: 600; }
.th-title { font: inherit; letter-spacing: inherit; }
.l-main { color: var(--ink); font-weight: 500; }
.l-sub { font-size: 13px; color: var(--faint); margin-top: 3px; }
.struck { color: var(--faint); margin-right: 6px; font-weight: 400; }
.lines tr.removed td { opacity: .4; }
.lines tr.removed td.qty-col { opacity: 1; }
.lines tr.removed .l-main { text-decoration: line-through; }
/* Optional extras not on this bill yet: shown as available, not crossed out. */
.lines tr.compact td { padding-top: 9px; padding-bottom: 9px; vertical-align: middle; }
.lines tr.optional td { background: #fbfcfd; }
.lines tr.optional .l-main { color: var(--muted); }
.lines tr.optional .amt { color: var(--faint); font-weight: 500; }
.opt-tag { display: inline-block; margin-left: 8px; font-size: 11px; font-weight: 600; letter-spacing: .01em; text-transform: none; color: #16a35a; background: #e9f8ef; border-radius: 999px; padding: 2px 8px; vertical-align: 2px; }

.ctls { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 10px; }
.ctl { border: 1px solid var(--line); border-radius: 8px; background: #fff; font: inherit; font-size: 13.5px; color: var(--ink); padding: 6px 10px; }
.ctl:focus { outline: none; border-color: var(--ink); }
.ctl-wide { width: 100%; max-width: 340px; }
.ctl-amt { width: 96px; text-align: right; }
.amt-edit { all: unset; cursor: text; font: inherit; color: inherit; font-weight: inherit; }
.amt-input {
  width: 96px; text-align: right; font: inherit; font-weight: 600; color: var(--ink) !important; -webkit-text-fill-color: var(--ink);
  padding: 3px 8px; margin: -4px -8px -4px 0; border: 1px solid var(--line) !important; border-radius: 8px; background: #fff !important;
  box-shadow: 0 0 0 3px rgba(17,19,24,.06) !important; outline: none !important; -moz-appearance: textfield; caret-color: var(--ink);
}
.amt-input::selection { background: #d6dae0; color: var(--ink); -webkit-text-fill-color: var(--ink); }
.amt-input::-webkit-outer-spin-button, .amt-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.link-btn { border: none; background: transparent; color: var(--muted); font-size: 13px; cursor: pointer; padding: 6px 4px; }
.link-btn:hover { color: var(--ink); text-decoration: underline; }

/* Summary */
.terms-wide { margin-top: 28px; padding-top: 18px; border-top: 1px solid var(--line); }
.terms-wide h3 { margin: 0 0 8px; }
.terms-wide p { margin: 0 0 6px; max-width: none; }
.th-plan { display: flex; align-items: center; gap: 12px; flex-wrap: nowrap; }
.th-plan .seg { margin: 0 auto; } /* centred between "Your plan" and Qty */
.seg { display: inline-grid; grid-auto-flow: column; gap: 2px; padding: 3px; border-radius: 999px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.14); text-transform: none; letter-spacing: 0; }
.seg-opt { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px; border-radius: 999px; font-size: 12px; color: #d4d8dd; white-space: nowrap; transition: background .2s ease, color .2s ease; }
.seg-opt:hover { color: #fff; background: rgba(255,255,255,.08); }
.seg-opt.on { background: #fff; color: #111318; box-shadow: 0 4px 14px -4px rgba(0,0,0,.6); }
.seg-name { font-weight: 700; }
.seg-price { font-size: 11.5px; font-weight: 500; display: inline-flex; align-items: center; }
.seg-price em { font-style: normal; margin-left: 4px; font-size: 10px; font-weight: 700; color: #5be39a; padding: 1px 6px; border-radius: 999px; background: rgba(91,227,154,.14); }
.seg-opt.on .seg-price em { color: #0d7a42; background: #dcf6e8; }
.seg-opt:focus-visible { outline: 2px solid #6d5dfc; outline-offset: 2px; }
.terms-link { all: unset; cursor: pointer; color: var(--ink); text-decoration: underline; text-underline-offset: 2px; text-decoration-color: rgba(17,19,24,.3); }
.terms-link:hover { text-decoration-color: currentColor; }
.terms-toggle { display: flex; justify-content: center; margin: 18px 0; }
.terms-toggle button { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #4a4f57; background: #fff; border: 1px solid var(--line); border-radius: 999px; padding: 9px 16px; box-shadow: 0 2px 8px -4px rgba(0,0,0,.15); }
.terms-toggle button:hover { color: var(--ink); }
.terms-collapsed { display: none; }
@media print { .terms-collapsed { display: block !important; } }
.summary { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: start; margin-top: 36px; }
/* Both columns end on the same line: the bill stretches to the left column's height,
   with the saving pinned to its bottom. */
.summary { align-items: stretch; }
.summary > .sum-card { display: flex; flex-direction: column; align-self: start; }
.summary > .sum-card .t-saved { margin-top: 4px; }
.summary-note h3, .terms-wide h3 { font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--faint); margin-bottom: 8px; }
.bank-wrap { margin-bottom: 0; }
.summary-note { display: contents; }
.tot-row td { border-top: none; vertical-align: middle; padding-top: 20px; padding-bottom: 20px; color: #c8ccd2;
  background: linear-gradient(180deg, #23262c 0%, #16181c 55%, #0f1013 100%) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.tot-inner { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.lines thead th + th { position: relative; }
.lines thead th + th::before { content: ""; position: absolute; top: 0; bottom: 0; left: -1px; width: 2px; pointer-events: none;
  background: linear-gradient(180deg, #23262c 0%, #16181c 55%, #0f1013 100%); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.tot-label { font-size: 10.5px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: #c9cdd3; }
.tot-adj { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 10px; }
.tot-adj:empty { display: none; }
.tot-chip { display: inline-flex; align-items: center; gap: 8px; font-size: 12.5px; color: #5be39a; padding: 4px 10px; border-radius: 999px; background: rgba(91,227,154,.1); border: 1px solid rgba(91,227,154,.22); }
.tot-chip.b-disc { color: #c9cdd3; background: rgba(255,255,255,.05); border-color: rgba(255,255,255,.12); }
.tot-chip.b-disc .amt-edit { color: #5be39a; }
.tot-chip .b-add { padding: 0 2px; border: 0; font-size: 12.5px; }
.tot-chip .b-disc-input { width: 90px; font-size: 12.5px; padding: 2px 6px; }
.lines .tot-row .tot-num { font-size: 40px; white-space: nowrap; display: inline-block; }
.trust { position: relative; overflow: hidden; border-radius: 18px; padding: 18px 18px 16px; color: #efe9dc; break-inside: avoid;
  border: 1px solid transparent;
  background:
    radial-gradient(120% 80% at 0% 0%, rgba(226,196,138,.10), transparent 55%) padding-box,
    repeating-linear-gradient(135deg, rgba(255,255,255,.018) 0 2px, transparent 2px 6px) padding-box,
    linear-gradient(160deg, #18181b 0%, #0f0f11 55%, #0a0a0b 100%) padding-box,
    linear-gradient(140deg, rgba(240,217,162,.75), rgba(255,255,255,.06) 38%, rgba(255,255,255,.04) 62%, rgba(212,178,122,.6)) border-box;
  box-shadow: inset 0 1px 0 rgba(255,236,190,.10), 0 30px 50px -28px rgba(0,0,0,.8);
  -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.trust-main { display: flex; align-items: center; gap: 15px; padding-bottom: 15px; margin-bottom: 14px; border-bottom: 1px solid transparent;
  border-image: linear-gradient(90deg, transparent, rgba(226,196,138,.35), transparent) 1; }
.trust-seal { flex-shrink: 0; width: 52px; height: 52px; border-radius: 50%; display: grid; place-items: center;
  background: radial-gradient(circle at 35% 28%, #2c2a25, #0d0c0a 72%);
  box-shadow: 0 0 0 1px rgba(240,217,162,.55), 0 0 0 5px rgba(240,217,162,.06), 0 10px 26px -8px rgba(226,196,138,.45), inset 0 1px 0 rgba(255,240,200,.2); }
.trust-eyebrow { font-size: 9.5px; font-weight: 700; letter-spacing: .22em; text-transform: uppercase; color: #d4b27a; margin-bottom: 3px; }
.trust-title { font-family: var(--font-display), Georgia, serif; font-size: 18px; font-weight: 500; letter-spacing: -.01em; color: #f7f1e3; line-height: 1.15; }
.trust-sub { font-size: 11.5px; color: #a29d93; margin-top: 4px; line-height: 1.5; }
.trust-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 11px 16px; }
.trust-badge { display: flex; align-items: center; gap: 9px; white-space: nowrap; font-size: 10.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #ddd6c6; }
.trust-ico { flex-shrink: 0; display: grid; place-items: center; }
.bcard {
  position: relative; overflow: hidden; width: 100%; max-width: 380px; aspect-ratio: 1.586; border-radius: 18px; padding: 20px 22px;
  display: flex; flex-direction: column; justify-content: space-between; color: #eef1f4;
  background:
    radial-gradient(120% 90% at 100% 0%, rgba(255,255,255,.14), transparent 55%),
    radial-gradient(90% 120% at 0% 100%, rgba(47,123,255,.18), transparent 60%),
    linear-gradient(135deg, #1d2230 0%, #121620 55%, #0b0d13 100%);
  box-shadow: 0 24px 44px -22px rgba(17,19,24,.75), inset 0 1px 0 rgba(255,255,255,.12);
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.bcard::after { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .5;
  background: repeating-linear-gradient(115deg, rgba(255,255,255,.025) 0 2px, transparent 2px 6px); }
.bcard > * { position: relative; z-index: 1; }
.bcard-top { display: flex; justify-content: space-between; align-items: center; }
.bcard-bank { font-size: 13px; font-weight: 700; letter-spacing: .02em; }
.bcard-nfc { color: rgba(255,255,255,.7); }
.bcard-chip {
  width: 42px; height: 32px; border-radius: 7px; margin-top: 6px;
  background: linear-gradient(135deg, #f2d991 0%, #c9a24a 45%, #f6e3a8 70%, #b38a35 100%);
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.2);
  -webkit-mask: linear-gradient(#000 0 0); mask: linear-gradient(#000 0 0);
  background-image: linear-gradient(90deg, transparent 32%, rgba(0,0,0,.25) 32% 34%, transparent 34% 66%, rgba(0,0,0,.25) 66% 68%, transparent 68%),
    linear-gradient(0deg, transparent 47%, rgba(0,0,0,.25) 47% 53%, transparent 53%),
    linear-gradient(135deg, #f2d991 0%, #c9a24a 45%, #f6e3a8 70%, #b38a35 100%);
}
.bcard-nums { display: flex; gap: 28px; }
.bcard-k { display: block; font-size: 9.5px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: rgba(238,241,244,.55); margin-bottom: 3px; }
.bcard-v { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 20px; letter-spacing: .08em; color: #fff; text-shadow: 0 1px 0 rgba(0,0,0,.5), 0 -1px 0 rgba(255,255,255,.15); }
.bcard-foot { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; }
.bcard-foot .right { text-align: right; min-width: 0; }
.bcard-name { font-size: 14px; font-weight: 600; letter-spacing: .14em; }
.bcard-ref { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11.5px; letter-spacing: .02em; white-space: nowrap; }
.summary-note p.fair-use, .terms-wide p.fair-use { margin-top: 10px; font-size: 11.5px; color: var(--faint); }
.summary-note p, .terms-wide p { font-size: 13px; line-height: 1.65; color: var(--muted); max-width: 300px; }
.terms-wide p { max-width: none; }
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
.t-due:first-child { margin-top: 0; padding-top: 0; border-top: none; }
.t-due { margin-top: 14px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,.12); }
.t-due-label { font-size: 11px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: #9ba1aa; }
.t-due-num {
  font-size: 44px; font-weight: 600; line-height: 1.05; letter-spacing: -.02em; margin-top: 0;
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
.b-title { font-size: 11px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: #8d939c; margin-bottom: 10px; }
.b-row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 7px 0; font-size: 14px; color: #d4d8dd; border-bottom: 1px solid rgba(255,255,255,.06); }
.b-row em { font-style: normal; font-size: 12px; color: #8d939c; margin-left: 8px; }
.b-row > span:last-child { color: #f1f3f5; font-weight: 500; white-space: nowrap; }
.b-row.save > span:last-child, .b-row.save .amt-edit { color: #5be39a; }
.b-add { all: unset; cursor: pointer; font-size: 12.5px; font-weight: 600; color: #e3e6ea; padding: 3px 10px; border-radius: 999px; border: 1px dashed rgba(255,255,255,.3); }
.b-add:hover { border-color: rgba(255,255,255,.6); }
.b-disc-input { width: 110px; text-align: right; font: inherit; font-size: 14px; color: #fff; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.25); border-radius: 8px; padding: 4px 8px; outline: none; }
.b-disc-input::placeholder { color: #6b717a; }
.b-total { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; margin-top: 16px; }
.b-total-label { white-space: nowrap; font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: #9ba1aa; padding-bottom: 8px; }
.b-total .t-due-num { font-size: 34px; white-space: nowrap; }
@media print { .b-disc:has(.b-add) { display: none; } }
.t-then { margin-top: 6px; text-align: right; font-size: 13px; color: #b9bec6; }
.sc-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.sc-label { font-size: 11px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: #9ba1aa; }
.sc-term { font-size: 11.5px; font-weight: 600; color: #e3e6ea; padding: 4px 10px; border-radius: 999px; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12); }
.sum-card .sc-total { font-size: 56px; margin-top: 14px; white-space: nowrap; }
.sc-then { font-size: 13.5px; color: #9ba1aa; margin-top: 6px; }
.sc-then strong { color: #e3e6ea; font-weight: 600; }
.sc-lines { margin-top: 20px; border-top: 1px solid rgba(255,255,255,.1); }
.sc-lines .b-row:last-child { border-bottom: none; }
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
.sign-line.signed { position: relative; display: flex; align-items: flex-end; justify-content: center; }
.sign-img { height: 84px; width: auto; margin: 0 0 -10px; transform: rotate(-4deg); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.sign-date { position: absolute; right: 0; bottom: 6px; font-size: 12.5px; color: var(--muted); }
.client-sign { all: unset; box-sizing: border-box; display: flex; width: 100%; align-items: flex-end; justify-content: center; cursor: pointer;
  border-bottom: 1px solid var(--ink); height: 72px; position: relative; border-radius: 10px 10px 0 0; transition: background .25s ease; }
.client-sign:hover { background: #f6f7f9; }
.client-sign:focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; }
.tap-sign { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 14px; padding: 9px 16px; border-radius: 999px; font-size: 13px; font-weight: 600; color: #fff;
  background: radial-gradient(140% 160% at 0% 0%, #3a3e46 0%, var(--steel-1) 45%, var(--steel-2) 100%); box-shadow: 0 10px 22px -12px rgba(17,19,24,.8);
  animation: tap-pulse 2.4s ease-in-out infinite; }
@keyframes tap-pulse { 0%, 100% { box-shadow: 0 10px 22px -12px rgba(17,19,24,.8), 0 0 0 0 rgba(17,19,24,.18); } 50% { box-shadow: 0 10px 22px -12px rgba(17,19,24,.8), 0 0 0 8px rgba(17,19,24,0); } }
.client-sig-img { max-height: 84px; max-width: 90%; margin-bottom: -8px; animation: sig-in .9s cubic-bezier(.22,1,.36,1) both; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
@keyframes sig-in { from { clip-path: inset(0 100% 0 0); opacity: .4; } to { clip-path: inset(0 0 0 0); opacity: 1; } }
@media print { .client-sign { background: none !important; } }
.sign-label { font-size: 12.5px; color: var(--muted); margin-top: 8px; text-align: center; }

.sheet-foot {
  position: relative; display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 22px 56px; color: #9ba1aa; font-size: 12.5px;
  background: radial-gradient(140% 160% at 0% 0%, #30343c 0%, var(--steel-1) 35%, var(--steel-2) 75%, #0a0b0d 100%);
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.sheet-foot::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 2px;
  background: linear-gradient(90deg, #5c626b, #f2f4f7 30%, #8a9099 50%, #e4e7eb 70%, #5c626b); }
.sf-thanks { color: #e8eaee; font-weight: 600; font-size: 13.5px; }
.sf-co { margin-top: 4px; font-size: 11.5px; color: #8d939c; }
.sf-web { color: #c9cdd3; font-weight: 600; letter-spacing: .04em; white-space: nowrap; }
.p2-head { align-items: center; justify-content: space-between; gap: 16px; padding: 14px 20px; margin-bottom: 28px; border-radius: 12px; color: #c9cdd3;
  background: radial-gradient(140% 160% at 0% 0%, #30343c 0%, var(--steel-1) 35%, var(--steel-2) 75%, #0a0b0d 100%);
  -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.p2-meta { display: flex; gap: 18px; font-size: 12px; letter-spacing: .04em; }
.p2-meta b { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: #fff; font-weight: 600; }

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
@media screen and (max-width: 760px) {
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
  .inc-title { font-size: 21px; }
  .features > li { padding: 20px; }
  .summary { grid-template-columns: 1fr; gap: 20px; }
  .signs { grid-template-columns: 1fr; gap: 24px; }
  .sheet-foot { padding: 16px 20px; flex-direction: column; gap: 4px; }
  .terms { padding: 32px 20px 36px; }
  .clauses { columns: 1; }
}

@media screen and (max-width: 480px) {
  .features { grid-template-columns: 1fr; }
  .features > li { display: grid; grid-template-columns: 46px 1fr; column-gap: 16px; row-gap: 3px; padding: 18px 20px; }
  .f-top { grid-row: span 2; margin: 0; }
  .f-num { display: none; }
  .f-points { grid-column: 2; }
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
  .lines tr.removed, .lines tr.optional { display: none; }
  .p-input::placeholder, .bt .p-input::placeholder, .bt .bt-post::placeholder { color: transparent; }
  .letterhead, .sum-card, .plan.on { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .print-only { display: inline; }
  div.print-only { display: block; }
  .terms { break-before: page; }
  /* margin 0 drops the browser's own date/URL header and footer */
  @page { size: A4; margin: 0; }

  .sheet { zoom: .74; }
  .lines, .inc { break-inside: avoid; }
  .part { margin-top: 26px; }
  .sheet-body { padding: 0 48px 40px; }
  .letterhead { padding: 34px 48px 30px; }
  /* One-page proposal: everything up to the signatures fits on page 1; terms follow. */
  .p2-wrap { break-before: auto; padding-top: 0; }
  .sheet-foot { padding: 20px 48px; }
  .lh-due b, .t-due-num { background: none !important; -webkit-text-fill-color: #fff; color: #fff; }
  .p2-head.print-only { display: none; }
  .summary { margin-top: 22px; }
  .summary { align-items: start; }
  .doc-title, .inc-title, .inc-title span, .inc-count strong, .t-due-num {
    background: none !important; -webkit-background-clip: border-box !important; background-clip: border-box !important;
    -webkit-text-fill-color: currentColor; filter: none !important;
  }
  .doc-title { color: #eef0f2; }
  .inc-title { color: #ffffff; }
  .inc-title span { color: #8d939c; }
  .inc-count strong { color: #ffffff; }
  .t-due-num { color: #ffffff; }
  .sheet-foot { break-inside: avoid; }
  .letterhead { padding-top: 28px; padding-bottom: 28px; }
  .sheet-foot { break-inside: avoid; }
  .features > li, .sum-card, .bcard, .signs, .parties .panel, .lines tr, .inc-head, .inc-extras, .summary, #signup { break-inside: avoid; }
  .part { margin-top: 32px; }
  .p-input { border-color: transparent !important; box-shadow: none !important; background: transparent !important; }
  .inc, .bcard, .f-icon, .f-points li::before { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .inc { box-shadow: none; }
  .features > li:hover { background: #fff; }
}
`
