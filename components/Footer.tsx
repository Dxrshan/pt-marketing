'use client'
export default function Footer() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '60px 24px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 60, marginBottom: 48 }} className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: 17, color: 'white', letterSpacing: '-0.3px' }}>DNI Studio</span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: 280 }}>
              The all-in-one platform built for personal trainers and studios who are serious about their business.
            </p>
            <div style={{ marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
              A product by <span style={{ color: 'rgba(255,255,255,0.4)' }}>DNI Analytics Ltd</span> · Registered in England &amp; Wales
            </div>
          </div>

          {/* Product */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16 }}>
              Product
            </div>
            {[
              { label: 'Features', href: '#features' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Pricing', href: '#pricing' },
              { label: 'View Offer', href: '/offer', external: false },
              { label: 'Login', href: 'https://pt-manager.onrender.com', external: true },
              { label: 'Register', href: 'https://pt-manager.onrender.com/register', external: true },
            ].map(link => (
              link.external || link.href.startsWith('/') ? (
                <a key={link.label} href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener noreferrer' : undefined}
                  style={{ display: 'block', fontSize: 14, color: link.href === '/offer' ? 'rgba(201,168,106,0.7)' : 'rgba(255,255,255,0.45)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = link.href === '/offer' ? '#c9a86a' : 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = link.href === '/offer' ? 'rgba(201,168,106,0.7)' : 'rgba(255,255,255,0.45)')}
                >
                  {link.label}
                </a>
              ) : (
                <button key={link.label} onClick={() => scrollTo(link.href)}
                  style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', marginBottom: 10, padding: 0, fontFamily: 'inherit', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                >
                  {link.label}
                </button>
              )
            ))}
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16 }}>
              Company
            </div>
            <span style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>DNI Analytics Ltd</span>
            <a href="mailto:darshan.mashru@dnianalytics.co.uk"
              style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            >
              Contact Us
            </a>
            <button onClick={() => scrollTo('#waitlist')}
              style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 10, padding: 0, fontFamily: 'inherit', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            >
              Early Access
            </button>
          </div>
        </div>

        <hr className="gradient-hr" />

        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
            © 2026 DNI Analytics Ltd. All rights reserved. Registered in England & Wales.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="/offer#terms" style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
            >
              Terms of Service
            </a>
            <a href="mailto:darshan.mashru@dnianalytics.co.uk" style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
            >
              Privacy Enquiries
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </footer>
  )
}
