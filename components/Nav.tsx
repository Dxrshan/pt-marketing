'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BrandLogo from './BrandLogo'

// Each link is a real page/URL (crawlable, works from any page). On a page that
// also contains the matching section, clicking scrolls to it instead.
const NAV_LINKS = [
  { label: 'Features', href: '/features', section: 'features' },
  { label: 'Product', href: '/#story', section: 'story' },
  { label: 'Pricing', href: '/pricing', section: 'pricing' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.section)
    const observers: IntersectionObserver[] = []

    ids.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    else window.location.href = '/' + href
  }

  // Follow the link normally unless the section is on this page and this is the
  // home page (where the nav acts as in-page navigation).
  const onNavClick = (e: React.MouseEvent, link: typeof NAV_LINKS[number]) => {
    const el = document.getElementById(link.section)
    if (el && window.location.pathname === '/') {
      e.preventDefault()
      setMobileOpen(false)
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: 'background 0.4s ease, border-color 0.4s ease',
          background: scrolled ? 'rgba(8, 9, 11, 0.72)' : 'transparent',
          backdropFilter: scrolled ? 'blur(18px) saturate(140%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
            {/* Logo */}
            <a href="/" aria-label="DNI Studios home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <BrandLogo height={38} className="logo-wide" />
              <BrandLogo variant="mark" height={34} className="logo-narrow" />
            </a>

            {/* Desktop nav links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
              {NAV_LINKS.map(link => {
                const isActive = activeSection === link.section
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={e => onNavClick(e, link)}
                    style={{
                      display: 'inline-block', textDecoration: 'none',
                      background: isActive ? 'rgba(255,255,255,0.07)' : 'none',
                      border: 'none', cursor: 'pointer',
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)',
                      fontSize: 14, fontWeight: isActive ? 600 : 500,
                      padding: '8px 16px', borderRadius: 8,
                      transition: 'all 0.25s ease',
                      fontFamily: 'inherit',
                      position: 'relative',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.background = 'none' }
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <span style={{
                        position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
                        width: 16, height: 2, borderRadius: 2,
                        background: 'linear-gradient(90deg, #9aa0a8, #ffffff, #9aa0a8)',
                        display: 'block',
                      }} />
                    )}
                  </a>
                )
              })}
              <a
                href="/offer"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#e8eaee', fontSize: 14, fontWeight: 500,
                  padding: '8px 16px', borderRadius: 8,
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                View Offer
              </a>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <a
                href="https://app.dnianalytics.com"
                className="btn-ghost hidden-mobile"
                style={{
                  padding: '8px 18px', borderRadius: 8,
                  fontSize: 14, fontWeight: 500,
                  textDecoration: 'none', display: 'inline-block',
                }}
              >
                Log in
              </a>
              <button
                onClick={() => scrollTo('#waitlist')}
                className="btn-primary"
                style={{
                  padding: '9px 20px', borderRadius: 8,
                  fontSize: 14, fontWeight: 600,
                  position: 'relative', zIndex: 1,
                }}
              >
                Get Early Access
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(o => !o)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                style={{
                  background: 'none', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white', cursor: 'pointer',
                  padding: '8px 10px', borderRadius: 8,
                  display: 'none', touchAction: 'manipulation',
                }}
                className="show-mobile"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {mobileOpen
                    ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                    : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                  }
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed', top: 68, left: 0, right: 0, zIndex: 99,
              background: 'rgb(10, 10, 10)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              padding: '20px 24px 24px',
            }}
          >
            {NAV_LINKS.map(link => {
              const isActive = activeSection === link.section
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={e => onNavClick(e, link)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left', textDecoration: 'none',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
                    fontSize: 16, fontWeight: isActive ? 600 : 500,
                    padding: '14px 0', fontFamily: 'inherit',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {isActive ? '→ ' : ''}{link.label}
                </a>
              )
            })}
            <a
              href="/offer"
              style={{
                display: 'block',
                color: '#e8eaee', fontSize: 16, fontWeight: 500,
                padding: '14px 0', textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              View Offer
            </a>
            <a
              href="https://app.dnianalytics.com"
              style={{
                display: 'block', marginTop: 16,
                color: 'rgba(255,255,255,0.6)', fontSize: 16,
                textDecoration: 'none',
              }}
            >
              Log in →
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  )
}
