import Image from 'next/image'
import ProSupplyProgram from '@/components/sections/ProSupplyProgram'
import Testimonials from '@/components/sections/Testimonials'
import InstagramFeed from '@/components/sections/InstagramFeed'
import LocationHours from '@/components/sections/LocationHours'
import Footer from '@/components/Footer'

const SHOP_URL = 'https://brashae-shop.vercel.app/shop'

const label: React.CSSProperties = {
  fontSize: 11,
  textTransform: 'uppercase',
  color: 'var(--gold)',
  fontWeight: 700,
}

const brands = [
  'Andis', 'Wahl', 'BaByliss PRO', 'JRL', 'Gamma+', 'Oster', 'CHI', 'Mizani',
]

const featuredProducts = [
  { brand: 'ANDIS', name: 'Master MX Cordless Clipper', price: '$189.99' },
  { brand: 'JRL', name: '2020C Professional Clipper', price: '$249.99' },
  { brand: 'BABYLISS PRO', name: 'FX870 Boost+ Clipper', price: '$129.99' },
]

const newArrivals = [
  { brand: 'GAMMA+', name: 'Absolute Hitter Trimmer', price: '$89.99' },
  { brand: 'WAHL', name: 'Magic Clip Cordless', price: '$119.99' },
  { brand: 'CHI', name: 'G2 Ceramic Flat Iron', price: '$79.99' },
  { brand: 'MIZANI', name: '25 Miracle Milk', price: '$34.99' },
  { brand: 'OSTER', name: 'Classic 76 Clipper', price: '$159.99' },
]

export default function HomePage() {
  return (
    <>
    <main style={{ background: 'var(--canvas)', color: 'var(--on-dark)', minHeight: '100vh' }}>

      {/* ── PROMO BANNER ────────────────────────────────── */}
      <div style={{
        height: 48,
        background: 'var(--canvas)',
        borderBottom: '1px solid var(--hairline)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ ...label, color: 'var(--body)' }}>
          Free shipping on orders over $75 &nbsp;·&nbsp; 713-541-2279
        </p>
      </div>

      {/* ── HERO ────────────────────────────────────────── */}
      <section style={{ position: 'relative', width: '100%', height: 'calc(100svh - 48px)', overflow: 'hidden' }}>
        <Image
          src="/images/storefront/storefront-exterior-dusk-main.jpg"
          alt="Brashae's Barber Beauty Supply storefront at dusk"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Gradient overlay — bottom-weighted for bottom-anchored content. Note: DESIGN.md specifies
            linear-gradient(to right, ...) for side-split editorial; current bottom-to-top intentional
            given content is position:absolute bottom:0. Review before changing. */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.1) 100%)',
        }} />
        {/* Content */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: 'clamp(24px, 4vw, 72px) clamp(24px, 5vw, 80px)',
        }}>
          <p style={{ ...label, marginBottom: 20 }}>BRASHAE&apos;S BARBER BEAUTY SUPPLY</p>
          <h1 style={{
            fontSize: 'clamp(3rem, 7vw, 6.5rem)',
            fontWeight: 800,
            lineHeight: 1.0,
            maxWidth: '12ch',
            textWrap: 'balance',
          }}>
            Where Houston Gets Sharp.
          </h1>
          <p style={{
            fontSize: 18, color: 'var(--body)',
            marginTop: 20, maxWidth: '40ch', lineHeight: 1.5,
            textWrap: 'pretty',
          }}>
            Professional supply store &amp; salon suite complex. 11902 S Gessner, Houston TX.
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 36, flexWrap: 'wrap' }}>
            <a href={SHOP_URL} className="btn-gold" style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'var(--gold)',
              color: '#000',
              fontSize: 14, fontWeight: 700,
              borderRadius: 6,
              border: '1px solid var(--gold)',
              cursor: 'pointer',
            }}>
              Shop Now
            </a>
            <a href="#suites" className="btn-outline-gold" style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'transparent',
              color: 'var(--gold)',
              fontSize: 14, fontWeight: 700,
              borderRadius: 6,
              border: '1px solid var(--gold)',
              cursor: 'pointer',
            }}>
              Book a Suite
            </a>
          </div>
        </div>
      </section>

      {/* ── FEATURED PICKS ──────────────────────────────── */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)' }}>
        <p style={{ ...label, marginBottom: 16 }}>FEATURED</p>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16, marginBottom: 48,
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, lineHeight: 1.05,
            textWrap: 'balance',
          }}>
            Staff Picks
          </h2>
          <a href={SHOP_URL} style={{
            fontSize: 13, color: 'var(--body)',
            borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 1,
            cursor: 'pointer',
          }}>
            Shop All Products →
          </a>
        </div>

        <div
          className="featured-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {featuredProducts.map((p) => (
            <a href={SHOP_URL} key={p.name}
              className="card-hover"
              style={{
                display: 'block',
                border: '1px solid var(--hairline)',
                borderRadius: 8,
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              {/* Image placeholder */}
              <div style={{
                aspectRatio: '3/4', background: 'var(--surface-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  {p.brand}
                </span>
              </div>
              <div style={{ padding: '16px 16px 20px' }}>
                <p style={{ ...label, marginBottom: 6 }}>{p.brand}</p>
                <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{p.name}</p>
                <p style={{
                  fontSize: '1.25rem', fontWeight: 700, marginTop: 6,
                  color: 'var(--gold)', fontVariantNumeric: 'tabular-nums',
                }}>{p.price}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── NEW ARRIVALS ────────────────────────────────── */}
      <section style={{ padding: '0 0 clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)' }}>
        <p style={{ ...label, marginBottom: 16 }}>NEW ARRIVALS</p>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16, marginBottom: 48, paddingRight: 'clamp(24px, 5vw, 80px)',
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, lineHeight: 1.05,
            textWrap: 'balance',
          }}>
            Just Dropped
          </h2>
          <a href={SHOP_URL} style={{
            fontSize: 13, color: 'var(--body)',
            borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 1,
            cursor: 'pointer',
          }}>
            See All →
          </a>
        </div>

        <div
          className="scroll-hide"
          style={{ display: 'flex', overflowX: 'auto', gap: 16 }}
        >
          {newArrivals.map((p) => (
            <a href={SHOP_URL} key={p.name}
              className="card-hover"
              style={{
                display: 'block', flexShrink: 0, width: 260,
                border: '1px solid var(--hairline)',
                borderRadius: 8, overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              <div style={{
                aspectRatio: '1/1', background: 'var(--surface-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  {p.brand}
                </span>
              </div>
              <div style={{ padding: '14px 16px 16px' }}>
                <p style={{ ...label, marginBottom: 4 }}>{p.brand}</p>
                <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{p.name}</p>
                <p style={{
                  fontSize: '1.25rem', fontWeight: 700, marginTop: 4,
                  color: 'var(--gold)', fontVariantNumeric: 'tabular-nums',
                }}>{p.price}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── SHOP BY BRAND ────────────────────────────────── */}
      <section style={{ padding: '0 clamp(24px, 5vw, 80px) clamp(80px, 10vw, 120px)' }}>
        <p style={{ ...label, marginBottom: 48 }}>SHOP BY BRAND</p>
        <div
          className="scroll-hide"
          style={{ display: 'flex', overflowX: 'auto', gap: 16, flexWrap: 'wrap' }}
        >
          {brands.map((b) => (
            <a
              href={`${SHOP_URL}?brand=${encodeURIComponent(b)}`}
              key={b}
              className="card-hover"
              style={{
                flexShrink: 0, width: 160, height: 160,
                border: '1px solid var(--hairline)',
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <span style={{
                fontSize: 11,
                textTransform: 'uppercase', fontWeight: 600, textAlign: 'center', padding: '0 8px',
              }}>
                {b}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── SUITE RENTAL CTA ──────────────────────────────── */}
      <section id="suites" style={{
        padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)',
        borderTop: '1px solid var(--hairline)',
      }}>
        <p style={{ ...label, marginBottom: 20 }}>SALON SUITES</p>
        <div
          className="suite-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center' }}
        >
          <div>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: 24,
              textWrap: 'balance',
            }}>
              30+ Independent Suites Available
            </h2>
            <p style={{
              fontSize: 17, color: 'var(--body)', lineHeight: 1.6, marginBottom: 36,
              textWrap: 'pretty',
            }}>
              Rent your own fully equipped suite. Run your business your way.
              Barbers, stylists, estheticians welcome.
            </p>
            <a href="tel:7135412279" className="btn-gold" style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'var(--gold)',
              color: '#000',
              fontSize: 14, fontWeight: 700,
              borderRadius: 6,
              border: '1px solid var(--gold)',
              cursor: 'pointer',
            }}>
              Call to Inquire: 713-541-2279
            </a>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2,
          }}>
            {['Private Suite', 'Flexible Terms', 'Prime Location', 'Pro Supply On-Site'].map((f) => (
              <div key={f} style={{
                background: 'var(--surface-soft)', padding: '32px 24px',
                borderTop: '2px solid var(--gold)',
              }}>
                <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRO SUPPLY PROGRAM ──────────────────────────── */}
      <ProSupplyProgram />

      {/* ── TESTIMONIALS ────────────────────────────────── */}
      <Testimonials />

      {/* ── INSTAGRAM FEED ──────────────────────────────── */}
      <InstagramFeed />

      {/* ── LOCATION + HOURS ────────────────────────────── */}
      <LocationHours />

    </main>

    <Footer />
    </>
  )
}
