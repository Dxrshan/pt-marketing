import Link from 'next/link'
import Footer from '@/components/Footer'

const DOCS = [
  { label: 'Privacy Policy',   href: '/legal/privacy-policy' },
  { label: 'Terms of Service', href: '/legal/terms-of-service' },
  { label: 'Cookie Policy',    href: '/legal/cookie-policy' },
]

export default function LegalPage({
  title, updated, current, children,
}: { title: string; updated: string; current: string; children: React.ReactNode }) {
  return (
    <main>
      {/* Slim header — the main Nav is anchor/scroll-spy driven and only works on the homepage */}
      <header style={{
        borderBottom: '1px solid var(--card-border)',
        padding: '18px 24px', position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(7,7,15,0.85)', backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 17, color: 'var(--text)', letterSpacing: '-0.3px' }}>DNI Studio</span>
          </Link>
          <Link href="/" style={{ fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none' }}>← Back to site</Link>
        </div>
      </header>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '52px 24px 72px' }}>
        <h1 style={{ fontSize: 38, fontWeight: 800, color: 'var(--text)', letterSpacing: '-1px', margin: 0 }}>{title}</h1>
        <p style={{ fontSize: 14, color: 'var(--text-subtle)', margin: '10px 0 0' }}>
          Last updated {updated} · DNI Analytics Ltd, registered in England &amp; Wales
        </p>

        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '28px 0 44px' }}>
          {DOCS.map(doc => {
            const active = doc.href === current
            return (
              <Link key={doc.href} href={doc.href} style={{
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
                padding: '7px 14px', borderRadius: 999,
                color: active ? 'var(--text)' : 'var(--text-muted)',
                background: active ? 'var(--accent-dim)' : 'transparent',
                border: `1px solid ${active ? 'var(--card-border-hover)' : 'var(--card-border)'}`,
              }}>
                {doc.label}
              </Link>
            )
          })}
        </nav>

        <article className="legal-prose">{children}</article>
      </div>

      {/* Scoped prose styling — the codebase styles pages with local <style> blocks
          (see app/offer/page.tsx) rather than adding one-off rules to globals.css. */}
      <style>{`
        .legal-prose { color: rgba(200,200,230,0.72); font-size: 15.5px; line-height: 1.8; }
        .legal-prose h2 {
          color: var(--text); font-size: 22px; font-weight: 700; letter-spacing: -0.4px;
          margin: 48px 0 14px; padding-top: 24px; border-top: 1px solid var(--card-border);
        }
        .legal-prose h2:first-child { margin-top: 0; padding-top: 0; border-top: none; }
        .legal-prose h3 { color: var(--text); font-size: 16.5px; font-weight: 700; margin: 28px 0 8px; }
        .legal-prose p { margin: 0 0 16px; }
        .legal-prose ul { margin: 0 0 18px; padding-left: 22px; }
        .legal-prose li { margin-bottom: 9px; }
        .legal-prose strong { color: var(--text); font-weight: 650; }
        .legal-prose a { color: var(--accent-light); }
        .legal-prose table { width: 100%; border-collapse: collapse; margin: 0 0 20px; font-size: 14px; display: block; overflow-x: auto; }
        .legal-prose th, .legal-prose td {
          text-align: left; padding: 11px 14px; border: 1px solid var(--card-border); vertical-align: top;
        }
        .legal-prose th { color: var(--text); font-weight: 650; background: rgba(255,255,255,0.025); white-space: nowrap; }
        .legal-callout {
          background: var(--card); border: 1px solid var(--card-border);
          border-left: 3px solid var(--accent); border-radius: var(--radius-sm);
          padding: 18px 20px; margin: 0 0 22px;
        }
        .legal-callout p:last-child { margin-bottom: 0; }
      `}</style>

      <Footer />
    </main>
  )
}
