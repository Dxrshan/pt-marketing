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
    if (theme) document.documentElement.setAttribute('data-xmas', '')
    const c = ref.current
    if (!theme || !c || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = c.getContext('2d')!
    let w = 0, h = 0, raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => { w = c.width = innerWidth * dpr; h = c.height = innerHeight * dpr; c.style.width = innerWidth + 'px'; c.style.height = innerHeight + 'px' }
    resize(); window.addEventListener('resize', resize)
    const count = innerWidth < 700 ? 60 : 140
    // mostly fine flakes, a few big soft ones up close (depth)
    const flakes = Array.from({ length: count }, (_, i) => {
      const near = i % 9 === 0
      return {
        x: Math.random() * w, y: Math.random() * h, r: (near ? Math.random() * 2.5 + 3 : Math.random() * 1.8 + .6) * dpr,
        vy: (near ? Math.random() * .5 + .7 : Math.random() * .4 + .22) * dpr, drift: Math.random() * Math.PI * 2, a: near ? Math.random() * .25 + .2 : Math.random() * .5 + .3,
      }
    })
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
  useEffect(() => {
    const on = sale && !hidden
    document.documentElement.toggleAttribute('data-xmas-banner', on)
  }, [sale, hidden])
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

/** Fairy lights swagged across the top of the hero, twinkling. */
export function Garland() {
  const { theme } = useXmas()
  const [w, setW] = useState(0)
  useEffect(() => { const f = () => setW(window.innerWidth); f(); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f) }, [])
  if (!theme || !w) return null
  const swag = w < 700 ? w / 2 : 360, n = Math.ceil(w / swag), dip = w < 700 ? 22 : 30, top = 0
  const COLORS = ['#ffd77a', '#ff4d5e', '#5fe39a', '#fff3d6', '#ffb347']
  const paths: string[] = [], bulbs: { x: number; y: number; c: string; d: number }[] = []
  let k = 0
  for (let i = 0; i < n; i++) {
    const x0 = i * swag, x1 = x0 + swag, cx = (x0 + x1) / 2, cy = top + dip * 2
    paths.push(`M${x0},${top} Q${cx},${cy} ${x1},${top}`)
    for (let t = 0.12; t < 0.95; t += 0.152) {
      const x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1
      const y = (1 - t) ** 2 * top + 2 * (1 - t) * t * cy + t * t * top
      bulbs.push({ x, y, c: COLORS[k % COLORS.length], d: (k * 0.37) % 2.4 }); k++
    }
  }
  return (
    <svg aria-hidden="true" className="xmas-garland" width={w} height={dip + 40} style={{ position: 'absolute', left: 0, top: 'var(--garland-top, 128px)', zIndex: 3, pointerEvents: 'none', overflow: 'visible' }}>
      {paths.map(d => <path key={d} d={d} fill="none" stroke="rgba(40,48,40,.9)" strokeWidth={1.6} />)}
      {bulbs.map((b, i) => (
        <g key={i} transform={`translate(${b.x},${b.y})`}>
          <rect x={-2.2} y={-1} width={4.4} height={4} rx={1} fill="#3a3f38" />
          <ellipse className="xmas-bulb" cx={0} cy={8} rx={4} ry={6} fill={b.c} style={{ color: b.c, animationDelay: `${b.d}s` }} />
        </g>
      ))}
    </svg>
  )
}

/** Glass baubles hanging in the hero corners, gently swinging. */
export function Baubles() {
  const { theme } = useXmas()
  if (!theme) return null
  const B = [
    { side: 'left', at: '6%', len: 150, size: 54, g: ['#fff1c9', '#e2b65c', '#7a5418'], d: 0 },
    { side: 'left', at: '13%', len: 70, size: 38, g: ['#ff9aa5', '#c8102e', '#4d0612'], d: .9 },
    { side: 'right', at: '7%', len: 120, size: 48, g: ['#ffffff', '#c3cad6', '#5d6675'], d: .4 },
    { side: 'right', at: '14%', len: 200, size: 40, g: ['#a8f5c9', '#1f7a4a', '#0a2b1a'], d: 1.3 },
  ] as const
  return (
    <div aria-hidden="true" className="xmas-baubles" style={{ top: 'calc(var(--garland-top, 128px) + 8px)' }}>
      {B.map((b, i) => (
        <div key={i} className="xmas-bauble" style={{ [b.side]: b.at, animationDelay: `-${b.d}s` } as React.CSSProperties}>
          <div style={{ width: 1, height: b.len, margin: '0 auto', background: 'linear-gradient(rgba(240,217,162,.0), rgba(240,217,162,.7))' }} />
          <div style={{ width: 10, height: 7, margin: '0 auto -2px', borderRadius: 2, background: 'linear-gradient(90deg,#8a6a2c,#f0d9a2,#8a6a2c)' }} />
          <div style={{ width: b.size, height: b.size, borderRadius: '50%', position: 'relative',
            background: `radial-gradient(circle at 32% 28%, ${b.g[0]} 0%, ${b.g[1]} 38%, ${b.g[2]} 100%)`,
            boxShadow: `0 0 40px -6px ${b.g[1]}, inset -6px -8px 16px rgba(0,0,0,.35)` }}>
            <div style={{ position: 'absolute', left: '22%', top: '16%', width: '26%', height: '16%', borderRadius: '50%', background: 'rgba(255,255,255,.65)', filter: 'blur(2px)', transform: 'rotate(-30deg)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Small Santa hat to perch on the nav logo. */
export function SantaHat({ style }: { style?: React.CSSProperties }) {
  const { theme } = useXmas()
  if (!theme) return null
  return (
    <svg aria-hidden="true" viewBox="0 0 64 52" width={30} height={24} style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      <defs>
        <linearGradient id="hatred" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff4d5e" /><stop offset="1" stopColor="#9b0b22" /></linearGradient>
      </defs>
      <path d="M8 40 C 14 18, 30 4, 48 8 C 56 10, 60 20, 58 30 C 52 22, 44 20, 40 24 L 50 40 Z" fill="url(#hatred)" />
      <rect x="4" y="36" width="50" height="12" rx="6" fill="#f6f3ee" />
      <circle cx="58" cy="32" r="6" fill="#f6f3ee" />
    </svg>
  )
}
