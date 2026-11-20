'use client'
import { motion } from 'framer-motion'
import { Reveal, SectionHead, SpotlightCard, IconTile, Icon } from './fx'

const PAINS = [
  { icon: 'chat',     tool: 'WhatsApp',          problem: 'Chasing clients in group chats, sending plans as screenshots, losing conversations in DMs.' },
  { icon: 'sheet',    tool: 'Google Sheets',     problem: 'Manually logging every session, payment and attendance. One mistake breaks everything.' },
  { icon: 'note',     tool: 'Notes & PDFs',      problem: 'Sending plans as PDFs with zero tracking. No idea if anyone is actually reading them.' },
  { icon: 'calendar', tool: 'Calendly + texts',  problem: 'Bookings coming in from everywhere. Double bookings. No-shows with no trace.' },
  { icon: 'bank',     tool: 'Bank transfers',    problem: 'Manually checking who has paid. Awkward chasing. No professional invoices.' },
  { icon: 'eyeoff',   tool: 'Flying blind',      problem: 'Zero visibility on client progress, wellness or how the business is really doing.' },
]

const REPLACES = ['WhatsApp groups', 'Google Sheets', 'Paper diaries', 'Calendly', 'PDF plans', 'Bank-transfer chasing', 'Notes app', 'Invoice templates', 'Excel trackers', 'Sticky notes']

export default function ProblemSection() {
  return (
    <section id="problem" style={{ padding: '80px 0 140px', position: 'relative' }}>
      {/* Ticker of the tools you stop paying attention to */}
      <Reveal>
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-subtle)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 22 }}>
          One platform instead of
        </div>
        <div className="marquee" style={{ marginBottom: 120 }}>
          <div className="marquee-track">
            {[...REPLACES, ...REPLACES].map((r, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: 999, whiteSpace: 'nowrap',
                border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)',
                fontSize: 15, color: 'var(--text-muted)', textDecoration: 'line-through', textDecorationColor: 'rgba(255,255,255,0.35)',
              }}>
                <Icon name="check" size={14} style={{ color: 'var(--steel-4)' }} />{r}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
        <SectionHead
          eyebrow="The problem"
          title="Serious business."
          accent="Patchwork tools."
          sub="Most PTs run a real business on a stack of consumer apps that were never built for it. It costs you hours every week, and clients notice."
        />

        <div className="pain-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 64 }}>
          {PAINS.map((p, i) => (
            <motion.div
              key={p.tool}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <SpotlightCard style={{ padding: 26, height: '100%' }}>
                <IconTile name={p.icon} />
                <div style={{ fontSize: 17, fontWeight: 700, marginTop: 18, color: 'var(--text)' }}>{p.tool}</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-muted)', marginTop: 8 }}>{p.problem}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.1} style={{ textAlign: 'center', marginTop: 56 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>
            <span style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, var(--steel-3))' }} />
            There&apos;s a better way.
            <span style={{ width: 40, height: 1, background: 'linear-gradient(90deg, var(--steel-3), transparent)' }} />
          </span>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 900px) { .pain-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .pain-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
