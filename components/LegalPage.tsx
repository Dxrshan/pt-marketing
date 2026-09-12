import Link from 'next/link'
import Footer from '@/components/Footer'
import TermlyEmbed from '@/components/TermlyEmbed'
import { type TermlyPolicy } from '@/lib/termly'

const OTHER_DOCS: { label: string; href: string }[] = [
  { label: 'Privacy Policy',   href: '/legal/privacy-policy' },
  { label: 'Terms of Service', href: '/legal/terms-of-service' },
  { label: 'Cookie Policy',    href: '/legal/cookie-policy' },
]

export default function LegalPage({
  title, policy, current,
}: { title: string; policy: TermlyPolicy; current: string }) {
  return (
    <main>
      {/* Slim header — the main Nav is anchor/scroll-spy driven and only works on the homepage */}
      <header style={{
        borderBottom: '1px solid var(--card-border)',
        padding: '18px 24px', position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(7,7,15,0.85)', backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
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
          <Link href="/" style={{ fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← Back to site
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '56px 24px 72px' }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, color: 'var(--text)', letterSpacing: '-1px', marginBottom: 12 }}>
          {title}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-subtle)', marginBottom: 32 }}>
          DNI Analytics Ltd · Registered in England &amp; Wales
        </p>

        {/* Sibling documents */}
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 40 }}>
          {OTHER_DOCS.map(doc => {
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

        <TermlyEmbed policy={policy} />
      </div>

      <Footer />
    </main>
  )
}
