const FAQS: [string, string][] = [
  ['How much does DNI Studios cost?',
   '£79 a month on the monthly plan, £69 a month on quarterly billing (£207 every 3 months) or £59 a month on annual billing (£708 a year). Every plan includes every feature.'],
  ['Is there a money-back guarantee?',
   'Yes. If DNI Studios isn\'t right for you, cancel within 30 days of your first payment and we\'ll refund your subscription in full, no questions asked.'],
  ['Do you charge per trainer or per client?',
   'No. Unlimited trainers and unlimited clients are included. There are no per-seat fees, ever.'],
  ['Are there setup fees?',
   'Not for founding studios (and this Christmas, free for every studio that joins before 31 Dec). Onboarding and data migration, a 1:1 setup call and priority support for your first 90 days are included free.'],
  ['Can I cancel?',
   'Yes. It is a rolling agreement with no fixed term beyond the billing cycle you choose, and you can cancel with 14 days’ notice. There is also a 30-day money-back guarantee.'],
  ['Will my price go up?',
   'We will always give you at least 30 days’ notice before any price change. It only applies from your next billing cycle, and you can cancel before it takes effect.'],
]

export default function PricingFaq() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }
  return (
    <section id="faq" style={{ padding: '40px 24px 100px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(26px, 3.4vw, 38px)', fontWeight: 900, letterSpacing: '-1px', textAlign: 'center', marginBottom: 36 }}>
          Pricing <span className="gradient-text">questions</span>
        </h2>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {FAQS.map(([q, a]) => (
            <details key={q} className="faq-item" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '20px 4px' }}>
              <summary style={{ cursor: 'pointer', fontSize: 17, fontWeight: 600, color: 'var(--text)', listStyle: 'none', display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                {q}<span aria-hidden="true" className="faq-plus" style={{ color: 'var(--accent-light)', fontWeight: 400 }}>+</span>
              </summary>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-muted)', marginTop: 12, paddingRight: 28 }}>{a}</p>
            </details>
          ))}
        </div>
      </div>
      <style>{`
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-item[open] .faq-plus { transform: rotate(45deg); }
        .faq-plus { transition: transform .2s ease; display: inline-block; }
      `}</style>
    </section>
  )
}
