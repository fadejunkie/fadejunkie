'use client'
import { useState, useEffect } from 'react'

const SHOP_URL = 'https://brashae-shop.vercel.app/shop'

const navLinks = [
  { label: 'Shop', href: SHOP_URL },
  { label: 'Services', href: '#services' },
  { label: 'Professionals', href: '#professionals' },
  { label: 'Specials', href: `${SHOP_URL}?collection=specials` },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route-like navigation
  function handleLinkClick() {
    setMenuOpen(false)
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 64,
        background: '#000',
        borderBottom: scrolled ? '1px solid var(--gold-glow-border)' : '1px solid var(--hairline)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(24px, 4vw, 48px)',
        transition: 'border-color 0.3s ease',
      }}>
        {/* Wordmark */}
        <a href="/" style={{
          fontSize: 15, fontWeight: 800,
          color: 'var(--gold)',
          cursor: 'pointer',
        }}>
          BRASHAE&apos;S
        </a>

        {/* Desktop nav links */}
        <div className="nav-desktop" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link"
              onClick={handleLinkClick}
              style={{
                fontSize: 13, color: 'var(--body)',
                padding: '12px 0',
                display: 'inline-block',
                cursor: 'pointer',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a
            href={SHOP_URL}
            className="btn-gold nav-cta-desktop"
            style={{
              display: 'inline-block',
              padding: '8px 18px',
              background: 'var(--gold)',
              color: '#000',
              fontSize: 13, fontWeight: 700,
              borderRadius: 6,
              border: '1px solid var(--gold)',
              cursor: 'pointer',
            }}
          >
            Shop Now
          </a>

          {/* Hamburger — visible on mobile only */}
          <button
            className="nav-hamburger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              display: 'none',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 8, color: 'var(--on-dark)',
            }}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="17" y2="6" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="14" x2="17" y2="14" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 199,
            background: '#000',
            display: 'flex', flexDirection: 'column',
            paddingTop: 64,
          }}
          className="nav-mobile-overlay"
        >
          <div style={{ padding: '32px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={handleLinkClick}
                style={{
                  fontSize: 24, fontWeight: 700, color: 'var(--on-dark)',
                  padding: '16px 0',
                  borderBottom: '1px solid var(--hairline)',
                  cursor: 'pointer',
                  display: 'block',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div style={{ padding: '24px' }}>
            <a
              href={SHOP_URL}
              onClick={handleLinkClick}
              className="btn-gold"
              style={{
                display: 'block', textAlign: 'center',
                padding: '16px 24px',
                background: 'var(--gold)',
                color: '#000',
                fontSize: 15, fontWeight: 700,
                borderRadius: 6,
                border: '1px solid var(--gold)',
                cursor: 'pointer',
              }}
            >
              Shop Now
            </a>
          </div>
        </div>
      )}

      {/* Responsive CSS for navbar */}
      <style>{`
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-cta-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 641px) {
          .nav-mobile-overlay { display: none !important; }
        }
      `}</style>
    </>
  )
}
