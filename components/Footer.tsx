'use client'
import BrandLogo from './BrandLogo'
export default function Footer() {

  // Go to the sign-up form: scroll if it's on this page, otherwise open it on the home page.
  const toSignup = (e: React.MouseEvent) => {
    const el = document.getElementById('waitlist')
    if (!el) return
    e.preventDefault()
    el.scrollIntoView({ behavior: 'smooth' })
  }

  const COLS: { title: string; links: { label: string; href: string; onClick?: (e: React.MouseEvent) => void; external?: boolean }[] }[] = [
    { title: 'Product', links: [
      { label: 'Features', href: '/features' },
      { label: 'How it works', href: '/features#how-it-works' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Log in', href: 'https://app.dnianalytics.com', external: true },
    ] },
    { title: 'Company', links: [
      { label: 'Get early access', href: '/#waitlist', onClick: toSignup },
      { label: 'Contact us', href: 'mailto:darshan.mashru@dnianalytics.com' },
    ] },
    { title: 'Legal', links: [
      { label: 'Privacy policy', href: '/legal/privacy-policy' },
      { label: 'Terms of service', href: '/legal/terms-of-service' },
      { label: 'Cookie policy', href: '/legal/cookie-policy' },
      { label: 'Data processing (DPA)', href: '/legal/dpa' },
    ] },
  ]

  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '80px 24px 0', background: '#050607', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 48 }}>
          <div>
            <BrandLogo height={40} />
            <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 300, marginTop: 20 }}>
              Studio software for personal trainers who are serious about their business.
            </p>
          </div>

          {COLS.map(col => (
            <nav key={col.title} aria-label={col.title}>
              <div className="mono" style={{ fontSize: 11.5, fontWeight: 500, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '.18em', marginBottom: 18 }}>
                {col.title}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.links.map(link => (
                  <li key={link.label}>
                    <a className="footer-link" href={link.href} onClick={link.onClick}
                      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                      {link.label}{link.external && <span aria-hidden="true" style={{ marginLeft: 6, opacity: 0.6 }}>↗</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div style={{ marginTop: 56, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 12.5, color: 'rgba(255,255,255,0.3)' }}>
          {`© ${new Date().getFullYear()} DNI Ltd, trading as DNI Analytics · Registered in England & Wales, company no. 15630271`}
        </div>
      </div>
      <div aria-hidden="true" style={{ marginTop: 56, textAlign: 'center', lineHeight: 0.8, overflow: 'hidden' }}>
        <span className="footer-giant" style={{ display: 'inline-block', fontSize: 'clamp(48px, 15vw, 260px)', fontWeight: 800, letterSpacing: '-0.06em', whiteSpace: 'nowrap',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.0) 85%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          DNI STUDIOS
        </span>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px 24px !important; }
          .footer-grid > div:first-child { grid-column: 1 / -1; }
        }
      `}</style>
    </footer>
  )
}
