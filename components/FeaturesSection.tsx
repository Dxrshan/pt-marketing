'use client'
import { motion } from 'framer-motion'

/* ─── Mini UI Mockups ─────────────────────────────────── */

function LiveSessionMockup() {
  return (
    <div style={{ background: '#0f172a', borderRadius: 14, padding: 16, fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: '#475569', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#16a34a', animation: 'glow-pulse 2s infinite' }} />
            LIVE SESSION
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Marcus L.</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#2563EB' }}>42:17</div>
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
          <div key={s.set} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', background: s.done ? 'rgba(255,255,255,0.03)' : 'rgba(37,99,235,0.08)', borderRadius: 6, marginBottom: 3, border: s.done ? 'none' : '1px solid rgba(37,99,235,0.2)' }}>
            <span style={{ fontSize: 9, color: '#475569', width: 30 }}>Set {s.set}</span>
            <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: s.done ? '#e2e8f0' : '#475569' }}>{s.done ? `${s.kg} × ${s.reps}` : '— logging —'}</span>
            {s.done && <span style={{ color: '#16a34a', fontSize: 10 }}>✓</span>}
            {s.pb && <span style={{ fontSize: 8, background: 'rgba(251,191,36,0.15)', color: '#fbbf24', padding: '1px 5px', borderRadius: 3 }}>🏆 PB!</span>}
            {!s.done && <div style={{ display: 'flex', gap: 3 }}>
              <div style={{ padding: '2px 6px', background: '#2563EB', borderRadius: 4, fontSize: 9, color: 'white', cursor: 'pointer' }}>Log</div>
            </div>}
          </div>
        ))}
      </div>

      <div style={{ padding: '8px 12px', background: 'rgba(37,99,235,0.1)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: '#60a5fa' }}>⏱ Rest timer</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#60a5fa' }}>1:23</span>
      </div>
    </div>
  )
}

function ClientPortalMockup() {
  return (
    <div style={{ background: '#f1f5f9', borderRadius: 14, padding: 14, fontFamily: 'inherit' }}>
      <div style={{ background: '#0f172a', borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>My Dashboard</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: 14 }}>🔥</div>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#fbbf24' }}>14</span>
            <span style={{ fontSize: 9, color: '#475569' }}>day streak</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {[
            { label: 'Workouts', value: '24', sub: 'this month', color: '#2563EB' },
            { label: 'Bodyweight', value: '81.2', sub: 'kg (-1.8)', color: '#16a34a' },
            { label: 'Next PT', value: 'Thu', sub: '10:00 AM', color: '#7c3aed' },
          ].map(m => (
            <div key={m.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 7, padding: '7px 8px' }}>
              <div style={{ fontSize: 7, color: '#475569', marginBottom: 2 }}>{m.label}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 7, color: '#374151' }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 10, padding: '10px 14px', marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Daily Wellness Log</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: 'Energy', value: 4, emoji: '⚡' },
            { label: 'Sleep', value: 5, emoji: '😴' },
            { label: 'Stress', value: 2, emoji: '🧘' },
            { label: 'Digestion', value: 4, emoji: '💚' },
          ].map(w => (
            <div key={w.label} style={{ flex: 1, textAlign: 'center', minWidth: 40 }}>
              <div style={{ fontSize: 14 }}>{w.emoji}</div>
              <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 3 }}>
                {[1,2,3,4,5].map(n => (
                  <div key={n} style={{ width: 5, height: 5, borderRadius: 1, background: n <= w.value ? '#2563EB' : '#e2e8f0' }} />
                ))}
              </div>
              <div style={{ fontSize: 7, color: '#94a3b8', marginTop: 2 }}>{w.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 10, padding: '10px 14px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Training Calendar</div>
        <div style={{ display: 'flex', gap: 3 }}>
          {['M','T','W','T','F','S','S'].map((d, i) => {
            const status = i < 2 ? 'done' : i === 2 ? 'today' : 'upcoming'
            return (
              <div key={i} style={{
                flex: 1, padding: '4px 0', borderRadius: 5, textAlign: 'center', fontSize: 7, fontWeight: 600,
                background: status === 'done' ? '#16a34a' : status === 'today' ? '#2563EB' : '#f1f5f9',
                color: status === 'done' || status === 'today' ? 'white' : '#94a3b8',
              }}>{d}</div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function SmartDashboardMockup() {
  return (
    <div style={{ background: '#f1f5f9', borderRadius: 14, padding: 14, fontFamily: 'inherit' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>Business Health</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        {[
          { label: 'Monthly Revenue', value: '£4,120', change: '+8%', up: true },
          { label: 'Active Clients', value: '18', change: '+2 this week', up: true },
          { label: 'Avg Client Score', value: '82/100', change: '⬆ Healthy', up: true },
          { label: 'Overdue Payments', value: '£480', change: '2 clients', up: false },
        ].map(m => (
          <div key={m.label} style={{ background: 'white', borderRadius: 8, padding: '8px 10px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 8, color: '#64748b', marginBottom: 3 }}>{m.label}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{m.value}</div>
            <div style={{ fontSize: 8, color: m.up ? '#16a34a' : '#dc2626', marginTop: 1 }}>{m.change}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'white', borderRadius: 8, padding: '8px 10px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Revenue — Last 6 months</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 40 }}>
          {[52, 61, 58, 70, 78, 85].map((h, i) => (
            <div key={i} style={{ flex: 1, background: i === 5 ? '#2563EB' : `rgba(37,99,235,${0.2 + i * 0.06})`, borderRadius: '3px 3px 0 0', height: `${h}%` }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
          {['Jan','Feb','Mar','Apr','May','Jun'].map(m => (
            <div key={m} style={{ flex: 1, textAlign: 'center', fontSize: 7, color: '#94a3b8' }}>{m}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Feature rows ────────────────────────────────────── */

const FEATURES = [
  {
    badge: 'Live Session Logger',
    headline: 'Log every set in real time. Your clients deserve more than a clipboard.',
    body: 'Track weight, reps, and rest times mid-session. DNI Studio automatically spots personal bests, shows progress charts per exercise, and gives your clients an elite experience — from your phone or tablet.',
    bullets: ['Real-time PB detection & celebration', 'Built-in rest timer', 'Per-exercise progress history', 'Works on any device'],
    mockup: <LiveSessionMockup />,
    reverse: false,
    accentColor: '#2563EB',
  },
  {
    badge: 'Client Portal',
    headline: 'Give your clients their own dashboard. They\'ll never want to leave.',
    body: 'Every client gets a professional portal where they log their own workouts, track daily wellness (energy, sleep, stress, nutrition), and see their progress. You see all of it in real time — no chasing for updates.',
    bullets: ['Daily wellness logs (8 metrics)', 'Independent workout logging', 'Streak & habit tracking', 'Trainer can see everything'],
    mockup: <ClientPortalMockup />,
    reverse: true,
    accentColor: '#7c3aed',
  },
  {
    badge: 'Smart Dashboard',
    headline: 'See who needs your attention before they ghost you.',
    body: 'Your dashboard surfaces the right information at the right time. Client health scores, action items, overdue payments, and revenue trends — all without opening a spreadsheet.',
    bullets: ['Automatic client health scoring', 'Action items that update in real time', 'Revenue & session analytics', 'Business health at a glance'],
    mockup: <SmartDashboardMockup />,
    reverse: false,
    accentColor: '#06B6D4',
  },
]

const FEATURE_GRID = [
  { icon: '💪', title: 'Workout Plans', desc: 'Build named plans with exercises, sets, reps, and notes. Assign to any client instantly.' },
  { icon: '💰', title: 'Payment Tracking', desc: 'Log payments, amounts, due dates. Overdue alerts so you never forget to chase.' },
  { icon: '🎯', title: 'Lead Pipeline', desc: 'Track every prospect from first enquiry to paid client. Never lose a lead again.' },
  { icon: '📅', title: 'Session Scheduling', desc: 'Scheduled, completed, no-show, cancelled — a clear record of every session.' },
  { icon: '📈', title: 'Progress Tracking', desc: 'Body measurements, strength charts, and training calendar — green vs red days at a glance.' },
  { icon: '👥', title: 'Team Management', desc: 'Multiple staff roles — trainer, manager, admin. Each with the right level of access.' },
]

export default function FeaturesSection() {
  return (
    <section id="features" style={{ padding: '120px 0', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 96 }}
        >
          <div className="badge badge-blue" style={{ marginBottom: 20, display: 'inline-flex' }}>The Platform</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 20 }}>
            Everything you need.{' '}
            <span className="gradient-text">Nothing you don&apos;t.</span>
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.45)', maxWidth: 500, margin: '0 auto' }}>
            Built after talking to real PTs about what actually slows them down.
          </p>
        </motion.div>

        {/* Alternating feature rows */}
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.badge}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 60,
              alignItems: 'center',
              marginBottom: 100,
              direction: f.reverse ? 'rtl' : 'ltr',
            }}
            className="feature-row"
          >
            {/* Copy */}
            <div style={{ direction: 'ltr' }}>
              <span className="badge" style={{
                marginBottom: 20, display: 'inline-flex',
                background: `${f.accentColor}18`,
                color: f.accentColor,
                border: `1px solid ${f.accentColor}30`,
              }}>
                {f.badge}
              </span>
              <h3 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 16, color: 'white' }}>
                {f.headline}
              </h3>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 24 }}>
                {f.body}
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {f.bullets.map(b => (
                  <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: `${f.accentColor}20`, border: `1px solid ${f.accentColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke={f.accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mockup */}
            <div style={{ direction: 'ltr' }}>
              {f.mockup}
            </div>
          </motion.div>
        ))}

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>
            Also included
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="feature-small-grid">
          {FEATURE_GRID.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="feature-card"
              style={{ padding: '20px 22px' }}
            >
              <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 6 }}>{f.title}</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .feature-row { grid-template-columns: 1fr !important; direction: ltr !important; gap: 30px !important; }
          .feature-small-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .feature-small-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
