'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const BILLING = {
  monthly:   { price: 69, label: 'Billed monthly',            saving: null },
  quarterly: { price: 59, label: 'Billed £177 every 3 months', saving: 'Save 14%' },
  annual:    { price: 49, label: 'Billed £588 once a year',    saving: 'Save 29%' },
} as const

type Term = keyof typeof BILLING

const INCLUDED = [
  'Unlimited clients & sessions',
  'Live session logger with PB tracking',
  'Client portal for every client',
  'Daily wellness & progress tracking',
  'AI assistant (staff + client)',
  'Lead pipeline & CRM',
  'Payments, invoicing & receipts',
  'Smart dashboard & action items',
  'Team roles & permissions',
  'Priority onboarding support',
]

export default function PricingSection() {
  const [term, setTerm] = useState<Term>('quarterly')
  const plan = BILLING[term]

  return (
    <section id="pricing" style={{ padding: '140px 0', position: 'relative', overflow: 'hidden' }}>
      <div className="glow-orb glow-blue" style={{ width: 500, height: 500, top: '20%', left: '50%', transform: 'translateX(-50%)', opacity: 0.2 }} />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div className="badge badge-blue" style={{ marginBottom: 20, display: 'inline-flex' }}>Founding Access</div>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 50px)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 16 }}>
            One price.{' '}
            <span className="gradient-text">Everything included.</span>
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 420, margin: '0 auto' }}>
            No tiers. No per-seat fees. No surprises. Lock in your founding rate and it never goes up.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 4, marginBottom: 32 }}
        >
          {(Object.keys(BILLING) as Term[]).map(t => (
            <button
              key={t}
              onClick={() => setTerm(t)}
              style={{
                flex: 1, padding: '10px 8px', borderRadius: 9, border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 13, fontWeight: term === t ? 700 : 500,
                background: term === t ? '#5B7BFF' : 'transparent',
                color: term === t ? 'white' : 'var(--text-muted)',
                transition: 'all 0.2s ease',
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {BILLING[t].saving && (
                <span style={{ display: 'block', fontSize: 10, marginTop: 1, color: term === t ? 'rgba(255,255,255,0.7)' : '#22D3EE', fontWeight: 600 }}>
                  {BILLING[t].saving}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Price card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'var(--card)', borderRadius: 20,
            border: '1px solid rgba(91,123,255,0.35)',
            boxShadow: '0 0 60px rgba(91,123,255,0.10), 0 2px 0 rgba(255,255,255,0.05) inset',
            overflow: 'hidden',
          }}
        >
          {/* Top gradient bar */}
          <div style={{ height: 3, background: 'linear-gradient(90deg, #5B7BFF, #22D3EE)' }} />

          <div style={{ padding: '36px 40px' }}>
            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 64, fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: '-3px' }}>
                £{plan.price}
              </span>
              <span style={{ fontSize: 16, color: 'var(--text-muted)', paddingBottom: 10 }}>/month</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{plan.label}</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 32 }}>
              Your rate is locked in for life — even when we raise prices.
            </p>

            {/* CTA */}
            <a
              href="/offer"
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '15px', borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: 'none', marginBottom: 10, position: 'relative', zIndex: 1 }}
            >
              Claim founding price →
            </a>
            <p style={{ fontSize: 12, color: 'var(--text-subtle)', textAlign: 'center', marginBottom: 36 }}>
              See full offer, T&amp;Cs, and sign — <a href="/offer" style={{ color: 'var(--accent-light)', textDecoration: 'none' }}>view the offer page</a>
            </p>

            {/* Included list */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 28 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16 }}>Everything included</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>
                {INCLUDED.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'rgba(255,255,255,0.68)' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                      <circle cx="7" cy="7" r="6" fill="rgba(91,123,255,0.18)" stroke="rgba(91,123,255,0.35)" strokeWidth="1"/>
                      <path d="M4 7l2 2 4-4" stroke="#7B96FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Guarantee + urgency */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 20 }} className="guarantee-grid">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ background: 'rgba(22,163,74,0.05)', border: '1px solid rgba(22,163,74,0.14)', borderRadius: 14, padding: '20px 22px' }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>🛡️</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 6 }}>30-Day Money-Back</div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.65 }}>
              Doesn&apos;t save you 5 hours a week? Full refund. No questions.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.13)', borderRadius: 14, padding: '20px 22px' }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>⚡</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 6 }}>Price Locked Forever</div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.65 }}>
              Founding price is only available for the first 50 studios. After that, it goes up.
            </p>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .guarantee-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
