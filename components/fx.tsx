'use client'
// Shared motion + effect building blocks for the marketing site.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

/** Fades + lifts its children into view once. */
export function Reveal({ children, delay = 0, y = 28, className, style }: {
  children: ReactNode; delay?: number; y?: number; className?: string; style?: CSSProperties
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Splits a line into words that rise and un-blur one after another. */
// The text finish (e.g. steel/sheen gradient) goes on each word, not the wrapper:
// background-clip:text doesn't paint through transformed children in Chrome.
export function WordsReveal({ text, className, style, delay = 0, stagger = 0.06 }: {
  text: string; className?: string; style?: CSSProperties; delay?: number; stagger?: number
}) {
  const words = text.split(' ')
  return (
    <span style={{ display: 'inline', ...style }}>
      {words.map((w, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.08em' }}>
          <motion.span
            className={className}
            style={{ display: 'inline-block' }}
            initial={{ y: '105%', opacity: 0, filter: 'blur(8px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: delay + i * stagger, ease: EASE }}
          >
            {w}{i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/** Card with a light that follows the cursor across its surface and border. */
export function SpotlightCard({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div ref={ref} onMouseMove={onMove} className={`spot ${className}`} style={style}>
      {children}
    </div>
  )
}

/** Tilts its content in 3D towards the cursor. */
export function Tilt({ children, max = 8, style }: { children: ReactNode; max?: number; style?: CSSProperties }) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const rx = useSpring(useTransform(y, [0, 1], [max, -max]), { stiffness: 140, damping: 18 })
  const ry = useSpring(useTransform(x, [0, 1], [-max, max]), { stiffness: 140, damping: 18 })
  return (
    <motion.div
      style={{ perspective: 1400, ...style }}
      onMouseMove={e => {
        if (reduce) return
        const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
        x.set((e.clientX - r.left) / r.width)
        y.set((e.clientY - r.top) / r.height)
      }}
      onMouseLeave={() => { x.set(0.5); y.set(0.5) }}
    >
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}>{children}</motion.div>
    </motion.div>
  )
}

/** Counts up to a number when scrolled into view. */
export function Counter({ to, prefix = '', suffix = '', decimals = 0, duration = 1.6 }: {
  to: number; prefix?: string; suffix?: string; decimals?: number; duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const k = Math.min((t - start) / (duration * 1000), 1)
      setV(to * (1 - Math.pow(1 - k, 4)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])
  return <span ref={ref}>{prefix}{v.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>
}

/** Soft light that follows the cursor across a section. */
export function CursorLight({ size = 700, opacity = 0.09 }: { size?: number; opacity?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    const parent = el?.parentElement
    if (!el || !parent) return
    const move = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect()
      el.style.transform = `translate(${e.clientX - r.left - size / 2}px, ${e.clientY - r.top - size / 2}px)`
      el.style.opacity = '1'
    }
    const leave = () => { el.style.opacity = '0' }
    parent.addEventListener('mousemove', move)
    parent.addEventListener('mouseleave', leave)
    return () => { parent.removeEventListener('mousemove', move); parent.removeEventListener('mouseleave', leave) }
  }, [size])
  return (
    <div ref={ref} aria-hidden="true" style={{
      position: 'absolute', top: 0, left: 0, width: size, height: size, borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      background: `radial-gradient(circle, rgba(230,236,245,${opacity}) 0%, transparent 60%)`,
      opacity: 0, transition: 'opacity .4s ease', willChange: 'transform',
    }} />
  )
}

/* ── Icons (stroke SVGs, inherit currentColor) ─────────────────────────── */
const PATHS: Record<string, ReactNode> = {
  chat: <path d="M4 5.5h16v10H9l-5 4z" />,
  sheet: <><rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M3.5 9h17M3.5 14.5h17M9 3.5v17" /></>,
  note: <><path d="M6 3.5h9l3.5 3.5v13.5H6z" /><path d="M14.5 3.5V7.5H18.5M9 12h6M9 16h4" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M8 3v4M16 3v4M3.5 10h17" /></>,
  bank: <><path d="M3 9.5 12 4l9 5.5" /><path d="M5 10v7M9.5 10v7M14.5 10v7M19 10v7M3.5 20h17" /></>,
  eyeoff: <><path d="M3 3l18 18" /><path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 8.5 4.5 9.5 6-.5.8-1.6 2.3-3.2 3.6M6.3 7.7C4.5 9 3.3 10.6 2.5 12c1 1.5 4.5 6 9.5 6 1.4 0 2.7-.3 3.8-.9" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 4.7a3.5 3.5 0 0 1 0 6.6M18.5 14.8c1.8.9 3 2.9 3 5.2" /></>,
  card: <><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M2.5 10h19M6.5 15h3" /></>,
  funnel: <path d="M3.5 4.5h17l-6.5 8v6l-4 2v-8z" />,
  grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></>,
  trend: <><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
  bell: <><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>,
  shield: <><path d="M12 3l8 3v6c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6z" /><path d="M8.8 12.2l2.2 2.2 4.2-4.3" /></>,
  bolt: <path d="M13 2.5 4.5 13.5h6.5l-1 8 8.5-11h-6.5z" />,
  sparkle: <path d="M12 3l1.8 5.4L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.6zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  lock: <><rect x="4.5" y="10.5" width="15" height="10.5" rx="2.5" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></>,
  timer: <><circle cx="12" cy="13" r="7.5" /><path d="M12 9.5V13l2.5 2M9.5 2.5h5" /></>,
  heart: <path d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7.2 4.5 4.5 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />,
  phone: <><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" /><path d="M10.5 18.5h3" /></>,
  layers: <><path d="M12 3 2.5 8 12 13l9.5-5z" /><path d="M2.5 12.5 12 17.5l9.5-5M2.5 16.5 12 21.5l9.5-5" /></>,
}

export function Icon({ name, size = 20, stroke = 1.6, style }: { name: keyof typeof PATHS | string; size?: number; stroke?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>
      {PATHS[name]}
    </svg>
  )
}

/** Metal-finished icon tile. */
export function IconTile({ name, size = 44 }: { name: string; size?: number }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: size * 0.28, flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#eef1f4',
      background: 'linear-gradient(160deg, #2a2e35 0%, #16181d 60%, #101216 100%)',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 18px -8px rgba(0,0,0,0.8)',
    }}>
      <Icon name={name} size={size * 0.46} />
    </span>
  )
}

export function SectionHead({ eyebrow, title, accent, sub, align = 'center' }: {
  eyebrow: string; title: string; accent?: string; sub?: string; align?: 'center' | 'left'
}) {
  return (
    <Reveal style={{ textAlign: align, maxWidth: align === 'center' ? 760 : undefined, margin: align === 'center' ? '0 auto' : undefined }}>
      <div className="eyebrow" style={{ marginBottom: 18 }}>{eyebrow}</div>
      <h2 style={{ fontSize: 'clamp(34px, 4.6vw, 60px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.04 }}>
        <span className="steel-text">{title}</span>{accent && <> <span className="spectrum-text">{accent}</span></>}
      </h2>
      {sub && <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--text-muted)', marginTop: 18, maxWidth: 600, marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0 }}>{sub}</p>}
    </Reveal>
  )
}
