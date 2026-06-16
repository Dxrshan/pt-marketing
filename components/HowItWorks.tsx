'use client'
import { motion } from 'framer-motion'

const STEPS = [
  {
    number: '01',
    title: 'Set up your studio in minutes',
    desc: 'Add your clients, set up your services, and customise your profile. We walk you through it — no manual, no YouTube tutorials.',
    icon: '⚡',
    color: '#2563EB',
  },
  {
    number: '02',
    title: 'Run your business from one place',
    desc: 'Log sessions, send workout plans, track payments, manage leads. Everything you did across 5 apps — now in one clean dashboard.',
    icon: '🎯',
    color: '#06B6D4',
  },
  {
    number: '03',
    title: 'Watch your clients get results',
    desc: 'Clients log daily wellness, track their own workouts, and see their progress. You get real-time data. They get accountability. Everyone wins.',
    icon: '📈',
    color: '#7c3aed',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: '100px 24px', position: 'relative', background: 'rgba(255,255,255,0.01)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          <div className="badge badge-blue" style={{ marginBottom: 20, display: 'inline-flex' }}>How It Works</div>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            Up and running in{' '}
            <span className="gradient-text">under 10 minutes.</span>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, position: 'relative' }} className="steps-grid">
          {/* Connector line */}
          <div style={{
            position: 'absolute', top: 36, left: '17%', right: '17%', height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.3), rgba(6,182,212,0.3), transparent)',
          }} className="connector-line" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: `${step.color}15`,
                border: `1px solid ${step.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: 28,
                position: 'relative', zIndex: 1,
              }}>
                {step.icon}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: step.color, letterSpacing: '2px', marginBottom: 10 }}>
                STEP {step.number}
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, color: 'white', letterSpacing: '-0.5px', marginBottom: 12, lineHeight: 1.3 }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .steps-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .connector-line { display: none !important; }
        }
      `}</style>
    </section>
  )
}
