'use client'
import { motion } from 'framer-motion'

const TESTIMONIALS = [
  {
    quote: "I used to spend 3 hours every Sunday updating my spreadsheet. Now it takes me 5 minutes to check the dashboard and I know exactly where every client stands. Game changer.",
    name: 'Alex R.',
    role: 'Personal Trainer · London',
    avatar: 'A',
    avatarColor: '#2563EB',
    stars: 5,
  },
  {
    quote: "My clients love having their own portal. The daily wellness log means I actually know how they're feeling before every session — I'm coaching so much better now. And they stick around longer.",
    name: 'Chloe M.',
    role: 'Online PT & Studio Owner',
    avatar: 'C',
    avatarColor: '#7c3aed',
    stars: 5,
  },
  {
    quote: "The live session logger is unreal. I used to write everything on my phone notes and transfer it later. Now I log sets in real time and clients can see their PBs on the spot — they love it.",
    name: 'Jake T.',
    role: 'Strength & Conditioning Coach',
    avatar: 'J',
    avatarColor: '#06B6D4',
    stars: 5,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" style={{ padding: '100px 0', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div className="badge badge-blue" style={{ marginBottom: 20, display: 'inline-flex' }}>Early Feedback</div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.1 }}>
            Trainers who made the switch
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="testimonial-grid">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="feature-card"
              style={{ padding: '28px 28px' }}
            >
              <Stars count={t.stars} />
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: '16px 0 24px', fontStyle: 'italic' }}>
                &quot;{t.quote}&quot;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${t.avatarColor}, ${t.avatarColor}88)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, color: 'white', flexShrink: 0,
                }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .testimonial-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 560px) and (max-width: 900px) {
          .testimonial-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
