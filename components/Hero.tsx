'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function DashboardMockup() {
  return (
    <div className="app-mockup" style={{ display: 'flex', height: '100%', minHeight: 400 }}>
      {/* Sidebar */}
      <div className="mockup-sidebar" style={{ width: 170, padding: '16px 0' }}>
        <div style={{ padding: '0 14px 18px', display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: 'linear-gradient(135deg, #2563EB, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" /></svg>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>DNI Studio</span>
        </div>

        {[
          { label: 'Dashboard', active: true, dot: '#2563EB' },
          { label: 'Clients', active: false, dot: null },
          { label: 'Bookings', active: false, dot: null },
          { label: 'Workout Plans', active: false, dot: null },
          { label: 'Progress', active: false, dot: null },
          { label: 'Payments', active: false, dot: null },
          { label: 'Leads', active: false, dot: null },
        ].map(item => (
          <div key={item.label} className={`mockup-nav-item ${item.active ? 'active' : ''}`}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: item.dot || 'transparent', flexShrink: 0 }} />
            <span>{item.label}</span>
          </div>
        ))}

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white' }}>D</div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: '#e2e8f0' }}>Darshan M.</div>
            <div style={{ fontSize: 8, color: '#475569' }}>Admin</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '14px 16px', background: '#f1f5f9', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Good morning, Darshan 👋</div>
            <div style={{ fontSize: 9, color: '#64748b' }}>Monday, 16 June 2026</div>
          </div>
          <div style={{ padding: '5px 10px', background: '#2563EB', color: 'white', borderRadius: 6, fontSize: 9, fontWeight: 600, cursor: 'pointer' }}>+ New Session</div>
        </div>

        {/* Metrics row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
          {[
            { label: "Today's Sessions", value: '4', sub: '2 completed', color: '#2563EB', bg: '#eff6ff' },
            { label: 'Monthly Revenue', value: '£3,840', sub: '+12% vs last month', color: '#16a34a', bg: '#f0fdf4' },
            { label: 'Active Clients', value: '18', sub: '3 action items', color: '#7c3aed', bg: '#faf5ff' },
          ].map(card => (
            <div key={card.label} className="mockup-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderRadius: '0 0 0 40px', background: card.bg, opacity: 0.8 }} />
              <div style={{ fontSize: 8, color: '#64748b', marginBottom: 3, fontWeight: 500 }}>{card.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: card.color, lineHeight: 1 }}>{card.value}</div>
              <div style={{ fontSize: 7.5, color: '#94a3b8', marginTop: 2 }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Action Items */}
        <div className="mockup-card" style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#0f172a', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>Action Items</span>
            <span style={{ color: '#2563EB', fontWeight: 500 }}>3 items</span>
          </div>
          {[
            { name: 'James T.', avatar: 'J', issue: 'Payment overdue — £240', dot: '#dc2626', bg: '#fef2f2' },
            { name: 'Sarah K.', avatar: 'S', issue: 'No session in 14 days', dot: '#d97706', bg: '#fffbeb' },
            { name: 'Marcus L.', avatar: 'M', issue: '2 sessions remaining in package', dot: '#2563EB', bg: '#eff6ff' },
          ].map((item, i) => (
            <div key={item.name} style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '5px 0',
              borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none',
            }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: item.bg, border: `1.5px solid ${item.dot}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: item.dot, flexShrink: 0 }}>{item.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: '#0f172a' }}>{item.name}</div>
                <div style={{ fontSize: 8, color: '#64748b' }}>{item.issue}</div>
              </div>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.dot, flexShrink: 0 }} />
            </div>
          ))}
        </div>

        {/* Training calendar strip */}
        <div className="mockup-card">
          <div style={{ fontSize: 9, fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>This Week</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { day: 'M', status: 'done' }, { day: 'T', status: 'done' }, { day: 'W', status: 'today' },
              { day: 'T', status: 'upcoming' }, { day: 'F', status: 'upcoming' }, { day: 'S', status: 'rest' }, { day: 'S', status: 'rest' },
            ].map((d, i) => (
              <div key={i} style={{
                flex: 1, padding: '4px 0', borderRadius: 5, textAlign: 'center',
                background: d.status === 'done' ? '#16a34a' : d.status === 'today' ? '#2563EB' : d.status === 'upcoming' ? '#f1f5f9' : '#f8fafc',
                color: d.status === 'done' || d.status === 'today' ? 'white' : '#94a3b8',
                fontSize: 8, fontWeight: 600,
                outline: d.status === 'today' ? '1.5px solid #2563EB' : 'none',
                outlineOffset: 1,
              }}>
                {d.day}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function LiveSessionBadge() {
  return (
    <div style={{
      position: 'absolute', top: -12, right: -12,
      background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12, padding: '10px 14px', minWidth: 180,
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    }} className="float-animation-2">
      <div style={{ fontSize: 10, color: '#64748b', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', animation: 'glow-pulse 2s ease infinite' }} />
        LIVE SESSION — Marcus L.
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'white', marginBottom: 4 }}>Bench Press</div>
      {[
        { set: 1, kg: '80kg', reps: '8', pb: true },
        { set: 2, kg: '82.5kg', reps: '7', pb: false },
      ].map(s => (
        <div key={s.set} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9, color: '#94a3b8', marginBottom: 3 }}>
          <span style={{ color: '#475569' }}>Set {s.set}</span>
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{s.kg} × {s.reps}</span>
          <span style={{ color: '#16a34a' }}>✓</span>
          {s.pb && <span style={{ fontSize: 8, background: 'rgba(251,191,36,0.15)', color: '#fbbf24', padding: '1px 4px', borderRadius: 3 }}>🏆 PB</span>}
        </div>
      ))}
      <div style={{ marginTop: 6, padding: '4px 8px', background: 'rgba(37,99,235,0.15)', borderRadius: 6, fontSize: 9, color: '#60a5fa', textAlign: 'center' }}>
        Rest timer: 0:42 ⏱
      </div>
    </div>
  )
}

const STATS = [
  { value: '18', label: 'Clients tracked' },
  { value: '£3.8k', label: 'Revenue this month' },
  { value: '47', label: 'Sessions logged' },
]

export default function Hero() {
  const [email, setEmail] = useState('')
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
        body: JSON.stringify({ email, source: 'hero' }),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    }
    setLoading(false)
  }

  return (
    <section
      id="hero"
      className="mesh-bg noise"
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 100, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}
    >
      {/* Glow orbs */}
      <div className="glow-orb glow-blue" style={{ width: 700, height: 700, top: '-20%', left: '-15%' }} />
      <div className="glow-orb glow-cyan" style={{ width: 500, height: 500, top: '30%', right: '-10%' }} />
      <div className="glow-orb glow-purple" style={{ width: 400, height: 400, bottom: '-10%', left: '40%' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }} className="hero-grid">

          {/* Left — copy */}
          <div>
            {/* Founding badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="badge badge-blue" style={{ marginBottom: 24, display: 'inline-flex' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa', animation: 'glow-pulse 2s ease infinite' }} />
                Founding Member Access — Limited Spots
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontSize: 'clamp(38px, 5vw, 62px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-2px', marginBottom: 24, color: 'white' }}
            >
              Stop Running Your{' '}
              <span className="gradient-text">£100k Business</span>
              {' '}From a WhatsApp Group.
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 36, maxWidth: 500 }}
            >
              DNI Studio gives personal trainers and studios one professional platform to manage clients, log sessions in real time, track payments, and grow — without the chaos.
            </motion.p>

            {/* Email capture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {!submitted ? (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="input-dark"
                      style={{ flex: 1, minWidth: 220, padding: '13px 18px', borderRadius: 10, fontSize: 15 }}
                    />
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={loading}
                      style={{ padding: '13px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap', position: 'relative', zIndex: 1, opacity: loading ? 0.7 : 1 }}
                    >
                      {loading ? 'Joining...' : 'Get Early Access →'}
                    </button>
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 10 }}>
                    Free 30-day trial · No credit card · Cancel anytime
                  </p>
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    padding: '16px 24px', borderRadius: 12,
                    background: 'rgba(22, 163, 74, 0.1)',
                    border: '1px solid rgba(22, 163, 74, 0.3)',
                    color: '#4ade80', fontSize: 15, fontWeight: 500,
                  }}
                >
                  🎉 You&apos;re on the list! We&apos;ll be in touch very soon.
                </motion.div>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              style={{ display: 'flex', gap: 32, marginTop: 48 }}
            >
              {STATS.map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg, #ffffff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — app mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative' }}
            className="hero-mockup float-animation"
          >
            <DashboardMockup />
            <LiveSessionBadge />

            {/* Wellness badge */}
            <div style={{
              position: 'absolute', bottom: -10, left: -14,
              background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, padding: '10px 14px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }} className="float-animation-2">
              <div style={{ fontSize: 9, color: '#64748b', marginBottom: 5 }}>CLIENT PORTAL</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#4ade80' }}>🔥 14</div>
                  <div style={{ fontSize: 8, color: '#64748b' }}>Day Streak</div>
                </div>
                <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.08)' }} />
                <div>
                  <div style={{ fontSize: 9, fontWeight: 600, color: '#e2e8f0', marginBottom: 3 }}>Today&apos;s Wellness</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {['Energy', 'Sleep', 'Mood'].map((m, i) => (
                      <div key={m} style={{ textAlign: 'center' }}>
                        <div style={{ width: 20, height: 20, borderRadius: 5, background: ['rgba(251,191,36,0.2)', 'rgba(37,99,235,0.2)', 'rgba(22,163,74,0.2)'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>
                          {['⚡', '😴', '😊'][i]}
                        </div>
                        <div style={{ fontSize: 7, color: '#475569', marginTop: 2 }}>{[4, 5, 4][i]}/5</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-mockup { display: none; }
        }
      `}</style>
    </section>
  )
}
