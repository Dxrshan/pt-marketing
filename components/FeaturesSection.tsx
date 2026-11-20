'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { SectionHead, SpotlightCard, Icon, IconTile, Counter, Reveal } from './fx'

const EASE = [0.22, 1, 0.36, 1] as const

function TileHead({ icon, kicker, title, text }: { icon: string; kicker: string; title: string; text: string }) {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <IconTile name={icon} size={40} />
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--steel-3)' }}>{kicker}</span>
      </div>
      <h3 style={{ fontSize: 'clamp(20px, 2vw, 26px)', fontWeight: 750, letterSpacing: '-0.02em', marginTop: 18, color: 'var(--text)' }}>{title}</h3>
      <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-muted)', marginTop: 8, maxWidth: 440 }}>{text}</p>
    </div>
  )
}

/* Live session logger: sets appear one by one, rest timer counts down. */
function LoggerDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-80px' })
  const [n, setN] = useState(0)
  const [rest, setRest] = useState(90)
  const reduce = useReducedMotion()
  const sets = [['Set 1', '80kg × 8', false], ['Set 2', '82.5kg × 8', false], ['Set 3', '85kg × 6', true], ['Set 4', '85kg × 6', false]] as const
  useEffect(() => {
    if (!inView) return
    if (reduce) { setN(sets.length); return }
    setN(0)
    const t = setInterval(() => setN(v => (v >= sets.length ? 0 : v + 1)), 1100)
    return () => clearInterval(t)
  }, [inView, reduce])
  useEffect(() => {
    if (!inView || reduce) return
    const t = setInterval(() => setRest(r => (r <= 1 ? 90 : r - 1)), 1000)
    return () => clearInterval(t)
  }, [inView, reduce])
  return (
    <div ref={ref} className="mockup-card" style={{ padding: 18, borderRadius: 16, marginTop: 26 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#8c929b' }}><span className="live-dot" /> LIVE · Marcus L.</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 6 }}>Bench press</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="steel-text" style={{ fontSize: 30, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>42:17</div>
          <div style={{ fontSize: 10.5, color: '#6b717b' }}>session time</div>
        </div>
      </div>
      <div style={{ marginTop: 14, minHeight: 150 }}>
        {sets.map(([s, v, pb], i) => (
          <motion.div key={s}
            initial={false}
            animate={{ opacity: i < n ? 1 : 0.18, x: i < n ? 0 : -6 }}
            transition={{ duration: 0.45, ease: EASE }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 14 }}
          >
            <span style={{ color: '#6b717b' }}>{s}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 650 }}>
              {v}
              {pb && i < n && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  style={{ fontSize: 10.5, fontWeight: 800, color: '#0b0c0f', padding: '3px 8px', borderRadius: 999, background: 'linear-gradient(180deg,#fff,#c4c9d0)' }}>NEW PB</motion.span>
              )}
              <Icon name="check" size={15} style={{ color: i < n ? '#5ee0a0' : 'transparent' }} />
            </span>
          </motion.div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#c3c8cf' }}><Icon name="timer" size={15} /> Rest timer</span>
        <span style={{ fontWeight: 800, fontSize: 18, fontVariantNumeric: 'tabular-nums' }}>{Math.floor(rest / 60)}:{String(rest % 60).padStart(2, '0')}</span>
      </div>
      <div style={{ height: 3, borderRadius: 3, background: 'rgba(255,255,255,0.06)', marginTop: 8, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(rest / 90) * 100}%`, background: 'linear-gradient(90deg,#9aa0a8,#fff)', transition: 'width 1s linear' }} />
      </div>
    </div>
  )
}

/* AI assistant: a short conversation types itself out. */
const CHAT = [
  { me: true, t: 'Book Marcus in for Thursday at 10am' },
  { me: false, t: 'Done. Marcus L. is booked for Thursday 10:00. No conflicts. Shall I send him a confirmation?' },
  { me: true, t: 'Who has overdue payments?' },
  { me: false, t: '3 clients: James T. (£240), Sarah K. (£160), Priya M. (£80). £480 outstanding in total.' },
]
function ChatDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-80px' })
  const [n, setN] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (!inView) return
    if (reduce) { setN(CHAT.length); return }
    setN(v => Math.max(v, 1))
    const t = setInterval(() => setN(v => (v >= CHAT.length + 1 ? 1 : v + 1)), 1500)
    return () => clearInterval(t)
  }, [inView, reduce])
  const shown = CHAT.slice(0, Math.min(n, CHAT.length))
  return (
    <div ref={ref} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 236 }}>
      <AnimatePresence initial={false}>
        {shown.map((m, i) => (
          <motion.div key={i + m.t}
            initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{
              alignSelf: m.me ? 'flex-end' : 'flex-start', maxWidth: '86%', padding: '10px 14px', borderRadius: 14, fontSize: 13.5, lineHeight: 1.5,
              ...(m.me
                ? { background: 'linear-gradient(180deg,#f4f6f8,#c9ced5)', color: '#0b0c0f', borderBottomRightRadius: 4, fontWeight: 550 }
                : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#dfe3e8', borderBottomLeftRadius: 4 }),
            }}
          >{m.t}</motion.div>
        ))}
      </AnimatePresence>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', fontSize: 13, color: '#6b717b' }}>
        <Icon name="sparkle" size={15} style={{ color: '#c3c8cf' }} /> Ask anything about your studio…
      </div>
    </div>
  )
}

/* Revenue: bars grow on view. */
function RevenueDemo() {
  const bars = [38, 52, 46, 64, 58, 76, 70, 88, 82, 100]
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span className="steel-text" style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}><Counter to={3840} prefix="£" /></span>
        <span style={{ fontSize: 13, color: '#8ff0bf', fontWeight: 600 }}>+12%</span>
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--text-subtle)' }}>Revenue this month</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7, height: 110, marginTop: 18 }}>
        {bars.map((h, i) => (
          <motion.div key={i}
            initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }}
            transition={{ duration: 0.9, delay: i * 0.06, ease: EASE }}
            style={{ flex: 1, borderRadius: '6px 6px 2px 2px', background: i === bars.length - 1 ? 'linear-gradient(180deg,#ffffff,#9aa0a8)' : 'linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.05))' }}
          />
        ))}
      </div>
    </div>
  )
}

/* Pipeline: a lead card moves across stages. */
function PipelineDemo() {
  const stages = ['Enquiry', 'Consult', 'Trial', 'Client']
  const [s, setS] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setS(v => (v + 1) % stages.length), 1600)
    return () => clearInterval(t)
  }, [reduce])
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 24 }}>
      {stages.map((st, i) => (
        <div key={st} style={{ borderRadius: 12, padding: 8, minHeight: 112, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 11, color: '#8c929b', marginBottom: 8 }}>{st}</div>
          {i === s && (
            <motion.div layoutId="lead-card" transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              style={{ padding: '8px 9px', borderRadius: 9, background: i === 3 ? 'linear-gradient(180deg,#fff,#c9ced5)' : '#1b1e24', color: i === 3 ? '#0b0c0f' : '#e8eaee', border: '1px solid rgba(255,255,255,0.1)', fontSize: 11.5, fontWeight: 650 }}>
              Priya M.
              <div style={{ fontSize: 10, fontWeight: 500, opacity: .7 }}>{i === 3 ? 'Signed · £59/mo' : 'Website enquiry'}</div>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  )
}

/* Client app: a phone with the client's day. */
function PhoneDemo() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
      <motion.div
        initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE }}
        style={{ width: 210, padding: 8, borderRadius: 34, background: 'linear-gradient(160deg,#3a3e46,#15171c)', boxShadow: '0 30px 60px -20px rgba(0,0,0,.9), inset 0 1px 0 rgba(255,255,255,.2)' }}
      >
        <div style={{ borderRadius: 27, background: '#0d0f12', padding: '18px 14px 16px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width: 60, height: 6, borderRadius: 6, background: '#1f2228', margin: '0 auto 14px' }} />
          <div style={{ fontSize: 11, color: '#8c929b' }}>Good morning, Sarah</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
            <span className="steel-text" style={{ fontSize: 30, fontWeight: 800 }}>14</span>
            <span style={{ fontSize: 11, color: '#c3c8cf' }}>day streak</span>
          </div>
          {[['Today', 'Upper body · 45 min'], ['Nutrition', '1,840 / 2,100 kcal'], ['Wellness', 'Sleep 8h · Energy 4/5']].map(([k, v], i) => (
            <div key={k} style={{ marginTop: 10, padding: '9px 10px', borderRadius: 11, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 9.5, color: '#6b717b' }}>{k}</div>
              <div style={{ fontSize: 11.5, fontWeight: 650, color: '#e8eaee', marginTop: 2 }}>{v}</div>
              {i === 1 && <div style={{ height: 3, borderRadius: 3, marginTop: 6, background: 'rgba(255,255,255,0.08)' }}><motion.div initial={{ width: 0 }} whileInView={{ width: '88%' }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3, ease: EASE }} style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg,#9aa0a8,#fff)' }} /></div>}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

const ALSO = [
  ['grid', 'Smart dashboard', 'Action items surface automatically'],
  ['bell', 'Smart alerts', 'At-risk clients, low packages, no-shows'],
  ['trend', 'Progress tracking', 'Body metrics and strength curves'],
  ['calendar', 'Scheduling', 'Conflict detection and bulk sessions'],
  ['users', 'Team permissions', 'Trainer, manager, admin, front desk'],
  ['shield', 'Your data, protected', 'Encrypted, UK-based company'],
]

export default function FeaturesSection() {
  const cell = (i: number) => ({
    initial: { opacity: 0, y: 34 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.8, delay: (i % 3) * 0.08, ease: EASE },
  })
  return (
    <section id="features" style={{ padding: '140px 0 120px', position: 'relative' }}>
      <div className="glow-orb glow-blue" style={{ width: 900, height: 900, top: '10%', left: '50%', transform: 'translateX(-50%)', opacity: .6 }} />
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <SectionHead
          eyebrow="The platform"
          title="Everything you need."
          accent="Nothing you don't."
          sub="Built with working PTs around the moments that actually slow a studio down."
        />

        <div className="bento" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginTop: 70 }}>
          <motion.div {...cell(0)} style={{ gridColumn: 'span 3' }}>
            <SpotlightCard style={{ padding: 30, height: '100%' }}>
              <TileHead icon="timer" kicker="Live session logger" title="Log every set in real time." text="Weights, reps and rest times mid-session. Personal bests are spotted automatically and clients see their progress on the spot." />
              <LoggerDemo />
            </SpotlightCard>
          </motion.div>
          <motion.div {...cell(1)} style={{ gridColumn: 'span 3' }}>
            <SpotlightCard style={{ padding: 30, height: '100%' }}>
              <TileHead icon="sparkle" kicker="AI assistant" title="Run your studio by asking." text="Book sessions, chase payments and check who hasn't trained in two weeks. No menus, just answers." />
              <ChatDemo />
            </SpotlightCard>
          </motion.div>
          <motion.div {...cell(2)} style={{ gridColumn: 'span 2' }}>
            <SpotlightCard style={{ padding: 28, height: '100%' }}>
              <TileHead icon="card" kicker="Payments" title="Know who has paid." text="Log payments, flag overdue accounts and send professional receipts." />
              <RevenueDemo />
            </SpotlightCard>
          </motion.div>
          <motion.div {...cell(3)} style={{ gridColumn: 'span 2' }}>
            <SpotlightCard style={{ padding: 28, height: '100%' }}>
              <TileHead icon="funnel" kicker="Lead pipeline" title="Nothing falls through." text="Every enquiry tracked from first message to paying client." />
              <PipelineDemo />
            </SpotlightCard>
          </motion.div>
          <motion.div {...cell(4)} style={{ gridColumn: 'span 2' }}>
            <SpotlightCard style={{ padding: 28, height: '100%' }}>
              <TileHead icon="phone" kicker="Client app" title="Your brand in their pocket." text="Workouts, nutrition, wellness check-ins and streaks." />
              <PhoneDemo />
            </SpotlightCard>
          </motion.div>
        </div>

        <Reveal style={{ marginTop: 16 }}>
          <div className="also" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.015)', overflow: 'hidden' }}>
            {ALSO.map(([icon, t, d]) => (
              <div key={t} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '22px 24px', borderRight: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'var(--steel-1)', marginTop: 2 }}><Icon name={icon} size={20} /></span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 650 }}>{t}</div>
                  <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 3 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 980px) {
          .bento > div { grid-column: span 6 !important; }
          .also { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) { .also { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
