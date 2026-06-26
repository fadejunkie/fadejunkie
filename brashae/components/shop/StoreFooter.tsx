import Link from 'next/link'
import { brand } from '@/brand.config'

const HOURS = [
  { days: 'Mon – Tue',  open: '10:00 AM',  close: '6:00 PM'  },
  { days: 'Wed – Fri',  open: '8:00 AM',   close: '7:00 PM'  },
  { days: 'Saturday',   open: '8:00 AM',   close: '6:00 PM'  },
  { days: 'Sunday',     open: null,        close: null        },
]

const SHOP_LINKS = [
  { href: '/shop',                        label: 'All Products'  },
  { href: '/shop?collection=clippers',    label: 'Clippers'      },
  { href: '/shop?collection=trimmers',    label: 'Trimmers'      },
  { href: '/shop?collection=hair-care',   label: 'Hair Care'     },
  { href: '/shop?collection=specials',    label: 'Specials'      },
  { href: '/shop?collection=bundles',     label: 'Bundles'       },
]

const SERVICE_LINKS = [
  { href: '#',  label: 'Book a Suite'         },
  { href: '#',  label: 'Salon Services'       },
  { href: '#',  label: 'Pro Supply Program'   },
  { href: '#',  label: "About Brashae's"      },
]

function todayIndex() {
  const d = new Date().getDay() // 0=Sun, 1=Mon … 6=Sat
  if (d === 0) return 3         // Sunday
  if (d <= 2)  return 0         // Mon–Tue
  if (d <= 5)  return 1         // Wed–Fri
  return 2                      // Saturday
}

const TODAY = todayIndex()

export default function StoreFooter() {
  return (
    <>
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
          gap: 48px;
          align-items: start;
        }
        .footer-link {
          font-size: 13px;
          font-weight: 400;
          color: #777777;
          text-decoration: none;
          display: block;
          margin-bottom: 8px;
          transition: color 0.15s ease;
        }
        .footer-link:hover { color: #111111; }
        .footer-col-heading {
          font-size: 11px;
          font-weight: 700;
          color: #333333;
          text-transform: uppercase;
          letter-spacing: initial;
          margin-bottom: 16px;
        }
        .footer-social a {
          color: #999999;
          transition: color 0.15s ease;
          display: inline-flex;
          align-items: center;
        }
        .footer-social a:hover { color: #C9A84C; }
        @media (max-width: 1023px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 36px;
          }
        }
        @media (max-width: 639px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>

      <footer
        role="contentinfo"
        style={{
          background: '#FBF8F3',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          padding: 'clamp(40px, 5vw, 64px) clamp(24px, 5vw, 80px) clamp(32px, 4vw, 48px)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="footer-grid">

            {/* Column 1 — Brand */}
            <div>
              {/* Original logo — mix-blend-mode removes white bg on cream canvas */}
              <img
                src="/brashae-logo.svg"
                alt="Brashae's Barber Beauty Supply"
                width={180}
                height={80}
                style={{ height: 64, width: 'auto', maxWidth: '100%', objectFit: 'contain', display: 'block', mixBlendMode: 'multiply', marginBottom: 12 }}
              />
              <p style={{ fontSize: 13, fontWeight: 600, color: '#333333', margin: '0 0 6px' }}>
                {brand.name}
              </p>
              <p style={{ fontSize: 12, color: '#999999', margin: '0 0 4px' }}>
                11902 S Gessner, Houston, TX
              </p>
              <p style={{ fontSize: 12, color: '#999999', margin: '0 0 20px' }}>
                832.314.1668
              </p>

              {/* Social icons */}
              <div className="footer-social" style={{ display: 'flex', gap: 16 }}>
                {brand.instagram && (
                  <a href={`https://instagram.com/${brand.instagram}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                )}
                {brand.facebook && (
                  <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                  </a>
                )}
                {brand.twitter && (
                  <a href={`https://twitter.com/${brand.twitter.replace('@','')}`} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Column 2 — Shop */}
            <div>
              <p className="footer-col-heading">Shop</p>
              {SHOP_LINKS.map(l => (
                <Link key={l.href + l.label} href={l.href} className="footer-link">{l.label}</Link>
              ))}
            </div>

            {/* Column 3 — Services */}
            <div>
              <p className="footer-col-heading">Services</p>
              {SERVICE_LINKS.map(l => (
                <Link key={l.label} href={l.href} className="footer-link">{l.label}</Link>
              ))}
            </div>

            {/* Column 4 — Hours */}
            <div>
              <p className="footer-col-heading">Hours</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {HOURS.map((h, i) => (
                  <div
                    key={h.days}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 8,
                      paddingLeft: i === TODAY ? 8 : 0,
                      borderLeft: i === TODAY ? '2px solid #C9A84C' : '2px solid transparent',
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: i === TODAY ? 600 : 500, color: i === TODAY ? '#111111' : '#555555' }}>
                      {h.days}
                    </span>
                    <span style={{ fontSize: 12, color: h.open ? '#999999' : '#BBBBBB', whiteSpace: 'nowrap' }}>
                      {h.open ? `${h.open} – ${h.close}` : 'Closed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom bar */}
          <div
            style={{
              marginTop: 40,
              paddingTop: 24,
              borderTop: '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 12, color: '#999999' }}>
              © {new Date().getFullYear()} Brashae&rsquo;s Barber Beauty Supply. All rights reserved.
            </span>
            <span style={{ fontSize: 12, color: '#BBBBBB' }}>
              Powered by Brashae&rsquo;s
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
