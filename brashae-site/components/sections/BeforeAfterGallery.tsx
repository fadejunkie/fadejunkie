// Before & After Gallery — placeholder shell (no photos received yet)
// TODO: Replace placeholder grid with real masonry gallery + lightbox when photos received from Raimons
// TODO: Lightbox modal design: full-screen dark overlay, left/right navigation, ESC to close

export default function BeforeAfterGallery() {
  return (
    <section
      style={{
        background: "var(--canvas)",
        padding: "clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)",
        borderTop: "1px solid var(--hairline)",
      }}
    >
      {/* Heading */}
      <h2
        style={{
          fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
          fontWeight: 700,
          color: "var(--on-dark)",
          textWrap: "balance",
          lineHeight: 1.2,
        }}
      >
        Before &amp; After
      </h2>

      {/* Subheading */}
      <p
        style={{
          fontSize: 16,
          fontWeight: 400,
          color: "var(--body)",
          marginTop: 8,
        }}
      >
        Work from our suite professionals.
      </p>

      {/* Placeholder grid — 6 slots */}
      <div className="before-after-grid" style={{ marginTop: 40 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: "var(--surface-elevated)",
              borderRadius: 8,
              aspectRatio: "4 / 5",
              border: "1px solid var(--hairline)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 400,
                color: "var(--muted)",
              }}
            >
              Photo Coming Soon
            </span>
          </div>
        ))}
      </div>

      {/* Responsive grid */}
      <style>{`
        .before-after-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 767px) {
          .before-after-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  )
}
