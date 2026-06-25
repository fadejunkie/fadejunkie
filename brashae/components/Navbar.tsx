'use client'
import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/shop?collection=clippers', label: 'Clippers' },
  { href: '/shop?collection=trimmers', label: 'Trimmers' },
  { href: '/shop?collection=hair-care', label: 'Hair Care' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMobileMenu() {
    setMenuOpen(false)
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 64,
        background: '#000',
        borderBottom: '1px solid var(--hairline)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(24px, 4vw, 48px)',
      }}>
        <Link href="/shop" style={{
          fontSize: 14, fontWeight: 800,
          color: 'var(--gold)',
          cursor: 'pointer',
        }}>
          BRASHAE&apos;S
        </Link>

        {/* Desktop nav */}
        <div className="ecomm-nav-desktop" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              style={{
                fontSize: 13,
                color: 'var(--body)',
                padding: '12px 0',
                display: 'inline-block',
                cursor: 'pointer',
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/shop?collection=specials"
            className="nav-link"
            style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600, padding: '12px 0' }}
          >
            Specials
          </Link>
        </div>

        {/* Right: Cart + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link
            href="/cart"
            className="btn-gold"
            style={{
              fontSize: 13, color: '#000', fontWeight: 700,
              background: 'var(--gold)', padding: '8px 16px',
              borderRadius: 6, border: '1px solid var(--gold)',
              cursor: 'pointer',
              display: 'inline-block',
            }}
          >
            Cart
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="ecomm-nav-hamburger"
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

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="ecomm-nav-mobile"
          style={{
            position: 'fixed', inset: 0, zIndex: 99,
            background: '#000',
            display: 'flex', flexDirection: 'column',
            paddingTop: 64,
          }}
        >
          <div style={{ padding: '32px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                style={{
                  fontSize: 22, fontWeight: 700, color: 'var(--on-dark)',
                  padding: '16px 0',
                  borderBottom: '1px solid var(--hairline)',
                  cursor: 'pointer',
                  display: 'block',
                }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/shop?collection=specials"
              onClick={closeMobileMenu}
              style={{
                fontSize: 22, fontWeight: 700, color: 'var(--gold)',
                padding: '16px 0',
                borderBottom: '1px solid var(--hairline)',
                cursor: 'pointer',
                display: 'block',
              }}
            >
              Specials
            </Link>
          </div>
          <div style={{ padding: '24px' }}>
            <Link
              href="/cart"
              onClick={closeMobileMenu}
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
              Cart
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .ecomm-nav-desktop { display: none !important; }
          .ecomm-nav-hamburger { display: flex !important; }
        }
        @media (min-width: 641px) {
          .ecomm-nav-mobile { display: none !important; }
        }
      `}</style>
    </>
  )
}
