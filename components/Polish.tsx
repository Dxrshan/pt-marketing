'use client'
// Site-wide finishing touches: inertia scrolling, custom cursor, magnetic buttons.
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'
import { scrollToSection } from '../lib/scrollTarget'

/** Buttery inertia scrolling; anchor links glide too. */
export function SmoothScroll() {
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce || window.matchMedia('(pointer: coarse)').matches) return
    document.documentElement.style.scrollBehavior = 'auto'
    // Lower lerp = longer, silkier glide after each wheel movement.
    const lenis = new Lenis({ lerp: 0.065, wheelMultiplier: 0.9, touchMultiplier: 1.2, smoothWheel: true })
    let raf = 0
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return
      const a = (e.target as HTMLElement).closest('a[href*="#"]') as HTMLAnchorElement | null
      if (!a) return
      const url = new URL(a.href)
      if (url.pathname !== window.location.pathname || !url.hash) return
      const el = document.querySelector<HTMLElement>(url.hash)
      if (!el) return
      e.preventDefault()
      scrollToSection(el)
    }
    document.addEventListener('click', onClick)
    // Arriving from another page with a #section link: land where that section
    // actually shows something (see lib/scrollTarget).
    if (window.location.hash) {
      const target = document.querySelector<HTMLElement>(window.location.hash)
      if (target?.dataset.scrollAt) requestAnimationFrame(() => scrollToSection(target, { immediate: true }))
    }
    return () => { cancelAnimationFrame(raf); lenis.destroy(); delete (window as unknown as { __lenis?: Lenis }).__lenis; document.removeEventListener('click', onClick) }
  }, [reduce])
  return null
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
