'use client'
// Full-screen, scroll-driven scenes for the home page (Apple-style product story).
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion'
import BrandLogo from './BrandLogo'
import { DashboardMockup, LiveToasts, LiveSessionCard } from './Hero'
import { LoggerDemo, ChatDemo, RevenueDemo, PipelineDemo, PhoneDemo } from './FeaturesSection'
import { Icon, Counter, CursorLight } from './fx'

const EASE = [0.22, 1, 0.36, 1] as const

function useMedia(q: string) {
  const [m, setM] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setM(mq.matches)
    on(); mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}

/* Slowly rising specks of light. */
function Dust({ count = 26 }: { count?: number }) {
  const specks = Array.from({ length: count }, (_, i) => ({
    left: (i * 37) % 100, size: 1 + ((i * 7) % 3), dur: 14 + ((i * 13) % 12), delay: -((i * 5) % 20), op: 0.15 + ((i * 11) % 5) / 12,
  }))
  return (
    <div aria-hidden="true" className="dust" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {specks.map((s, i) => (
        <span key={i} style={{
          position: 'absolute', bottom: -10, left: `${s.left}%`, width: s.size, height: s.size, borderRadius: '50%',
          background: '#fff', opacity: s.op, boxShadow: '0 0 6px rgba(255,255,255,.8)',
          animation: `dust-rise ${s.dur}s linear ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  )
}

/* ── 1. Opening: giant metal mark, huge headline, fly-through on scroll ── */
export function CineHero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const markScale = useTransform(scrollYProgress, [0, 0.6], reduce ? [1, 1] : [1, 2.8])
  const markOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const textOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -120])
  const textScale = useTransform(scrollYProgress, [0, 0.3], reduce ? [1, 1] : [1, 1.12])
  const [markH, setMarkH] = useState(240)
  useEffect(() => {
    const set = () => setMarkH(Math.round(Math.min(Math.max(window.innerHeight * 0.26, 140), 300)))
    set(); window.addEventListener('resize', set)
    return () => window.removeEventListener('resize', set)
  }, [])

  return (
    <section ref={ref} id="hero" style={{ height: '170vh', position: 'relative' }}>
      <div className="grain" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse 80% 60% at 50% 38%, #1a1d23 0%, #0b0c0f 55%, #050607 100%)' }}>
        <CursorLight size={900} opacity={0.07} />
        <Dust />
        {/* Rotating light beams */}
        <div aria-hidden="true" className="beams" style={{
          position: 'absolute', top: '38%', left: '50%', width: 1600, height: 1600, marginLeft: -800, marginTop: -800, pointerEvents: 'none', opacity: 0.55,
          background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.05) 8deg, transparent 18deg, transparent 90deg, rgba(255,255,255,0.04) 100deg, transparent 112deg, transparent 200deg, rgba(255,255,255,0.05) 210deg, transparent 222deg, transparent 290deg, rgba(255,255,255,0.035) 300deg, transparent 312deg)',
          WebkitMaskImage: 'radial-gradient(circle, #000 0%, transparent 60%)', maskImage: 'radial-gradient(circle, #000 0%, transparent 60%)',
        }} />

        <motion.div style={{ scale: markScale, opacity: markOpacity, position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, scale: 0.7, filter: 'blur(18px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 1.6, ease: EASE }}>
            <div style={{ position: 'absolute', inset: '-30%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(225,232,242,0.22), transparent 62%)', filter: 'blur(10px)' }} />
            <BrandLogo variant="mark" height={markH} alt="DNI Studios" />
          </motion.div>
        </motion.div>

        <motion.div style={{ opacity: textOpacity, y: textY, scale: textScale, position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 20px', marginTop: 34 }}>
          <motion.div initial={{ opacity: 0, letterSpacing: '0.6em' }} animate={{ opacity: 1, letterSpacing: '0.32em' }} transition={{ duration: 1.6, delay: 0.5, ease: EASE }}
            style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', color: 'var(--steel-3)' }}>
            Studio software for personal trainers
          </motion.div>
          <h1 style={{ fontSize: 'clamp(52px, 9.5vw, 150px)', fontWeight: 800, letterSpacing: '-0.055em', lineHeight: 0.92, marginTop: 18 }}>
            <motion.span className="steel-text" style={{ display: 'block' }} initial={{ opacity: 0, y: 40, filter: 'blur(14px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1.3, delay: 0.7, ease: EASE }}>
              Run your studio.
            </motion.span>
            <motion.span className="sheen-text" style={{ display: 'block' }} initial={{ opacity: 0, y: 40, filter: 'blur(14px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1.3, delay: 0.95, ease: EASE }}>
              Beautifully.
            </motion.span>
          </h1>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.35, ease: EASE }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 40 }}>
            <a href="#waitlist" className="btn-steel" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 30px', borderRadius: 999, fontSize: 16, textDecoration: 'none' }}>
              Start free trial <Icon name="arrow" size={17} />
            </a>
            <a href="#story" className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 28px', borderRadius: 999, fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>
              Watch it work
            </a>
          </motion.div>
        </motion.div>

        <motion.div style={{ opacity: textOpacity, position: 'absolute', bottom: 34, left: '50%', x: '-50%', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, fontSize: 11, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--steel-4)' }}>
          Scroll
          <span style={{ width: 1, height: 44, background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
            <span className="scroll-cue" style={{ position: 'absolute', left: 0, top: 0, width: 1, height: 18, background: 'linear-gradient(transparent, #fff)' }} />
          </span>
        </motion.div>
      </div>
    </section>
  )
}

/* ── 2. Product reveal: dashboard rises, flattens, zooms; captions cycle ── */
const CAPTIONS = ['Every client.', 'Every session.', 'Every pound.']

function Caption({ text, i, p }: { text: string; i: number; p: MotionValue<number> }) {
  const a = 0.08 + i * 0.24
  const opacity = useTransform(p, [a, a + 0.06, a + 0.18, a + 0.24], [0, 1, 1, i === CAPTIONS.length - 1 ? 1 : 0])
  const y = useTransform(p, [a, a + 0.06, a + 0.18, a + 0.24], [40, 0, 0, i === CAPTIONS.length - 1 ? 0 : -40])
  const blur = useTransform(p, [a, a + 0.06, a + 0.18, a + 0.24], ['blur(12px)', 'blur(0px)', 'blur(0px)', i === CAPTIONS.length - 1 ? 'blur(0px)' : 'blur(12px)'])
  return (
    <motion.div style={{ opacity, y, filter: blur, position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center' }}>
      <span className="steel-text" style={{ fontSize: 'clamp(40px, 6.4vw, 104px)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1 }}>{text}</span>
    </motion.div>
  )
}

export function ProductReveal() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const y = useTransform(p, [0, 0.3], reduce ? ['0vh', '0vh'] : ['38vh', '6vh'])
  const rotateX = useTransform(p, [0, 0.35], reduce ? [0, 0] : [48, 0])
  const scale = useTransform(p, [0, 0.35, 1], reduce ? [1, 1, 1] : [0.62, 0.92, 1.04])
  const opacity = useTransform(p, [0, 0.1], [0, 1])
  const glow = useTransform(p, [0.1, 0.4], [0, 1])

  return (
    <section ref={ref} id="story" style={{ height: '320vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#050607' }}>
        <div style={{ position: 'absolute', top: '9vh', left: 0, right: 0, height: 110, zIndex: 3 }}>
          {CAPTIONS.map((c, i) => <Caption key={c} text={c} i={i} p={p} />)}
        </div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 1400, paddingTop: '14vh' }}>
          <motion.div style={{ opacity: glow, position: 'absolute', width: '80vw', height: '60vh', top: '30vh', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(220,228,240,0.16), transparent 65%)', filter: 'blur(30px)' }} />
          <motion.div style={{ y, rotateX, scale, opacity, transformOrigin: '50% 100%', width: 'min(1100px, 92vw)', position: 'relative' }}>
            <div style={{ position: 'relative', padding: 10, borderRadius: 24, background: 'linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03))', border: '1px solid rgba(255,255,255,0.14)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 80px 160px -40px rgba(0,0,0,1)' }}>
              <DashboardMockup />
              <LiveToasts />
              <LiveSessionCard />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── 3. Statement: each word lights up as you scroll ─────────────────── */
const STATEMENT = 'Built for personal trainers who are done running a serious business from a group chat, a spreadsheet and five different apps.'

function Word({ w, i, n, p }: { w: string; i: number; n: number; p: MotionValue<number> }) {
  const start = 0.1 + (i / n) * 0.7
  const opacity = useTransform(p, [start, start + 0.06], [0.12, 1])
  const highlight = ['group', 'chat,', 'spreadsheet', 'five', 'apps.'].includes(w)
  return <motion.span style={{ opacity }} className={highlight ? 'sheen-text' : undefined}>{w} </motion.span>
}

export function Statement() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const words = STATEMENT.split(' ')
  return (
    <section ref={ref} style={{ height: '220vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6vw', background: 'radial-gradient(ellipse 60% 50% at 50% 50%, #111317, #050607 70%)' }}>
        <p style={{ fontSize: 'clamp(32px, 5vw, 80px)', fontWeight: 750, letterSpacing: '-0.04em', lineHeight: 1.08, maxWidth: 1250, color: '#f2f3f5' }}>
          {words.map((w, i) => <Word key={i} w={w} i={i} n={words.length} p={p} />)}
        </p>
      </div>
    </section>
  )
}

/* ── 4. Horizontal feature gallery ───────────────────────────────────── */
const PANELS: { n: string; kicker: string; title: string; sub: string; demo: ReactNode }[] = [
  { n: '01', kicker: 'Live session logger', title: 'Every set.\nLogged live.', sub: 'Weights, reps and rest, mid-session. PBs spotted automatically.', demo: <LoggerDemo /> },
  { n: '02', kicker: 'AI assistant', title: 'Ask.\nIt’s done.', sub: 'Book sessions and chase payments in plain English.', demo: <ChatDemo /> },
  { n: '03', kicker: 'Payments', title: 'Every pound.\nAccounted for.', sub: 'Overdue accounts flagged. Receipts sent. No awkward chasing.', demo: <RevenueDemo /> },
  { n: '04', kicker: 'Lead pipeline', title: 'No lead\nleft behind.', sub: 'From first enquiry to paying client, all in one view.', demo: <PipelineDemo /> },
  { n: '05', kicker: 'Client app', title: 'Your studio.\nIn their pocket.', sub: 'Workouts, nutrition, wellness and streaks for every client.', demo: <PhoneDemo /> },
]

function Panel({ panel, wide }: { panel: typeof PANELS[number]; wide: boolean }) {
  return (
    <div style={{
      width: wide ? '100vw' : '100%', height: wide ? '100vh' : 'auto', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: wide ? '0 7vw' : '80px 22px',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: wide ? '1fr 1fr' : '1fr', gap: wide ? '6vw' : 36, alignItems: 'center', width: '100%', maxWidth: 1280 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span className="steel-text" style={{ fontSize: 22, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{panel.n}</span>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--steel-3)' }}>{panel.kicker}</span>
          </div>
          <h3 className="steel-text" style={{ fontSize: 'clamp(44px, 6.2vw, 104px)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 0.95, marginTop: 22, whiteSpace: 'pre-line' }}>{panel.title}</h3>
          <p style={{ fontSize: 'clamp(17px, 1.5vw, 21px)', lineHeight: 1.55, color: 'var(--text-muted)', marginTop: 22, maxWidth: 460 }}>{panel.sub}</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: '-15%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,228,240,0.12), transparent 62%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
          <div className="spot" style={{ position: 'relative', padding: 30, borderRadius: 28, background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', boxShadow: '0 60px 120px -40px rgba(0,0,0,1), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
            {panel.demo}
          </div>
        </div>
      </div>
    </div>
  )
}

export function FeatureGallery() {
  const ref = useRef<HTMLElement>(null)
  const wide = useMedia('(min-width: 900px)')
  const reduce = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(p, [0.05, 0.95], ['0vw', `-${(PANELS.length - 1) * 100}vw`])
  const bar = useTransform(p, [0.05, 0.95], [0, 1])

  if (!wide || reduce) {
    return (
      <section id="features" style={{ background: '#050607' }}>
        {PANELS.map(pn => <Panel key={pn.n} panel={pn} wide={false} />)}
      </section>
    )
  }
  return (
    <section ref={ref} id="features" style={{ height: `${PANELS.length * 100}vh`, position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: 'radial-gradient(ellipse 70% 60% at 50% 50%, #101216, #050607 75%)' }}>
        <motion.div style={{ x, display: 'flex', height: '100%' }}>
          {PANELS.map(pn => <Panel key={pn.n} panel={pn} wide />)}
        </motion.div>
        <div style={{ position: 'absolute', left: '7vw', right: '7vw', bottom: 44, height: 2, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
          <motion.div style={{ scaleX: bar, transformOrigin: '0% 50%', height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #9aa0a8, #fff)', boxShadow: '0 0 12px rgba(255,255,255,.5)' }} />
        </div>
      </div>
    </section>
  )
}

/* ── 5. Giant numbers ────────────────────────────────────────────────── */
const NUMBERS = [
  { to: 10, prefix: '<', suffix: '', unit: 'min', label: 'to set up your studio' },
  { to: 0, prefix: '£', suffix: '', unit: '', label: 'per-seat fees, ever' },
  { to: 30, prefix: '', suffix: '', unit: 'days', label: 'free trial, no card' },
  { to: 1, prefix: '', suffix: '', unit: 'app', label: 'instead of five' },
]

export function BigNumbers() {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 6vw', background: '#050607', position: 'relative' }}>
      <div className="big-nums" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4vw', width: '100%', maxWidth: 1400, margin: '0 auto' }}>
        {NUMBERS.map((n, i) => (
          <motion.div key={n.label}
            initial={{ opacity: 0, y: 60, filter: 'blur(12px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.1, delay: i * 0.12, ease: EASE }}
            style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 28 }}>
            <div className="steel-text" style={{ fontSize: 'clamp(64px, 9vw, 150px)', fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>
              <Counter to={n.to} prefix={n.prefix} suffix={n.suffix} duration={2} />
              {n.unit && <span style={{ fontSize: '0.32em', letterSpacing: '-0.02em', marginLeft: 8 }}>{n.unit}</span>}
            </div>
            <div style={{ fontSize: 'clamp(15px, 1.3vw, 19px)', color: 'var(--text-muted)', marginTop: 16 }}>{n.label}</div>
          </motion.div>
        ))}
      </div>
      <style>{`@media (max-width: 900px) { .big-nums { grid-template-columns: 1fr 1fr !important; gap: 48px 24px !important; } }`}</style>
    </section>
  )
}
