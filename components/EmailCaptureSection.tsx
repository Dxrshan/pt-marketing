'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

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
        body: JSON.stringify({ email, name, type, source: 'cta' }),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    }
    setLoading(false)
  }

  return (
    <section id="waitlist" style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
      <div className="glow-orb glow-blue" style={{ width: 600, height: 600, top: '0%', left: '50%', transform: 'translateX(-50%)', opacity: 0.25 }} />
      <div className="glow-orb glow-cyan" style={{ width: 400, height: 400, bottom: '-10%', right: '10%', opacity: 0.15 }} />

      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="badge badge-blue" style={{ marginBottom: 24, display: 'inline-flex' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa', animation: 'glow-pulse 2s ease infinite' }} />
            Limited Founding Member Spots
          </div>

          <h2 style={{ fontSize: 'clamp(32px, 5vw, 58px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.08, marginBottom: 20 }}>
            Join the founding<br />
            <span className="gradient-text">members.</span>
          </h2>

          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginBottom: 40 }}>
            Get early access, lock in founding member pricing forever, and help shape the future of DNI Studio.
          </p>
        </motion.div>

        {!submitted ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 24,
              padding: '36px',
            }}
          >
            {/* Type toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4 }}>
              {(['solo', 'studio'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 9, border: 'none',
                    background: type === t ? 'rgba(37,99,235,0.5)' : 'transparent',
                    color: type === t ? 'white' : 'rgba(255,255,255,0.4)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                    fontFamily: 'inherit',
                  }}
                >
                  {t === 'solo' ? '👤 Solo Trainer' : '🏢 Studio / Gym'}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <input
                type="text"
                placeholder="Your first name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-dark"
                style={{ padding: '14px 18px', borderRadius: 12, fontSize: 15, width: '100%' }}
              />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="input-dark"
                style={{ padding: '14px 18px', borderRadius: 12, fontSize: 15, width: '100%' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%', padding: '16px', borderRadius: 12,
                fontSize: 16, fontWeight: 700,
                position: 'relative', zIndex: 1,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Securing your spot...' : 'Secure My Founding Spot →'}
            </button>

            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 14 }}>
              Free 30-day trial · No credit card · Cancel anytime · Founding price locked forever
            </p>
          </motion.form>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              padding: '48px 36px',
              borderRadius: 24,
              background: 'rgba(22, 163, 74, 0.06)',
              border: '1px solid rgba(22, 163, 74, 0.2)',
            }}
          >
            <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 12 }}>You&apos;re in!</h3>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
              Welcome to the founding members list. We&apos;ll be in touch soon with your early access link and everything you need to get started.
            </p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 16 }}>
              In the meantime, the app is live at{' '}
              <a href="https://pt-manager.onrender.com" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>
                pt-manager.onrender.com
              </a>
            </p>
          </motion.div>
        )}

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}
        >
          {[
            { icon: '🔒', text: 'Your data is safe' },
            { icon: '🇬🇧', text: 'UK-based company' },
            { icon: '💬', text: 'Direct founder access' },
          ].map(item => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
