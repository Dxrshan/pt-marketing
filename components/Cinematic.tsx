'use client'
// Full-screen, scroll-driven scenes for the home page (Apple-style product story).
import React, { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, useMotionValue, useSpring, useMotionTemplate, type MotionValue } from 'framer-motion'
import BrandLogo from './BrandLogo'
import { DashboardMockup, LiveToasts, LiveSessionCard, PhoneInCrater } from './Hero'
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

/* Drifting colour glow. colors: 3-4 css colours. */
function Aurora({ colors, style }: { colors: string[]; style?: React.CSSProperties }) {
  const spots = [[10, 20, 55], [55, 5, 60], [30, 55, 50], [65, 50, 45]]
  return (
    <div aria-hidden="true" className="aurora" style={{ inset: 0, ...style }}>
      {colors.map((c, i) => {
        const [l, t, sz] = spots[i % spots.length]
        return <span key={i} style={{ left: `${l}%`, top: `${t}%`, width: `${sz}%`, height: `${sz}%`, background: `radial-gradient(circle, ${c} 0%, transparent 65%)`, animationDelay: `${-i * 4}s`, animationDuration: `${14 + i * 3}s` }} />
      })}
    </div>
  )
}

/* Metal mark that tilts toward the cursor, with a light gliding across it. */
function InteractiveMark({ height }: { height: number }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0.5), my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 90, damping: 18 }), sy = useSpring(my, { stiffness: 90, damping: 18 })
  const rotateY = useTransform(sx, [0, 1], reduce ? [0, 0] : [-22, 22])
  const rotateX = useTransform(sy, [0, 1], reduce ? [0, 0] : [16, -16])
  const lx = useTransform(sx, [0, 1], ['10%', '90%']), ly = useTransform(sy, [0, 1], ['10%', '90%'])
  const shine = useMotionTemplate`radial-gradient(circle at ${lx} ${ly}, rgba(255,255,255,0.75), rgba(255,255,255,0) 38%)`
  useEffect(() => {
    if (reduce) return
    const move = (e: MouseEvent) => { mx.set(e.clientX / window.innerWidth); my.set(e.clientY / window.innerHeight) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [reduce, mx, my])
  const width = Math.round(height * 822 / 598)
  return (
    <div style={{ perspective: 900 }}>
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d', position: 'relative', width, height }}>
        <BrandLogo variant="mark" height={height} alt="DNI Studios" priority />
        <motion.div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: shine, mixBlendMode: 'overlay',
          WebkitMask: 'url(/logo-mark-clear.webp?v=5) center / contain no-repeat', mask: 'url(/logo-mark-clear.webp?v=5) center / contain no-repeat',
        }} />
      </motion.div>
    </div>
  )
}

/* Dot grid that lights up around the cursor. */
function DotGrid() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current, parent = el?.parentElement
    if (!el || !parent) return
    const move = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect()
      el.style.setProperty('--dx', `${e.clientX - r.left}px`); el.style.setProperty('--dy', `${e.clientY - r.top}px`)
    }
    parent.addEventListener('mousemove', move)
    return () => parent.removeEventListener('mousemove', move)
  }, [])
  return (
    <div ref={ref} aria-hidden="true" style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: 'radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1.2px)', backgroundSize: '28px 28px',
      WebkitMaskImage: 'radial-gradient(260px circle at var(--dx, -500px) var(--dy, -500px), #000 0%, transparent 70%)',
      maskImage: 'radial-gradient(260px circle at var(--dx, -500px) var(--dy, -500px), #000 0%, transparent 70%)',
    }} />
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
    const set = () => setMarkH(Math.round(Math.min(Math.max(window.innerHeight * 0.26, 110), 300, window.innerWidth * 0.36)))
    set(); window.addEventListener('resize', set)
    return () => window.removeEventListener('resize', set)
  }, [])

  return (
    <section ref={ref} id="hero" className="cine-hero" style={{ position: 'relative' }}>
      <div className="grain" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse 80% 60% at 50% 38%, #1a1d23 0%, #0b0c0f 55%, #050607 100%)' }}>
        <CursorLight size={900} opacity={0.07} />
        <DotGrid />
        <Aurora colors={['rgba(47,123,255,0.55)', 'rgba(139,92,255,0.5)', 'rgba(255,79,163,0.42)', 'rgba(255,138,61,0.35)']} style={{ inset: '-10% 5% 15%', opacity: 0.6 }} />
        <Dust />
        {/* Rotating light beams */}
        <div aria-hidden="true" className="beams" style={{
          position: 'absolute', top: '38%', left: '50%', width: 1600, height: 1600, marginLeft: -800, marginTop: -800, pointerEvents: 'none', opacity: 0.55,
          background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.05) 8deg, transparent 18deg, transparent 90deg, rgba(255,255,255,0.04) 100deg, transparent 112deg, transparent 200deg, rgba(255,255,255,0.05) 210deg, transparent 222deg, transparent 290deg, rgba(255,255,255,0.035) 300deg, transparent 312deg)',
          WebkitMaskImage: 'radial-gradient(circle, #000 0%, transparent 60%)', maskImage: 'radial-gradient(circle, #000 0%, transparent 60%)',
        }} />

        <motion.div style={{ scale: markScale, opacity: markOpacity, position: 'relative', zIndex: 1 }}>
          <div className="hero-in hero-in-mark">
            <div style={{ position: 'absolute', inset: '-30%', borderRadius: '50%', background: 'conic-gradient(from 0deg, rgba(47,123,255,0.45), rgba(139,92,255,0.45), rgba(255,79,163,0.4), rgba(255,138,61,0.38), rgba(47,123,255,0.45))', filter: 'blur(60px)', opacity: 0.8 }} />
            <InteractiveMark height={markH} />
          </div>
        </motion.div>

        <motion.div style={{ opacity: textOpacity, y: textY, scale: textScale, position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 20px', marginTop: 34 }}>
          <div className="mono hero-in hero-in-eyebrow" style={{ fontSize: 13, fontWeight: 500, textTransform: 'uppercase', color: 'var(--steel-3)' }}>
            Studio software for personal trainers
          </div>
          <h1 style={{ fontSize: 'clamp(52px, 9.5vw, 150px)', fontWeight: 800, letterSpacing: '-0.055em', lineHeight: 0.92, marginTop: 18 }}>
            <span className="steel-text hero-in hero-in-line" style={{ display: 'block', animationDelay: '.7s' }}>
              Run your studio.
            </span>
            <span className="spectrum-text hero-in hero-in-line" style={{ display: 'block', animationDelay: '.95s' }}>
              Beautifully.
            </span>
          </h1>
          <div className="hero-in hero-in-cta" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 40 }}>
            <a href="#waitlist" className="btn-spectrum magnetic" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 30px', borderRadius: 999, fontSize: 16, textDecoration: 'none' }}>
              Book a demo <Icon name="arrow" size={17} />
            </a>
          </div>
        </motion.div>

        <motion.div className="scroll-hint" style={{ opacity: textOpacity, position: 'absolute', bottom: 18, left: '50%', x: '-50%', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, fontSize: 11, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--steel-4)' }}>
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
const CAPTION_GRADS = ['linear-gradient(90deg,#4f8dff,#22d3ee)', 'linear-gradient(90deg,#ff8a3d,#ffc24d)', 'linear-gradient(90deg,#2fe39a,#22d3ee)']

function Caption({ text, i, p }: { text: string; i: number; p: MotionValue<number> }) {
  const a = 0.08 + i * 0.24
  const opacity = useTransform(p, [a, a + 0.06, a + 0.18, a + 0.24], [0, 1, 1, i === CAPTIONS.length - 1 ? 1 : 0])
  const y = useTransform(p, [a, a + 0.06, a + 0.18, a + 0.24], [40, 0, 0, i === CAPTIONS.length - 1 ? 0 : -40])
  const blurPx = useTransform(p, [a, a + 0.06, a + 0.18, a + 0.24], [12, 0, 0, i === CAPTIONS.length - 1 ? 0 : 12])
  const blur = useTransform(blurPx, v => (v < 0.2 ? 'none' : `blur(${v}px)`))
  return (
    <motion.div style={{ opacity, y, filter: blur, position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center' }}>
      <span className="tint-text" style={{ backgroundImage: CAPTION_GRADS[i], fontSize: 'clamp(40px, 6.4vw, 104px)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1 }}>{text}</span>
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
    <section ref={ref} id="story" data-scroll-at="0.25" className="cine-story" style={{ position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#050607' }}>
        <div style={{ position: 'absolute', top: '9vh', left: 0, right: 0, height: 110, zIndex: 3 }}>
          {CAPTIONS.map((c, i) => <Caption key={c} text={c} i={i} p={p} />)}
        </div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 1400, paddingTop: '14vh' }}>
          <motion.div style={{ opacity: glow, position: 'absolute', width: '80vw', height: '60vh', top: '30vh', borderRadius: '50%', background: 'radial-gradient(ellipse at 30% 50%, rgba(47,123,255,0.35), transparent 55%), radial-gradient(ellipse at 70% 50%, rgba(139,92,255,0.32), transparent 55%), radial-gradient(ellipse at 50% 70%, rgba(255,79,163,0.22), transparent 60%)', filter: 'blur(40px)' }} />
          <motion.div style={{ y, rotateX, scale, opacity, transformOrigin: '50% 100%', width: 'min(1100px, 92vw)', position: 'relative' }}>
            <div style={{ position: 'relative', padding: 10, borderRadius: 24, background: 'linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03))', border: '1px solid rgba(255,255,255,0.14)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 80px 160px -40px rgba(0,0,0,1)' }}>
              <DashboardMockup />
              <LiveToasts />
              <LiveSessionCard />
            </div>
            <PhoneInCrater style={{ right: -130, bottom: 40, zIndex: 4 }} />
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
  return <motion.span style={{ opacity }} className={highlight ? 'spectrum-text' : undefined}>{w} </motion.span>
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
const PANELS: { n: string; kicker: string; title: string; sub: string; demo: ReactNode; c1: string; c2: string }[] = [
  { n: '01', kicker: 'Live session logger', title: 'Every set.\nLogged live.', sub: 'Weights, reps and rest, mid-session. PBs spotted automatically.', demo: <LoggerDemo />, c1: '#ff8a3d', c2: '#ff4f6d' },
  { n: '02', kicker: 'AI assistant', title: 'Ask.\nIt’s done.', sub: 'Book sessions and chase payments in plain English.', demo: <ChatDemo />, c1: '#8b5cff', c2: '#ff4fa3' },
  { n: '03', kicker: 'Payments', title: 'Every pound.\nAccounted for.', sub: 'Overdue accounts flagged. Receipts sent. No awkward chasing.', demo: <RevenueDemo />, c1: '#2fe39a', c2: '#22d3ee' },
  { n: '04', kicker: 'Lead pipeline', title: 'No lead\nleft behind.', sub: 'From first enquiry to paying client, all in one view.', demo: <PipelineDemo />, c1: '#2f7bff', c2: '#22d3ee' },
  { n: '05', kicker: 'Client app', title: 'Your studio.\nIn their pocket.', sub: 'Workouts, nutrition, wellness and streaks for every client.', demo: <PhoneDemo />, c1: '#c26bff', c2: '#ff5fae' },
]

function Panel({ panel, wide }: { panel: typeof PANELS[number]; wide: boolean }) {
  return (
    <div style={{
      width: wide ? '100vw' : '100%', height: wide ? '100vh' : 'auto', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: wide ? '0 7vw' : '80px 22px', position: 'relative',
    }}>
      {wide && (
        <span aria-hidden="true" style={{
          position: 'absolute', right: '4vw', top: '50%', transform: 'translateY(-50%)', fontSize: '42vw', fontWeight: 800, letterSpacing: '-0.08em', lineHeight: 0.8,
          color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 0,
        }}>{panel.n}</span>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: wide ? '1fr 1fr' : '1fr', gap: wide ? '6vw' : 36, alignItems: 'center', width: '100%', maxWidth: 1280, position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span className="tint-text" style={{ backgroundImage: `linear-gradient(90deg, ${panel.c1}, ${panel.c2})`, fontSize: 22, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{panel.n}</span>
            <span className="mono" style={{ fontSize: 13, fontWeight: 500, letterSpacing: '.18em', textTransform: 'uppercase', color: panel.c1 }}>{panel.kicker}</span>
          </div>
          <h3 style={{ fontSize: 'clamp(44px, 6.2vw, 104px)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 0.95, marginTop: 22 }}>
            <span className="steel-text" style={{ display: 'block' }}>{panel.title.split('\n')[0]}</span>
            <span className="tint-text" style={{ display: 'block', backgroundImage: `linear-gradient(90deg, ${panel.c1}, ${panel.c2})` }}>{panel.title.split('\n')[1]}</span>
          </h3>
          <p style={{ fontSize: 'clamp(17px, 1.5vw, 21px)', lineHeight: 1.55, color: 'var(--text-muted)', marginTop: 22, maxWidth: 460 }}>{panel.sub}</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: '-25%', borderRadius: '50%', background: `radial-gradient(circle at 35% 40%, ${panel.c1}66, transparent 55%), radial-gradient(circle at 70% 65%, ${panel.c2}55, transparent 55%)`, filter: 'blur(50px)', pointerEvents: 'none' }} />
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
  const stops = PANELS.map((_, i) => 0.05 + (0.9 * i) / (PANELS.length - 1))
  const toRgba = (h: string, a: number) => `rgba(${parseInt(h.slice(1, 3), 16)}, ${parseInt(h.slice(3, 5), 16)}, ${parseInt(h.slice(5, 7), 16)}, ${a})`
  const tint1 = useTransform(p, stops, PANELS.map(pn => toRgba(pn.c1, 0.22)))
  const tint2 = useTransform(p, stops, PANELS.map(pn => toRgba(pn.c2, 0.16)))
  const barBg = useTransform(p, stops, PANELS.map(pn => pn.c1))
  const bg = useMotionTemplate`radial-gradient(ellipse 55% 60% at 72% 50%, ${tint1}, transparent 70%), radial-gradient(ellipse 50% 50% at 20% 80%, ${tint2}, transparent 70%), radial-gradient(ellipse 70% 60% at 50% 50%, #101216, #050607 75%)`

  if (!wide || reduce) {
    return (
      <section id="features" style={{ background: '#050607' }}>
        {PANELS.map(pn => <Panel key={pn.n} panel={pn} wide={false} />)}
      </section>
    )
  }
  return (
    <section ref={ref} id="features" style={{ height: `${PANELS.length * 100}vh`, position: 'relative' }}>
      <motion.div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', backgroundImage: bg }}>
        <motion.div style={{ x, display: 'flex', height: '100%' }}>
          {PANELS.map(pn => <Panel key={pn.n} panel={pn} wide />)}
        </motion.div>
        <div style={{ position: 'absolute', left: '7vw', right: '7vw', bottom: 44, height: 2, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
          <motion.div style={{ scaleX: bar, transformOrigin: '0% 50%', height: '100%', borderRadius: 2, backgroundColor: barBg, boxShadow: '0 0 14px rgba(255,255,255,.35)' }} />
        </div>
      </motion.div>
    </section>
  )
}

/* ── 5. Giant numbers: bento of stat cards, each with a live visual ── */
const STAT = {
  blue:   { a: '#9cc0ff', b: '#2f7bff' },
  violet: { a: '#c6b0ff', b: '#8b5cff' },
  pink:   { a: '#ffb3d6', b: '#ff4fa3' },
  amber:  { a: '#ffd08a', b: '#ff8a3d' },
}
type StatTone = keyof typeof STAT

function StatCard({ tone, span, delay, num, unit, label, sub, children }: {
  tone: StatTone; span: number; delay: number; num: ReactNode; unit?: string; label: string; sub: string; children: ReactNode
}) {
  const c = STAT[tone]
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <motion.div ref={ref} onPointerMove={onMove} className="stat-card"
      initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1, delay, ease: EASE }}
      style={{
        gridColumn: `span ${span}`, position: 'relative', overflow: 'hidden', borderRadius: 32, padding: 'clamp(24px, 2.6vw, 40px)',
        minHeight: 420, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 28,
        background: `radial-gradient(120% 80% at 100% 0%, ${c.b}26, transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.012))`,
        border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 40px 80px -40px rgba(0,0,0,.9)',
        ['--glow' as string]: `${c.b}33`,
      }}>
      <div aria-hidden="true" style={{ position: 'absolute', top: -1, left: '12%', right: '12%', height: 1, background: `linear-gradient(90deg, transparent, ${c.a}, transparent)`, opacity: 0.7 }} />
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 170 }}>{children}</div>
      <div style={{ position: 'relative' }}>
        <div className="tint-text" style={{ backgroundImage: `linear-gradient(180deg, ${c.a}, ${c.b})`, fontSize: 'clamp(64px, 7vw, 120px)', fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 0.88, fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'baseline', gap: 10 }}>
          {num}
          {unit && <span style={{ fontSize: '0.34em', letterSpacing: '-0.03em' }}>{unit}</span>}
        </div>
        <div style={{ fontSize: 'clamp(18px, 1.5vw, 22px)', fontWeight: 600, color: '#eef1f4', marginTop: 14, letterSpacing: '-0.01em' }}>{label}</div>
        <div style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 6, maxWidth: 420, lineHeight: 1.5 }}>{sub}</div>
      </div>
    </motion.div>
  )
}

/* Setup: ring that fills while steps tick off. */
function SetupVisual() {
  const steps = ['Brand & logo', 'Services & prices', 'Import clients', 'First booking live']
  const R = 62, C = 2 * Math.PI * R
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px, 3vw, 44px)', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: 150, height: 150 }}>
        <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
          <defs><linearGradient id="ring-blue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9cc0ff" /><stop offset="1" stopColor="#2f7bff" /></linearGradient></defs>
          <circle cx="75" cy="75" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
          <motion.circle cx="75" cy="75" r={R} fill="none" stroke="url(#ring-blue)" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={C} initial={{ strokeDashoffset: C }} whileInView={{ strokeDashoffset: C * 0.08 }} viewport={{ once: true }}
            transition={{ duration: 2.4, delay: 0.3, ease: EASE }} style={{ filter: 'drop-shadow(0 0 10px rgba(47,123,255,.6))' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="timer" size={20} style={{ color: '#9cc0ff' }} />
          <span className="mono" style={{ fontSize: 22, fontWeight: 600, marginTop: 4, color: '#fff' }}><Counter to={9} prefix="0" suffix=":42" duration={2.4} /></span>
        </div>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
        {steps.map((s, i) => (
          <motion.li key={s} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 + i * 0.45, ease: EASE }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#dfe3e8', padding: '9px 14px 9px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#9cc0ff,#2f7bff)', color: '#05101f', boxShadow: '0 0 12px rgba(47,123,255,.5)' }}>
              <Icon name="check" size={13} stroke={2.6} />
            </span>
            {s}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

/* Seats: a crowd of trainers, every one of them free. */
function SeatsVisual() {
  const people = ['SK', 'JT', 'MR', 'PA', 'LB', 'DW', 'AN', 'CH', 'EF', 'RG', 'OM', 'TS']
  const hues = ['#8b5cff', '#2f7bff', '#ff4fa3', '#ff8a3d', '#22c39a', '#c6b0ff']
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
        {people.map((p, i) => (
          <motion.span key={p} initial={{ opacity: 0, scale: 0.4 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 + i * 0.06 }}
            style={{ aspectRatio: '1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff',
              background: `linear-gradient(160deg, ${hues[i % hues.length]}, ${hues[(i + 2) % hues.length]}88)`, border: '2px solid #0c0d11', boxShadow: '0 6px 16px rgba(0,0,0,.4)' }}>
            {p}
          </motion.span>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 1.1, ease: EASE }}
        style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 14, background: 'rgba(139,92,255,0.1)', border: '1px solid rgba(139,92,255,0.25)', fontSize: 14 }}>
        <span style={{ color: 'var(--text-muted)' }}>12 trainers × <s style={{ textDecorationColor: '#ff4fa3' }}>£15</s></span>
        <span style={{ fontWeight: 700, color: '#c6b0ff' }}>£0 / month</span>
      </motion.div>
    </div>
  )
}

/* Guarantee: a month of days lighting up, full refund inside it. */
function TrialVisual() {
  return (
    <div style={{ width: '100%', maxWidth: 340 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6 }}>
        {Array.from({ length: 30 }, (_, i) => (
          <motion.span key={i} initial={{ opacity: 0.15, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.045 }}
            style={{ aspectRatio: '1', borderRadius: 6, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: i === 29 ? '#fff' : 'rgba(255,255,255,.55)',
              background: i === 29 ? 'linear-gradient(180deg,#ffb3d6,#ff4fa3)' : `rgba(255,79,163,${0.12 + (i / 29) * 0.35})`,
              boxShadow: i === 29 ? '0 0 18px rgba(255,79,163,.8)' : undefined }}>
            {i + 1}
          </motion.span>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 1.6, ease: EASE }}
        style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 14, background: 'rgba(255,79,163,0.08)', border: '1px solid rgba(255,79,163,0.22)', fontSize: 14, color: '#f3d7e5' }}>
        <span style={{ position: 'relative', display: 'inline-flex', color: '#ffb3d6' }}>
          <Icon name="shield" size={20} />
        </span>
        Full refund. No questions asked.
      </motion.div>
    </div>
  )
}

/* One app: five scattered tools pull into one tile. */
function OneAppVisual() {
  const tools = [
    { n: 'chat', x: -125, y: -30 }, { n: 'sheet', x: -78, y: 62 }, { n: 'calendar', x: 0, y: -82 },
    { n: 'bank', x: 78, y: 62 }, { n: 'note', x: 125, y: -30 },
  ]
  return (
    <div style={{ position: 'relative', width: '100%', height: 200 }}>
      {tools.map((t, i) => (
        <motion.div key={t.n} initial={{ x: t.x * 1.25, y: t.y * 1.25, opacity: 1, scale: 1 }} whileInView={{ x: [t.x * 1.25, 0, t.x], y: [t.y * 1.25, 0, t.y], opacity: [1, 0, 0.35], scale: [1, 0.4, 0.7] }} viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 2.2, times: [0, 0.45, 1], delay: 0.6 + i * 0.08, ease: [0.7, 0, 0.3, 1] }}
          style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -26, marginTop: -26, width: 52, height: 52, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#16181d', border: '1px solid rgba(255,255,255,0.1)', color: '#aab0b9', boxShadow: '0 10px 24px rgba(0,0,0,.5)' }}>
          <Icon name={t.n} size={22} />
        </motion.div>
      ))}
      <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-60px' }}
        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 1.5 }}
        style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -48, marginTop: -48, width: 96, height: 96, borderRadius: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(circle at 30% 20%, #2a2d34, #101216)', border: '1px solid rgba(255,208,138,0.35)', boxShadow: '0 0 0 8px rgba(255,138,61,0.08), 0 0 60px rgba(255,138,61,.45), 0 20px 40px rgba(0,0,0,.6)' }}>
        <BrandLogo variant="mark" height={42} />
      </motion.div>
    </div>
  )
}

export function BigNumbers() {
  return (
    <section style={{ padding: 'clamp(100px, 14vh, 160px) 5vw', background: '#050607', position: 'relative', overflow: 'hidden' }}>
      <Aurora colors={['rgba(47,123,255,.18)', 'rgba(139,92,255,.16)', 'rgba(255,79,163,.12)', 'rgba(255,138,61,.12)']} style={{ position: 'absolute', opacity: 0.6 }} />
      <div style={{ position: 'relative', maxWidth: 1320, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE }}
          style={{ textAlign: 'center', marginBottom: 'clamp(48px, 7vh, 80px)' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>By the numbers</div>
          <h2 style={{ fontSize: 'clamp(40px, 6vw, 92px)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 0.95, marginTop: 18 }}>
            <span className="steel-text">Less admin.</span><br /><span className="spectrum-text">More training.</span>
          </h2>
        </motion.div>
        <div className="big-nums" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
          <StatCard tone="blue" span={7} delay={0} num={<><span style={{ fontSize: '0.8em' }}>&lt;</span><Counter to={10} duration={2} /></>} unit="min"
            label="to set up your studio" sub="Add your brand, services and clients, then take your first booking before your coffee goes cold.">
            <SetupVisual />
          </StatCard>
          <StatCard tone="violet" span={5} delay={0.1} num={<Counter to={0} prefix="£" />} label="per-seat fees, ever" sub="Unlimited trainers and unlimited clients. Grow the team without growing the bill.">
            <SeatsVisual />
          </StatCard>
          <StatCard tone="pink" span={5} delay={0.1} num={<Counter to={30} duration={2} />} unit="days" label="money-back guarantee" sub="Every feature from day one. Not for you? Cancel within 30 days for a full refund of your subscription.">
            <TrialVisual />
          </StatCard>
          <StatCard tone="amber" span={7} delay={0.2} num={<Counter to={1} duration={1.2} />} unit="app" label="instead of five" sub="Bookings, payments, programmes, check-ins and chat, all in one place.">
            <OneAppVisual />
          </StatCard>
        </div>
      </div>
      <style>{`
        .stat-card::after { content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .4s;
          background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), var(--glow), transparent 60%); }
        .stat-card:hover::after { opacity: 1; }
        .stat-card { transition: border-color .4s, transform .5s cubic-bezier(.22,1,.36,1); }
        .stat-card:hover { border-color: rgba(255,255,255,0.16) !important; }
        @media (max-width: 960px) { .big-nums > .stat-card { grid-column: span 12 !important; min-height: 0 !important; } }
      `}</style>
    </section>
  )
}


/* ── Before / after: drag from chaos to calm ─────────────────────────── */
function Chaos() {
  const bubble = (t: string, me = false): React.CSSProperties => ({
    position: 'absolute', padding: '10px 14px', borderRadius: 16, fontSize: 14, lineHeight: 1.35, maxWidth: 260,
    background: me ? '#005c4b' : '#202c33', color: '#e9edef', boxShadow: '0 10px 30px rgba(0,0,0,.5)',
  })
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, #121417 0 12px, #101215 12px 24px)', overflow: 'hidden' }}>
      <div style={{ ...bubble(''), left: '6%', top: '10%', transform: 'rotate(-4deg)' }}><b style={{ color: '#53bdeb', fontSize: 12 }}>Sarah K.</b><br />can i move tmrw to 7am?? 🙏</div>
      <div style={{ ...bubble('', true), left: '30%', top: '24%', transform: 'rotate(3deg)' }}>did you get my transfer for last month? 👀</div>
      <div style={{ ...bubble(''), left: '8%', top: '52%', transform: 'rotate(2deg)' }}><b style={{ color: '#53bdeb', fontSize: 12 }}>James T.</b><br />sorry mate will pay next week</div>
      <div style={{ position: 'absolute', right: '6%', top: '8%', width: 300, transform: 'rotate(5deg)', background: '#fff', color: '#202124', borderRadius: 6, boxShadow: '0 20px 40px rgba(0,0,0,.6)', fontSize: 11, overflow: 'hidden' }}>
        <div style={{ background: '#0f9d58', color: '#fff', padding: '6px 10px', fontWeight: 700 }}>clients_FINAL_v3 (2).xlsx</div>
        {['Name|Paid?|Sessions', 'Sarah|??|8', 'James|NO|3', 'Marcus|yes i think|12', 'Priya||'].map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid #e0e0e0', fontWeight: i ? 400 : 700, background: i === 2 ? '#fce8e6' : undefined }}>
            {r.split('|').map((c, j) => <span key={j} style={{ padding: '5px 8px', borderLeft: j ? '1px solid #e0e0e0' : undefined }}>{c}</span>)}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', right: '14%', bottom: '12%', width: 180, padding: 14, transform: 'rotate(-6deg)', background: '#ffe066', color: '#3b3200', boxShadow: '0 14px 30px rgba(0,0,0,.5)', fontFamily: 'cursive', fontSize: 15, lineHeight: 1.3 }}>
        chase james £240<br />book marcus thurs??<br />update sheet!!!
      </div>
      <div style={{ position: 'absolute', left: '34%', bottom: '10%', width: 230, padding: 12, transform: 'rotate(-2deg)', background: '#1c1c1e', border: '1px solid #333', borderRadius: 14, color: '#ddd', fontSize: 12.5, boxShadow: '0 14px 30px rgba(0,0,0,.5)' }}>
        <div style={{ color: '#ff9f0a', fontWeight: 700, marginBottom: 4 }}>Notes</div>
        Marcus PB bench 85kg? or was it 82.5 · Sarah knee niggle · invoice priya
      </div>
      <div style={{ position: 'absolute', left: '50%', top: '46%', padding: '6px 12px', borderRadius: 999, background: '#ff3b30', color: '#fff', fontWeight: 800, fontSize: 13, boxShadow: '0 0 0 6px rgba(255,59,48,.2)' }}>47 unread</div>
    </div>
  )
}

export function BeforeAfter() {
  const box = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const [drag, setDrag] = useState(false)
  const [touched, setTouched] = useState(false)
  const reduce = useReducedMotion()
  // Sweep once on first view to show it's interactive.
  useEffect(() => {
    const el = box.current
    if (!el || reduce) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || touched) return
      io.disconnect()
      const start = performance.now()
      const tick = (t: number) => {
        const k = Math.min((t - start) / 2200, 1)
        setPos(50 + Math.sin(k * Math.PI * 2) * 28 * (1 - k))
        if (k < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [reduce, touched])
  const setFrom = (clientX: number) => {
    const r = box.current!.getBoundingClientRect()
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)))
  }
  return (
    <section style={{ padding: '140px 4vw', background: '#050607', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <style>{`@media (max-width: 760px) { .ba-box { aspect-ratio: auto !important; height: 520px; border-radius: 22px !important; } .ba-box .hero-toast-wrap, .ba-box .hero-live { display: none; } }`}</style>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>Drag to compare</div>
        <h2 style={{ fontSize: 'clamp(40px, 6vw, 96px)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 0.95, marginTop: 18 }}>
          <span className="steel-text">From chaos</span> <span className="spectrum-text">to calm.</span>
        </h2>
      </div>
      <div ref={box}
        onPointerDown={e => { setDrag(true); setTouched(true); (e.target as HTMLElement).setPointerCapture?.(e.pointerId); setFrom(e.clientX) }}
        onPointerMove={e => drag && setFrom(e.clientX)}
        onPointerUp={() => setDrag(false)}
        className="ba-box" style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', aspectRatio: '16 / 9', borderRadius: 28, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 80px 160px -50px rgba(0,0,0,1)', touchAction: 'pan-y', userSelect: 'none', cursor: 'ew-resize' }}>
        {/* After */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, #1a1d23, #0b0c0f 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4%' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 30%, rgba(47,123,255,.25), transparent 50%), radial-gradient(circle at 30% 80%, rgba(139,92,255,.2), transparent 50%)' }} />
          <div style={{ width: '100%', maxWidth: 900, position: 'relative' }}><DashboardMockup /></div>
        </div>
        {/* Before (clipped) */}
        <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)` }}><Chaos /></div>
        {/* Labels */}
        <span className="mono" style={{ position: 'absolute', left: 20, top: 18, fontSize: 12, letterSpacing: '.2em', color: '#fff', padding: '6px 12px', borderRadius: 999, background: 'rgba(0,0,0,.55)', opacity: pos > 12 ? 1 : 0, transition: 'opacity .2s' }}>BEFORE</span>
        <span className="mono" style={{ position: 'absolute', right: 20, top: 18, fontSize: 12, letterSpacing: '.2em', color: '#0b0c0f', padding: '6px 12px', borderRadius: 999, background: 'linear-gradient(180deg,#fff,#c9ced5)', opacity: pos < 88 ? 1 : 0, transition: 'opacity .2s' }}>WITH DNI STUDIOS</span>
        {/* Handle */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${pos}%`, width: 2, marginLeft: -1, background: 'linear-gradient(180deg, #2f7bff, #8b5cff, #ff4fa3, #ff8a3d)', boxShadow: '0 0 20px rgba(139,92,255,.8)' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 56, height: 56, marginLeft: -28, marginTop: -28, borderRadius: '50%', background: 'linear-gradient(180deg,#fff,#c9ced5)', boxShadow: '0 10px 30px rgba(0,0,0,.6), 0 0 0 6px rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#0b0c0f' }}>
            <Icon name="arrow" size={16} style={{ transform: 'rotate(180deg)' }} /><Icon name="arrow" size={16} />
          </div>
        </div>
      </div>
    </section>
  )
}
