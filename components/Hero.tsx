'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import BrandLogo from './BrandLogo'
import { WordsReveal, CursorLight, Icon, Tilt } from './fx'

const EASE = [0.22, 1, 0.36, 1] as const

/* ── Dashboard mockup: the real PT dashboard, at real size, scaled to fit ── */
// Built at the app's real desktop size (1534 × 853) from a screenshot of the live
// dashboard with demo data, then scaled down to whatever width the mockup gets.
const DW = 1534, DH = 853
const P = { purple: '#6d5dfc', purple2: '#7c6bff', ink: '#1b1d2e', muted: '#6b7088', faint: '#9aa0b5', line: '#eceef4', red: '#e5484d', green: '#1f9d55', pink: '#d9467c', orange: '#f08c2b' }

function useFitScale(width: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [k, setK] = useState(0.7)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setK(el.clientWidth / width)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [width])
  return { ref, k }
}

const ico = {
  home: 'M4 11 12 4l8 7v9h-5v-6H9v6H4z', users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.7a3.5 3.5 0 0 1 0 6.6M18.5 14.8c1.8.9 3 2.9 3 5.2',
  chat: 'M4 5.5h16v10H9l-5 4z', cal: 'M3.5 6.5h17v14h-17zM8 3v4M16 3v4M3.5 10.5h17', hash: 'M5 9h15M4 15h15M10 3 8 21M16 3l-2 18',
  fork: 'M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M16 3c-2 2-2 6 0 8v10', pulse: 'M3 12h4l3-7 4 14 3-7h4', userplus: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M19 8v6M16 11h6',
  card: 'M2.5 5.5h19v13h-19zM2.5 10h19', bars: 'M5 20V11M12 20V5M19 20v-6', list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2.5v3M12 18.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
  shield: 'M12 3l8 3v6c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6z', pound: 'M16 7a4 4 0 0 0-7 2.5V13M7 13h7M7 19h10M9 13c0 3-1 5-2 6',
  warn: 'M12 4 2.5 20h19zM12 10v4M12 17h.01', grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z', bolt: 'M13 2.5 4.5 13.5h6.5l-1 8 8.5-11h-6.5z',
}
function Ic({ d, size = 18, color = 'currentColor', sw = 1.8 }: { d: string; size?: number; color?: string; sw?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eceef4', boxShadow: '0 1px 2px rgba(20,22,40,.04), 0 6px 18px -10px rgba(20,22,40,.12)', padding: '18px 18px', position: 'absolute', ...style }}>{children}</div>
}

function DashboardFull() {
  const kpis = [
    { k: 'REVENUE', v: '£1,225', s: '▲ 16% vs last month', sc: '#4ade80', i: ico.pound, ic: '#4ade80' },
    { k: 'ACTIVE CLIENTS', v: '13', s: '+2 this month', sc: '#4ade80', i: ico.users, ic: '#a5a3ff' },
    { k: 'SESSIONS / WEEK', v: '20', s: '+2 vs last week', sc: '#4ade80', i: ico.cal, ic: '#a5a3ff' },
    { k: 'OVERDUE', v: '£890', s: '3 invoices overdue', sc: '#f87171', i: ico.warn, ic: '#f87171' },
  ]
  const rev = [960, 1000, 1100, 1100, 1100, 1225], lbl = ['£960', '£1.0k', '£1.1k', '£1.1k', '£1.1k', '£1.2k'], mon = ['Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov']
  const cx = (i: number) => 24 + i * 124, cy = (v: number) => 112 - ((v - 800) / 500) * 90
  const line = rev.map((v, i) => `${i ? 'L' : 'M'}${cx(i)},${cy(v).toFixed(1)}`).join(' ')
  return (
    <div style={{ width: DW, height: DH, position: 'relative', background: '#f4f5f9', fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif', color: P.ink, textAlign: 'left', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 68, background: '#14142a', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, color: '#8f92b3' }}>
        <div style={{ width: 40, overflow: 'hidden' }}><BrandLogo height={26} /></div>
        <div style={{ marginTop: 34, width: 46, height: 46, borderRadius: 14, display: 'grid', placeItems: 'center', color: '#fff', background: 'linear-gradient(160deg,#7b6bff,#5b4bf0)', boxShadow: '0 8px 22px -6px rgba(109,93,252,.9)' }}><Ic d={ico.home} size={20} /></div>
        {[ico.users, ico.chat, ico.cal, ico.hash, ico.fork, ico.pulse].map((d, i) => (
          <div key={i} style={{ marginTop: i === 0 ? 42 : 22, position: 'relative' }}>
            <Ic d={d} size={19} />
            {i === 1 && <span style={{ position: 'absolute', top: -7, right: -9, width: 15, height: 15, borderRadius: 8, background: P.red, color: '#fff', fontSize: 9, fontWeight: 800, display: 'grid', placeItems: 'center' }}>4</span>}
          </div>
        ))}
        <div style={{ marginTop: 58 }}><Ic d={ico.userplus} size={19} /></div>
        <div style={{ marginTop: 22 }}><Ic d={ico.card} size={19} /></div>
        <div style={{ marginTop: 22 }}><Ic d={ico.bars} size={19} /></div>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, paddingBottom: 18 }}>
          <Ic d={ico.list} size={19} /><Ic d={ico.gear} size={19} /><Ic d={ico.shield} size={19} />
          <div style={{ width: 38, height: 38, borderRadius: '50%', padding: 2, background: 'linear-gradient(140deg,#7b6bff,#c34bd8)' }}><div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle at 50% 35%, #c9b8a6, #6b5a4c 70%)' }} /></div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 68, right: 0, top: 0, height: 166, background: 'linear-gradient(90deg,#1c1836 0%,#17152c 45%,#0f0e1c 100%)', padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Good evening, Darshan <span style={{ marginLeft: 8 }}>👋</span></div>
            <div style={{ fontSize: 13, color: '#a9a6c9', marginTop: 4 }}>Thursday 26 November</div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,.16)', background: 'rgba(255,255,255,.05)', color: '#c9c8dc', fontSize: 13.5 }}><Ic d={ico.grid} size={13} /> Layout</span>
            <span style={{ display: 'flex', alignItems: 'center', height: 34, padding: '0 13px', borderRadius: 8, border: '1px solid #4c4a8e', background: '#26244f', color: '#d9d6ff', fontSize: 13.5, fontWeight: 700 }}>+ Book Session</span>
            <span style={{ display: 'flex', alignItems: 'center', height: 34, padding: '0 14px', borderRadius: 8, background: 'linear-gradient(160deg,#8b7bff,#6a55ff)', color: '#fff', fontSize: 13.5, fontWeight: 700, boxShadow: '0 6px 18px -6px rgba(109,93,252,.9)' }}>+ Add Client</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginTop: 16 }}>
          {kpis.map(c => (
            <div key={c.k} style={{ height: 68, borderRadius: 10, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px' }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,.06)', color: c.ic }}><Ic d={c.i} size={15} /></span>
              <div>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.06em', color: '#9d9ab8' }}>{c.k}</div>
                <div style={{ fontSize: 19, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{c.v}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: c.sc }}>{c.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card style={{ left: 120, top: 187, width: 670, height: 318 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14.5, fontWeight: 700, paddingBottom: 12, borderBottom: `1px solid ${P.line}` }}>
          <span style={{ width: 26, height: 26, borderRadius: 7, background: '#fff3e8', color: P.orange, display: 'grid', placeItems: 'center' }}><Ic d={ico.bolt} size={14} /></span>Action Items
        </div>
        {[
          { t: '3 new messages', sub: 'Sarah Williams, Michael O’Brien, James Chen', c: P.purple, n: 3, bg: '#efedff', e: '💬', chev: true },
          { t: '3 overdue payments', extra: ' — £890 total', sub: 'Priya Shah, Tom Baker, Leo Grant', c: P.red, n: 3, bg: '#fdeeee', e: '💳', chev: true },
          { t: 'Emma Thompson', sub: 'Birthday in 4d', c: P.pink, bg: '#fdeef3', e: '🎂' },
          { t: '2 clients need attention', sub: 'Priya Shah, Tom Baker', c: P.red, n: 2, bg: '#fdeeee', e: '❤️', chev: true },
        ].map(r => (
          <div key={r.t} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 55, marginTop: 9, padding: '0 14px', borderRadius: 10, background: '#fbfbfe', border: '1px solid #eef0f6' }}>
            <span style={{ position: 'relative', width: 28, height: 28, borderRadius: 8, background: r.bg, display: 'grid', placeItems: 'center', fontSize: 14 }}>
              {r.e}{r.n ? <b style={{ position: 'absolute', top: -6, right: -6, width: 15, height: 15, borderRadius: 8, background: r.c, color: '#fff', fontSize: 9, display: 'grid', placeItems: 'center' }}>{r.n}</b> : null}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: r.c }}>{r.t}<span style={{ color: P.muted, fontWeight: 500 }}>{r.extra || ''}</span></div>
              <div style={{ fontSize: 12, color: P.muted, marginTop: 2 }}>{r.sub}</div>
            </div>
            {r.chev && <span style={{ color: P.faint, fontSize: 16 }}>›</span>}
          </div>
        ))}
      </Card>

      <Card style={{ left: 803, top: 187, width: 667, height: 318 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, fontWeight: 700, paddingBottom: 12, borderBottom: `1px solid ${P.line}` }}>Revenue <span style={{ color: P.purple, fontWeight: 600, fontSize: 13.5 }}>Full report →</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          <div><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: P.muted }}>NOVEMBER</div><div style={{ fontSize: 24, fontWeight: 800, color: P.green }}>£1,225</div></div>
          <div style={{ textAlign: 'center', background: '#ebfaf1', borderRadius: 8, padding: '4px 8px', height: 'fit-content' }}><div style={{ fontSize: 13.5, fontWeight: 800, color: P.green }}>↑ 16%</div><div style={{ fontSize: 9.5, color: P.green }}>vs last month</div></div>
        </div>
        <svg viewBox="0 0 660 150" style={{ width: '100%', height: 170, marginTop: -6 }}>
          <defs><linearGradient id="dash-rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={P.purple} stopOpacity=".28" /><stop offset="1" stopColor={P.purple} stopOpacity=".02" /></linearGradient></defs>
          {[40, 80, 112].map(y => <line key={y} x1="24" x2="644" y1={y} y2={y} stroke="#eef0f6" strokeDasharray="3 4" />)}
          <path d={`${line} L${cx(5)},120 L${cx(0)},120 Z`} fill="url(#dash-rev)" />
          <path d={line} fill="none" stroke={P.purple2} strokeWidth="2.4" />
          {rev.map((v, i) => <g key={i}>
            <circle cx={cx(i)} cy={cy(v)} r={i === 5 ? 5 : 3.2} fill={i === 5 ? '#fff' : P.purple2} stroke={P.purple2} strokeWidth="2" />
            <text x={cx(i)} y={cy(v) - (i === 5 ? 12 : 10)} textAnchor="middle" fontSize={i === 5 ? 14 : 11} fontWeight={i === 5 ? 800 : 500} fill={i === 5 ? P.purple : P.ink}>{lbl[i]}</text>
            <text x={cx(i)} y="142" textAnchor="middle" fontSize="12" fontWeight={i === 5 ? 800 : 400} fill={i === 5 ? P.ink : P.muted}>{mon[i]}</text>
          </g>)}
        </svg>
      </Card>

      <Card style={{ left: 120, top: 517, width: 670, height: 318 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14.5, fontWeight: 700, paddingBottom: 12, borderBottom: `1px solid ${P.line}` }}>
          <span style={{ fontSize: 15 }}>📅</span>Sessions
          <span style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #d9d6ff', borderTopColor: P.purple, borderRightColor: P.purple, fontSize: 7, display: 'grid', placeItems: 'center', color: P.muted }}>2/3</span>
          <span style={{ marginLeft: 'auto', color: P.purple, fontWeight: 600, fontSize: 13.5 }}>View all →</span>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: P.muted, margin: '12px 0 8px' }}>TODAY · THURSDAY 26 NOV</div>
        {[
          { a: 'S', n: 'Sarah Williams', d: '08:00 · 58min · PT Session', left: ' · -3 left', st: 'done' },
          { a: 'V', n: 'Vikram Thakur', d: '09:00 · 60min · PT Session', st: 'sched' },
          { a: 'E', n: 'Emma Reid', d: '14:00 · 68min · PT Session', st: 'done' },
        ].map(r => {
          const done = r.st === 'done'
          return (
            <div key={r.n} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 50, marginBottom: 6, padding: '0 12px', borderRadius: 10, background: done ? '#f1fbf4' : '#f3f2ff', border: `1px solid ${done ? '#cdeed8' : '#e1ddff'}` }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: done ? '#2fa35f' : P.purple, color: '#fff', fontSize: 12, fontWeight: 800, display: 'grid', placeItems: 'center' }}>{r.a}</span>
              <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 700 }}>{r.n}</div><div style={{ fontSize: 11.5, color: P.muted }}>{r.d}<span style={{ color: P.red }}>{r.left || ''}</span></div></div>
              {done
                ? <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.05em', color: P.green, background: '#e1f5e8', borderRadius: 999, padding: '4px 10px' }}>COMPLETED</span>
                : <><span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.05em', color: P.green, background: '#e9f8ee', borderRadius: 999, padding: '4px 10px' }}>SCHEDULED</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: P.purple, borderRadius: 7, padding: '6px 12px', marginLeft: 6 }}>▶ Start</span></>}
            </div>
          )
        })}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: P.muted, marginTop: 14, paddingTop: 10, borderTop: `1px solid ${P.line}` }}>UPCOMING · 5 SESSIONS <span style={{ color: P.purple, letterSpacing: 0, fontSize: 11 }}>+3 more</span></div>
      </Card>

      <Card style={{ left: 803, top: 517, width: 667, height: 318 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14.5, fontWeight: 700, paddingBottom: 12, borderBottom: `1px solid ${P.line}` }}>
          Lead Pipeline
          <span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 700, color: P.green, background: '#e9f8ee', borderRadius: 999, padding: '3px 10px' }}>67% close rate</span>
          <span style={{ color: P.purple, fontWeight: 600, fontSize: 13.5 }}>Manage →</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginTop: 10 }}>
          {[['7', 'IN PIPELINE', P.purple, '#f3f2ff'], ['2', 'WON', P.green, '#effaf3'], ['1', 'LOST', P.red, '#fdf3f2']].map(([n, l, c, bg]) => (
            <div key={l} style={{ height: 46, borderRadius: 8, background: bg, border: '1px solid #eceef4', textAlign: 'center', paddingTop: 6 }}><div style={{ fontSize: 16, fontWeight: 800, color: c }}>{n}</div><div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '.06em', color: P.muted }}>{l}</div></div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 2, marginTop: 8 }}>{[['28%', '#9aa0b5'], ['27%', P.purple], ['27%', P.purple], ['18%', P.orange]].map(([w, c], i) => <i key={i} style={{ width: w, height: 3, background: c, borderRadius: 2 }} />)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
          {[['2', 'ENQUIRY', '#9aa0b5', '#e6e8ef'], ['2', 'CONTACTED', P.purple, '#dcd8ff'], ['2', 'TRIAL', P.purple, P.purple], ['1', 'NEGOTIATING', P.orange, P.orange], ['2', 'WON', P.green, '#cdeed8']].map(([n, l, c, bd], i) => (
            <div key={l} style={{ display: 'contents' }}>
              {i > 0 && <span style={{ color: P.faint, fontSize: 10 }}>›</span>}
              <div style={{ flex: 1, height: 38, borderRadius: 7, border: `1.4px solid ${bd}`, textAlign: 'center', paddingTop: 4 }}><div style={{ fontSize: 14, fontWeight: 800, color: c }}>{n}</div><div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: '.04em', color: c }}>{l}</div></div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: P.muted, margin: '10px 0 6px' }}>CLOSE TO CLOSING · 3 LEADS</div>
        {[['Aisha Okonkwo', 'Negotiating', P.orange, '#fff8ef', '27 Nov', '🛡️'], ['Ryan Mitchell', 'Trial', P.purple, '#fafaff', '1 Dec', '🧪']].map(([n, st, c, bg, d, e]) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 46, marginBottom: 6, padding: '0 12px', borderRadius: 9, background: bg, border: '1px solid #f0eef6' }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: '#fff', display: 'grid', placeItems: 'center', fontSize: 11 }}>{e}</span>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 700 }}>{n}</div><div style={{ fontSize: 11.5, color: c }}>{st}</div></div>
            <span style={{ fontSize: 11.5, color: P.muted }}>{d} ›</span>
          </div>
        ))}
      </Card>
    </div>
  )
}

export function DashboardMockup() {
  const { ref, k } = useFitScale(DW)
  return (
    <div ref={ref} className="app-mockup" style={{ width: '100%', height: DH * k, position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: DW, height: DH, transform: `scale(${k})`, transformOrigin: '0 0', position: 'absolute', left: 0, top: 0 }}>
        <DashboardFull />
      </div>
    </div>
  )
}

/* ── Client app on a realistic phone, beside the dashboard ──────────────── */
function PhoneScreen() {
  // Laid out at real phone size (390 × 844 CSS px, like the live client app) and
  // scaled down to the mockup's screen, so it matches the real app closely.
  const W = 390, H = 844, SCALE = 173 / W
  const days: [string, 'done' | 'missed' | 'booked' | 'none'][] = [['Mon', 'done'], ['Tue', 'none'], ['Wed', 'missed'], ['Thu', 'none'], ['Fri', 'booked'], ['Sat', 'none'], ['Sun', 'none']]
  const tile = (st: string) => st === 'done'
    ? { bg: 'rgba(34,160,90,.22)', bd: '#2f9a5c', c: '#6ee7a0' }
    : st === 'missed' ? { bg: 'rgba(220,60,70,.18)', bd: '#b8424c', c: '#ff8a93' }
    : st === 'booked' ? { bg: 'rgba(255,255,255,.06)', bd: 'rgba(255,255,255,.28)', c: '#d6d9e6' }
    : { bg: 'rgba(255,255,255,.02)', bd: 'rgba(255,255,255,.08)', c: '#5d6380' }
  // November 2026 starts on a Sunday. Red = missed, green = trained, today = 26.
  const missed = new Set([2, 4, 6, 9, 11, 13, 16, 18, 20, 25]), trained = new Set([14, 15, 23]), bright = new Set([17])
  const cells: (number | null)[] = [...Array(6).fill(null), ...Array.from({ length: 30 }, (_, i) => i + 1)]
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0b0d1c' }}>
      <div style={{ width: W, height: H, transform: `scale(${SCALE})`, transformOrigin: '0 0', fontFamily: 'Inter, -apple-system, sans-serif', color: '#f3f5fa', textAlign: 'left', position: 'relative' }}>
        {/* status bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 30px 0 40px', fontSize: 16, fontWeight: 600 }}>
          <span>22:37</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <span style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>{[5, 8, 11, 14].map(h => <i key={h} style={{ width: 3, height: h, borderRadius: 1, background: '#fff' }} />)}</span>5G
            <span style={{ width: 25, height: 12, borderRadius: 4, border: '1.2px solid rgba(255,255,255,.6)', padding: 1.5 }}><i style={{ display: 'block', width: '60%', height: '100%', borderRadius: 2, background: '#fff' }} /></span>
          </span>
        </div>

        {/* greeting + this week */}
        <div style={{ margin: '28px 14px 0', borderRadius: 24, padding: '22px 20px 18px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg,#26224a 0%,#1a1836 55%,#131229 100%)' }}>
          <div style={{ position: 'absolute', right: -50, top: -60, width: 190, height: 190, borderRadius: '50%', background: 'rgba(255,255,255,.035)' }} />
          <div style={{ fontSize: 12, color: '#8e92ad' }}>Thursday 26 November</div>
          <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 4 }}>Night session, Sarah 💪</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, fontSize: 9.5, letterSpacing: '.14em', color: '#8e92ad', fontWeight: 600 }}>
            <span>THIS WEEK</span>
            <span style={{ letterSpacing: 0, fontWeight: 500 }}><b style={{ background: '#6d4cff', color: '#fff', borderRadius: 5, padding: '1px 5px', fontSize: 8 }}>PT</b> = Session Booked</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 7, marginTop: 9 }}>
            {days.map(([d, st]) => { const t = tile(st); return (
              <div key={d} style={{ height: 50, borderRadius: 10, background: t.bg, border: `1.5px solid ${t.bd}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, color: t.c, fontSize: 9.5, fontWeight: 600 }}>
                {d}
                <span style={{ fontSize: st === 'done' ? 12 : 11, lineHeight: 1 }}>{st === 'done' ? '✅' : st === 'missed' ? '✕' : st === 'booked' ? '·' : '–'}</span>
              </div>) })}
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,.08)', margin: '15px 0 13px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', textAlign: 'center' }}>
            {[['STREAK', <>🥉 3 <small style={{ fontSize: 10, fontWeight: 500, color: '#9aa0bb' }}>wks</small></>, <span style={{ color: '#4ade80' }}>5 this month</span>],
              ['STEPS TARGET', '10,000', 'daily goal'], ['PROTEIN TARGET', <>120<small style={{ fontSize: 10, fontWeight: 500, color: '#9aa0bb' }}>g</small></>, 'daily goal']].map(([k, v, sub], i) => (
              <div key={i} style={{ borderLeft: i ? '1px solid rgba(255,255,255,.08)' : 'none' }}>
                <div style={{ fontSize: 8.5, letterSpacing: '.12em', color: '#8e92ad' }}>{k}</div>
                <div style={{ fontSize: 19, fontWeight: 800, marginTop: 4 }}>{v}</div>
                <div style={{ fontSize: 9, color: '#8e92ad', marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* suggested next workout */}
        <div style={{ margin: '14px 14px 0', borderRadius: 22, overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)', background: '#121428' }}>
          <div style={{ padding: '16px 18px 16px', background: 'linear-gradient(100deg,#6a55ff 0%,#3b7ef0 55%,#1aa5e6 100%)' }}>
            <div style={{ fontSize: 9.5, letterSpacing: '.14em', fontWeight: 700, color: 'rgba(255,255,255,.92)' }}>⚡ SUGGESTED NEXT WORKOUT</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <div style={{ fontSize: 19, fontWeight: 800 }}>Workout 2</div>
              <span style={{ background: '#fff', color: '#4f46e5', borderRadius: 12, padding: '9px 18px', fontSize: 14, fontWeight: 800 }}>▶ Start</span>
            </div>
            <span style={{ display: 'inline-block', marginTop: 8, background: '#fff7e6', color: '#d97706', borderRadius: 999, padding: '4px 10px', fontSize: 10.5, fontWeight: 700 }}>9 days ago — good time to revisit</span>
          </div>
          <div style={{ padding: '12px 12px 14px' }}>
            <div style={{ textAlign: 'center', fontSize: 9, letterSpacing: '.14em', fontWeight: 700, color: '#8e92ad', marginBottom: 10 }}>OR CHOOSE A DIFFERENT WORKOUT</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
              {[['Workout 1', '9 days ago', '#f59e0b'], ['Workout 3', '3 days ago', '#22c55e']].map(([w, a, c]) => (
                <div key={w} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '11px 10px', fontSize: 11 }}>
                  <b>{w}</b><span style={{ color: c, fontWeight: 700 }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* training calendar */}
        <div style={{ margin: '22px 14px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700 }}><span>Nov 2026</span><span style={{ color: '#f04a55' }}>4 sessions</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginTop: 10, fontSize: 9.5, textAlign: 'center' }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={i} style={{ color: '#9aa0bb', fontWeight: 600, paddingBottom: 4 }}>{d}</div>)}
            {cells.map((n, i) => {
              if (!n) return <div key={i} />
              const st = n === 26 ? { bg: 'transparent', bd: '#6366f1', c: '#a5b4fc' }
                : bright.has(n) ? { bg: '#22c58a', bd: '#22c58a', c: '#062b1c' }
                : trained.has(n) ? { bg: '#14684a', bd: '#1d7d59', c: '#dffbe9' }
                : missed.has(n) ? { bg: 'rgba(180,40,50,.25)', bd: '#7a2a33', c: '#ff7d86' }
                : { bg: 'rgba(255,255,255,.02)', bd: 'rgba(255,255,255,.12)', c: '#c9cde0' }
              return <div key={i} style={{ height: 17, lineHeight: '15px', borderRadius: 5, background: st.bg, border: `1px solid ${st.bd}`, color: st.c, fontWeight: n === 26 || trained.has(n) || bright.has(n) ? 800 : 500 }}>{n}</div>
            })}
          </div>
        </div>

        {/* floating tab bar */}
        <div style={{ position: 'absolute', left: 12, right: 12, bottom: 26, height: 64, borderRadius: 32, background: 'rgba(10,11,24,.96)', border: '1px solid rgba(110,100,255,.25)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 -10px 30px rgba(0,0,0,.5)' }}>
          {[['Home', 'M4 11 12 4l8 7v9h-5v-6H9v6H4z'], ['Food Log', 'M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M16 3c-2 2-2 6 0 8v10'], ['Journal', 'M3 5.5c3-1.5 6-1.5 9 0v14c-3-1.5-6-1.5-9 0zM12 5.5c3-1.5 6-1.5 9 0v14c-3-1.5-6-1.5-9 0z'], ['Chat', 'M12 3l1.8 5.4L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.6z'], ['Settings', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 13.7H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10.3 3V3a2 2 0 1 1 4 0v.1A1.7 1.7 0 0 0 17 4.6l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z']].map(([t, d], i) => (
            <div key={t} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: i === 0 ? '#a78bfa' : '#a3a8c3', fontSize: 10.5, fontWeight: 500 }}>
              {i === 0 && <i style={{ width: 18, height: 2, borderRadius: 1, background: '#a78bfa', marginBottom: -1 }} />}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
              {t}
            </div>
          ))}
        </div>
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
