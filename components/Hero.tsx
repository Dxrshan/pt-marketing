'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import BrandLogo from './BrandLogo'
import { WordsReveal, CursorLight, Icon, Tilt } from './fx'

const EASE = [0.22, 1, 0.36, 1] as const

/* ── Dashboard mockup (graphite build of the real app) ─────────────────── */
function DashboardMockup() {
  const nav = ['Dashboard', 'Clients', 'Bookings', 'Workout Plans', 'Progress', 'Payments', 'Leads']
  const week = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  return (
    <div className="app-mockup" style={{ display: 'flex', minHeight: 440 }}>
      <div className="mockup-sidebar hero-mock-side" style={{ width: 180, padding: '16px 0' }}>
        <div style={{ padding: '2px 14px 18px' }}><BrandLogo height={16} /></div>
        {nav.map((n, i) => (
          <div key={n} className={`mockup-nav-item ${i === 0 ? 'active' : ''}`}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: i === 0 ? '#e8eaee' : 'transparent' }} />{n}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f2f3f5' }}>Good morning, Darshan</div>
            <div style={{ fontSize: 10.5, color: '#6b717b', marginTop: 2 }}>Monday, 16 June 2026</div>
          </div>
          <span style={{ fontSize: 10, color: '#9aa0a8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, padding: '4px 10px' }}>This week</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            ['Today’s sessions', '4', '2 completed'],
            ['Revenue this month', '£3,840', '+12% vs last month'],
            ['Active clients', '18', '3 need attention'],
          ].map(([k, v, s], i) => (
            <div key={k} className="mockup-card">
              <div style={{ fontSize: 9.5, color: '#6b717b' }}>{k}</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: i === 1 ? '#8ff0bf' : '#f2f3f5', letterSpacing: '-0.02em' }}>{v}</div>
              <div style={{ fontSize: 9, color: '#5a6069', marginTop: 2 }}>{s}</div>
            </div>
          ))}
        </div>
        <div className="mockup-card" style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#e8eaee', marginBottom: 8 }}>
            Action items <span style={{ color: '#9aa0a8', fontWeight: 500, fontSize: 10 }}>3 items</span>
          </div>
          {[
            ['J', 'James T.', 'Payment overdue · £240', '#f87171'],
            ['S', 'Sarah K.', 'No session in 14 days', '#fbbf24'],
            ['M', 'Marcus L.', '2 sessions left in package', '#a9c7ff'],
          ].map(([a, n, d, c]) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#e8eaee', background: 'linear-gradient(160deg,#2a2e35,#15171c)', border: '1px solid rgba(255,255,255,0.08)' }}>{a}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: '#e8eaee' }}>{n}</div>
                <div style={{ fontSize: 9.5, color: '#6b717b' }}>{d}</div>
              </div>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />
            </div>
          ))}
        </div>
        <div className="mockup-card">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#e8eaee', marginBottom: 8 }}>This week</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {week.map((d, i) => (
              <div key={i} style={{
                textAlign: 'center', fontSize: 9.5, fontWeight: 700, padding: '6px 0', borderRadius: 6,
                color: i < 2 ? '#0b0c0f' : i === 2 ? '#0b0c0f' : '#5a6069',
                background: i < 2 ? 'linear-gradient(180deg,#8ff0bf,#5ee0a0)' : i === 2 ? 'linear-gradient(180deg,#fff,#c4c9d0)' : 'rgba(255,255,255,0.04)',
              }}>{d}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Floating live toasts that cycle over the mockup ───────────────────── */
const TOASTS = [
  { icon: 'card', title: 'Payment received', sub: 'Sarah K. · £59.00', tone: '#8ff0bf' },
  { icon: 'bolt', title: 'New PB', sub: 'Marcus L. · Bench 85kg', tone: '#e8eaee' },
  { icon: 'calendar', title: 'Session booked', sub: 'Thu 10:00 · James T.', tone: '#a9c7ff' },
  { icon: 'funnel', title: 'New enquiry', sub: 'Priya M. · via website', tone: '#e8eaee' },
]

function LiveToasts() {
  const [i, setI] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setI(v => (v + 1) % TOASTS.length), 2600)
    return () => clearInterval(t)
  }, [reduce])
  const t = TOASTS[i]
  return (
    <div className="hero-toast-wrap" style={{ position: 'absolute', right: -28, top: 56, zIndex: 3, width: 250 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 30, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.98 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14,
            background: 'rgba(18,20,24,0.82)', border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
            boxShadow: '0 20px 50px -15px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <span style={{ width: 34, height: 34, borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: t.tone, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Icon name={t.icon} size={17} />
          </span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f2f3f5' }}>{t.title}</div>
            <div style={{ fontSize: 12, color: '#8c929b', marginTop: 1 }}>{t.sub}</div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function LiveSessionCard() {
  return (
    <div className="float-animation hero-live" style={{
      position: 'absolute', left: -36, bottom: 64, zIndex: 3, width: 230, padding: 14, borderRadius: 16,
      background: 'rgba(18,20,24,0.85)', border: '1px solid rgba(255,255,255,0.12)',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      boxShadow: '0 24px 60px -18px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10.5, color: '#8c929b', marginBottom: 8 }}>
        <span className="live-dot" /> LIVE SESSION · Marcus L.
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#f2f3f5', marginBottom: 8 }}>Bench press</div>
      {[['Set 1', '80kg × 8'], ['Set 2', '82.5kg × 8'], ['Set 3', '85kg × 6 · PB']].map(([s, v], i) => (
        <div key={s} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, padding: '4px 0', color: i === 2 ? '#fff' : '#b6bcc5', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ color: '#6b717b' }}>{s}</span><span style={{ fontWeight: 600 }}>{v}</span>
        </div>
      ))}
      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', fontSize: 11, color: '#c3c8cf' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="timer" size={13} /> Rest</span>
        <span style={{ fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>0:42</span>
      </div>
    </div>
  )
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // The dashboard starts tilted back like a screen on a desk and straightens as you scroll.
  const rotateX = useTransform(scrollYProgress, [0, 0.45], reduce ? [0, 0] : [24, 0])
  const scale = useTransform(scrollYProgress, [0, 0.45], reduce ? [1, 1] : [0.9, 1])
  const glowOpacity = useTransform(scrollYProgress, [0, 0.4], [0.9, 0.35])

  return (
    <section ref={ref} id="hero" className="mesh-bg grain" style={{ position: 'relative', overflow: 'hidden', paddingTop: 150, paddingBottom: 60 }}>
      <CursorLight size={800} opacity={0.08} />
      <div className="grid-floor" />
      {/* Top light beam */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: -200, left: '50%', width: 1100, height: 700, transform: 'translateX(-50%)', pointerEvents: 'none',
        background: 'conic-gradient(from 180deg at 50% 0%, transparent 150deg, rgba(220,228,240,0.10) 175deg, rgba(255,255,255,0.16) 180deg, rgba(220,228,240,0.10) 185deg, transparent 210deg)',
        filter: 'blur(10px)',
      }} />

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
          <a href="/pricing" className="badge badge-blue" style={{ textDecoration: 'none', marginBottom: 28 }}>
            <span className="live-dot" />
            Founding studio access is open
            <span style={{ color: 'var(--steel-3)', display: 'inline-flex' }}><Icon name="arrow" size={14} /></span>
          </a>
        </motion.div>

        <h1 style={{ fontSize: 'clamp(44px, 8vw, 104px)', fontWeight: 800, lineHeight: 0.98, letterSpacing: '-0.05em', margin: '0 auto', maxWidth: 1050 }}>
          <WordsReveal text="Run your studio." className="steel-text" delay={0.1} />
          <br />
          <WordsReveal text="Not a group chat." className="sheen-text" delay={0.4} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
          style={{ fontSize: 'clamp(17px, 1.6vw, 20px)', lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: 640, margin: '28px auto 0' }}
        >
          Clients, sessions, payments and leads in one beautifully simple platform, built for personal trainers who are done juggling WhatsApp, spreadsheets and five different apps.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.05, ease: EASE }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 38 }}
        >
          <a href="#waitlist" className="btn-steel" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 28px', borderRadius: 14, fontSize: 16, textDecoration: 'none' }}>
            Start your free trial <Icon name="arrow" size={17} />
          </a>
          <a href="/features" className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 26px', borderRadius: 14, fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>
            Explore features
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.3 }}
          style={{ display: 'flex', gap: 22, justifyContent: 'center', flexWrap: 'wrap', marginTop: 22, fontSize: 13.5, color: 'var(--text-subtle)' }}
        >
          {['30-day free trial', 'No card needed', 'Unlimited clients', 'UK-built'].map(t => (
            <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Icon name="check" size={14} style={{ color: 'var(--steel-2)' }} />{t}</span>
          ))}
        </motion.div>

        {/* Product shot */}
        <motion.div
          initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 1.1, ease: EASE }}
          style={{ marginTop: 70, perspective: 1600, position: 'relative' }}
        >
          <motion.div aria-hidden="true" style={{
            position: 'absolute', inset: '-8% 6% 20%', borderRadius: 40, pointerEvents: 'none', opacity: glowOpacity,
            background: 'radial-gradient(ellipse at 50% 40%, rgba(220,228,240,0.22), transparent 65%)', filter: 'blur(30px)',
          }} />
          <motion.div style={{ rotateX, scale, transformOrigin: '50% 0%', maxWidth: 980, margin: '0 auto', position: 'relative' }}>
            <Tilt max={5}>
              <div style={{
                position: 'relative', padding: 10, borderRadius: 22, textAlign: 'left',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
              }}>
                <div style={{ display: 'flex', gap: 6, padding: '4px 6px 10px' }}>
                  {[0, 1, 2].map(d => <span key={d} style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(255,255,255,0.18)' }} />)}
                  <span style={{ flex: 1, textAlign: 'center', fontSize: 11, color: '#6b717b', marginRight: 36 }}>app.dnianalytics.com</span>
                </div>
                <DashboardMockup />
                <LiveToasts />
                <LiveSessionCard />
              </div>
            </Tilt>
          </motion.div>
          {/* Reflection fade into the page */}
          <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: -2, height: 160, background: 'linear-gradient(to bottom, transparent, var(--bg))', pointerEvents: 'none', zIndex: 4 }} />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .hero-mock-side { display: none; }
          .hero-toast-wrap { right: 8px !important; top: -18px !important; width: 220px !important; }
          .hero-live { display: none; }
        }
      `}</style>
    </section>
  )
}
