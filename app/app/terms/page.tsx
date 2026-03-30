import Link from "next/link";

export const metadata = {
  title: "Terms of Service \u2014 fadejunkie",
};

export default function TermsPage() {
  return (
    <div
      style={{
        backgroundColor: "var(--background)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column" as const,
      }}
    >
      {/* Minimal nav */}
      <nav
        style={{
          padding: "1.5rem clamp(1.5rem, 5vw, 6rem)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display), 'League Spartan', sans-serif",
            fontSize: "1.125rem",
            fontWeight: 800,
            color: "var(--foreground)",
            textDecoration: "none",
            letterSpacing: "-0.03em",
          }}
        >
          fadejunkie
        </Link>
      </nav>

      {/* Content */}
      <main
        style={{
          flex: 1,
          maxWidth: 640,
          margin: "0 auto",
          padding: "5rem clamp(1.5rem, 5vw, 3rem) 6rem",
          width: "100%",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono), ui-monospace, monospace",
            fontSize: "0.625rem",
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--muted-foreground)",
            marginBottom: "1.25rem",
          }}
        >
          Last updated March 2026
        </p>

        <h1
          className="font-display"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.0,
            color: "var(--foreground)",
            marginBottom: "2.5rem",
          }}
        >
          Terms of Service
        </h1>

        <div
          style={{
            fontFamily: "var(--font-body), 'Courier Prime', monospace",
            fontSize: "1rem",
            lineHeight: 1.75,
            color: "var(--muted-foreground)",
          }}
        >
          <p style={{ marginBottom: "1.5rem" }}>
            By using FadeJunkie, you agree to use the service responsibly.
            Treat the community with respect, represent your work honestly, and
            keep your account secure.
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            FadeJunkie is provided as-is. We work hard to keep the platform
            running smoothly, but we cannot guarantee uninterrupted service.
            We reserve the right to remove accounts that violate community
            standards.
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            Full terms coming soon. If you have questions, reach out at{" "}
            <a
              href="mailto:hello@fadejunkie.com"
              style={{
                color: "var(--foreground)",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              hello@fadejunkie.com
            </a>
            .
          </p>
        </div>

        <div
          style={{
            marginTop: "4rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-mono), ui-monospace, monospace",
              fontSize: "0.6875rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--muted-foreground)",
              textDecoration: "none",
            }}
          >
            &larr; Back to fadejunkie
          </Link>
        </div>
      </main>
    </div>
  );
}
