'use client'
// Product facts + promises. (Replaces placeholder testimonials: no reviews are
// shown until real founding studios have given them.)
import { SectionHead, Counter, Reveal, SpotlightCard, Icon } from './fx'

const FACTS = [
  { value: 10, suffix: ' min', prefix: '<', label: 'to set up your studio' },
  { value: 0, prefix: '£', suffix: '', label: 'per-trainer or per-client fees' },
  { value: 30, suffix: ' days', prefix: '', label: 'money-back guarantee' },
  { value: 100, suffix: '%', prefix: '', label: 'of features on every plan' },
]

const PROMISES = [
  ['heart', 'Built with PTs', 'Shaped by working personal trainers and studio owners, around the jobs that eat their week.'],
  ['shield', 'Your data stays yours', 'Export everything any time. We never sell or share client data. UK company, UK law.'],
  ['users', 'A real human on day one', 'Founding studios get a 1:1 setup call with the founder and priority support for 90 days.'],
]

export default function TestimonialsSection() {
  return (
    <section id="why" style={{ padding: '120px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <SectionHead eyebrow="Why DNI Studios" title="Premium software." accent="Fair, simple terms." />

        <Reveal delay={0.1}>
          <div className="facts" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', marginTop: 64, borderRadius: 24, border: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))', overflow: 'hidden' }}>
            {FACTS.map(f => (
              <div key={f.label} style={{ padding: '34px 26px', borderRight: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                <div className="steel-text" style={{ fontSize: 'clamp(40px, 4.4vw, 58px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                  <Counter to={f.value} prefix={f.prefix} suffix={f.suffix} />
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 10 }}>{f.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="promises" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16 }}>
          {PROMISES.map(([icon, t, d], i) => (
            <Reveal key={t} delay={0.1 + i * 0.08}>
              <SpotlightCard style={{ padding: 28, height: '100%' }}>
                <span style={{ color: 'var(--steel-1)' }}><Icon name={icon} size={24} /></span>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 14 }}>{t}</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-muted)', marginTop: 8 }}>{d}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .facts { grid-template-columns: 1fr 1fr !important; }
          .promises { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
