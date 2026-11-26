'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import BrandLogo from './BrandLogo'
import { WordsReveal, CursorLight, Icon, Tilt } from './fx'

const EASE = [0.22, 1, 0.36, 1] as const

/* ── Dashboard mockup: a faithful mini build of the real PT dashboard ───── */
// Same layout as app.dnianalytics.com: icon rail, purple header with KPIs, then
// Action Items, Revenue, Sessions and Lead Pipeline cards. Demo names only.
const M = {
  rail: '#0b0d16', head: 'linear-gradient(180deg,#1c1840 0%,#16142e 60%,#12122a 100%)', page: '#f4f5fa',
  card: '#ffffff', line: '#e8eaf2', ink: '#14162a', muted: '#6b7088', faint: '#9aa0b5',
  purple: '#6d5dfc', purple2: '#8b7bff', red: '#e5484d', green: '#16a35a', amber: '#f59e0b',
}

function RailIcon({ d, active, badge }: { d: React.ReactNode; active?: boolean; badge?: number }) {
  return (
    <div style={{ position: 'relative', width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center', color: active ? '#fff' : '#7d82a3', background: active ? 'linear-gradient(160deg,#7b6bff,#5b4bf0)' : 'transparent', boxShadow: active ? '0 6px 16px -6px rgba(109,93,252,.9)' : 'none' }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
      {badge ? <span style={{ position: 'absolute', top: 1, right: 0, minWidth: 12, height: 12, borderRadius: 6, background: M.red, color: '#fff', fontSize: 7.5, fontWeight: 800, display: 'grid', placeItems: 'center' }}>{badge}</span> : null}
    </div>
  )
}

function MCard({ title, right, children, style }: { title: React.ReactNode; right?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: M.card, border: `1px solid ${M.line}`, borderRadius: 12, padding: '10px 12px', display: 'flex', flexDirection: 'column', minWidth: 0, ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10.5, fontWeight: 700, color: M.ink, paddingBottom: 7, marginBottom: 7, borderBottom: `1px solid ${M.line}` }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{title}</span>
        {right && <span style={{ fontSize: 9, fontWeight: 600, color: M.purple }}>{right}</span>}
      </div>
      {children}
    </div>
  )
}

export function DashboardMockup() {
  const kpis = [
    { k: 'Revenue', v: '£1,260', s: '▲ 33% vs last month', tone: '#5ee0a0', icon: 'card' as const },
    { k: 'Active clients', v: '13', s: '+2 this month', tone: '#c9c6ff', icon: 'users' as const },
    { k: 'Sessions / week', v: '20', s: '+1 vs last week', tone: '#c9c6ff', icon: 'calendar' as const },
    { k: 'Overdue', v: '£905', s: '3 invoices overdue', tone: '#ff8a8f', icon: 'bell' as const },
  ]
  const revenue = [950, 1100, 1100, 1120, 945, 1260]
  const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
  const max = 1400, min = 700
  const pts = revenue.map((v, i) => [8 + i * (284 / 5), 70 - ((v - min) / (max - min)) * 60])
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  return (
    <div className="app-mockup" style={{ display: 'flex', minHeight: 460, background: M.page, fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif', textAlign: 'left' }}>
      {/* Icon rail */}
      <div className="hero-mock-side" style={{ width: 50, background: M.rail, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, padding: '12px 0', flexShrink: 0 }}>
        <div style={{ marginBottom: 6 }}><BrandLogo height={14} /></div>
        <RailIcon active d={<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z" />} />
        <RailIcon d={<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /></>} />
        <RailIcon badge={4} d={<path d="M4 5.5h16v10H9l-5 4z" />} />
        <RailIcon d={<><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M8 3v4M16 3v4M3.5 10h17" /></>} />
        <RailIcon d={<path d="M4 9h16M4 15h16M9 4v16M15 4v16" />} />
        <RailIcon d={<path d="M3 12h4l3-7 4 14 3-7h4" />} />
        <RailIcon d={<><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M2.5 10h19" /></>} />
        <RailIcon d={<path d="M5 20V10M12 20V4M19 20v-7" />} />
      </div>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Purple header with KPIs */}
        <div style={{ background: M.head, padding: '14px 16px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Good evening, Darshan 👋</div>
              <div style={{ fontSize: 9.5, color: '#a9a6d6', marginTop: 2 }}>Thursday 26 November</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: '#d6d4ff', border: '1px solid rgba(255,255,255,.16)', borderRadius: 7, padding: '5px 9px' }}>Layout</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#d6d4ff', border: '1px solid rgba(139,123,255,.6)', borderRadius: 7, padding: '5px 9px' }}>+ Book Session</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', background: `linear-gradient(160deg,${M.purple2},${M.purple})`, borderRadius: 7, padding: '5px 9px' }}>+ Add Client</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 8 }}>
            {kpis.map(c => (
              <div key={c.k} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', minWidth: 0 }}>
                <span style={{ width: 24, height: 24, borderRadius: 7, display: 'grid', placeItems: 'center', color: c.tone, background: 'rgba(255,255,255,0.07)', flexShrink: 0 }}><Icon name={c.icon} size={12} /></span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: '.08em', color: '#a9a6d6', textTransform: 'uppercase' }}>{c.k}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15 }}>{c.v}</div>
                  <div style={{ fontSize: 8, color: c.tone, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 10, padding: 12 }}>
          <MCard title={<><span style={{ color: M.amber }}>⚡</span> Action Items</>}>
            {[
              { t: '3 new messages', s: 'Sarah W., Tom B., Priya M.', c: M.purple, n: 3 },
              { t: '3 overdue payments', s: '£905 total · Joe K., Amy R., Ben S.', c: M.red, n: 3 },
              { t: 'James C.', s: 'Missed their session · follow up', c: M.red },
            ].map(r => (
              <div key={r.t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', border: `1px solid ${M.line}`, borderRadius: 8, marginBottom: 5 }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: r.n ? r.c : '#fde8e8', color: r.n ? '#fff' : M.red, fontSize: 8.5, fontWeight: 800, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{r.n || '!'}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: r.c }}>{r.t}</div>
                  <div style={{ fontSize: 8.5, color: M.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.s}</div>
                </div>
              </div>
            ))}
          </MCard>

          <MCard title="Revenue" right="Full report →">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: '.08em', color: M.muted }}>NOVEMBER</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: M.ink }}>£1,260</div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 800, color: M.green, background: '#e9f8ef', borderRadius: 6, padding: '3px 6px' }}>↑ 33%</span>
            </div>
            <svg viewBox="0 0 300 84" style={{ width: '100%', height: 'auto', marginTop: 4 }} aria-hidden="true">
              <defs><linearGradient id="mock-rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={M.purple} stopOpacity=".28" /><stop offset="1" stopColor={M.purple} stopOpacity="0" /></linearGradient></defs>
              <path d={`${line} L${pts[pts.length - 1][0]},74 L${pts[0][0]},74 Z`} fill="url(#mock-rev)" />
              <path d={line} fill="none" stroke={M.purple} strokeWidth="2" />
              {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 3.2 : 2.2} fill="#fff" stroke={M.purple} strokeWidth="1.6" />)}
              {months.map((m, i) => <text key={m} x={8 + i * (284 / 5)} y="83" fontSize="7" textAnchor="middle" fill={i === 5 ? M.ink : M.faint} fontWeight={i === 5 ? 700 : 400}>{m}</text>)}
            </svg>
          </MCard>

          <MCard title={<>📅 Sessions</>} right="View all →">
            <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: '.08em', color: M.muted, marginBottom: 5 }}>TODAY · THURSDAY 26 NOV</div>
            {[['S', 'Sarah W.', '08:00 · 60min · PT Session'], ['V', 'Vikram T.', '09:00 · 60min · PT Session'], ['E', 'Emma R.', '14:00 · 60min · PT Session']].map(([a, n, d]) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 7px', background: '#f6f5ff', border: '1px solid #ebe8ff', borderRadius: 8, marginBottom: 5 }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: M.purple, color: '#fff', fontSize: 8.5, fontWeight: 800, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{a}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: M.ink }}>{n}</div>
                  <div style={{ fontSize: 8, color: M.muted }}>{d}</div>
                </div>
                <span style={{ fontSize: 7.5, fontWeight: 800, color: M.green, letterSpacing: '.05em' }}>SCHEDULED</span>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#fff', background: M.purple, borderRadius: 6, padding: '3px 7px' }}>▶ Start</span>
              </div>
            ))}
          </MCard>

          <MCard title="Lead Pipeline" right="Manage →">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 5, marginBottom: 7 }}>
              {[['7', 'In pipeline', M.purple, '#f3f2ff'], ['2', 'Won', M.green, '#eefaf2'], ['1', 'Lost', M.red, '#fdf0f0']].map(([n, l, c, bg]) => (
                <div key={l} style={{ textAlign: 'center', padding: '5px 0', borderRadius: 7, background: bg }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: c }}>{n}</div>
                  <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '.06em', color: M.muted, textTransform: 'uppercase' }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4 }}>
              {[['2', 'Enquiry', M.faint], ['2', 'Contacted', M.purple], ['2', 'Trial', M.purple], ['1', 'Negotiating', M.amber], ['2', 'Won', M.green]].map(([n, l, c]) => (
                <div key={l} style={{ textAlign: 'center', padding: '4px 0', borderRadius: 6, border: `1px solid ${c}55` }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: c }}>{n}</div>
                  <div style={{ fontSize: 6, fontWeight: 700, color: M.muted, textTransform: 'uppercase' }}>{l}</div>
                </div>
              ))}
            </div>
          </MCard>
        </div>
      </div>
    </div>
  )
}

/* ── Client app on a phone, landed in a rocky crater beside the dashboard ── */
function PhoneScreen() {
  const C = { bg: '#0d0e16', card: 'rgba(255,255,255,0.06)', line: 'rgba(255,255,255,0.09)', ink: '#f3f5fa', muted: '#9aa3b8', accent: '#7c5cff' }
  const macros: [string, number, number, string][] = [['Protein', 118, 150, '#7c5cff'], ['Carbs', 160, 220, '#22d3ee'], ['Fat', 48, 70, '#f59e0b']]
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, display: 'flex', flexDirection: 'column', fontFamily: 'Inter, -apple-system, sans-serif', textAlign: 'left' }}>
      <div style={{ padding: '34px 12px 8px', background: 'radial-gradient(120% 80% at 20% 0%, rgba(124,92,255,.35), transparent 60%)' }}>
        <div style={{ fontSize: 8, color: C.muted }}>Thursday 26 Nov</div>
        <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, letterSpacing: '-0.02em' }}>Hi Sarah 👋</div>
      </div>
      <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['🔥', '6', 'week streak'], ['🏆', '3', 'PBs this month']].map(([e, n, l]) => (
            <div key={l} style={{ flex: 1, background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: '6px 7px' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>{e} {n}</div>
              <div style={{ fontSize: 7, color: C.muted }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ borderRadius: 12, padding: '9px 9px', background: 'linear-gradient(150deg,#7c5cff,#c34bd8)', color: '#fff' }}>
          <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '.08em', opacity: .85 }}>TODAY’S WORKOUT</div>
          <div style={{ fontSize: 11.5, fontWeight: 800, marginTop: 2 }}>Upper Body A</div>
          <div style={{ fontSize: 7.5, opacity: .85 }}>6 exercises · 55 min</div>
          <div style={{ marginTop: 6, display: 'inline-block', fontSize: 8, fontWeight: 800, background: '#fff', color: '#5b3fe0', borderRadius: 999, padding: '3px 9px' }}>▶ Start</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: '7px 8px' }}>
          <div style={{ fontSize: 8, fontWeight: 700, color: C.ink, marginBottom: 5 }}>Food Log · 1,640 kcal</div>
          {macros.map(([n, v, t, c]) => (
            <div key={n} style={{ marginBottom: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 6.8, color: C.muted }}><span>{n}</span><span>{v}/{t}g</span></div>
              <div style={{ height: 3.5, borderRadius: 3, background: 'rgba(255,255,255,0.08)' }}><div style={{ width: `${(v / t) * 100}%`, height: '100%', borderRadius: 3, background: c }} /></div>
            </div>
          ))}
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: '7px 8px', display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(124,92,255,.2)', color: '#b9a8ff', display: 'grid', placeItems: 'center', fontSize: 9 }}>📅</span>
          <div><div style={{ fontSize: 8, fontWeight: 700, color: C.ink }}>Next session · Fri 08:00</div><div style={{ fontSize: 7, color: C.muted }}>PT Session with Darshan</div></div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '6px 4px 14px', borderTop: `1px solid ${C.line}`, background: 'rgba(13,14,22,.95)' }}>
        {['Home', 'Train', 'Food', 'Progress', 'Chat'].map((t, i) => (
          <div key={t} style={{ textAlign: 'center', fontSize: 6.5, fontWeight: 600, color: i === 0 ? '#b9a8ff' : C.muted }}>
            <div style={{ width: 4, height: 4, borderRadius: 2, margin: '0 auto 3px', background: i === 0 ? '#b9a8ff' : 'transparent' }} />{t}
          </div>
        ))}
      </div>
    </div>
  )
}

/** The client app on a realistic phone, standing beside the dashboard. Desktop only. */
export function PhoneInCrater({ style }: { style?: React.CSSProperties }) {
  return (
    <div className="phone-crater" aria-hidden="true" style={{ position: 'absolute', width: 230, height: 420, ...style }}>
      {/* soft coloured glow behind the phone */}
      <div style={{ position: 'absolute', left: -40, right: -40, bottom: -10, height: 120, background: 'radial-gradient(ellipse at 50% 70%, rgba(255,140,60,.35), rgba(139,92,255,.18) 45%, transparent 70%)', filter: 'blur(14px)' }} />
      {/* back rim of the crater */}
      {/* the phone, tilted back as if it landed. Built like the real thing: a thin
          brushed-titanium band, a black glass bezel, and real depth made from stacked
          layers of the same rounded shape (so the rounded corners stay rounded in 3D). */}
      <div style={{ position: 'absolute', left: 20, bottom: 30, width: 188, height: 392, perspective: 1400 }}>
        {/* soft contact shadow on the ground, not tilted with the phone */}
        <div style={{ position: 'absolute', left: 10, right: -30, bottom: -14, height: 40, borderRadius: '50%', background: 'radial-gradient(ellipse at 45% 50%, rgba(0,0,0,.85), transparent 70%)', filter: 'blur(8px)' }} />
        <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transformOrigin: '50% 100%', transform: 'rotateX(10deg) rotateY(-26deg) rotateZ(-6deg)' }}>
          {/* depth: 10 slices of the titanium band, darker towards the back */}
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} style={{ position: 'absolute', inset: 0, borderRadius: 40, transform: `translateZ(${-(i + 1)}px)`,
              background: `linear-gradient(100deg, hsl(220 4% ${46 - i * 2.2}%), hsl(220 5% ${72 - i * 3}%) 38%, hsl(220 4% ${34 - i * 1.6}%) 62%, hsl(220 5% ${58 - i * 2.6}%))` }} />
          ))}
          {/* front: titanium band → black glass bezel → screen */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: 40, padding: 2.5,
            background: 'linear-gradient(135deg,#d6d9de 0%,#8b9098 18%,#f1f2f4 34%,#5b6068 58%,#b3b7be 82%,#70757c 100%)',
            boxShadow: '0 1px 0 rgba(255,255,255,.5) inset' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: 37.5, padding: 5, background: '#050506', boxShadow: 'inset 0 0 0 .6px rgba(255,255,255,.18)' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 32.5, overflow: 'hidden', background: '#000' }}>
                <PhoneScreen />
                {/* camera island */}
                <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 56, height: 16, borderRadius: 10, background: '#000', boxShadow: 'inset 0 0 0 .5px rgba(255,255,255,.06)' }}>
                  <span style={{ position: 'absolute', right: 6, top: 4.5, width: 7, height: 7, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #2a3b55, #05070b 70%)' }} />
                </div>
                {/* glass: one broad soft reflection plus a faint edge sheen, like real cover glass */}
                <div style={{ position: 'absolute', inset: 0, borderRadius: 32.5, pointerEvents: 'none',
                  background: 'linear-gradient(118deg, rgba(255,255,255,.13) 0%, rgba(255,255,255,.05) 22%, transparent 23%, transparent 100%)' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: 32.5, pointerEvents: 'none', boxShadow: 'inset 0 0 18px rgba(0,0,0,.55)' }} />
              </div>
            </div>
          </div>
          {/* side buttons sit on the band, slightly proud of it */}
          <span style={{ position: 'absolute', left: -1.5, top: 96, width: 2.5, height: 22, borderRadius: 2, transform: 'translateZ(-4px)', background: 'linear-gradient(90deg,#4b4f56,#c9ccd1)' }} />
          <span style={{ position: 'absolute', left: -1.5, top: 128, width: 2.5, height: 38, borderRadius: 2, transform: 'translateZ(-4px)', background: 'linear-gradient(90deg,#4b4f56,#c9ccd1)' }} />
          <span style={{ position: 'absolute', left: -1.5, top: 172, width: 2.5, height: 38, borderRadius: 2, transform: 'translateZ(-4px)', background: 'linear-gradient(90deg,#4b4f56,#c9ccd1)' }} />
        </div>
      </div>
    </div>
  )
}

/* ── Floating live toasts that cycle over the mockup ───────────────────── */
const TOASTS = [
  { icon: 'card', title: 'Payment received', sub: 'Sarah K. · £59.00', tone: '#8ff0bf' },
  { icon: 'bolt', title: 'New PB', sub: 'Marcus L. · Bench 85kg', tone: '#e8eaee' },
  { icon: 'calendar', title: 'Session booked', sub: 'Thu 10:00 · James T.', tone: '#a9c7ff' },
  { icon: 'funnel', title: 'New enquiry', sub: 'Priya M. · via website', tone: '#e8eaee' },
]

export function LiveToasts() {
  const [i, setI] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setI(v => (v + 1) % TOASTS.length), 2600)
    return () => clearInterval(t)
  }, [reduce])
  const t = TOASTS[i]
  return (
    <div className="hero-toast-wrap" style={{ position: 'absolute', right: -28, top: 56, zIndex: 3, width: 250 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 30, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.98 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14,
            background: 'rgba(18,20,24,0.82)', border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
            boxShadow: '0 20px 50px -15px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <span style={{ width: 34, height: 34, borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: t.tone, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Icon name={t.icon} size={17} />
          </span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f2f3f5' }}>{t.title}</div>
            <div style={{ fontSize: 12, color: '#8c929b', marginTop: 1 }}>{t.sub}</div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function LiveSessionCard() {
  return (
    <div className="float-animation hero-live" style={{
      position: 'absolute', left: -36, bottom: 64, zIndex: 3, width: 230, padding: 14, borderRadius: 16,
      background: 'rgba(18,20,24,0.85)', border: '1px solid rgba(255,255,255,0.12)',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      boxShadow: '0 24px 60px -18px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10.5, color: '#8c929b', marginBottom: 8 }}>
        <span className="live-dot" /> LIVE SESSION · Marcus L.
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#f2f3f5', marginBottom: 8 }}>Bench press</div>
      {[['Set 1', '80kg × 8'], ['Set 2', '82.5kg × 8'], ['Set 3', '85kg × 6 · PB']].map(([s, v], i) => (
        <div key={s} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, padding: '4px 0', color: i === 2 ? '#fff' : '#b6bcc5', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ color: '#6b717b' }}>{s}</span><span style={{ fontWeight: 600 }}>{v}</span>
        </div>
      ))}
      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', fontSize: 11, color: '#c3c8cf' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="timer" size={13} /> Rest</span>
        <span style={{ fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>0:42</span>
      </div>
    </div>
  )
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // The dashboard starts tilted back like a screen on a desk and straightens as you scroll.
  const rotateX = useTransform(scrollYProgress, [0, 0.45], reduce ? [0, 0] : [24, 0])
  const scale = useTransform(scrollYProgress, [0, 0.45], reduce ? [1, 1] : [0.9, 1])
  const glowOpacity = useTransform(scrollYProgress, [0, 0.4], [0.9, 0.35])

  return (
    <section ref={ref} id="hero" className="mesh-bg grain" style={{ position: 'relative', overflow: 'hidden', paddingTop: 150, paddingBottom: 60 }}>
      <CursorLight size={800} opacity={0.08} />
      <div className="grid-floor" />
      {/* Top light beam */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: -200, left: '50%', width: 1100, height: 700, transform: 'translateX(-50%)', pointerEvents: 'none',
        background: 'conic-gradient(from 180deg at 50% 0%, transparent 150deg, rgba(220,228,240,0.10) 175deg, rgba(255,255,255,0.16) 180deg, rgba(220,228,240,0.10) 185deg, transparent 210deg)',
        filter: 'blur(10px)',
      }} />

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
          <a href="/pricing" className="badge badge-blue" style={{ textDecoration: 'none', marginBottom: 28 }}>
            <span className="live-dot" />
            Founding studio access is open
            <span style={{ color: 'var(--steel-3)', display: 'inline-flex' }}><Icon name="arrow" size={14} /></span>
          </a>
        </motion.div>

        <h1 style={{ fontSize: 'clamp(44px, 8vw, 104px)', fontWeight: 800, lineHeight: 0.98, letterSpacing: '-0.05em', margin: '0 auto', maxWidth: 1050 }}>
          <WordsReveal text="Run your studio." className="steel-text" delay={0.1} />
          <br />
          <WordsReveal text="Not a group chat." className="sheen-text" delay={0.4} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
          transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
          style={{ fontSize: 'clamp(17px, 1.6vw, 20px)', lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: 640, margin: '28px auto 0' }}
        >
          Clients, sessions, payments and leads in one beautifully simple platform, built for personal trainers who are done juggling WhatsApp, spreadsheets and five different apps.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.05, ease: EASE }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 38 }}
        >
          <a href="#waitlist" className="btn-steel" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 28px', borderRadius: 14, fontSize: 16, textDecoration: 'none' }}>
            Book a demo <Icon name="arrow" size={17} />
          </a>
          <a href="/features" className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 26px', borderRadius: 14, fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>
            Explore features
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.3 }}
          style={{ display: 'flex', gap: 22, justifyContent: 'center', flexWrap: 'wrap', marginTop: 22, fontSize: 13.5, color: 'var(--text-subtle)' }}
        >
          {['30-day money-back guarantee', 'No lock-in', 'Unlimited clients', 'UK-built'].map(t => (
            <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Icon name="check" size={14} style={{ color: 'var(--steel-2)' }} />{t}</span>
          ))}
        </motion.div>

        {/* Product shot */}
        <motion.div
          initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 1.1, ease: EASE }}
          style={{ marginTop: 70, perspective: 1600, position: 'relative' }}
        >
          <motion.div aria-hidden="true" style={{
            position: 'absolute', inset: '-8% 6% 20%', borderRadius: 40, pointerEvents: 'none', opacity: glowOpacity,
            background: 'radial-gradient(ellipse at 50% 40%, rgba(220,228,240,0.22), transparent 65%)', filter: 'blur(30px)',
          }} />
          <motion.div style={{ rotateX, scale, transformOrigin: '50% 0%', maxWidth: 980, margin: '0 auto', position: 'relative' }}>
            <Tilt max={5}>
              <div style={{
                position: 'relative', padding: 10, borderRadius: 22, textAlign: 'left',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
              }}>
                <div style={{ display: 'flex', gap: 6, padding: '4px 6px 10px' }}>
                  {[0, 1, 2].map(d => <span key={d} style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(255,255,255,0.18)' }} />)}
                  <span style={{ flex: 1, textAlign: 'center', fontSize: 11, color: '#6b717b', marginRight: 36 }}>app.dnianalytics.com</span>
                </div>
                <DashboardMockup />
                <LiveToasts />
                <LiveSessionCard />
              </div>
            </Tilt>
          </motion.div>
          {/* Reflection fade into the page */}
          <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: -2, height: 160, background: 'linear-gradient(to bottom, transparent, var(--bg))', pointerEvents: 'none', zIndex: 4 }} />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .hero-mock-side { display: none; }
          .hero-toast-wrap { right: 8px !important; top: -18px !important; width: 220px !important; }
          .hero-live { display: none; }
        }
      `}</style>
    </section>
  )
}
