'use client'
import { useEffect, useRef, useState } from 'react'
import { XMAS, xmasSaleOn, xmasThemeOn } from '../lib/season'

/* Luxury, subtle Christmas: soft snow, and a slim sale banner. Off after the season. */

export function useXmas() {
  const [state, setState] = useState({ theme: false, sale: false })
  useEffect(() => { setState({ theme: xmasThemeOn(), sale: xmasSaleOn() }) }, [])
  return state
}

/** Gentle snowfall on a canvas behind the content. Few, soft, slow flakes; none for reduced motion. */
export function Snowfall() {
  const ref = useRef<HTMLCanvasElement>(null)
  const { theme } = useXmas()
  useEffect(() => {
    const c = ref.current
    if (!theme || !c || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = c.getContext('2d')!
    let w = 0, h = 0, raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => { w = c.width = innerWidth * dpr; h = c.height = innerHeight * dpr; c.style.width = innerWidth + 'px'; c.style.height = innerHeight + 'px' }
    resize(); window.addEventListener('resize', resize)
    const count = innerWidth < 700 ? 34 : 70
    const flakes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: (Math.random() * 1.8 + .6) * dpr,
      vy: (Math.random() * .35 + .18) * dpr, drift: Math.random() * Math.PI * 2, a: Math.random() * .45 + .25,
    }))
    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const f of flakes) {
        f.y += f.vy; f.x += Math.sin(t / 2400 + f.drift) * .25 * dpr
        if (f.y > h + 6) { f.y = -6; f.x = Math.random() * w }
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 2.2)
        g.addColorStop(0, `rgba(255,255,255,${f.a})`); g.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 2.2, 0, Math.PI * 2); ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [theme])
  if (!theme) return null
  return <canvas ref={ref} aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 90, pointerEvents: 'none' }} />
}

/** Slim gold-edged banner above the nav while the sale is on. Dismissible. */
export function XmasBanner() {
  const { sale } = useXmas()
  const [hidden, setHidden] = useState(true)
  useEffect(() => { try { setHidden(sessionStorage.getItem('dni-xmas-banner') === 'closed') } catch { setHidden(false) } }, [])
  if (!sale || hidden) return null
  return (
    <div className="xmas-banner" role="region" aria-label="Christmas sale">
      <a href="/#waitlist" className="xmas-banner-link">
        <span className="xmas-star" aria-hidden="true">✦</span>
        <span className="xmas-gold">Christmas sale</span>
        <span className="xmas-sep" aria-hidden="true">·</span>
        <span>Free onboarding &amp; data migration <span className="xmas-dim">(worth £{XMAS.onboardingWorth})</span> when you join before 31 Dec</span>
        <span className="xmas-cta">Book a demo →</span>
      </a>
      <button type="button" className="xmas-close" aria-label="Dismiss" onClick={() => { setHidden(true); try { sessionStorage.setItem('dni-xmas-banner', 'closed') } catch {} }}>×</button>
    </div>
  )
}

/** Small gold pill for use next to prices and CTAs during the sale. */
export function XmasSaleNote({ style }: { style?: React.CSSProperties }) {
  const { sale } = useXmas()
  if (!sale) return null
  return (
    <div className="xmas-note" style={style}>
      <span aria-hidden="true">✦</span> Christmas sale: free onboarding &amp; data migration (worth £{XMAS.onboardingWorth}) until 31 Dec
    </div>
  )
}
