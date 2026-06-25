// Instagram Feed — placeholder shell (API not yet configured)
// TODO: Connect Instagram Basic Display API or add Elfsight embed for live feed

const IG_URL = 'https://instagram.com/TheClipperConnect713'

// Simple Instagram SVG icon
function InstagramIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function InstagramFeed() {
  return (
    <section
      style={{
        background: 'var(--canvas)',
        padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)',
        borderTop: '1px solid var(--hairline)',
      }}
    >
      {/* Heading */}
      <h2
        style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
          fontWeight: 700,
          color: 'var(--on-dark)',
          textWrap: 'balance',
          marginBottom: 8,
        }}
      >
        Follow the Culture
      </h2>

      {/* Subheading */}
      <p
        style={{
          fontSize: 15,
          fontWeight: 400,
          color: 'var(--muted)',
          marginBottom: 40,
        }}
      >
        @TheClipperConnect713 · @BUORBeauty
      </p>

      {/* Placeholder grid */}
      <div className="ig-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="ig-cell"
            style={{
              aspectRatio: '1 / 1',
              background: 'var(--surface-card)',
              border: '1px solid var(--hairline)',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted)',
            }}
          >
            <InstagramIcon />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <a
          href={IG_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--gold)',
            textDecoration: 'none',
          }}
        >
          Follow @TheClipperConnect713 →
        </a>
      </div>

      {/* Responsive CSS */}
      <style>{`
        .ig-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(140px, 1fr));
          gap: 8px;
        }
        .ig-cell:hover {
          border-color: rgba(201,168,76,0.35) !important;
        }
        @media (max-width: 767px) {
          .ig-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          /* Hide last 2 cells on mobile to show 4 */
          .ig-grid > div:nth-child(n+5) {
            display: none;
          }
        }
      `}</style>
    </section>
  )
}
