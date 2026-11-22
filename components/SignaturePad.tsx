'use client'
// Full-screen signing sheet for the offer page. Works with finger, pen or mouse
// (pointer events), draws a smooth variable-width ink line, and hands back a
// trimmed transparent PNG of the signature.
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

type Pt = { x: number; y: number; t: number; w: number }
type Stroke = Pt[]

const INK = '#111318'
const MIN_W = 1.4
const MAX_W = 4.2
const EASE = [0.22, 1, 0.36, 1] as const

function widthFor(prev: Pt | undefined, x: number, y: number, t: number) {
  if (!prev) return (MIN_W + MAX_W) / 2
  const v = Math.hypot(x - prev.x, y - prev.y) / Math.max(t - prev.t, 1) // px per ms
  const target = Math.max(MIN_W, Math.min(MAX_W, MAX_W - v * 1.6))
  return prev.w * 0.65 + target * 0.35 // smooth the width so it never jumps
}

function drawStroke(ctx: CanvasRenderingContext2D, s: Stroke) {
  if (!s.length) return
  ctx.fillStyle = INK
  ctx.strokeStyle = INK
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  if (s.length === 1) {
    ctx.beginPath(); ctx.arc(s[0].x, s[0].y, s[0].w / 2, 0, Math.PI * 2); ctx.fill(); return
  }
  for (let i = 1; i < s.length; i++) {
    const a = s[i - 1], b = s[i]
    const p0 = i > 1 ? s[i - 2] : a
    // Quadratic segment from the midpoint of the last pair to the midpoint of this one.
    const m1 = { x: (p0.x + a.x) / 2, y: (p0.y + a.y) / 2 }
    const m2 = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
    ctx.lineWidth = (a.w + b.w) / 2
    ctx.beginPath()
    ctx.moveTo(m1.x, m1.y)
    ctx.quadraticCurveTo(a.x, a.y, m2.x, m2.y)
    ctx.stroke()
  }
}

export default function SignaturePad({ open, onClose, onSign, signer, reference }: {
  open: boolean
  onClose: () => void
  onSign: (dataUrl: string) => void
  signer: string
  reference: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const strokes = useRef<Stroke[]>([])
  const drawing = useRef(false)
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const redraw = useCallback(() => {
    const c = canvasRef.current; if (!c) return
    const ctx = c.getContext('2d')!
    const dpr = window.devicePixelRatio || 1
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, c.width, c.height)
    strokes.current.forEach(s => drawStroke(ctx, s))
  }, [])

  // Size the canvas to its box at device resolution.
  useEffect(() => {
    if (!open) return
    const fit = () => {
      const c = canvasRef.current, w = wrapRef.current; if (!c || !w) return
      const r = w.getBoundingClientRect(), dpr = window.devicePixelRatio || 1
      c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr)
      c.style.width = `${r.width}px`; c.style.height = `${r.height}px`
      redraw()
    }
    const id = requestAnimationFrame(fit)
    window.addEventListener('resize', fit)
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', fit) }
  }, [open, redraw])

  // Fresh pad each time it opens; Escape closes; page doesn't scroll behind it.
  useEffect(() => {
    if (!open) return
    strokes.current = []; setCount(0)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, onClose])

  const point = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top, t: e.timeStamp }
  }
  const down = (e: React.PointerEvent) => {
    e.preventDefault()
    canvasRef.current!.setPointerCapture(e.pointerId)
    drawing.current = true
    const p = point(e)
    strokes.current.push([{ ...p, w: widthFor(undefined, p.x, p.y, p.t) }])
    redraw()
  }
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return
    const s = strokes.current[strokes.current.length - 1]
    const events = (e.nativeEvent as PointerEvent).getCoalescedEvents?.() ?? [e.nativeEvent]
    for (const ev of events) {
      const r = canvasRef.current!.getBoundingClientRect()
      const x = ev.clientX - r.left, y = ev.clientY - r.top, t = ev.timeStamp
      const last = s[s.length - 1]
      if (Math.hypot(x - last.x, y - last.y) < 0.8) continue
      s.push({ x, y, t, w: widthFor(last, x, y, t) })
    }
    redraw()
  }
  const up = () => {
    if (!drawing.current) return
    drawing.current = false
    setCount(strokes.current.length)
  }

  const undo = () => { strokes.current.pop(); setCount(strokes.current.length); redraw() }
  const clear = () => { strokes.current = []; setCount(0); redraw() }

  const confirm = () => {
    const pts = strokes.current.flat()
    if (!pts.length) return
    const pad = 8
    const minX = Math.min(...pts.map(p => p.x)) - pad, minY = Math.min(...pts.map(p => p.y)) - pad
    const maxX = Math.max(...pts.map(p => p.x)) + pad, maxY = Math.max(...pts.map(p => p.y)) + pad
    const scale = 3
    const out = document.createElement('canvas')
    out.width = Math.ceil((maxX - minX) * scale); out.height = Math.ceil((maxY - minY) * scale)
    const ctx = out.getContext('2d')!
    ctx.setTransform(scale, 0, 0, scale, -minX * scale, -minY * scale)
    strokes.current.forEach(s => drawStroke(ctx, s))
    onSign(out.toDataURL('image/png'))
  }

  if (!mounted) return null
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="sp-backdrop" key="sp"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          onPointerDown={e => { if (e.target === e.currentTarget) onClose() }}>
          <motion.div className="sp-sheet" role="dialog" aria-modal="true" aria-labelledby="sp-title"
            initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE }}>
            <header className="sp-head">
              <div>
                <div className="sp-kicker">Acceptance</div>
                <h2 id="sp-title" className="sp-title">Sign to accept this invoice</h2>
              </div>
              <button type="button" className="sp-x" onClick={onClose} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </header>

            <div className="sp-meta">
              <span><em>Signing for</em>{signer || 'Client'}</span>
              <span><em>Invoice</em>{reference}</span>
              <span><em>Date</em>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>

            <div className="sp-pad" ref={wrapRef}>
              <canvas ref={canvasRef} className="sp-canvas"
                onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up} />
              <AnimatePresence>
                {count === 0 && (
                  <motion.div className="sp-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 3.5l4 4L8 20l-5 1 1-5z" /><path d="M14 6l4 4" /></svg>
                    Sign here with your finger, pen or mouse
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="sp-baseline" aria-hidden="true"><span>&times;</span></div>
            </div>

            <p className="sp-legal">By signing, you accept this invoice and the Terms &amp; Conditions that form part of this agreement.</p>

            <footer className="sp-foot">
              <div className="sp-tools">
                <button type="button" className="sp-btn ghost" onClick={undo} disabled={!count}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14L4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></svg>
                  Undo
                </button>
                <button type="button" className="sp-btn ghost" onClick={clear} disabled={!count}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
                  Redo signature
                </button>
              </div>
              <motion.button type="button" className="sp-btn primary" onClick={confirm} disabled={!count}
                whileTap={count ? { scale: 0.97 } : undefined}>
                Accept &amp; sign
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              </motion.button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export const SIGNATURE_PAD_CSS = `
.sp-backdrop {
  position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px;
  background: rgba(8,9,12,.55); -webkit-backdrop-filter: blur(10px) saturate(120%); backdrop-filter: blur(10px) saturate(120%);
}
.sp-sheet {
  width: min(760px, 100%); max-height: calc(100vh - 40px); overflow: auto; border-radius: 22px; background: #fff; color: #111318;
  box-shadow: 0 40px 120px -30px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.06);
  font-family: inherit;
}
.sp-head {
  position: relative; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding: 24px 28px 22px; color: #e8eaee;
  background: radial-gradient(140% 160% at 0% 0%, #30343c 0%, #23262c 35%, #121418 75%, #0a0b0d 100%);
}
.sp-head::before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .7;
  background: repeating-linear-gradient(90deg, rgba(255,255,255,.022) 0 1px, transparent 1px 3px); }
.sp-head > * { position: relative; }
.sp-kicker { font-size: 10.5px; font-weight: 600; letter-spacing: .22em; text-transform: uppercase; color: #8d939c; }
.sp-title {
  margin-top: 6px; font-size: 22px; font-weight: 600; letter-spacing: -.02em;
  background: linear-gradient(180deg, #ffffff 0%, #e2e5e9 55%, #a7adb5 100%); -webkit-background-clip: text; background-clip: text; color: transparent;
}
.sp-x { all: unset; cursor: pointer; width: 34px; height: 34px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;
  color: #c9cdd3; background: rgba(255,255,255,.08); transition: background .2s ease, transform .2s ease; }
.sp-x:hover { background: rgba(255,255,255,.16); transform: rotate(90deg); }
.sp-meta { display: flex; flex-wrap: wrap; gap: 8px 28px; padding: 16px 28px 0; font-size: 13.5px; font-weight: 600; color: #111318; }
.sp-meta em { display: block; font-style: normal; font-size: 10.5px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: #9a9fa8; margin-bottom: 3px; }
.sp-meta span:nth-child(2) { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px; }
.sp-pad {
  position: relative; margin: 18px 28px 0; height: min(300px, 42vh); border-radius: 16px; overflow: hidden;
  background: linear-gradient(180deg, #fbfbfc, #f4f5f7); border: 1px solid #e6e7ea;
  box-shadow: inset 0 2px 8px rgba(17,19,24,.05);
}
.sp-canvas { position: absolute; inset: 0; touch-action: none; cursor: crosshair; z-index: 2; }
.sp-hint { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 10px; color: #a3a8b0; font-size: 15px; pointer-events: none; z-index: 1; }
.sp-baseline { position: absolute; left: 28px; right: 28px; bottom: 26%; border-bottom: 1.5px dashed #c9cdd3; pointer-events: none; z-index: 1; }
.sp-baseline span { position: absolute; left: 0; bottom: 4px; font-size: 22px; color: #9a9fa8; line-height: 1; }
.sp-legal { padding: 12px 28px 0; font-size: 12px; color: #9a9fa8; line-height: 1.5; }
.sp-foot { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; padding: 18px 28px 24px; }
.sp-tools { display: flex; gap: 8px; }
.sp-btn { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; border-radius: 12px; padding: 12px 16px; transition: background .2s ease, color .2s ease, opacity .2s ease, box-shadow .2s ease, transform .15s ease; }
.sp-btn:disabled { opacity: .4; cursor: not-allowed; }
.sp-btn.ghost { color: #2a2d33; background: #f1f2f4; }
.sp-btn.ghost:not(:disabled):hover { background: #e6e7ea; }
.sp-btn.primary {
  padding: 13px 22px; color: #fff; background: radial-gradient(140% 160% at 0% 0%, #3a3e46 0%, #23262c 45%, #121418 100%);
  box-shadow: 0 12px 24px -12px rgba(17,19,24,.8), inset 0 1px 0 rgba(255,255,255,.12);
}
.sp-btn.primary:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 16px 30px -12px rgba(17,19,24,.9), inset 0 1px 0 rgba(255,255,255,.14); }
@media (max-width: 560px) {
  .sp-head, .sp-meta, .sp-legal, .sp-foot { padding-left: 18px; padding-right: 18px; }
  .sp-pad { margin-left: 18px; margin-right: 18px; }
  .sp-foot { flex-direction: column-reverse; align-items: stretch; }
  .sp-tools { justify-content: space-between; }
  .sp-btn.primary { justify-content: center; }
}
`
