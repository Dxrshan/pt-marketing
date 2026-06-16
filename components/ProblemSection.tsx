'use client'
import { motion } from 'framer-motion'

const PAINS = [
  {
    icon: '💬',
    tool: 'WhatsApp',
    problem: 'Chasing clients in group chats, sending plans as screenshots, losing conversations in DMs.',
  },
  {
    icon: '📊',
    tool: 'Google Sheets',
    problem: 'Manually logging every session, payment, and attendance. One mistake breaks everything.',
  },
  {
    icon: '📝',
    tool: 'Notes & PDFs',
    problem: 'Sending workout plans as PDFs with zero tracking. You have no idea if they\'re even reading it.',
  },
  {
    icon: '📅',
    tool: 'Calendly + texts',
    problem: 'Bookings coming in from everywhere. No joined-up view. Double bookings. No-shows with no trace.',
  },
  {
    icon: '💳',
    tool: 'Bank transfers',
    problem: 'Manually checking who\'s paid. Awkward payment chasing. No professional invoices.',
  },
  {
    icon: '🤷',
    tool: 'Nothing',
    problem: 'Zero visibility on client progress, wellness, or business health. You\'re flying blind.',
  },
]

export default function ProblemSection() {
  return (
    <section
      id="problem"
      style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Subtle divider */}
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          <div className="badge badge-blue" style={{ marginBottom: 20, display: 'inline-flex' }}>
            The Problem
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 20 }}>
            Sound familiar?
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.45)', maxWidth: 540, margin: '0 auto' }}>
            The average PT is running a serious business through a patchwork of consumer apps that were never built for this.
          </p>
        </motion.div>

        {/* Pain grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="problem-grid">
          {PAINS.map((pain, i) => (
            <motion.div
              key={pain.tool}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="feature-card"
              style={{ padding: '24px 24px' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>
                  {pain.icon}
                </div>
                <div>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)',
                    textDecoration: 'line-through', marginBottom: 6,
                    letterSpacing: '0.5px',
                  }}>
                    {pain.tool}
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                    {pain.problem}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transition statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: 72 }}
        >
          <div style={{ display: 'inline-block', padding: '20px 40px', borderRadius: 16, background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)' }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: 'white', letterSpacing: '-0.5px' }}>
              There&apos;s a better way.
            </p>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
              One platform. Built for how you actually train.
            </p>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .problem-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .problem-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
