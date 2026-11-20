'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import BrandLogo from '../../components/BrandLogo'

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
  const [issued, setIssued] = useState('')

  // Dates are set on the client so server and client render the same markup.
  useEffect(() => {
    setIssued(fmtDate(new Date()))
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
                  <input className="p-input" placeholder="Postcode" autoComplete="postal-code" aria-label="Postcode" />
                </dd>
              </div>
              <div className="p-row">
                <dt><label htmlFor="bt-email">Email</label></dt>
                <dd><input id="bt-email" className="p-input" type="email" placeholder="name@studio.com" autoComplete="email" /></dd>
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
                <dd><input id="inv-ref" className="p-input" placeholder="DNI-2026-XXX" value={ref} onChange={e => setRef(e.target.value)} /></dd>
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
                    {x.custom ? (
                      <>
                        <input className="ctl ctl-wide no-print" value={x.label} onChange={e => updateExtra(x.id, { label: e.target.value })} aria-label="Item description" />
                        <div className="l-main print-only">{x.label}</div>
                      </>
                    ) : (
                      <div className="l-main">{x.label}</div>
                    )}
                    <div className="l-sub">
                      {x.status === 'waived' ? 'Included for founding studios' : x.status === 'removed' ? 'Removed' : kindWord(x.kind)}
                    </div>
                    <div className="ctls no-print">
                      <div className="seg" role="group" aria-label="Charge status">
                        {(['charge', 'waived', 'removed'] as Status[]).map(st => (
                          <button key={st} className={x.status === st ? 'on' : ''} onClick={() => updateExtra(x.id, { status: st })}>
                            {st === 'charge' ? 'Charge' : st === 'waived' ? 'Waive' : 'Remove'}
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
                    {x.status === 'waived' && <div className="amt-note no-print">Waived · {gbp(0)}</div>}
                    <span className="print-only">
                      {x.status === 'waived' ? <><s className="struck">{gbp(x.amount)}</s> {gbp(0)}</> : gbp(x.amount)}
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

          <div className="add no-print">
            <button className="add-btn" onClick={addDiscount}>+ Add discount</button>
            <button className="add-btn" onClick={addCharge}>+ Add charge</button>
          </div>

          <div className="summary">
            <div className="summary-note">
              <h3>Payment terms</h3>
              <p>Due on acceptance. Covered by a 30-day money-back guarantee, and your rate stays fixed for as long as you stay subscribed.</p>
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
              <button className="cta no-print" onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}>
                Accept invoice
              </button>
            </div>
          </div>
        </section>

        {/* Acceptance */}
        <section className="part" id="signup">
          <h2 className="label">Acceptance</h2>
          <p className="agree">By signing, {studio ? <strong>{studio}</strong> : 'the studio named above'} accepts this invoice and the Terms &amp; Conditions that follow, which form part of this agreement.</p>

          <div className="signs">
            <div><div className="sign-line" /><div className="sign-label">Studio signature &amp; date</div></div>
            <div><div className="sign-line" /><div className="sign-label">For DNI Studios</div></div>
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
.plan-save { font-size: 12px; font-weight: 600; margin-top: 8px; color: var(--ink); background: #f1f2f4; border-radius: 999px; padding: 3px 9px; }
.plan.on .plan-name { color: #fff; }
.plan.on .plan-term { color: #9ba1aa; }
.plan.on .plan-save { color: var(--ink); background: linear-gradient(180deg, #f4f5f7, #c9cdd3); }

/* Features */
.features { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 0 40px; }
.features li { display: grid; grid-template-columns: 18px 1fr; column-gap: 10px; padding: 12px 0; border-top: 1px solid var(--line-soft); }
.features li::before {
  content: ""; grid-row: span 2; width: 14px; height: 14px; margin-top: 3px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #ffffff, #b7bcc4 55%, #6e747d);
  box-shadow: 0 1px 2px rgba(0,0,0,.2);
}
.f-name { font-size: 14px; font-weight: 500; color: var(--ink); }
.f-det { font-size: 13px; color: var(--muted); }

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
.amt-note { font-size: 12px; color: #2f7d4f; margin-top: 6px; font-weight: 500; }
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
.sign-line { border-bottom: 1px solid var(--ink); height: 44px; }
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
  .plans { grid-template-columns: 1fr; gap: 10px; }
  .features { grid-template-columns: 1fr; }
  .summary { grid-template-columns: 1fr; gap: 20px; }
  .signs { grid-template-columns: 1fr; gap: 24px; }
  .sheet-foot { padding: 16px 20px; flex-direction: column; gap: 4px; }
  .terms { padding: 32px 20px 36px; }
  .clauses { columns: 1; }
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
