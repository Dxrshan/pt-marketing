'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon, CursorLight } from './fx'

const EASE = [0.22, 1, 0.36, 1] as const

export default function EmailCaptureSection() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [type, setType] = useState<'solo' | 'studio'>('solo')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || loading) return
    setLoading(true)
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, type, source: 'website' }),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    }
    setLoading(false)
  }

  return (
    <section id="waitlist" className="grain" style={{ padding: '140px 24px 150px', position: 'relative', overflow: 'hidden' }}>
      <CursorLight size={700} opacity={0.08} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: '10% 10% 20%', pointerEvents: 'none', filter: 'blur(90px)', opacity: 0.4, background: 'radial-gradient(circle at 25% 50%, #2f7bff, transparent 45%), radial-gradient(circle at 75% 45%, #ff4fa3, transparent 45%), radial-gradient(circle at 50% 80%, #ff8a3d, transparent 45%)' }} />
      {/* Light beam from above */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: -120, left: '50%', width: 900, height: 600, transform: 'translateX(-50%)', pointerEvents: 'none',
        background: 'conic-gradient(from 180deg at 50% 0%, transparent 155deg, rgba(220,228,240,0.10) 175deg, rgba(255,255,255,0.14) 180deg, rgba(220,228,240,0.10) 185deg, transparent 205deg)',
      }} />

      <div style={{ maxWidth: 620, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE }}>
          <span className="badge badge-blue" style={{ marginBottom: 26 }}><span className="live-dot" /> Limited founding spots</span>
          <h2 style={{ fontSize: 'clamp(40px, 6vw, 76px)', fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1, marginBottom: 22 }}>
            <span className="steel-text">See it with</span><br /><span className="spectrum-text">your own clients.</span>
          </h2>
          <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 40 }}>
            Book a free demo. We'll walk you through DNI Studios set up for your studio.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form key="form" onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
              style={{
                textAlign: 'left', padding: 30, borderRadius: 26,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 40px 100px -40px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              <div role="radiogroup" aria-label="I am a" style={{ display: 'flex', gap: 6, marginBottom: 16, padding: 5, borderRadius: 14, background: 'rgba(255,255,255,0.04)' }}>
                {(['solo', 'studio'] as const).map(t => {
                  const on = type === t
                  return (
                    <button key={t} type="button" role="radio" aria-checked={on} onClick={() => setType(t)}
                      style={{ position: 'relative', flex: 1, padding: 11, borderRadius: 10, border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 14, fontWeight: 650, cursor: 'pointer', color: on ? '#0b0c0f' : 'rgba(255,255,255,0.55)', transition: 'color .3s' }}>
                      {on && <motion.span layoutId="who-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} style={{ position: 'absolute', inset: 0, borderRadius: 10, background: 'linear-gradient(180deg,#fff,#c9ced5)' }} />}
                      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <Icon name={t === 'solo' ? 'users' : 'layers'} size={15} />{t === 'solo' ? 'Solo trainer' : 'Studio or gym'}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                <input type="text" name="given-name" autoComplete="given-name" placeholder="First name" aria-label="First name"
                  value={name} onChange={e => setName(e.target.value)} className="input-dark"
                  style={{ padding: '15px 18px', borderRadius: 13, fontSize: 15.5, width: '100%' }} />
                <input type="email" name="email" autoComplete="email" placeholder="you@yourstudio.com" aria-label="Email" required
                  value={email} onChange={e => setEmail(e.target.value)} className="input-dark"
                  style={{ padding: '15px 18px', borderRadius: 13, fontSize: 15.5, width: '100%' }} />
              </div>

              <button type="submit" disabled={loading} className="btn-spectrum"
                style={{ width: '100%', padding: 17, borderRadius: 14, fontSize: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: loading ? 0.75 : 1 }}>
                {loading ? 'Booking…' : <>Book my demo <Icon name="arrow" size={17} /></>}
              </button>
              <p style={{ fontSize: 13, color: 'var(--text-subtle)', marginTop: 14, textAlign: 'center' }}>
                30-day money-back guarantee · No lock-in
              </p>
            </motion.form>
          ) : (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE }}
              style={{ padding: '48px 36px', borderRadius: 26, background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))', border: '1px solid rgba(255,255,255,0.12)' }}>
              <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.15 }}
                style={{ width: 64, height: 64, borderRadius: 20, margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0b0c0f', background: 'linear-gradient(180deg,#fff,#b9bec6)', boxShadow: '0 12px 40px -10px rgba(220,226,235,.5)' }}>
                <Icon name="check" size={30} stroke={2.4} />
              </motion.span>
              <h3 className="steel-text" style={{ fontSize: 30, fontWeight: 800, marginBottom: 12 }}>Demo requested.</h3>
              <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Thanks! We&apos;ll be in touch within 24 hours to find a time that suits you.
              </p>
              <p style={{ fontSize: 14, color: 'var(--text-subtle)', marginTop: 16 }}>
                The app is live now: <a href="https://app.dnianalytics.com" style={{ color: 'var(--steel-1)' }}>open DNI Studios</a>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
          {[['lock', 'Your data is safe'], ['shield', 'UK-based company'], ['chat', 'Direct founder access']].map(([icon, text]) => (
            <span key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'var(--text-subtle)' }}>
              <Icon name={icon} size={15} />{text}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
