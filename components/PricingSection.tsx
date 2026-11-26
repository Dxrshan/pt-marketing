'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHead, Icon, Reveal } from './fx'

const EASE = [0.22, 1, 0.36, 1] as const

const BILLING = {
  monthly:   { price: 69, label: 'Billed monthly',             saving: null },
  quarterly: { price: 59, label: 'Billed £177 every 3 months', saving: 'Save 14%' },
  annual:    { price: 49, label: 'Billed £588 once a year',     saving: 'Save 29%' },
} as const

type Term = keyof typeof BILLING

const INCLUDED = [
  'Unlimited clients & sessions',
  'Live session logger with PB tracking',
  'Client app for every client',
  'Daily wellness & progress tracking',
  'AI assistant (staff + client)',
  'Lead pipeline & CRM',
  'Payments, invoicing & receipts',
  'Smart dashboard & action items',
  'Team roles & permissions',
  'Priority onboarding support',
]

export default function PricingSection({ bare = false }: { bare?: boolean }) {
  const [term, setTerm] = useState<Term>('quarterly')
  const plan = BILLING[term]

  return (
    <section id="pricing" style={{ padding: '140px 24px', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden="true" style={{ position: 'absolute', width: 900, height: 700, top: '25%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', filter: 'blur(80px)', opacity: 0.45, background: 'radial-gradient(circle at 30% 40%, #2f7bff, transparent 50%), radial-gradient(circle at 70% 40%, #ff4fa3, transparent 50%), radial-gradient(circle at 50% 75%, #8b5cff, transparent 55%)' }} />

      <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {!bare && <SectionHead
          eyebrow="Founding pricing"
          title="One price."
          accent="Everything included."
          sub="No tiers, no per-seat fees, no surprises. Lock in your founding rate and it never goes up."
        />}

        {/* Billing toggle with sliding pill */}
        <Reveal delay={0.1} style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
          <div role="radiogroup" aria-label="Billing term" style={{ display: 'inline-flex', padding: 5, borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
            {(Object.keys(BILLING) as Term[]).map(t => {
              const on = term === t
              return (
                <button key={t} role="radio" aria-checked={on} onClick={() => setTerm(t)}
                  style={{ position: 'relative', border: 'none', background: 'none', cursor: 'pointer', padding: '10px 20px', borderRadius: 999, fontFamily: 'inherit', fontSize: 14, fontWeight: 650, color: on ? '#0b0c0f' : 'rgba(255,255,255,0.6)', transition: 'color .3s' }}>
                  {on && <motion.span layoutId="term-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'linear-gradient(180deg,#fff,#c9ced5)', boxShadow: '0 6px 20px -6px rgba(220,226,235,.5)' }} />}
                  <span style={{ position: 'relative' }}>
                    {t[0].toUpperCase() + t.slice(1)}
                    {BILLING[t].saving && <span style={{ marginLeft: 6, fontSize: 11, color: on ? '#2f7d4f' : '#8ff0bf' }}>−{BILLING[t].saving.split(' ')[1]}</span>}
                  </span>
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Card with a ring of light running around its edge */}
        <Reveal delay={0.15} style={{ marginTop: 34 }}>
          <div className="spectrum-ring" style={{ borderRadius: 26 }}>
            <div className="pricing-featured" style={{ borderRadius: 25, padding: '40px 40px 36px', background: 'radial-gradient(120% 120% at 0% 0%, #1d2026 0%, #111317 45%, #0b0c0f 100%)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--steel-3)' }}>DNI Studios · Founding</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 14, height: 84, overflow: 'hidden' }}>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span key={plan.price}
                        initial={{ y: 60, opacity: 0, filter: 'blur(8px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }} exit={{ y: -60, opacity: 0, filter: 'blur(8px)' }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="steel-text" style={{ fontSize: 84, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                        £{plan.price}
                      </motion.span>
                    </AnimatePresence>
                    <span style={{ fontSize: 17, color: 'var(--text-muted)' }}>/month</span>
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>{plan.label}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  <span className="badge badge-blue"><Icon name="lock" size={13} /> Rate locked for life</span>
                  {plan.saving && <span className="badge badge-green">{plan.saving} vs monthly</span>}
                </div>
              </div>

              <a href="/#waitlist" className="btn-spectrum" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 17, borderRadius: 14, fontSize: 16, textDecoration: 'none', marginTop: 30 }}>
                Claim founding price <Icon name="arrow" size={17} />
              </a>
              <p style={{ fontSize: 13, color: 'var(--text-subtle)', textAlign: 'center', marginTop: 12 }}>30-day money-back guarantee · No lock-in · Unlimited clients</p>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 30, paddingTop: 26 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--steel-3)', textTransform: 'uppercase', letterSpacing: '.16em', marginBottom: 16 }}>Everything included</p>
                <div className="incl" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
                  {INCLUDED.map((item, i) => (
                    <motion.div key={item}
                      initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.04, ease: EASE }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14.5, color: 'rgba(255,255,255,0.78)' }}>
                      <span style={{ width: 20, height: 20, borderRadius: 7, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#0b0c0f', background: 'linear-gradient(180deg,#fff,#b9bec6)' }}>
                        <Icon name="check" size={12} stroke={2.4} />
                      </span>
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="guarantee-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 18 }}>
          {[
            ['shield', '30-day money-back', 'Not the right fit within 30 days? Full refund of your first payment, no questions.'],
            ['lock', 'Price locked forever', 'Founding pricing is only for the first 50 studios. After that, it goes up.'],
          ].map(([icon, t, d], i) => (
            <Reveal key={t} delay={0.1 + i * 0.08}>
              <div className="spot" style={{ padding: '20px 22px', height: '100%' }}>
                <span style={{ color: 'var(--steel-1)' }}><Icon name={icon} size={22} /></span>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 10 }}>{t}</div>
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 6 }}>{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .guarantee-grid, .incl { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
