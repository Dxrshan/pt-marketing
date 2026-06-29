'use client'
import { motion } from 'framer-motion'

function LiveSessionMockup() {
  return (
    <div style={{ background: '#0A0A18', borderRadius: 14, padding: 16, fontFamily: 'inherit', border: '1px solid rgba(91,123,255,0.15)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: '#475569', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#16a34a', animation: 'glow-pulse 2s infinite' }} />
            LIVE SESSION
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Marcus L.</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#7B96FF' }}>42:17</div>
          <div style={{ fontSize: 8, color: '#475569' }}>Session time</div>
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>Bench Press</span>
          <span style={{ fontSize: 9, color: '#475569' }}>4 sets planned</span>
        </div>
        {[
          { set: 1, kg: '80kg', reps: '8', done: true, pb: true },
          { set: 2, kg: '82.5kg', reps: '8', done: true, pb: false },
          { set: 3, kg: '82.5kg', reps: '7', done: true, pb: false },
          { set: 4, kg: '', reps: '', done: false, pb: false },
        ].map(s => (
          <div key={s.set} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', background: s.done ? 'rgba(255,255,255,0.03)' : 'rgba(91,123,255,0.08)', borderRadius: 6, marginBottom: 3, border: s.done ? 'none' : '1px solid rgba(91,123,255,0.2)' }}>
            <span style={{ fontSize: 9, color: '#475569', width: 30 }}>Set {s.set}</span>
            <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: s.done ? '#e2e8f0' : '#475569' }}>{s.done ? `${s.kg} × ${s.reps}` : '— logging —'}</span>
            {s.done && <span style={{ color: '#16a34a', fontSize: 10 }}>✓</span>}
            {s.pb && <span style={{ fontSize: 8, background: 'rgba(251,191,36,0.15)', color: '#fbbf24', padding: '1px 5px', borderRadius: 3 }}>🏆 PB!</span>}
            {!s.done && <div style={{ padding: '2px 6px', background: '#5B7BFF', borderRadius: 4, fontSize: 9, color: 'white' }}>Log</div>}
          </div>
        ))}
      </div>
      <div style={{ padding: '8px 12px', background: 'rgba(91,123,255,0.1)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: '#7B96FF' }}>⏱ Rest timer</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#7B96FF' }}>1:23</span>
      </div>
    </div>
  )
}

function AIMockup() {
  return (
    <div style={{ background: '#0A0A18', borderRadius: 14, padding: 16, fontFamily: 'inherit', border: '1px solid rgba(91,123,255,0.15)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #5B7BFF, #22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>✦</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>DNI Assistant</div>
          <div style={{ fontSize: 9, color: '#475569' }}>Powered by AI</div>
        </div>
      </div>
      {[
        { role: 'user', text: 'Book Marcus in for Thursday at 10am' },
        { role: 'ai', text: 'Done ✓ Marcus L. is booked for Thursday 3 July at 10:00am. No conflicts found. Shall I send him a confirmation?' },
        { role: 'user', text: 'Who has overdue payments this week?' },
        { role: 'ai', text: '3 clients have overdue payments: James T. (£240), Sarah K. (£160), Priya M. (£80). Total outstanding: £480.' },
      ].map((msg, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
          <div style={{
            maxWidth: '82%', padding: '8px 12px', borderRadius: msg.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
            background: msg.role === 'user' ? 'rgba(91,123,255,0.25)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${msg.role === 'user' ? 'rgba(91,123,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
            fontSize: 11, color: msg.role === 'user' ? '#c5d0ff' : '#d0d8ff', lineHeight: 1.5,
          }}>
            {msg.text}
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 12px', fontSize: 11, color: '#475569' }}>Ask anything about your studio...</div>
        <div style={{ width: 32, height: 32, background: '#5B7BFF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, cursor: 'pointer' }}>↑</div>
      </div>
    </div>
  )
}

const FEATURES = [
  {
    badge: 'Live Session Logger',
    headline: 'Log every set in real time. Your clients deserve more than a clipboard.',
    body: 'Track weight, reps, and rest times mid-session. Automatically spots personal bests, shows progress charts per exercise, and gives your clients an elite experience from your phone or tablet.',
    bullets: ['Auto-detects personal bests instantly', 'Built-in rest timer with audio cues', 'Per-exercise strength progression charts', 'Works on any device, mid-session'],
    mockup: <LiveSessionMockup />,
    reverse: false,
    accentColor: '#5B7BFF',
  },
  {
    badge: 'AI Assistant',
    headline: 'Book sessions, chase payments, and manage your studio — just by asking.',
    body: 'Your built-in AI assistant knows your entire studio. Ask it to book a client, find overdue payments, or check who hasn\'t trained in two weeks. No clicking through menus. Just results.',
    bullets: ['Book, reschedule & cancel sessions by chat', 'Instant overdue payment summaries', 'Client health & activity reports on demand', 'Clients get their own AI training coach'],
    mockup: <AIMockup />,
    reverse: true,
    accentColor: '#22D3EE',
  },
]

const FEATURE_GRID = [
  { icon: '👥', title: 'Client Portal', desc: 'Every client gets their own dashboard — workouts, wellness, progress, and upcoming sessions.' },
  { icon: '💰', title: 'Payments & Invoicing', desc: 'Log payments, auto-flag overdue accounts, and generate professional receipts instantly.' },
  { icon: '🎯', title: 'Lead Pipeline', desc: 'Track every enquiry from first message to paid client. Nothing falls through.' },
  { icon: '📊', title: 'Smart Dashboard', desc: 'Action items surface automatically — who needs attention before they ghost you.' },
  { icon: '📈', title: 'Progress Tracking', desc: 'Body metrics, strength curves, and daily wellness logs — all in one place.' },
  { icon: '🔔', title: 'Smart Alerts', desc: 'Automatic flags for at-risk clients, low packages, missed sessions, and milestones.' },
  { icon: '👤', title: 'Team Permissions', desc: 'Trainer, manager, admin, front desk — each with exactly the right level of access.' },
  { icon: '📅', title: 'Session Scheduling', desc: 'Full calendar with conflict detection, bulk session generation, and no-show tracking.' },
]

export default function FeaturesSection() {
  return (
    <section id="features" style={{ padding: '140px 0 100px', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 100 }}
        >
          <div className="badge badge-blue" style={{ marginBottom: 20, display: 'inline-flex' }}>The Platform</div>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 50px)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 16 }}>
            Everything you need.{' '}
            <span className="gradient-text">Nothing you don&apos;t.</span>
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 460, margin: '0 auto' }}>
            Built after talking to real PTs about what actually slows them down.
          </p>
        </motion.div>

        {/* 2 hero feature rows */}
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.badge}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64,
              alignItems: 'center', marginBottom: 120,
              direction: f.reverse ? 'rtl' : 'ltr',
            }}
            className="feature-row"
          >
            <div style={{ direction: 'ltr' }}>
              <span className="badge" style={{ marginBottom: 20, display: 'inline-flex', background: `${f.accentColor}15`, color: f.accentColor, border: `1px solid ${f.accentColor}30` }}>
                {f.badge}
              </span>
              <h3 style={{ fontSize: 'clamp(22px, 2.8vw, 34px)', fontWeight: 800, letterSpacing: '-0.8px', lineHeight: 1.2, marginBottom: 16, color: 'white' }}>
                {f.headline}
              </h3>
              <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 28 }}>
                {f.body}
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {f.bullets.map(b => (
                  <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.72)' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: `${f.accentColor}18`, border: `1px solid ${f.accentColor}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke={f.accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ direction: 'ltr' }}>{f.mockup}</div>
          </motion.div>
        ))}

        {/* Also included grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 36 }}
        >
          <p style={{ fontSize: 12, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '2.5px', fontWeight: 700 }}>
            Also included
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }} className="feature-small-grid">
          {FEATURE_GRID.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="feature-card"
              style={{ padding: '18px 20px' }}
            >
              <div style={{ fontSize: 22, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'white', marginBottom: 5 }}>{f.title}</div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .feature-row { grid-template-columns: 1fr !important; direction: ltr !important; gap: 32px !important; margin-bottom: 72px !important; }
          .feature-small-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .feature-small-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
