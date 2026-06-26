'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { brand } from '@/brand.config'

// ─── Reveal hook ─────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in-view')
          obs.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

// ─── Stats data ───────────────────────────────────────────────────────────────
const STATS = [
  { value: '500+', label: 'Products' },
  { value: '15',   label: 'Brands'   },
  { value: '1990s', label: 'Est.'    },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function PromoBanner() {
  const textRef = useReveal()

  return (
    <>
      {/* ── Scoped styles ────────────────────────────────────────────────── */}
      <style>{`
        .promo-banner {
          display: flex;
          flex-direction: row;
          min-height: 480px;
          background: #FBF8F3;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          width: 100%;
          overflow: hidden;
        }

        /* Text column */
        .promo-banner__text {
          flex: 0 0 55%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(32px, 6vw, 80px) clamp(24px, 5vw, 72px);
        }

        /* Image column */
        .promo-banner__image {
          flex: 0 0 45%;
          background: #EDE8E1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 480px;
        }

        /* Reveal animation */
        .promo-banner__text.reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .promo-banner__text.reveal.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        /* CTA row */
        .promo-banner__ctas {
          display: flex;
          flex-direction: row;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        /* Stats */
        .promo-banner__stats {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0;
          margin-top: 28px;
        }
        .promo-banner__stat {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 0 20px;
        }
        .promo-banner__stat:first-child {
          padding-left: 0;
        }
        .promo-banner__stat-divider {
          width: 1px;
          height: 36px;
          background: rgba(0,0,0,0.1);
          flex-shrink: 0;
        }

        /* ── Responsive ─────────────────────────────────────────────────── */
        @media (max-width: 767px) {
          .promo-banner {
            flex-direction: column;
            min-height: unset;
          }
          .promo-banner__text {
            flex: unset;
            width: 100%;
            padding: 36px 20px 28px;
          }
          .promo-banner__image {
            flex: unset;
            width: 100%;
            min-height: 200px;
            height: 200px;
          }
          .promo-banner__ctas {
            flex-direction: column;
            gap: 10px;
          }
          .promo-banner__ctas a {
            width: 100%;
            text-align: center;
            justify-content: center;
          }
          /* Hide stats below 390px */
          .promo-banner__stats {
            display: none;
          }
        }

        /* Show stats again at 430px+ (above minimum mobile width) */
        @media (min-width: 430px) {
          .promo-banner__stats {
            display: flex;
          }
        }
      `}</style>

      {/* ── Banner ──────────────────────────────────────────────────────────── */}
      <section className="promo-banner" aria-label="Featured promotion">

        {/* Left — text */}
        <div ref={textRef} className="promo-banner__text reveal">

          {/* Eyebrow */}
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '11px',
              color: '#8A6E2E',
              textTransform: 'uppercase',
              letterSpacing: 'initial',
              display: 'block',
              marginBottom: '14px',
            }}
          >
            Houston&rsquo;s Premier Beauty Supply
          </span>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#111111',
              lineHeight: 1.12,
              margin: '0 0 14px 0',
              textWrap: 'balance',
            } as React.CSSProperties}
          >
            {brand.copy.heroHeadline}
          </h1>

          {/* Subline */}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '15px',
              color: '#555555',
              lineHeight: 1.6,
              maxWidth: '480px',
              margin: 0,
              textWrap: 'pretty',
            } as React.CSSProperties}
          >
            {brand.copy.heroSubline}
          </p>

          {/* CTA row */}
          <div className="promo-banner__ctas">
            {/* Primary CTA */}
            <Link
              href="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#C9A84C',
                color: '#000000',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '14px',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.18s ease, transform 0.12s ease',
                lineHeight: 1,
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = '#E8C96A'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = '#C9A84C'
              }}
              onMouseDown={e => {
                ;(e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'
              }}
              onMouseUp={e => {
                ;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
              }}
            >
              Shop Now
            </Link>

            {/* Secondary CTA — outline on cream: border + text #111111 */}
            <Link
              href="/shop?collection=specials"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'transparent',
                color: '#111111',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '14px',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                border: '1px solid #111111',
                cursor: 'pointer',
                transition: 'border-color 0.18s ease, color 0.18s ease',
                lineHeight: 1,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = '#C9A84C'
                el.style.color = '#C9A84C'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = '#111111'
                el.style.color = '#111111'
              }}
            >
              Pro Access
            </Link>
          </div>

          {/* Stats strip */}
          <div className="promo-banner__stats" role="list" aria-label="Store stats">
            {STATS.map((stat, i) => (
              <React.Fragment key={stat.label}>
                {i > 0 && (
                  <div
                    className="promo-banner__stat-divider"
                    aria-hidden="true"
                  />
                )}
                <div
                  className="promo-banner__stat"
                  role="listitem"
                >
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 700,
                      fontSize: '20px',
                      color: '#111111',
                      lineHeight: 1.1,
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '12px',
                      color: '#999999',
                      marginTop: '2px',
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right — logo */}
        <div className="promo-banner__image" aria-hidden="true">
          <img
            src="/brashae-logo.svg"
            alt=""
            aria-hidden="true"
            width={340}
            height={153}
            style={{
              width: '72%',
              maxWidth: 340,
              height: 'auto',
              objectFit: 'contain',
              mixBlendMode: 'multiply',
              display: 'block',
            }}
          />
        </div>

      </section>
    </>
  )
}
