'use client'

import { useState } from 'react'

const PLANS = {
  monthly:   { price: 69, billed: 'Billed monthly',               disc: null,       sub: 'No commitment, cancel anytime' },
  quarterly: { price: 59, billed: 'Billed £177 every 3 months',   disc: 'Save 14%', sub: 'Most studios start here' },
  annual:    { price: 49, billed: 'Billed £588 once a year',       disc: 'Save 29%', sub: 'Best value — lock in the lowest rate' },
} as const

type Term = keyof typeof PLANS

const FEATURES: [string, string][] = [
  ['Scheduling & calendar',      'Book, reschedule, and track every session in one view'],
  ['Client tracking & progress', 'Goals, body metrics, workout logs, wellness trends'],
  ['Payments & invoicing',       'Know who\'s paid and who hasn\'t, at a glance'],
  ['Lead pipeline (CRM)',        'Enquiry to signed client, nothing falls through'],
  ['Performance analytics',      'Client adherence and trends, not buried in chat threads'],
  ['Unlimited trainers & clients','No per-seat fees, ever'],
]

const BONUSES: [string, string][] = [
  ['Free onboarding & data migration', 'Worth £150'],
  ['1:1 setup call with the founder',  'Worth £75'],
  ['Priority support for your first 90 days', 'Worth £90'],
]

export default function OfferPage() {
  const [term, setTerm] = useState<Term>('quarterly')
  const plan = PLANS[term]

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
        .header {
          background: #14120f;
          color: #faf8f4;
          padding: 48px 24px 40px;
          border-bottom: 2px solid;
          border-image: linear-gradient(90deg, #a6824f, rgba(166,130,79,0)) 1;
        }
        .header-inner { max-width: 640px; margin: 0 auto; text-align: center; }
        .logo {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 32px; font-weight: 700; letter-spacing: 0.5px;
        }
        .logo .accent { color: #c9a86a; }
        .tagline {
          font-size: 11px; color: #c4bfb3; margin-top: 8px;
          letter-spacing: 2px; text-transform: uppercase;
        }
        .pill {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 28px; font-size: 11px; letter-spacing: 1px;
          text-transform: uppercase; color: #c9a86a;
          border: 1px solid #a6824f; border-radius: 999px; padding: 5px 14px;
        }
        h1 {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 26px; font-weight: 700; margin: 18px 0 6px; line-height: 1.3;
        }
        .subhead { font-size: 14px; color: #b8b2a4; max-width: 440px; margin: 0 auto; }

        .body { max-width: 640px; margin: 0 auto; padding: 40px 24px 64px; }

        .toggle {
          display: flex; background: #efe9da; border-radius: 12px;
          padding: 4px; margin-bottom: 28px;
        }
        .toggle button {
          flex: 1; padding: 11px 8px; border-radius: 9px; border: none;
          cursor: pointer; font-size: 13px; font-weight: 600;
          font-family: inherit; background: transparent; color: #6b6458;
          transition: background 0.25s ease, color 0.25s ease;
        }
        .toggle button.active { background: #14120f; color: #faf8f4; }
        .toggle button .disc {
          display: block; font-size: 10px; margin-top: 2px;
          color: #0f5c3f; font-weight: 700;
        }
        .toggle button.active .disc { color: #c9a86a; }

        .price-card {
          background: #14120f; border-radius: 14px; padding: 32px 28px;
          position: relative; overflow: hidden; margin-bottom: 24px;
        }
        .price-card::before {
          content: ""; position: absolute; top: 0; left: 0; bottom: 0; width: 4px;
          background: linear-gradient(180deg, #c9a86a, #a6824f);
        }
        .price-top {
          display: flex; justify-content: space-between;
          align-items: flex-start; flex-wrap: wrap; gap: 16px;
        }
        .price-num {
          font-family: Georgia, serif; font-size: 52px; font-weight: 700;
          color: #faf8f4; line-height: 1;
        }
        .price-per { font-size: 15px; color: #c9a86a; }
        .billed { font-size: 12.5px; color: #b8b2a4; margin-top: 8px; }
        .psub { font-size: 12px; color: #8a8478; margin-top: 4px; }
        .disc-badge {
          border: 1px solid #a6824f; border-radius: 6px;
          padding: 8px 14px; text-align: center;
        }
        .disc-badge .big {
          font-size: 10px; color: #c9a86a; letter-spacing: 1px;
          text-transform: uppercase; font-weight: 700;
        }
        .disc-badge .sm { font-size: 9px; color: #8a8478; margin-top: 2px; }

        .cta {
          width: 100%; margin-top: 24px; padding: 14px 0;
          background: linear-gradient(135deg, #c9a86a, #a6824f);
          color: #14120f; border: none; border-radius: 8px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: inherit;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .cta:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(166,130,79,0.35); }
        .lock { font-size: 11px; color: #8a8478; text-align: center; margin-top: 10px; }

        .guarantee {
          display: flex; align-items: center; gap: 12px;
          background: #f1ece0; border: 1px solid #ddd1b3;
          border-left: 3px solid #0f5c3f; border-radius: 8px;
          padding: 14px 16px; margin-bottom: 32px;
          font-size: 12.5px; line-height: 1.5; color: #423f37;
        }
        .guarantee strong { color: #0f5c3f; }
        .guarantee .shield { flex-shrink: 0; font-size: 18px; }

        .section-label {
          font-size: 11px; color: #6b6458; text-transform: uppercase;
          letter-spacing: 1.5px; margin-bottom: 16px; font-weight: 700;
        }
        .feature {
          display: flex; gap: 12px; padding: 12px 0;
          border-bottom: 1px solid #e8e2d5;
        }
        .feature .chk { color: #0f5c3f; font-weight: 700; flex-shrink: 0; }
        .feature .fname { font-size: 13.5px; font-weight: 600; color: #14120f; }
        .feature .fdet { font-size: 11.5px; color: #6b6458; margin-top: 2px; }

        .bonus-wrap { margin: 32px 0; }
        .bonus {
          display: flex; justify-content: space-between; align-items: center;
          background: #fff; border: 1px solid #e8e2d5; border-radius: 8px;
          padding: 12px 16px; margin-bottom: 10px;
        }
        .bonus .bname { font-size: 13px; color: #2a2722; }
        .bonus .bval { font-size: 11px; color: #a6824f; font-weight: 700; }

        .footnote { text-align: center; font-size: 11px; color: #6b6458; margin-top: 8px; }

        .onboard { max-width: 640px; margin: 0 auto; padding: 0 24px 64px; }
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

        .terms-page { max-width: 640px; margin: 0 auto; padding: 0 24px 64px; }
        .terms-card { background: #fff; border: 1px solid #e8e2d5; border-radius: 10px; padding: 30px 28px; }
        .terms-title { font-family: Georgia, 'Times New Roman', serif; font-size: 18px; font-weight: 700; color: #14120f; margin-bottom: 4px; }
        .terms-intro { font-size: 11px; color: #6b6458; margin-bottom: 18px; line-height: 1.6; }
        .clause { margin-bottom: 14px; }
        .clause-title { font-size: 12.5px; font-weight: 700; color: #14120f; display: flex; gap: 6px; margin-bottom: 3px; }
        .clause-num { color: #a6824f; }
        .clause p { font-size: 11px; color: #423f37; line-height: 1.6; padding-left: 18px; margin-bottom: 3px; }

        .section-divider {
          text-align: center; margin: 8px 0 36px; color: #6b6458;
          font-size: 10px; text-transform: uppercase; letter-spacing: 2px;
          display: flex; align-items: center; gap: 12px;
          max-width: 640px; margin-left: auto; margin-right: auto; padding: 0 24px;
        }
        .section-divider::before, .section-divider::after {
          content: ""; flex: 1; height: 1px; background: #ddd6c8;
        }

        .print-btn-wrap { text-align: center; margin-top: 28px; }
        .print-btn {
          max-width: 320px; margin: 0 auto;
          background: linear-gradient(135deg, #c9a86a, #a6824f);
          color: #14120f; border: none; border-radius: 8px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 14px 24px; font-family: inherit;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          width: 100%;
        }
        .print-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(166,130,79,0.35); }

        @media print {
          .no-print { display: none !important; }
          .pill, .subhead { display: none; }
          h1 { font-size: 18px; }
          .body, .onboard, .terms-page { max-width: 100%; padding: 0 18mm; }
          .price-card { break-inside: avoid; }
          .onboard-card, .terms-card { border: none; padding: 0; }
          .terms-page { page-break-before: always; }
          body { background: #fff; }
          .bonus-wrap, .footnote { display: none; }
          .print-btn-wrap { display: none; }
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

      <div className="body">
        <div className="toggle no-print">
          {(['monthly', 'quarterly', 'annual'] as Term[]).map(t => (
            <button
              key={t}
              className={term === t ? 'active' : ''}
              onClick={() => setTerm(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === 'quarterly' && <span className="disc">Save 14%</span>}
              {t === 'annual'    && <span className="disc">Save 29%</span>}
            </button>
          ))}
        </div>

        <div className="price-card">
          <div className="price-top">
            <div>
              <div>
                <span className="price-num">£{plan.price}</span>
                <span className="price-per">/ month</span>
              </div>
              <div className="billed">{plan.billed}</div>
              <div className="psub">{plan.sub}</div>
            </div>
            {plan.disc && (
              <div className="disc-badge">
                <div className="big">{plan.disc}</div>
                <div className="sm">vs monthly</div>
              </div>
            )}
          </div>
          <button
            className="cta no-print"
            onClick={() => document.getElementById('onboardSection')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start as a founding studio →
          </button>
          <div className="lock">Your price is locked in for as long as you stay subscribed.</div>
        </div>

        <div className="guarantee">
          <span className="shield">🛡️</span>
          <div><strong>30-day money-back guarantee.</strong> If it doesn't fit how your studio runs, get a full refund — no questions, no hoops.</div>
        </div>

        <div className="section-label">Everything included</div>
        <div>
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

        <div className="bonus-wrap no-print">
          <div className="section-label">Included when you join as a founding studio</div>
          {BONUSES.map(([name, val]) => (
            <div className="bonus" key={name}>
              <span className="bname">{name}</span>
              <span className="bval">{val}</span>
            </div>
          ))}
        </div>

        <div className="footnote no-print">Founding pricing is limited to the first studios onboarded — your rate stays fixed once you join.</div>
      </div>

      <div className="section-divider no-print">Sign Up</div>

      <div className="onboard" id="onboardSection">
        <div className="onboard-card">
          <div className="onboard-title">Studio Details</div>
          <div className="onboard-sub">Complete this to lock in your founding price. Reference and date are completed at signing.</div>

          <div className="field-row">
            <div className="field"><label>Reference</label><input type="text" placeholder="DNI-2026-XXX" /></div>
            <div className="field"><label>Date</label><input type="text" placeholder="DD / MM / YYYY" /></div>
          </div>
          <div className="field-row">
            <div className="field"><label>Studio Name</label><input type="text" /></div>
            <div className="field"><label>Owner / Contact</label><input type="text" /></div>
          </div>
          <div className="field-row">
            <div className="field" style={{ flex: 2 }}><label>Address</label><input type="text" /></div>
            <div className="field"><label>City</label><input type="text" /></div>
            <div className="field"><label>Postcode</label><input type="text" /></div>
          </div>
          <div className="field-row">
            <div className="field full"><label>Email</label><input type="email" /></div>
          </div>

          <div className="agree-line">By signing below, the Customer agrees to the Terms &amp; Conditions overleaf, which form part of this agreement.</div>

          <div className="sign-row">
            <div className="sign-box">
              <div className="sign-line"></div>
              <div className="sign-label">Studio Signature &amp; Date</div>
            </div>
            <div className="sign-box">
              <div className="sign-line"></div>
              <div className="sign-label">DNI Studio — Authorised</div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-divider no-print">Terms &amp; Conditions</div>

      <div className="terms-page" id="terms">
        <div className="terms-card">
          <div className="terms-title">Terms &amp; Conditions of Service</div>
          <div className="terms-intro">These terms govern the provision of the DNI Studio software platform ("the Service") by DNI Analytics ("we", "us", "our") to the studio named above ("the Customer", "you"). By signing the offer sheet or by accessing or using the Service, you agree to be bound by these terms.</div>

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
              'All software, design, and branding associated with the Service remain the exclusive property of DNI Analytics. Nothing in this agreement transfers any intellectual property rights to the Customer.',
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
            🖨️ Print this offer &amp; agreement
          </button>
        </div>
      </div>
    </>
  )
}
