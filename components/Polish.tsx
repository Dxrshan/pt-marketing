'use client'
// Site-wide finishing touches: inertia scrolling, intro, custom cursor, magnetic buttons.
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'
import BrandLogo from './BrandLogo'

const EASE = [0.76, 0, 0.24, 1] as const

/** Buttery inertia scrolling; anchor links glide too. */
export function SmoothScroll() {
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce || window.matchMedia('(pointer: coarse)').matches) return
    document.documentElement.style.scrollBehavior = 'auto'
    const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true })
    let raf = 0
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href*="#"]') as HTMLAnchorElement | null
      if (!a) return
      const url = new URL(a.href)
      if (url.pathname !== window.location.pathname || !url.hash) return
      const el = document.querySelector(url.hash)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.6 })
    }
    document.addEventListener('click', onClick)
    return () => { cancelAnimationFrame(raf); lenis.destroy(); document.removeEventListener('click', onClick) }
  }, [reduce])
  return null
}

/** Branded intro: counter to 100, logo, then the curtain lifts. Once per session. */
export function Intro() {
  const [show, setShow] = useState(false)
  const [n, setN] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem('dni-intro') === '1' } catch {}
    if (seen || reduce) return
    setShow(true)
    try { sessionStorage.setItem('dni-intro', '1') } catch {}
    document.documentElement.style.overflow = 'hidden'
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const k = Math.min((t - start) / 1500, 1)
      setN(Math.round(100 * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(tick)
      else setTimeout(() => { setShow(false); document.documentElement.style.overflow = '' }, 350)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); document.documentElement.style.overflow = '' }
  }, [reduce])
  return (
    <AnimatePresence>
      {show && (
        <motion.div key="intro" exit={{ y: '-100%' }} transition={{ duration: 1, ease: EASE }}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#050607', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '-40%', borderRadius: '50%', filter: 'blur(50px)', opacity: 0.7, background: 'conic-gradient(from 0deg, #2f7bff, #8b5cff, #ff4fa3, #ff8a3d, #2f7bff)' }} />
            <BrandLogo variant="mark" height={110} />
          </motion.div>
          <div className="mono" style={{ position: 'absolute', left: 32, bottom: 28, fontSize: 12, color: '#6b717b', letterSpacing: '.2em' }}>DNI STUDIOS — LOADING</div>
          <div className="mono" style={{ position: 'absolute', right: 32, bottom: 18, fontSize: 'clamp(48px, 8vw, 120px)', fontWeight: 500, color: '#f2f3f5', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {String(n).padStart(3, '0')}
          </div>
          <div style={{ position: 'absolute', left: 0, bottom: 0, height: 2, width: `${n}%`, background: 'linear-gradient(90deg,#2f7bff,#8b5cff,#ff4fa3,#ff8a3d)' }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Small dot + trailing ring cursor; grows over links and buttons. Desktop only. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setOn(true)
    document.documentElement.classList.add('has-cursor')
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0, big = false
    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY
      const t = e.target as HTMLElement
      big = !!t.closest('a, button, [role="radio"], input, select, textarea, .spot')
    }
    const loop = () => {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      if (ring.current) {
        ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${big ? 1.8 : 1})`
        ring.current.style.borderColor = big ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)'
      }
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', move)
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); document.documentElement.classList.remove('has-cursor') }
  }, [])
  if (!on) return null
  return (
    <>
      <div ref={ring} aria-hidden="true" style={{ position: 'fixed', top: 0, left: 0, width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.35)', pointerEvents: 'none', zIndex: 999, transition: 'transform .18s cubic-bezier(.22,1,.36,1), border-color .2s', mixBlendMode: 'difference' }} />
      <div ref={dot} aria-hidden="true" style={{ position: 'fixed', top: 0, left: 0, width: 6, height: 6, borderRadius: '50%', background: '#fff', pointerEvents: 'none', zIndex: 999, mixBlendMode: 'difference' }} />
    </>
  )
}

/** Buttons and links marked .magnetic lean towards the cursor. */
export function Magnetic() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const move = (e: MouseEvent) => {
      document.querySelectorAll<HTMLElement>('.magnetic').forEach(el => {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2
        const dx = e.clientX - cx, dy = e.clientY - cy
        const near = Math.abs(dx) < r.width / 2 + 40 && Math.abs(dy) < r.height / 2 + 40
        el.style.transform = near ? `translate(${dx * 0.18}px, ${dy * 0.28}px)` : ''
      })
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return null
}

/** Giant scrolling word band. */
export function WordBand({ words, reverse = false }: { words: string[]; reverse?: boolean }) {
  const row = [...words, ...words, ...words, ...words]
  return (
    <div aria-hidden="true" className="marquee" style={{ padding: '6vh 0', background: '#050607' }}>
      <div className="marquee-track" style={{ gap: 0, animationDuration: '45s', animationDirection: reverse ? 'reverse' : 'normal' }}>
        {row.map((w, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', fontSize: 'clamp(56px, 9vw, 160px)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, whiteSpace: 'nowrap', padding: '0 0.35em' }}>
            <span className={i % 2 ? 'outline-text' : 'spectrum-text'}>{w}</span>
            <span style={{ fontSize: '0.35em', color: '#3a3e46', marginLeft: '0.7em' }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
