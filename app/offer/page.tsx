'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

/* ─── Pricing data ─────────────────────────────────────────────────────── */

const LIST_MONTHLY = 69

const PLANS = {
  monthly:   { label: 'Monthly',   months: 1,  rate: 69, save: null,       term: 'Rolling, cancel anytime', period: 'per month' },
  quarterly: { label: 'Quarterly', months: 3,  rate: 59, save: 'Save 14%', term: 'Billed every 3 months',   period: 'every 3 months' },
  annual:    { label: 'Annual',    months: 12, rate: 49, save: 'Save 29%', term: 'Billed once a year',      period: 'per year' },
} as const

type Term = keyof typeof PLANS

const FEATURES: [string, string][] = [
  ['Scheduling & calendar',        'Book, reschedule and track every session'],
  ['Client tracking & progress',   'Goals, metrics, workout logs and trends'],
  ['Payments & invoicing',         'See who has paid at a glance'],
  ['Lead pipeline (CRM)',          'From enquiry to signed client'],
  ['Performance analytics',        'Adherence and trends in one place'],
  ['Unlimited trainers & clients', 'No per-seat fees, ever'],
]

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

const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

/* ─── Small pieces ─────────────────────────────────────────────────────── */

function Logo() {
  return (
    <span className="logo">
      <span className="logo-mark" aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff" /></svg>
      </span>
      <span className="logo-word">DNI Studios</span>
    </span>
  )
}

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
  const [editing, setEditing] = useState(false)

  const [studio, setStudio] = useState('')
  const [contact, setContact] = useState('')
  const [ref, setRef] = useState('')
  const [issued, setIssued] = useState('')
  const [validUntil, setValidUntil] = useState('')

  // Dates are set on the client so server and client render the same markup.
  useEffect(() => {
    const now = new Date()
    const until = new Date(now)
    until.setDate(until.getDate() + 14)
    setIssued(fmtDate(now))
    setValidUntil(fmtDate(until))
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

    return {
      listSub, termSaving, onceExtras, discAmounts, recurringTotal,
      dueToday: Math.max(firstBase - onceDisc, 0),
      subtotal: listSub + recurringExtras + onceExtras,
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

  const visibleExtras = extras.filter(e => editing || e.status !== 'removed')
  const kindWord = (k: Kind) => (k === 'once' ? 'One-off' : 'Recurring')
  const monthsWord = plan.months === 1 ? 'first month' : `first ${plan.months} months`

  return (
    <div className="offer">
      <style>{CSS}</style>

      <div className="bar no-print">
        <div className="bar-actions">
          <button className={`text-btn ${editing ? 'on' : ''}`} onClick={() => setEditing(e => !e)} aria-pressed={editing}>
            {editing ? 'Done' : 'Adjust'}
          </button>
          <button className="text-btn" onClick={() => window.print()}>Print</button>
        </div>
      </div>

      {/* ── Sheet 1: proposal ─────────────────────────────── */}
      <article className="sheet">
        <header className="head">
          <div>
            <Logo />
            <p className="from">
              DNI Ltd, trading as DNI Analytics<br />
              78a Deacon Road, London NW2 5QJ<br />
              Company no. 15630271
            </p>
          </div>
          <div className="head-right">
            <h1 className="doc-title">Proposal</h1>
            <dl className="doc-meta num">
              <dt>No.</dt>
              <dd><input className="inline-input" placeholder="DNI-2026-XXX" value={ref} onChange={e => setRef(e.target.value)} aria-label="Reference" /></dd>
              <dt>Date</dt><dd>{issued || '—'}</dd>
              <dt>Valid until</dt><dd>{validUntil || '—'}</dd>
            </dl>
          </div>
        </header>

        <div className="for">
          <div>
            <label className="label" htmlFor="q-studio">Prepared for</label>
            <input id="q-studio" className="line" placeholder="Studio name" value={studio} onChange={e => setStudio(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="q-contact">Attention</label>
            <input id="q-contact" className="line" placeholder="Owner or contact" value={contact} onChange={e => setContact(e.target.value)} />
          </div>
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
                  <span className="radio" aria-hidden="true" />
                  <span className="plan-name">{p.label}</span>
                  <span className="plan-term">{p.term}</span>
                  {p.save && <span className="plan-save">{p.save}</span>}
                </button>
              )
            })}
          </div>
        </section>

        {/* Included */}
        <section className="part selection" id="included">
          <h2 className="label">Included in every plan</h2>
          <ul className="features">
            {FEATURES.map(([name, detail]) => (
              <li key={name}>
                <span className="f-name">{name}</span>
                <span className="f-det">{detail}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Quote */}
        <section className="part" id="quote">

          {editing && (
            <p className="edit-note no-print">Editing. Charge, waive or remove lines, change amounts, or add a discount or charge.</p>
          )}

          <table className="lines">
            <thead>
              <tr><th><h2 className="th-title">Quote</h2></th><th className="amt">Amount</th></tr>
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
                    {editing && x.custom ? (
                      <input className="ctl ctl-wide" value={x.label} onChange={e => updateExtra(x.id, { label: e.target.value })} aria-label="Item description" />
                    ) : (
                      <div className="l-main">{x.label}</div>
                    )}
                    {!editing && (
                      <div className="l-sub">{x.status === 'waived' ? 'Included for founding studios' : kindWord(x.kind)}</div>
                    )}
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
                            <button className="link-btn" onClick={() => deleteExtra(x.id)}>Delete</button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="amt num">
                    {editing ? (
                      <input
                        type="number" min={0} step="0.01" className="ctl ctl-amt num" value={x.amount}
                        onChange={e => updateExtra(x.id, { amount: Math.max(0, Number(e.target.value) || 0) })}
                        aria-label="Amount"
                      />
                    ) : x.status === 'waived' ? (
                      <><s className="struck">{gbp(x.amount)}</s> {gbp(0)}</>
                    ) : (
                      gbp(x.amount)
                    )}
                  </td>
                </tr>
              ))}

              {discounts.map(d => (
                <tr key={d.id}>
                  <td>
                    {editing ? (
                      <>
                        <input className="ctl ctl-wide" value={d.label} onChange={e => updateDiscount(d.id, { label: e.target.value })} aria-label="Discount name" />
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
                      </>
                    ) : (
                      <>
                        <div className="l-main">{d.label}</div>
                        <div className="l-sub">
                          {`${d.mode === 'pct' ? `${d.value}%` : gbp(d.value)} off ${d.scope === 'once' ? 'the first payment' : 'every payment'}`}
                        </div>
                      </>
                    )}
                  </td>
                  <td className="amt num">−{gbp(totals.discAmounts[d.id] ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {editing && (
            <div className="add no-print">
              <button className="link-btn" onClick={addDiscount}>+ Add discount</button>
              <button className="link-btn" onClick={addCharge}>+ Add charge</button>
            </div>
          )}

          <div className="totals num">
            <div className="t-row"><span>Subtotal</span><span>{gbp(totals.subtotal)}</span></div>
            {totals.discountTotal > 0 && (
              <div className="t-row"><span>Discounts</span><span>−{gbp(totals.discountTotal)}</span></div>
            )}
            <div className="t-due">
              <div>
                <div className="t-due-label">Due today</div>
                <div className="t-due-note">{`Covers your ${monthsWord}${totals.onceExtras > 0 ? ' and one-off items' : ''}`}</div>
              </div>
              <div className="t-due-num">{gbp(dueShown)}</div>
            </div>
            <div className="t-then">
              {`Then ${gbp(totals.recurringTotal)} ${plan.period}`}
              {plan.months > 1 && <span>{` · ${gbp(totals.recurringTotal / plan.months)} a month`}</span>}
            </div>
          </div>

          <div className="accept no-print">
            <button className="cta" onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}>
              Accept proposal
            </button>
            <p className="assure">30-day money-back guarantee. Your rate is fixed for as long as you stay subscribed.</p>
          </div>
        </section>

        {/* Acceptance */}
        <section className="part" id="signup">
          <h2 className="label">Acceptance</h2>
          <div className="fields">
            <div className="field"><label htmlFor="s-studio">Studio name</label><input id="s-studio" className="line" value={studio} onChange={e => setStudio(e.target.value)} /></div>
            <div className="field"><label htmlFor="s-contact">Owner / contact</label><input id="s-contact" className="line" value={contact} onChange={e => setContact(e.target.value)} /></div>
            <div className="field wide"><label htmlFor="s-addr">Address</label><input id="s-addr" className="line" autoComplete="street-address" /></div>
            <div className="field"><label htmlFor="s-city">City</label><input id="s-city" className="line" autoComplete="address-level2" /></div>
            <div className="field"><label htmlFor="s-post">Postcode</label><input id="s-post" className="line" autoComplete="postal-code" /></div>
            <div className="field wide"><label htmlFor="s-email">Email</label><input id="s-email" className="line" type="email" autoComplete="email" /></div>
          </div>

          <p className="agree">By signing, the Customer accepts this proposal and the Terms &amp; Conditions that follow, which form part of this agreement.</p>

          <div className="signs">
            <div><div className="sign-line" /><div className="sign-label">Studio signature &amp; date</div></div>
            <div><div className="sign-line" /><div className="sign-label">For DNI Studios</div></div>
          </div>
        </section>
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

      <footer className="foot no-print">© {new Date().getFullYear()} DNI Ltd · Registered in England &amp; Wales, no. 15630271</footer>
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
  --ink: #16140f; --text: #2b2924; --muted: #77716a; --faint: #a39d93;
  --line: #e7e3db; --line-2: #d6d0c4; --bg: #f3f1ec;
  --serif: var(--font-display), Georgia, 'Times New Roman', serif;
  --sans: var(--font-inter), 'Helvetica Neue', Arial, sans-serif;
  background: var(--bg); color: var(--text); font-family: var(--sans);
  min-height: 100vh; padding: 0 16px 48px; -webkit-font-smoothing: antialiased;
}
body { background: #f3f1ec; }
.offer .num { font-variant-numeric: tabular-nums; }
.offer button { font-family: inherit; }
.offer :focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

/* Logo (matches the site nav) */
.logo { display: inline-flex; align-items: center; gap: 10px; }
.logo-mark {
  width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
  display: inline-flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #2563EB, #06B6D4);
}
.logo-word { font-weight: 700; font-size: 16px; letter-spacing: -.3px; color: var(--ink); }

/* Top bar */
.bar { max-width: 820px; margin: 0 auto; display: flex; align-items: center; justify-content: flex-end; padding: 18px 0; }
.bar-actions { display: flex; gap: 4px; }
.text-btn {
  border: none; background: transparent; color: var(--muted); font-size: 13.5px; font-weight: 500;
  padding: 7px 12px; border-radius: 8px; cursor: pointer;
}
.text-btn:hover { color: var(--ink); background: rgba(0,0,0,.04); }
.text-btn.on { background: var(--ink); color: #fff; }

/* Sheet */
.sheet {
  max-width: 820px; margin: 0 auto; background: #fff; border-radius: 6px;
  padding: 64px 72px 72px;
  box-shadow: 0 1px 2px rgba(22,20,15,.04), 0 12px 40px -24px rgba(22,20,15,.18);
}
.sheet + .sheet { margin-top: 24px; }

.head { display: flex; justify-content: space-between; gap: 32px; }
.from { font-size: 12.5px; line-height: 1.6; color: var(--muted); margin-top: 16px; }
.head-right { text-align: right; }
.doc-title { font-family: var(--serif); font-weight: 400; font-size: 40px; line-height: 1; color: var(--ink); letter-spacing: -.01em; }
.doc-meta { display: grid; grid-template-columns: auto auto; gap: 4px 16px; margin-top: 18px; font-size: 13px; justify-content: end; }
.doc-meta dt { color: var(--faint); text-align: left; }
.doc-meta dd { color: var(--text); text-align: right; }
.inline-input {
  width: 120px; text-align: right; border: none; background: transparent; font: inherit; color: var(--text); padding: 0;
}
.inline-input::placeholder { color: var(--faint); }
.inline-input:focus { outline: none; box-shadow: 0 1px 0 var(--ink); }

.for { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 48px; }

.label {
  display: block; font-family: var(--sans); font-size: 11px; font-weight: 600; letter-spacing: 1.2px;
  text-transform: uppercase; color: var(--faint); margin-bottom: 10px;
}
.line {
  width: 100%; border: none; border-bottom: 1px solid var(--line); background: transparent;
  font: inherit; font-size: 15px; color: var(--ink); padding: 6px 0 8px; border-radius: 0;
  transition: border-color .15s ease;
}
.line::placeholder { color: #c4beb3; }
.line:focus { outline: none; border-bottom-color: var(--ink); }

.part { margin-top: 56px; scroll-margin-top: 24px; }

/* Plans */
.plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.plan {
  position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 3px; text-align: left;
  background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 18px 18px 16px 46px;
  cursor: pointer; color: var(--text); transition: border-color .15s ease, box-shadow .15s ease;
}
.plan:hover { border-color: var(--line-2); }
.plan.on { border-color: var(--ink); box-shadow: inset 0 0 0 1px var(--ink); }
.radio {
  position: absolute; left: 18px; top: 20px; width: 16px; height: 16px; border-radius: 50%;
  border: 1.5px solid var(--line-2); transition: all .15s ease;
}
.plan.on .radio { border-color: var(--ink); box-shadow: inset 0 0 0 3.5px #fff; background: var(--ink); }
.plan-name { font-size: 15px; font-weight: 600; color: var(--ink); }
.plan-term { font-size: 13px; color: var(--muted); }
.plan-save { font-size: 12.5px; color: var(--ink); margin-top: 6px; font-weight: 500; }

/* Features */
.features { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 0 40px; }
.features li { display: flex; flex-direction: column; gap: 2px; padding: 12px 0; border-top: 1px solid var(--line); }
.f-name { font-size: 14px; font-weight: 500; color: var(--ink); }
.f-det { font-size: 13px; color: var(--muted); }

/* Quote */
.edit-note { font-size: 13px; color: var(--muted); background: var(--bg); border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; }
.lines { width: 100%; border-collapse: collapse; }
.lines th {
  font-size: 11px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: var(--faint);
  text-align: left; padding: 0 0 10px; border-bottom: 1px solid var(--ink);
}
.lines td { padding: 14px 0; border-bottom: 1px solid var(--line); vertical-align: top; font-size: 14.5px; }
.lines .amt { text-align: right; white-space: nowrap; padding-left: 24px; color: var(--ink); }
.th-title { font: inherit; letter-spacing: inherit; }
.l-main { color: var(--ink); }
.l-sub { font-size: 13px; color: var(--faint); margin-top: 3px; }
.struck { color: var(--faint); margin-right: 6px; }
.lines tr.removed td { opacity: .4; }
.lines tr.removed .l-main { text-decoration: line-through; }

.ctls { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 10px; }
.seg { display: inline-flex; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
.seg button {
  border: none; background: #fff; color: var(--muted); font-size: 12.5px; padding: 6px 11px; cursor: pointer;
}
.seg button + button { border-left: 1px solid var(--line); }
.seg button.on { background: var(--ink); color: #fff; }
.ctl {
  border: 1px solid var(--line); border-radius: 8px; background: #fff; font: inherit; font-size: 13.5px;
  color: var(--ink); padding: 6px 10px;
}
.ctl:focus { outline: none; border-color: var(--ink); }
.ctl-wide { width: 100%; max-width: 340px; }
.ctl-amt { width: 96px; text-align: right; }
.link-btn { border: none; background: transparent; color: var(--muted); font-size: 13px; cursor: pointer; padding: 6px 4px; }
.link-btn:hover { color: var(--ink); text-decoration: underline; }
.add { display: flex; gap: 16px; padding: 12px 0 0; }

.totals { margin-left: auto; max-width: 360px; padding-top: 20px; }
.t-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--muted); padding: 4px 0; }
.t-due {
  display: flex; justify-content: space-between; align-items: flex-end; gap: 16px;
  margin-top: 12px; padding-top: 16px; border-top: 1px solid var(--ink);
}
.t-due-label { font-size: 14px; font-weight: 600; color: var(--ink); }
.t-due-note { font-size: 12.5px; color: var(--faint); margin-top: 2px; }
.t-due-num { font-family: var(--serif); font-size: 40px; font-weight: 400; line-height: 1; color: var(--ink); letter-spacing: -.02em; }
.t-then { font-size: 13px; color: var(--muted); text-align: right; margin-top: 10px; }

.accept { display: flex; flex-direction: column; align-items: flex-end; margin-top: 36px; }
.cta {
  border: none; border-radius: 10px; background: var(--ink); color: #fff; cursor: pointer;
  font-size: 15px; font-weight: 500; padding: 15px 36px; min-width: 240px; transition: background .15s ease;
}
.cta:hover { background: #000; }
.assure { font-size: 12.5px; color: var(--faint); margin-top: 12px; text-align: right; }

/* Acceptance */
.fields { display: grid; grid-template-columns: 1fr 1fr; gap: 24px 32px; }
.field label { display: block; font-size: 12.5px; color: var(--muted); }
.field.wide { grid-column: 1 / -1; }
.agree { font-size: 13px; line-height: 1.6; color: var(--muted); margin: 32px 0 48px; }
.signs { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
.sign-line { border-bottom: 1px solid var(--ink); height: 44px; }
.sign-label { font-size: 12.5px; color: var(--muted); margin-top: 8px; }

/* Terms */
.terms-title { font-family: var(--serif); font-weight: 400; font-size: 26px; color: var(--ink); }
.terms-intro { font-size: 13px; line-height: 1.7; color: var(--muted); margin: 14px 0 32px; }
.clauses { columns: 2; column-gap: 40px; }
.clause { break-inside: avoid; margin-bottom: 20px; }
.clause h3 { font-size: 13.5px; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
.clause p { font-size: 12.5px; line-height: 1.65; color: var(--muted); margin-bottom: 6px; }

.foot { max-width: 820px; margin: 28px auto 0; text-align: center; font-size: 12px; color: var(--faint); }

/* Small screens */
@media (max-width: 720px) {
  .offer { padding: 0 10px 32px; }
  .bar { padding: 10px 0; }
  .sheet { padding: 32px 22px 40px; }
  .head { flex-direction: column; gap: 28px; }
  .head-right { text-align: left; }
  .doc-meta { justify-content: start; }
  .doc-meta dd { text-align: left; }
  .inline-input { text-align: left; }
  .for, .fields, .signs { grid-template-columns: 1fr; gap: 24px; }
  .part { margin-top: 44px; }
  .plans { grid-template-columns: 1fr; gap: 10px; }
  .features { grid-template-columns: 1fr; }
  .totals { max-width: none; }
  .accept { align-items: stretch; }
  .assure { text-align: center; }
  .clauses { columns: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .offer *, .offer *::before, .offer *::after { transition: none !important; }
}

/* Print: the proposal and terms, without the choosing steps or controls */
@media print {
  .no-print, .selection { display: none !important; }
  .offer, body { background: #fff; padding: 0; }
  .sheet { box-shadow: none; padding: 0 12mm; max-width: none; }
  .sheet + .sheet { margin-top: 0; }
  .lines tr.removed { display: none; }
  .terms { break-before: page; }
  .logo-mark { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`
