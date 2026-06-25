// Footer — 4-col with Raimon's co-brand
// Background: var(--surface-soft) = #0A0A0A
// Border-top: gold tint divider

const SHOP_URL = 'https://brashae-shop.vercel.app/shop'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: SHOP_URL },
  { label: 'Salon Services', href: '/#services' },
  { label: 'Professionals', href: '/professionals' },
  { label: 'Pro Supply', href: '/#pro-supply' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const hours = [
  { label: 'Mon – Tue', time: '10am – 6pm' },
  { label: 'Wed – Fri', time: '8am – 7pm' },
  { label: 'Saturday', time: '8am – 6pm' },
  { label: 'Sunday', time: 'Closed' },
]

const socials = [
  { handle: '@TheClipperConnect713', href: 'https://instagram.com/TheClipperConnect713' },
  { handle: '@BUORBeauty', href: 'https://instagram.com/BUORBeauty' },
  { handle: '@Brashaes', href: 'https://x.com/Brashaes' },
]

const colHeading: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--muted)',
  textTransform: 'uppercase',
  marginBottom: 20,
}

const linkStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 400,
  color: 'var(--muted)',
  marginBottom: 12,
  textDecoration: 'none',
  cursor: 'pointer',
}

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--surface-soft)',
        borderTop: '1px solid rgba(201,168,76,0.15)',
        padding: 'clamp(60px, 8vw, 80px) clamp(24px, 5vw, 80px) 0',
      }}
    >
      {/* 4-col grid */}
      <div className="footer-cols">

        {/* Col 1: Brand */}
        <div>
          <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold)', marginBottom: 12 }}>
            BRASHAE&apos;S
          </p>
          <p style={{
            fontSize: 13, fontWeight: 400, color: 'var(--muted)',
            lineHeight: 1.65, maxWidth: '26ch',
          } as React.CSSProperties}>
            Houston&apos;s Premier Barber &amp; Beauty Complex.
          </p>
          <div style={{ marginTop: 20 }}>
            {socials.map((s) => (
              <a
                key={s.handle}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                style={linkStyle}
              >
                {s.handle}
              </a>
            ))}
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <p style={colHeading}>LINKS</p>
          {quickLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="footer-link"
              style={linkStyle}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Col 3: Hours */}
        <div>
          <p style={colHeading}>HOURS</p>
          {hours.map((h) => (
            <p key={h.label} style={{
              fontSize: 13, fontWeight: 400, color: 'var(--body)',
              lineHeight: 2,
            }}>
              <span style={{ display: 'inline-block', minWidth: '7ch' }}>{h.label}</span>
              {'  '}{h.time}
            </p>
          ))}
        </div>

        {/* Col 4: Raimon's Co-Brand */}
        <div>
          <p style={colHeading}>SALON SUITES</p>
          <p style={{
            fontSize: 13, fontWeight: 400, color: 'var(--body)',
            lineHeight: 1.7, maxWidth: '26ch',
          }}>
            Brashae&apos;s Barber Beauty Supply is located inside{' '}
            <span style={{ color: 'var(--gold)', fontWeight: 600 }}>
              Raimon&apos;s Salon de Beauté
            </span>
            .
          </p>
          <p style={{
            fontSize: 13, fontWeight: 400, color: 'var(--muted)',
            marginTop: 12, lineHeight: 1.6,
          }}>
            11902 S Gessner Rd, Houston, TX
          </p>
          <p style={{ fontSize: 13, fontWeight: 400, color: 'var(--muted)', marginTop: 4 }}>
            713-541-2279
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid var(--hairline)',
        paddingTop: 24,
        marginTop: 60,
        paddingBottom: 32,
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <p style={{ fontSize: 11, fontWeight: 400, color: 'var(--muted)' }}>
          © 2026 Brashae&apos;s Barber Beauty Supply. All rights reserved.
        </p>
        <p style={{ fontSize: 11, fontWeight: 400, color: 'var(--muted)' }}>
          Built by twanii
        </p>
      </div>

      {/* Responsive CSS */}
      <style>{`
        .footer-cols {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 48px;
          margin-bottom: 60px;
        }
        .footer-link:hover {
          color: var(--on-dark) !important;
        }
        @media (max-width: 767px) {
          .footer-cols {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .footer-cols {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </footer>
  )
}
