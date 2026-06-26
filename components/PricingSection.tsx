'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const VALUE_STACK = [
  { tool: 'Client management & progress tracking', competitor: 'TrueCoach', price: '£35/mo' },
  { tool: 'Session scheduling & attendance', competitor: 'Acuity', price: '£12/mo' },
  { tool: 'Lead & CRM pipeline', competitor: 'Pipedrive', price: '£25/mo' },
  { tool: 'Invoicing & payment tracking', competitor: 'FreshBooks', price: '£15/mo' },
  { tool: 'Client wellness & nutrition tracking', competitor: 'MyFitnessPal Pro', price: '£10/mo' },
  { tool: 'Business analytics & reporting', competitor: 'Tableau', price: '£15/mo' },
]

const PLANS = [
  {
    name: 'Solo',
    tagline: 'Perfect for the self-employed PT',
    price: 39,
    yearlyPrice: 390,
    period: 'mo',
    highlight: false,
    features: [
      '1 trainer account',
      'Unlimited clients',
      'Live session logger',
      'Client portal (all clients)',
      'Workout plan builder',
      'Payment tracking',
      'Lead pipeline',
      'Progress & body metrics',
      'Business dashboard',
      'Email support',
    ],
    cta: 'Start Free Trial',
    ctaNote: '30 days free · No card needed',
  },
  {
    name: 'Studio',
    tagline: 'For gym owners & multi-trainer studios',
    price: 79,
    yearlyPrice: 790,
    period: 'mo',
    highlight: true,
    features: [
      'Up to 5 trainers',
      'Everything in Solo',
      'Team management & permissions',
      'Shared client pool',
      'Manager-level analytics',
      'Staff performance reporting',
      'Priority support',
      'Onboarding call with Darshan',
    ],
    cta: 'Start Free Trial',
    ctaNote: 'Most popular for studios',
    badge: 'Most Popular',
  },
]

export default function PricingSection() {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="pricing" style={{ padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div className="glow-orb glow-blue" style={{ width: 600, height: 600, top: '10%', left: '50%', transform: 'translateX(-50%)', opacity: 0.3 }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          <div className="badge badge-blue" style={{ marginBottom: 20, display: 'inline-flex' }}>The Offer</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 20 }}>
            One investment.{' '}
            <span className="gradient-text">Infinite return.</span>
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.45)', maxWidth: 560, margin: '0 auto 32px' }}>
            Let&apos;s be honest about what this replaces — and what that costs.
          </p>
        </motion.div>

        {/* Value stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20,
            padding: '36px 40px',
            marginBottom: 48,
          }}
          className="value-stack"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>What you&apos;d pay if you bought these separately:</h3>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Monthly equivalent</div>
          </div>

          {VALUE_STACK.map((item, i) => (
            <div
              key={item.tool}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: i < VALUE_STACK.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{item.tool}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>via {item.competitor}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#dc2626', textDecoration: 'line-through', opacity: 0.7 }}>{item.price}</div>
            </div>
          ))}

          <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(220,38,38,0.07)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Total if bought separately</span>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#dc2626', textDecoration: 'line-through' }}>£112/mo</span>
          </div>

          <div style={{ marginTop: 12, padding: '16px 20px', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>DNI Studio — everything above</span>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>+ Live session logger + Client wellness portal (nowhere else)</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: '#60a5fa' }}>£39<span style={{ fontSize: 14, fontWeight: 500 }}>/mo</span></span>
              <div style={{ fontSize: 11, color: '#4ade80', marginTop: 2 }}>You save £73/mo</div>
            </div>
          </div>
        </motion.div>

        {/* Billing toggle */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '6px 6px 6px 18px' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Monthly</span>
            <button
              onClick={() => setYearly(y => !y)}
              style={{
                width: 44, height: 24, borderRadius: 100, border: 'none', cursor: 'pointer',
                background: yearly ? '#2563EB' : 'rgba(255,255,255,0.1)',
                position: 'relative', transition: 'background 0.3s ease',
              }}
            >
              <div style={{
                position: 'absolute', top: 3, left: yearly ? 23 : 3,
                width: 18, height: 18, borderRadius: '50%', background: 'white',
                transition: 'left 0.3s ease',
              }} />
            </button>
            <span style={{ fontSize: 13, color: yearly ? 'white' : 'rgba(255,255,255,0.5)' }}>
              Annual
              <span style={{ marginLeft: 6, fontSize: 11, background: 'rgba(22,163,74,0.15)', color: '#4ade80', padding: '2px 8px', borderRadius: 100, border: '1px solid rgba(22,163,74,0.25)' }}>
                2 months free
              </span>
            </span>
          </div>
        </div>

        {/* Plan cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 48 }} className="plan-grid">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={plan.highlight ? 'pricing-featured' : ''}
              style={{
                borderRadius: 20,
                padding: '32px 36px',
                background: plan.highlight ? 'rgba(37,99,235,0.06)' : 'rgba(255,255,255,0.02)',
                border: plan.highlight ? undefined : '1px solid rgba(255,255,255,0.07)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {plan.badge && (
                <div style={{
                  position: 'absolute', top: 20, right: 20,
                  background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                  color: 'white', fontSize: 11, fontWeight: 700,
                  padding: '4px 12px', borderRadius: 100,
                }}>
                  {plan.badge}
                </div>
              )}

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 4 }}>{plan.name}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{plan.tagline}</div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                  <span style={{ fontSize: 52, fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: '-2px' }}>
                    £{yearly ? Math.floor(plan.yearlyPrice / 12) : plan.price}
                  </span>
                  <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', paddingBottom: 8 }}>/mo</span>
                </div>
                {yearly && (
                  <div style={{ fontSize: 12, color: '#4ade80', marginTop: 4 }}>
                    £{plan.yearlyPrice}/yr — 2 months free
                  </div>
                )}
              </div>

              <a
                href="https://pt-manager.onrender.com/register"
                target="_blank"
                rel="noopener noreferrer"
                className={plan.highlight ? 'btn-primary' : 'btn-ghost'}
                style={{
                  display: 'block', textAlign: 'center', textDecoration: 'none',
                  padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                  marginBottom: 6, position: 'relative', zIndex: 1,
                }}
              >
                {plan.cta}
              </a>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginBottom: 28 }}>
                {plan.ctaNote}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Guarantee + Urgency */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="guarantee-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ background: 'rgba(22,163,74,0.05)', border: '1px solid rgba(22,163,74,0.15)', borderRadius: 16, padding: '24px 28px' }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>🛡️</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 8 }}>30-Day Money-Back Guarantee</div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
              If DNI Studio doesn&apos;t save you at least 5 hours a week in your first 30 days, we&apos;ll refund every penny. No questions asked. No awkward email chains.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: 16, padding: '24px 28px' }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>⚡</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 8 }}>Founding Member Price — Locked In Forever</div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
              Join now and your price is locked in for life — even when we raise rates. This founding price is only available for the first 50 trainers. Once we hit that, it goes up to £69/mo.
            </p>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .plan-grid { grid-template-columns: 1fr !important; }
          .guarantee-grid { grid-template-columns: 1fr !important; }
          .value-stack { padding: 24px 20px !important; }
        }
      `}</style>
    </section>
  )
}
