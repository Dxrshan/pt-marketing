// Top-of-page header for standalone pages (Features, Pricing): breadcrumb,
// H1 and a short intro. Sits under the fixed nav.
export default function PageIntro({ crumb, title, accent, intro }: {
  crumb: string; title: string; accent?: string; intro: string
}) {
  return (
    <header style={{ padding: '150px 24px 0', textAlign: 'center', position: 'relative' }}>
      <div className="glow-orb glow-blue" style={{ width: 520, height: 520, top: 40, left: '50%', transform: 'translateX(-50%)', opacity: 0.18 }} />
      <nav aria-label="Breadcrumb" style={{ position: 'relative', fontSize: 13, color: 'var(--text-muted)', marginBottom: 22 }}>
        <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</a>
        <span style={{ margin: '0 8px', opacity: 0.5 }}>/</span>
        <span style={{ color: 'var(--text)' }}>{crumb}</span>
      </nav>
      <h1 style={{ position: 'relative', fontSize: 'clamp(36px, 5.5vw, 64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05, maxWidth: 860, margin: '0 auto' }}>
        {title}{accent && <> <span className="gradient-text">{accent}</span></>}
      </h1>
      <p style={{ position: 'relative', fontSize: 18, lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: 620, margin: '20px auto 0' }}>
        {intro}
      </p>
    </header>
  )
}
