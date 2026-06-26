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
      { threshold: 0.08, rootMargin: '-40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function fmt(cents: number) {
  return '$' + (cents / 100).toFixed(2)
}

// TODO: Replace DEMO_SPECIALS with Convex query: useQuery(api.products.listSpecials)
const DEMO_SPECIALS = [
  { name: 'Andis Master Cordless',   brand: 'ANDIS',        price: 11999, originalPrice: 14999, slug: 'andis-master-cordless', tag: 'SALE'        },
  { name: 'Wahl Magic Clip Cordless', brand: 'WAHL',         price:  8499, originalPrice:  9999, slug: 'wahl-magic-clip',      tag: 'SALE'        },
  { name: 'BaByliss PRO FX870',       brand: 'BABYLISS PRO', price: 15999, originalPrice: 18999, slug: 'babyliss-fx870',       tag: 'SALE'        },
  { name: 'JRL Onyx Trimmer',         brand: 'JRL',          price:  7999, originalPrice:  9500, slug: 'jrl-onyx',            tag: 'NEW + SALE'  },
]

export default function MonthlySpecials() {
  const sectionRef = useReveal()
  const month = new Date().toLocaleString('default', { month: 'long' })

  return (
    <>
      <style>{`
        .specials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
          margin-top: 32px;
        }
        @media (max-width: 639px) {
          .specials-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 12px;
          }
        }
        .special-card {
          background: #FFFDF9;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .special-card:hover {
          border-color: rgba(201,168,76,0.5);
          box-shadow: 0 4px 16px rgba(201,168,76,0.12);
        }
        .special-card__img {
          aspect-ratio: 3 / 4;
          background: #EDE8E1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .special-card__badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #C9A84C;
          color: #000000;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: initial;
        }
        .special-card__info {
          padding: 14px 16px 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .special-card__add {
          width: 100%;
          background: #C9A84C;
          color: #000000;
          border: none;
          border-top: 1px solid rgba(0,0,0,0.06);
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 700;
          font-family: Inter, sans-serif;
          cursor: pointer;
          transition: background 0.2s ease;
          border-radius: 0 0 8px 8px;
        }
        .special-card__add:hover { background: #E8C96A; }
      `}</style>

      <section
        aria-labelledby="specials-heading"
        style={{
          background: '#FAF7F2',
          padding: 'clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div ref={sectionRef} className="reveal" style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#8A6E2E',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                  letterSpacing: 'initial',
                }}
              >
                This Month&rsquo;s Deals
              </span>
              <h2
                id="specials-heading"
                style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  fontWeight: 700,
                  color: '#111111',
                  margin: 0,
                  textWrap: 'balance',
                } as React.CSSProperties}
              >
                {month} Specials
              </h2>
              <p
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  color: '#555555',
                  textWrap: 'pretty',
                } as React.CSSProperties}
              >
                Fresh deals on professional supplies — updated monthly.
              </p>
            </div>
            <Link
              href="/shop?collection=specials"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#C9A84C',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                transition: 'color 0.15s ease',
                flexShrink: 0,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#E8C96A' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#C9A84C' }}
            >
              View all specials <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Grid */}
          {DEMO_SPECIALS.length === 0 ? (
            <p style={{ color: '#999999', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>
              No specials this month — check back soon.
            </p>
          ) : (
            <div className="specials-grid" role="list">
              {DEMO_SPECIALS.map(p => {
                const onSale = p.originalPrice > p.price
                return (
                  <article key={p.slug} className="special-card" role="listitem">
                    {/* Image placeholder */}
                    <div className="special-card__img">
                      {/* TODO: <Image> once product photos are available */}
                      <span style={{ fontWeight: 800, fontSize: 20, color: '#C9A84C', letterSpacing: 'initial' }}>
                        {p.brand.split(' ')[0]}
                      </span>
                      <span className="special-card__badge">{p.tag}</span>
                    </div>

                    {/* Info */}
                    <div className="special-card__info">
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#8A6E2E', textTransform: 'uppercase', letterSpacing: 'initial' }}>
                        {p.brand}
                      </span>
                      <p style={{
                        fontSize: 14, fontWeight: 700, color: '#111111', margin: 0, lineHeight: 1.3,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      } as React.CSSProperties}>
                        {p.name}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <span style={{ fontSize: 20, fontWeight: 700, color: '#C9A84C', fontVariantNumeric: 'tabular-nums' }}>
                          {fmt(p.price)}
                        </span>
                        {onSale && (
                          <span style={{ fontSize: 13, color: '#999999', textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}>
                            {fmt(p.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart */}
                    {/* TODO: wire onClick to cart mutation once Convex cart is ready */}
                    <button
                      className="special-card__add"
                      onClick={() => { /* cart add — to be wired */ }}
                      aria-label={`Add ${p.name} to cart`}
                    >
                      Add to Cart
                    </button>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
