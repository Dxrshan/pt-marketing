'use client'

import { useEffect, useMemo, useState } from 'react'

/* ─── Pricing data ─────────────────────────────────────────────────────── */

const LIST_MONTHLY = 69

const PLANS = {
  monthly:   { label: 'Monthly',   months: 1,  rate: 69, save: null,       commit: 'No commitment, cancel anytime', period: 'per month' },
  quarterly: { label: 'Quarterly', months: 3,  rate: 59, save: 'Save 14%', commit: 'Most studios start here',      period: 'every 3 months' },
  annual:    { label: 'Annual',    months: 12, rate: 49, save: 'Save 29%', commit: 'Best value — lowest rate',     period: 'per year' },
} as const

type Term = keyof typeof PLANS

const FEATURES: [string, string][] = [
  ['Scheduling & calendar',       'Book, reschedule, and track every session in one view'],
  ['Client tracking & progress',  'Goals, body metrics, workout logs, wellness trends'],
  ['Payments & invoicing',        'Know who\'s paid and who hasn\'t, at a glance'],
  ['Lead pipeline (CRM)',         'Enquiry to signed client, nothing falls through'],
  ['Performance analytics',       'Client adherence and trends, not buried in chat threads'],
  ['Unlimited trainers & clients', 'No per-seat fees, ever'],
]

/* ─── Quote line model ─────────────────────────────────────────────────── */

type Kind = 'once' | 'recurring'
type Status = 'charge' | 'waived' | 'removed'

type Extra = {
  id: string
  label: string
  amount: number
  kind: Kind
  status: Status
  custom: boolean
}

type Discount = {
  id: string
  label: string
  mode: 'pct' | 'fixed'
  value: number
  scope: Kind
}

const DEFAULT_EXTRAS: Extra[] = [
  { id: 'onboard', label: 'Onboarding & data migration',       amount: 150, kind: 'once', status: 'waived', custom: false },
  { id: 'call',    label: '1:1 setup call with the founder',   amount: 75,  kind: 'once', status: 'waived', custom: false },
  { id: 'support', label: 'Priority support — first 90 days',  amount: 90,  kind: 'once', status: 'waived', custom: false },
]

const gbp = (n: number) =>
  '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const uid = () => Math.random().toString(36).slice(2, 9)

const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

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
    const dueToday = Math.max(firstBase - onceDisc, 0)

    const waivedValue = extras.filter(e => e.status === 'waived').reduce((s, e) => s + e.amount, 0)
    const totalSaved = termSaving + waivedValue + recurringDisc + onceDisc

    return {
      listSub, termSaving, recurringExtras, onceExtras,
      subtotal: listSub + recurringExtras + onceExtras,
      discAmounts, recurringTotal, dueToday, totalSaved,
    }
  }, [plan, extras, discounts])

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
  const kindTag = (k: Kind) => (k === 'once' ? 'One-off' : 'Recurring')
  const hasRecurringDiffering = Math.abs(totals.dueToday - totals.recurringTotal) > 0.005

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          background: #faf8f4;
          color: #2a2722;
          -webkit-font-smoothing: antialiased;
        }
        .num { font-variant-numeric: tabular-nums; }

        /* Header */
        .header {
          background: #14120f; color: #faf8f4;
          padding: 40px 24px 36px;
          border-bottom: 2px solid;
          border-image: linear-gradient(90deg, #a6824f, rgba(166,130,79,0)) 1;
        }
        .header-inner { max-width: 720px; margin: 0 auto; text-align: center; }
        .logo { font-family: Georgia, 'Times New Roman', serif; font-size: 30px; font-weight: 700; letter-spacing: 0.5px; }
        .logo .accent { color: #c9a86a; }
        .tagline { font-size: 11px; color: #c4bfb3; margin-top: 8px; letter-spacing: 2px; text-transform: uppercase; }
        .pill {
          display: inline-flex; align-items: center; gap: 6px; margin-top: 24px;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #c9a86a;
          border: 1px solid #a6824f; border-radius: 999px; padding: 5px 14px;
        }
        h1 { font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 700; margin: 16px 0 6px; line-height: 1.3; }
        .subhead { font-size: 14px; color: #b8b2a4; max-width: 440px; margin: 0 auto; }

        .wrap { max-width: 720px; margin: 0 auto; padding: 36px 20px 56px; }

        /* Steps */
        .step { margin-bottom: 36px; }
        .step-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 14px; }
        .step-num {
          font-family: Georgia, serif; font-size: 13px; color: #a6824f; font-weight: 700;
          border: 1px solid #ddd1b3; border-radius: 999px; width: 26px; height: 26px;
          display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .step-title { font-family: Georgia, serif; font-size: 18px; font-weight: 700; color: #14120f; }
        .step-sub { font-size: 12.5px; color: #6b6458; margin: -6px 0 14px 38px; }

        .terms-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .term-opt {
          text-align: left; background: #fff; border: 1px solid #e3dccb; border-radius: 10px;
          padding: 14px 14px 13px; cursor: pointer; font-family: inherit; color: inherit;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; position: relative;
        }
        .term-opt:hover { border-color: #c9a86a; }
        .term-opt.active { border-color: #14120f; box-shadow: 0 0 0 1px #14120f; }
        .term-opt .radio {
          position: absolute; top: 14px; right: 14px; width: 16px; height: 16px; border-radius: 50%;
          border: 1.5px solid #c4bba6;
        }
        .term-opt.active .radio { border-color: #14120f; background: radial-gradient(#14120f 0 4px, transparent 5px); }
        .term-opt .tname { font-size: 14px; font-weight: 700; color: #14120f; }
        .term-opt .tsave { display: inline-block; margin-top: 6px; font-size: 10px; font-weight: 700; color: #0f5c3f; letter-spacing: 0.4px; text-transform: uppercase; }
        .term-opt .tcommit { font-size: 11.5px; color: #6b6458; margin-top: 6px; line-height: 1.4; }

        .features { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }
        .feature { display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid #e8e2d5; }
        .feature .chk { color: #0f5c3f; font-weight: 700; flex-shrink: 0; }
        .feature .fname { font-size: 13px; font-weight: 600; color: #14120f; }
        .feature .fdet { font-size: 11.5px; color: #6b6458; margin-top: 2px; }

        /* Invoice */
        .invoice {
          background: #fff; border: 1px solid #e3dccb; border-radius: 12px;
          box-shadow: 0 1px 0 #efe9da, 0 12px 32px -18px rgba(20,18,15,0.25);
          overflow: hidden;
        }
        .inv-top { display: flex; justify-content: space-between; gap: 24px; padding: 26px 28px 20px; flex-wrap: wrap; border-bottom: 1px solid #efe9da; }
        .inv-kicker { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #a6824f; font-weight: 700; }
        .inv-title { font-family: Georgia, serif; font-size: 24px; font-weight: 700; color: #14120f; margin-top: 2px; }
        .inv-from { font-size: 11px; color: #6b6458; margin-top: 8px; line-height: 1.55; }
        .inv-meta { display: grid; grid-template-columns: auto auto; gap: 5px 14px; font-size: 11.5px; align-content: start; }
        .inv-meta dt { color: #8a8478; text-transform: uppercase; letter-spacing: 0.8px; font-size: 9.5px; padding-top: 3px; }
        .inv-meta dd { color: #14120f; text-align: right; }

        .bill-to { padding: 16px 28px; background: #fbf9f4; border-bottom: 1px solid #efe9da; display: flex; gap: 24px; flex-wrap: wrap; }
        .bill-to .bt { flex: 1; min-width: 180px; }
        .lbl { font-size: 9.5px; color: #8a8478; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px; }
        .line-input {
          width: 100%; border: none; border-bottom: 1px dashed #cfc6b1; background: transparent;
          font-family: inherit; font-size: 13.5px; color: #14120f; padding: 3px 0;
        }
        .line-input:focus { outline: none; border-bottom: 1px solid #a6824f; }
        .line-input::placeholder { color: #b9b1a0; }

        .inv-table { width: 100%; border-collapse: collapse; }
        .inv-table th {
          font-size: 9.5px; color: #8a8478; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;
          text-align: left; padding: 12px 8px; border-bottom: 1px solid #e8e2d5;
        }
        .inv-table th:first-child, .inv-table td:first-child { padding-left: 28px; }
        .inv-table th:last-child, .inv-table td:last-child { padding-right: 28px; text-align: right; }
        .inv-table td { padding: 12px 8px; border-bottom: 1px solid #f1ece0; font-size: 13px; vertical-align: top; }
        .inv-table .desc-main { color: #14120f; font-weight: 600; }
        .inv-table .desc-sub { color: #8a8478; font-size: 11.5px; margin-top: 2px; }
        .inv-table .tag {
          display: inline-block; font-size: 9.5px; letter-spacing: 0.5px; text-transform: uppercase;
          color: #6b6458; background: #f3eee2; border-radius: 4px; padding: 2px 6px; white-space: nowrap;
        }
        .inv-table .amt { white-space: nowrap; color: #14120f; }
        .inv-table .neg { color: #0f5c3f; }
        .inv-table tr.waived .amt-strike { text-decoration: line-through; color: #b0a896; margin-right: 8px; font-size: 12px; }
        .inv-table tr.waived .free { color: #0f5c3f; font-weight: 700; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; }
        .inv-table tr.removed td { opacity: 0.45; }
        .inv-table tr.removed .desc-main { text-decoration: line-through; }
        .inv-table tr.discount-row td { background: #f7fbf8; }

        .ctrls { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; align-items: center; }
        .seg { display: inline-flex; border: 1px solid #ddd5c3; border-radius: 6px; overflow: hidden; }
        .seg button {
          border: none; background: #fff; font-family: inherit; font-size: 10.5px; padding: 4px 8px;
          color: #6b6458; cursor: pointer; border-right: 1px solid #ddd5c3;
        }
        .seg button:last-child { border-right: none; }
        .seg button.on { background: #14120f; color: #faf8f4; }
        .mini-input, .mini-select {
          border: 1px solid #ddd5c3; border-radius: 6px; background: #fff; font-family: inherit;
          font-size: 12px; padding: 4px 7px; color: #14120f;
        }
        .mini-input.wide { width: 100%; font-weight: 600; font-size: 13px; }
        .mini-input.amt-in { width: 84px; text-align: right; }
        .x-btn {
          border: none; background: transparent; color: #a0988a; cursor: pointer; font-size: 15px;
          line-height: 1; padding: 2px 4px; border-radius: 4px;
        }
        .x-btn:hover { color: #9b2c2c; background: #f9eeee; }

        .add-row { display: flex; gap: 8px; padding: 14px 28px; border-bottom: 1px solid #efe9da; flex-wrap: wrap; }
        .add-btn {
          border: 1px dashed #c9bfa8; background: #fff; color: #6b6458; font-family: inherit;
          font-size: 12px; font-weight: 600; padding: 7px 12px; border-radius: 7px; cursor: pointer;
        }
        .add-btn:hover { border-color: #a6824f; color: #14120f; }

        .sums { padding: 18px 28px 6px; display: flex; justify-content: flex-end; }
        .sums-inner { width: 100%; max-width: 320px; }
        .sum-row { display: flex; justify-content: space-between; font-size: 13px; padding: 5px 0; color: #423f37; }
        .sum-row.saved { color: #0f5c3f; font-weight: 600; }

        .total {
          margin-top: 10px; background: #14120f; color: #faf8f4; padding: 22px 28px 24px;
          position: relative;
        }
        .total::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #c9a86a, #a6824f);
        }
        .total-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; }
        .total-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #c9a86a; font-weight: 700; }
        .total-note { font-size: 12px; color: #b8b2a4; margin-top: 6px; }
        .total-num { font-family: Georgia, serif; font-size: 44px; font-weight: 700; line-height: 1; }
        .then { margin-top: 14px; padding-top: 12px; border-top: 1px solid #2f2b25; font-size: 12.5px; color: #c4bfb3; display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .then strong { color: #faf8f4; }

        .inv-foot { padding: 18px 28px 24px; background: #14120f; }
        .cta {
          width: 100%; padding: 14px 0;
          background: linear-gradient(135deg, #c9a86a, #a6824f);
          color: #14120f; border: none; border-radius: 8px;
          font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .cta:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(166,130,79,0.35); }
        .lock { font-size: 11px; color: #8a8478; text-align: center; margin-top: 10px; }

        .edit-toggle {
          border: 1px solid #ddd5c3; background: #fff; border-radius: 999px; font-family: inherit;
          font-size: 11px; font-weight: 600; color: #6b6458; padding: 5px 12px; cursor: pointer; margin-left: auto;
        }
        .edit-toggle.on { background: #14120f; color: #faf8f4; border-color: #14120f; }

        .guarantee {
          display: flex; align-items: center; gap: 12px; margin-top: 18px;
          background: #f1ece0; border: 1px solid #ddd1b3; border-left: 3px solid #0f5c3f; border-radius: 8px;
          padding: 14px 16px; font-size: 12.5px; line-height: 1.5; color: #423f37;
        }
        .guarantee strong { color: #0f5c3f; }
        .guarantee .shield { flex-shrink: 0; font-size: 18px; }

        /* Sign-up + terms (unchanged look) */
        .onboard { max-width: 720px; margin: 0 auto; padding: 0 20px 64px; }
        .onboard-card { background: #fff; border: 1px solid #e8e2d5; border-radius: 10px; padding: 28px 26px; }
        .onboard-title { font-family: Georgia, 'Times New Roman', serif; font-size: 18px; font-weight: 700; color: #14120f; margin-bottom: 4px; }
        .onboard-sub { font-size: 12px; color: #6b6458; margin-bottom: 20px; }
        .field-row { display: flex; gap: 14px; margin-bottom: 14px; flex-wrap: wrap; }
        .field { flex: 1; min-width: 140px; display: flex; flex-direction: column; }
        .field.full { flex-basis: 100%; }
        .field label { font-size: 9px; color: #6b6458; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
        .field input { border: 1px solid #d8d1c0; border-radius: 5px; background: #fff; padding: 10px 11px; font-size: 13px; font-family: inherit; color: #14120f; }
        .field input:focus { outline: 2px solid #a6824f; outline-offset: 1px; }
        .agree-line { font-size: 11px; color: #6b6458; margin: 18px 0 16px; line-height: 1.5; }
        .sign-row { display: flex; gap: 20px; margin-top: 6px; flex-wrap: wrap; }
        .sign-box { flex: 1; min-width: 200px; }
        .sign-line { border: 1px solid #d8d1c0; border-radius: 5px; background: #fff; height: 56px; }
        .sign-label { font-size: 9px; color: #6b6458; text-transform: uppercase; letter-spacing: 0.8px; margin-top: 8px; }

        .terms-page { max-width: 720px; margin: 0 auto; padding: 0 20px 64px; }
        .terms-card { background: #fff; border: 1px solid #e8e2d5; border-radius: 10px; padding: 30px 28px; }
        .terms-title { font-family: Georgia, 'Times New Roman', serif; font-size: 18px; font-weight: 700; color: #14120f; margin-bottom: 4px; }
        .terms-intro { font-size: 11px; color: #6b6458; margin-bottom: 18px; line-height: 1.6; }
        .clause { margin-bottom: 14px; }
        .clause-title { font-size: 12.5px; font-weight: 700; color: #14120f; display: flex; gap: 6px; margin-bottom: 3px; }
        .clause-num { color: #a6824f; }
        .clause p { font-size: 11px; color: #423f37; line-height: 1.6; padding-left: 18px; margin-bottom: 3px; }

        .section-divider {
          margin: 8px auto 36px; color: #6b6458; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;
          display: flex; align-items: center; gap: 12px; max-width: 720px; padding: 0 20px;
        }
        .section-divider::before, .section-divider::after { content: ""; flex: 1; height: 1px; background: #ddd6c8; }

        .print-btn-wrap { text-align: center; margin-top: 28px; }
        .print-btn {
          max-width: 320px; width: 100%; margin: 0 auto;
          background: linear-gradient(135deg, #c9a86a, #a6824f); color: #14120f; border: none; border-radius: 8px;
          font-size: 15px; font-weight: 700; cursor: pointer; padding: 14px 24px; font-family: inherit;
        }

        @media (max-width: 600px) {
          .terms-grid { grid-template-columns: 1fr; }
          .features { grid-template-columns: 1fr; }
          .inv-top, .bill-to, .add-row, .sums, .total, .inv-foot { padding-left: 18px; padding-right: 18px; }
          .inv-table th:first-child, .inv-table td:first-child { padding-left: 18px; }
          .inv-table th:last-child, .inv-table td:last-child { padding-right: 18px; }
          .inv-table .col-type { display: none; }
          .inv-meta dd { text-align: left; }
          .total-num { font-size: 36px; }
          .step-sub { margin-left: 0; }
        }

        @media print {
          .no-print { display: none !important; }
          body { background: #fff; }
          .header { padding: 20px 0; }
          .wrap, .onboard, .terms-page { max-width: 100%; padding: 0 14mm; }
          .step.selection { display: none; }
          .invoice { box-shadow: none; break-inside: avoid; }
          .inv-table tr.removed { display: none; }
          .line-input { border-bottom-color: transparent; }
          .onboard-card, .terms-card { border: none; padding: 0; }
          .terms-page { page-break-before: always; }
          .total, .header, .inv-foot { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="header">
        <div className="header-inner">
          <div className="logo">DNI <span className="accent">STUDIO</span></div>
          <div className="tagline">Operations software for fitness studios</div>
          <div className="no-print"><span className="pill">✦ Founding Customer Pricing</span></div>
          <h1 className="no-print">Run your studio on one tool,<br />not five.</h1>
          <p className="subhead no-print">Replace WhatsApp, spreadsheets, and scattered apps with a single system built for personal trainers.</p>
        </div>
      </div>

      <div className="wrap">
        {/* Step 1 — billing term */}
        <section className="step selection">
          <div className="step-head">
            <span className="step-num">1</span>
            <h2 className="step-title">Choose how you'd like to be billed</h2>
          </div>
          <p className="step-sub">Longer commitments unlock a lower founding rate. You'll see the full breakdown below.</p>
          <div className="terms-grid" role="radiogroup" aria-label="Billing term">
            {(Object.keys(PLANS) as Term[]).map(t => {
              const p = PLANS[t]
              return (
                <button
                  key={t}
                  role="radio"
                  aria-checked={term === t}
                  className={`term-opt ${term === t ? 'active' : ''}`}
                  onClick={() => setTerm(t)}
                >
                  <span className="radio" />
                  <div className="tname">{p.label}</div>
                  {p.save && <span className="tsave">{p.save}</span>}
                  <div className="tcommit">{p.commit}</div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Step 2 — what's included */}
        <section className="step selection">
          <div className="step-head">
            <span className="step-num">2</span>
            <h2 className="step-title">Everything that's included</h2>
          </div>
          <div className="features">
            {FEATURES.map(([name, detail]) => (
              <div className="feature" key={name}>
                <span className="chk">✓</span>
                <div>
                  <div className="fname">{name}</div>
                  <div className="fdet">{detail}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Step 3 — the quote */}
        <section className="step">
          <div className="step-head no-print">
            <span className="step-num">3</span>
            <h2 className="step-title">Your quote</h2>
            <button
              className={`edit-toggle ${editing ? 'on' : ''}`}
              onClick={() => setEditing(e => !e)}
              aria-pressed={editing}
            >
              {editing ? '✓ Done adjusting' : '✎ Adjust quote'}
            </button>
          </div>

          <div className="invoice">
            <div className="inv-top">
              <div>
                <div className="inv-kicker">Founding offer</div>
                <div className="inv-title">Quote</div>
                <div className="inv-from">
                  DNI Ltd, trading as DNI Analytics<br />
                  78a Deacon Road, London NW2 5QJ<br />
                  Company no. 15630271
                </div>
              </div>
              <dl className="inv-meta">
                <dt>Reference</dt>
                <dd>
                  <input className="line-input" style={{ textAlign: 'right', width: 130 }} placeholder="DNI-2026-XXX" value={ref} onChange={e => setRef(e.target.value)} aria-label="Reference" />
                </dd>
                <dt>Issued</dt><dd>{issued || '—'}</dd>
                <dt>Valid until</dt><dd>{validUntil || '—'}</dd>
                <dt>Billing</dt><dd>{plan.label}</dd>
              </dl>
            </div>

            <div className="bill-to">
              <div className="bt">
                <label className="lbl" htmlFor="q-studio">Prepared for</label>
                <input id="q-studio" className="line-input" placeholder="Studio name" value={studio} onChange={e => setStudio(e.target.value)} />
              </div>
              <div className="bt">
                <label className="lbl" htmlFor="q-contact">Attention</label>
                <input id="q-contact" className="line-input" placeholder="Owner / contact" value={contact} onChange={e => setContact(e.target.value)} />
              </div>
            </div>

            <table className="inv-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="col-type">Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="desc-main">DNI Studio platform — {plan.label.toLowerCase()} subscription</div>
                    <div className="desc-sub num">
                      {`${plan.months} ${plan.months === 1 ? 'month' : 'months'} × ${gbp(LIST_MONTHLY)} list price · unlimited trainers & clients`}
                    </div>
                  </td>
                  <td className="col-type"><span className="tag">Recurring</span></td>
                  <td className="amt num">{gbp(totals.listSub)}</td>
                </tr>

                {totals.termSaving > 0 && (
                  <tr className="discount-row">
                    <td>
                      <div className="desc-main">{plan.label} commitment rate</div>
                      <div className="desc-sub num">Founding rate {gbp(plan.rate)}/mo instead of {gbp(LIST_MONTHLY)}/mo</div>
                    </td>
                    <td className="col-type"><span className="tag">Recurring</span></td>
                    <td className="amt num neg">−{gbp(totals.termSaving)}</td>
                  </tr>
                )}

                {visibleExtras.map(x => (
                  <tr key={x.id} className={x.status}>
                    <td>
                      {editing && x.custom ? (
                        <input className="mini-input wide" value={x.label} onChange={e => updateExtra(x.id, { label: e.target.value })} aria-label="Item description" />
                      ) : (
                        <div className="desc-main">{x.label}</div>
                      )}
                      {!editing && x.status === 'waived' && <div className="desc-sub">Included free for founding studios</div>}
                      {editing && (
                        <div className="ctrls no-print">
                          <div className="seg" role="group" aria-label="Charge status">
                            {(['charge', 'waived', 'removed'] as Status[]).map(s => (
                              <button key={s} className={x.status === s ? 'on' : ''} onClick={() => updateExtra(x.id, { status: s })}>
                                {s === 'charge' ? 'Charge' : s === 'waived' ? 'Waive' : 'Remove'}
                              </button>
                            ))}
                          </div>
                          {x.custom && (
                            <>
                              <select className="mini-select" value={x.kind} onChange={e => updateExtra(x.id, { kind: e.target.value as Kind })} aria-label="Charge type">
                                <option value="once">One-off</option>
                                <option value="recurring">Recurring</option>
                              </select>
                              <button className="x-btn" onClick={() => deleteExtra(x.id)} aria-label="Delete item">×</button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="col-type"><span className="tag">{kindTag(x.kind)}</span></td>
                    <td className="amt num">
                      {editing ? (
                        <input
                          type="number" min={0} step="0.01" className="mini-input amt-in num"
                          value={x.amount}
                          onChange={e => updateExtra(x.id, { amount: Math.max(0, Number(e.target.value) || 0) })}
                          aria-label="Amount"
                        />
                      ) : x.status === 'waived' ? (
                        <><span className="amt-strike">{gbp(x.amount)}</span><span className="free">Free</span></>
                      ) : (
                        gbp(x.amount)
                      )}
                    </td>
                  </tr>
                ))}

                {discounts.map(d => (
                  <tr key={d.id} className="discount-row">
                    <td>
                      {editing ? (
                        <>
                          <input className="mini-input wide" value={d.label} onChange={e => updateDiscount(d.id, { label: e.target.value })} aria-label="Discount name" />
                          <div className="ctrls no-print">
                            <input
                              type="number" min={0} step="0.01" className="mini-input amt-in num"
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
                            <select className="mini-select" value={d.scope} onChange={e => updateDiscount(d.id, { scope: e.target.value as Kind })} aria-label="Applies to">
                              <option value="once">First payment only</option>
                              <option value="recurring">Every payment</option>
                            </select>
                            <button className="x-btn" onClick={() => deleteDiscount(d.id)} aria-label="Delete discount">×</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="desc-main">{d.label}</div>
                          <div className="desc-sub">
                            {d.mode === 'pct' ? `${d.value}% off` : `${gbp(d.value)} off`}
                            {d.scope === 'once' ? ' your first payment' : ' every payment'}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="col-type"><span className="tag">{kindTag(d.scope)}</span></td>
                    <td className="amt num neg">−{gbp(totals.discAmounts[d.id] ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {editing && (
              <div className="add-row no-print">
                <button className="add-btn" onClick={addDiscount}>+ Add discount</button>
                <button className="add-btn" onClick={addCharge}>+ Add charge</button>
              </div>
            )}

            <div className="sums">
              <div className="sums-inner">
                <div className="sum-row num"><span>Subtotal</span><span>{gbp(totals.subtotal)}</span></div>
                {totals.totalSaved > 0 && (
                  <div className="sum-row saved num"><span>You save</span><span>{gbp(totals.totalSaved)}</span></div>
                )}
              </div>
            </div>

            <div className="total">
              <div className="total-row">
                <div>
                  <div className="total-label">Total due today</div>
                  <div className="total-note">
                    Covers your first {plan.months === 1 ? 'month' : `${plan.months} months`}
                    {totals.onceExtras > 0 ? ' plus one-off items' : ''}
                  </div>
                </div>
                <div className="total-num num">{gbp(totals.dueToday)}</div>
              </div>
              <div className="then num">
                <span>
                  {hasRecurringDiffering ? 'Then ' : 'Renews at '}
                  <strong>{gbp(totals.recurringTotal)}</strong> {plan.period}
                </span>
                <span>≈ {gbp(totals.recurringTotal / plan.months)} / month</span>
              </div>
            </div>

            <div className="inv-foot no-print">
              <button
                className="cta"
                onClick={() => document.getElementById('onboardSection')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Accept &amp; start as a founding studio →
              </button>
              <div className="lock">Your rate is locked in for as long as you stay subscribed.</div>
            </div>
          </div>

          <div className="guarantee">
            <span className="shield">🛡️</span>
            <div><strong>30-day money-back guarantee.</strong> If it doesn't fit how your studio runs, get a full refund — no questions, no hoops.</div>
          </div>
        </section>
      </div>

      <div className="section-divider no-print">Sign Up</div>

      <div className="onboard" id="onboardSection">
        <div className="onboard-card">
          <div className="onboard-title">Studio Details</div>
          <div className="onboard-sub">Complete this to lock in the quote above. Reference and date are taken from the quote.</div>

          <div className="field-row">
            <div className="field"><label htmlFor="s-studio">Studio Name</label><input id="s-studio" type="text" value={studio} onChange={e => setStudio(e.target.value)} /></div>
            <div className="field"><label htmlFor="s-contact">Owner / Contact</label><input id="s-contact" type="text" value={contact} onChange={e => setContact(e.target.value)} /></div>
          </div>
          <div className="field-row">
            <div className="field" style={{ flex: 2 }}><label>Address</label><input type="text" /></div>
            <div className="field"><label>City</label><input type="text" /></div>
            <div className="field"><label>Postcode</label><input type="text" /></div>
          </div>
          <div className="field-row">
            <div className="field full"><label>Email</label><input type="email" /></div>
          </div>

          <div className="agree-line">By signing below, the Customer accepts the quote above and agrees to the Terms &amp; Conditions overleaf, which form part of this agreement.</div>

          <div className="sign-row">
            <div className="sign-box">
              <div className="sign-line"></div>
              <div className="sign-label">Studio Signature &amp; Date</div>
            </div>
            <div className="sign-box">
              <div className="sign-line"></div>
              <div className="sign-label">DNI Studios — Authorised</div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-divider no-print">Terms &amp; Conditions</div>

      <div className="terms-page" id="terms">
        <div className="terms-card">
          <div className="terms-title">Terms &amp; Conditions of Service</div>
          <div className="terms-intro">These terms govern the provision of the DNI Studios software platform ("the Service") by DNI Ltd, trading as DNI Analytics, a company registered in England and Wales under company number 15630271, registered office 78a Deacon Road, London NW2 5QJ ("we", "us", "our") to the studio named above ("the Customer", "you"). By signing the offer sheet or by accessing or using the Service, you agree to be bound by these terms.</div>

          {[
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
          ].map(clause => (
            <div className="clause" key={clause.num}>
              <div className="clause-title">
                <span className="clause-num">{clause.num}</span> {clause.title}
              </div>
              {clause.paras.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          ))}
        </div>

        <div className="print-btn-wrap no-print">
          <button className="print-btn" onClick={() => window.print()}>
            🖨️ Print this quote &amp; agreement
          </button>
        </div>
      </div>
    </>
  )
}
