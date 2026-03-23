export default function Loading() {
  return (
    <div
      style={{
        backgroundColor: "#fff4ea",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Nav skeleton */}
      <div
        style={{
          height: 57,
          borderBottom: "1px solid rgba(22,16,8,0.08)",
          backgroundColor: "rgba(255,244,234,0.88)",
          display: "flex",
          alignItems: "center",
          padding: "0 max(1.5rem, 3vw)",
          flexShrink: 0,
        }}
      >
        <div
          className="fj-skel"
          style={{
            width: 88,
            height: 14,
            borderRadius: 4,
            backgroundColor: "rgba(22,16,8,0.08)",
          }}
        />
      </div>

      {/* Hero skeleton */}
      <div
        className="fj-loading-grid"
        style={{
          flex: 1,
          maxWidth: 1200,
          width: "100%",
          margin: "0 auto",
          padding: "5rem clamp(1.5rem, 5vw, 6rem) 4rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}
      >
        {/* Left copy skeleton */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div
            className="fj-skel"
            style={{
              width: 140,
              height: 11,
              borderRadius: 3,
              backgroundColor: "rgba(22,16,8,0.06)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div
              className="fj-skel"
              style={{
                width: "80%",
                height: 60,
                borderRadius: 6,
                backgroundColor: "rgba(22,16,8,0.07)",
              }}
            />
            <div
              className="fj-skel"
              style={{
                width: "70%",
                height: 60,
                borderRadius: 6,
                backgroundColor: "rgba(22,16,8,0.05)",
                animationDelay: "0.1s",
              }}
            />
            <div
              className="fj-skel"
              style={{
                width: "55%",
                height: 60,
                borderRadius: 6,
                backgroundColor: "rgba(22,16,8,0.04)",
                animationDelay: "0.2s",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              marginTop: "0.5rem",
            }}
          >
            <div
              className="fj-skel"
              style={{
                width: "85%",
                height: 14,
                borderRadius: 3,
                backgroundColor: "rgba(22,16,8,0.05)",
                animationDelay: "0.05s",
              }}
            />
            <div
              className="fj-skel"
              style={{
                width: "65%",
                height: 14,
                borderRadius: 3,
                backgroundColor: "rgba(22,16,8,0.04)",
                animationDelay: "0.1s",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem" }}>
            <div
              className="fj-skel"
              style={{
                width: 130,
                height: 48,
                borderRadius: 40,
                backgroundColor: "rgba(22,16,8,0.10)",
              }}
            />
            <div
              className="fj-skel"
              style={{
                width: 110,
                height: 48,
                borderRadius: 40,
                backgroundColor: "rgba(22,16,8,0.05)",
                animationDelay: "0.15s",
              }}
            />
          </div>
        </div>

        {/* Right card skeleton */}
        <div
          className="fj-loading-card"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <div
            className="fj-skel"
            style={{
              width: 316,
              height: 380,
              borderRadius: "1.375rem",
              backgroundColor: "rgba(22,16,8,0.07)",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes fj-skeleton-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
        .fj-skel {
          animation: fj-skeleton-pulse 1.8s ease-in-out infinite;
        }
        @media (max-width: 1023px) {
          .fj-loading-grid {
            grid-template-columns: 1fr !important;
          }
          .fj-loading-card {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
