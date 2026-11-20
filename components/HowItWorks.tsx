'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SectionHead, Icon } from './fx'

const STEPS = [
  { number: '01', icon: 'bolt',   title: 'Set up in minutes',          desc: 'Add your clients, services and branding. We migrate your data and walk you through it, so there is no manual to read.' },
  { number: '02', icon: 'layers', title: 'Run everything in one place', desc: 'Sessions, plans, payments and leads that used to live in five apps now sit in one clean dashboard.' },
  { number: '03', icon: 'trend',  title: 'Watch clients get results',   desc: 'Clients log workouts and wellness in their own app. You see real data, they get accountability, and they stay longer.' },
]

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const line = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="how-it-works" style={{ padding: '120px 24px 140px', position: 'relative' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <SectionHead eyebrow="How it works" title="Up and running in" accent="under 10 minutes." />

        <div ref={ref} className="steps" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, marginTop: 80 }}>
          {/* Track + scroll-drawn line */}
          <div className="steps-line" aria-hidden="true" style={{ position: 'absolute', top: 31, left: '16.6%', right: '16.6%', height: 1, background: 'rgba(255,255,255,0.08)' }}>
            <motion.div style={{ scaleX: line, transformOrigin: '0% 50%', height: '100%', background: 'linear-gradient(90deg, #9aa0a8, #ffffff, #9aa0a8)', boxShadow: '0 0 12px rgba(255,255,255,0.6)' }} />
          </div>

          {STEPS.map((s, i) => {
            const start = i / STEPS.length
            return <Step key={s.number} step={s} progress={scrollYProgress} at={start} />
          })}
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .steps { grid-template-columns: 1fr !important; gap: 44px !important; }
          .steps-line { display: none; }
        }
      `}</style>
    </section>
  )
}

function Step({ step, progress, at }: { step: typeof STEPS[number]; progress: ReturnType<typeof useScroll>['scrollYProgress']; at: number }) {
  const lit = useTransform(progress, [Math.max(0, at - 0.05), at + 0.12], [0, 1])
  const glow = useTransform(lit, v => `0 0 0 1px rgba(255,255,255,${0.1 + v * 0.4}), 0 0 ${v * 40}px rgba(230,236,245,${v * 0.35})`)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ textAlign: 'center', position: 'relative' }}
    >
      <motion.div style={{
        width: 64, height: 64, borderRadius: 20, margin: '0 auto', position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f2f3f5',
        background: 'linear-gradient(160deg, #2a2e35 0%, #121418 70%)', boxShadow: glow,
      }}>
        <Icon name={step.icon} size={26} />
      </motion.div>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.2em', color: 'var(--steel-3)', marginTop: 24 }}>STEP {step.number}</div>
      <h3 style={{ fontSize: 22, fontWeight: 750, letterSpacing: '-0.02em', marginTop: 10 }}>{step.title}</h3>
      <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text-muted)', marginTop: 10, maxWidth: 330, marginLeft: 'auto', marginRight: 'auto' }}>{step.desc}</p>
    </motion.div>
  )
}
