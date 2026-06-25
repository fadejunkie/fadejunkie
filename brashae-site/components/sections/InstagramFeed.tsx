// Instagram Feed — placeholder shell (API not yet configured)
// TODO: Connect Instagram Basic Display API or add Elfsight embed for live feed

import Image from 'next/image'

const IG_URL = 'https://instagram.com/TheClipperConnect713'
const IG_PLACEHOLDER = 'https://placehold.co/400x400/0A0A0A/D4AF37?text=@TheClipperConnect713'

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
              position: 'relative',
              aspectRatio: '1 / 1',
              border: '1px solid var(--hairline)',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <Image
              src={IG_PLACEHOLDER}
              alt="@TheClipperConnect713 on Instagram"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 767px) 25vw, 17vw"
              unoptimized
            />
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
