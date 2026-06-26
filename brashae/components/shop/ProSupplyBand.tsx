'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('in-view'); obs.unobserve(el) } },
      { threshold: 0.1, rootMargin: '-40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

const BENEFITS = [
  {
    title: 'Wholesale Pricing',
    body:  'Up to 30% off retail on all major brands.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    title: 'Priority Orders',
    body:  'Your orders are fulfilled first — no waitlists.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    title: 'Early Access',
    body:  'New arrivals in your Pro dashboard 48hrs early.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
]

export default function ProSupplyBand() {
  const ref = useReveal()

  return (
    <>
      <style>{`
        .pro-band-benefits {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          margin-top: 48px;
        }
        @media (max-width: 767px) {
          .pro-band-benefits {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .pro-band-cta {
            width: 100%;
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>

      <section
        aria-label="Pro Supply Program"
        style={{
          background: '#0A0A0A',
          borderTop: '1px solid #2A2A2A',
          borderBottom: '1px solid #2A2A2A',
          padding: 'clamp(56px, 8vw, 96px) clamp(24px, 5vw, 80px)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          ref={ref}
          className="reveal"
          style={{ maxWidth: 1200, margin: '0 auto' }}
        >
          {/* Eyebrow */}
          <span
            style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 700,
              color: '#C9A84C',
              textTransform: 'uppercase',
              marginBottom: 16,
              letterSpacing: 'initial',
            }}
          >
            Pro Barbers
          </span>

          {/* Headline */}
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.15,
              margin: 0,
              maxWidth: 640,
              textWrap: 'balance',
            } as React.CSSProperties}
          >
            Wholesale Access for Working Barbers
          </h2>

          {/* Body */}
          <p
            style={{
              marginTop: 16,
              fontSize: 15,
              fontWeight: 400,
              color: '#BBBBBB',
              maxWidth: 560,
              lineHeight: 1.65,
              textWrap: 'pretty',
            } as React.CSSProperties}
          >
            Licensed pros get wholesale pricing, early access to new arrivals, and priority orders.
            Apply for your Pro Account in minutes.
          </p>

          {/* Benefits */}
          <div className="pro-band-benefits" role="list">
            {BENEFITS.map(b => (
              <div key={b.title} role="listitem" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>{b.icon}</div>
                <p style={{ fontWeight: 700, fontSize: 15, color: '#FFFFFF', margin: 0 }}>{b.title}</p>
                <p style={{ fontWeight: 400, fontSize: 13, color: '#BBBBBB', margin: 0, lineHeight: 1.55, textWrap: 'pretty' } as React.CSSProperties}>{b.body}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: 48 }}>
            <Link
              href="/shop?collection=specials"
              className="pro-band-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: '#C9A84C',
                color: '#000000',
                fontWeight: 700,
                fontSize: 14,
                padding: '14px 28px',
                borderRadius: 6,
                textDecoration: 'none',
                transition: 'background 0.2s ease, transform 0.12s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#E8C96A' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#C9A84C' }}
              onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)' }}
              onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
            >
              Apply for Pro Access
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
