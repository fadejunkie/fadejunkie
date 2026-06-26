'use client'
import { useState } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/shop?collection=clippers', label: 'Clippers' },
  { href: '/shop?collection=trimmers', label: 'Trimmers' },
  { href: '/shop?collection=hair-care', label: 'Hair Care' },
  { href: '/shop?collection=specials', label: 'Specials', gold: true },
]

// Cart count is static for now — TODO: wire to Convex cart session
const CART_COUNT = 0

export default function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <style>{`
        .sh-desktop-nav { display: flex; }
        .sh-hamburger    { display: none; }
        .sh-pro-link     { display: flex; }
        @media (max-width: 767px) {
          .sh-desktop-nav { display: none !important; }
          .sh-hamburger    { display: flex !important; }
          .sh-pro-link     { display: none !important; }
        }
        .sh-nav-link {
          font-size: 13px;
          font-weight: 400;
          color: #555555;
          padding: 12px 0;
          display: inline-block;
          transition: color 0.15s ease;
          text-decoration: none;
        }
        .sh-nav-link:hover { color: #111111; }
        .sh-nav-link-gold  { color: #C9A84C !important; font-weight: 600; }
        .sh-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          color: #555555;
          transition: color 0.15s ease;
          border-radius: 6px;
        }
        .sh-icon-btn:hover { color: #111111; }
        /* mobile drawer */
        .sh-mobile-menu {
          position: fixed;
          inset: 0;
          z-index: 99;
          background: #FAF7F2;
          display: flex;
          flex-direction: column;
          padding-top: 56px;
          animation: sh-slide-in 0.25s ease;
        }
        @keyframes sh-slide-in {
          from { transform: translateX(100%); }
          to   { transform: translateX(0);    }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes sh-slide-in { from { opacity: 0; } to { opacity: 1; } }
        }
      `}</style>

      {/* ── Fixed header bar ─────────────────────────────────────────────────── */}
      <header
        role="banner"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          height: 64,
          background: '#FBF8F3',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(16px, 4vw, 48px)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Left — logo + wordmark */}
        <Link
          href="/shop"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
          }}
        >
          {/* B|B monogram — mix-blend-mode removes white bg on cream */}
          <img
            src="/brand/logo-symbol.png"
            alt=""
            aria-hidden="true"
            width={32}
            height={32}
            style={{
              mixBlendMode: 'multiply',
              objectFit: 'contain',
              display: 'block',
            }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <span
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: '#111111',
              letterSpacing: 'initial',
            }}
          >
            Brashae&rsquo;s
          </span>
        </Link>

        {/* Center — desktop nav links */}
        <nav
          aria-label="Main navigation"
          className="sh-desktop-nav"
          style={{ gap: 28, alignItems: 'center' }}
        >
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`sh-nav-link${link.gold ? ' sh-nav-link-gold' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right — search + pro account + cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Search */}
          <button
            className="sh-icon-btn"
            aria-label="Search"
            onClick={() => {/* TODO: open search modal */}}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Pro Account (desktop only) */}
          <Link
            href="/shop?collection=specials"
            className="sh-pro-link sh-nav-link"
            style={{ marginLeft: 8, marginRight: 4 }}
            aria-label="Pro Account"
          >
            Pro
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            aria-label={`Cart${CART_COUNT > 0 ? `, ${CART_COUNT} items` : ''}`}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              padding: 6,
              color: '#555555',
              transition: 'color 0.15s ease',
              borderRadius: 6,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#111111' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#555555' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {CART_COUNT > 0 && (
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: '#C9A84C',
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: 10,
                  borderRadius: '50%',
                  width: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}
              >
                {CART_COUNT}
              </span>
            )}
          </Link>

          {/* Hamburger (mobile only) */}
          <button
            className="sh-icon-btn sh-hamburger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{ marginLeft: 4 }}
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ────────────────────────────────────────────────────── */}
      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="sh-mobile-menu"
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{
              padding: '24px 24px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  fontWeight: 700,
                  fontSize: 22,
                  color: link.gold ? '#C9A84C' : '#111111',
                  padding: '16px 0',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  textDecoration: 'none',
                  letterSpacing: 'initial',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div style={{ padding: '24px' }}>
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '16px 24px',
                background: '#C9A84C',
                color: '#000000',
                fontWeight: 700,
                fontSize: 15,
                borderRadius: 6,
                textDecoration: 'none',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#E8C96A' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#C9A84C' }}
            >
              View Cart
            </Link>
          </div>
        </nav>
      )}
    </>
  )
}
