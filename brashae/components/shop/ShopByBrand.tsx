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

const BRANDS = [
  { name: 'Andis',       slug: 'andis'        },
  { name: 'BaByliss PRO',slug: 'babyliss-pro' },
  { name: 'Wahl',        slug: 'wahl'         },
  { name: 'Oster',       slug: 'oster'        },
  { name: 'JRL',         slug: 'jrl'          },
  { name: 'Gamma+',      slug: 'gamma-plus'   },
  { name: 'Cocco',       slug: 'cocco'        },
  { name: 'CHI',         slug: 'chi'          },
  { name: 'Mizani',      slug: 'mizani'       },
  { name: 'Avlon',       slug: 'avlon'        },
  { name: 'Level3',      slug: 'level3'       },
  { name: 'Immortal',    slug: 'immortal'     },
  { name: 'SC',          slug: 'sc'           },
  { name: 'ST Supreme',  slug: 'st-supreme'   },
]

export default function ShopByBrand() {
  const ref = useReveal()

  return (
    <>
      <style>{`
        .brand-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
          margin-top: 32px;
        }
        @media (max-width: 639px) {
          .brand-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 8px;
          }
        }
        .brand-card {
          background: #FFFDF9;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 8px;
          padding: 20px 12px;
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          text-decoration: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }
        .brand-card:hover {
          border-color: rgba(201,168,76,0.5);
          box-shadow: 0 4px 16px rgba(201,168,76,0.12);
        }
      `}</style>

      <section
        aria-labelledby="brands-heading"
        style={{
          background: '#FBF8F3',
          padding: 'clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div ref={ref} className="reveal" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Header */}
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
            Shop by Brand
          </span>
          <h2
            id="brands-heading"
            style={{
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
              fontWeight: 700,
              color: '#111111',
              margin: 0,
              textWrap: 'balance',
            } as React.CSSProperties}
          >
            Browse by Brand
          </h2>

          {/* Grid */}
          {/* TODO: replace text labels with brand logo imgs once assets are available */}
          <div className="brand-grid" role="list">
            {BRANDS.map(b => (
              <Link
                key={b.slug}
                href={`/shop?collection=${b.slug}`}
                className="brand-card"
                role="listitem"
                aria-label={`Shop ${b.name}`}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: '#333333',
                    lineHeight: 1.2,
                  }}
                >
                  {b.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
