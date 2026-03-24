import Link from "next/link";

export const metadata = {
  title: "Privacy Policy \u2014 fadejunkie",
};

export default function PrivacyPage() {
  return (
    <div
      style={{
        backgroundColor: "#fff4ea",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column" as const,
      }}
    >
      {/* Minimal nav */}
      <nav
        style={{
          padding: "1.5rem clamp(1.5rem, 5vw, 6rem)",
          borderBottom: "1px solid rgba(22,16,8,0.08)",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-spectral), Georgia, serif",
            fontSize: "1.125rem",
            fontWeight: 400,
            color: "hsl(0, 0%, 8%)",
            textDecoration: "none",
            letterSpacing: "-0.02em",
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
            fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
            fontSize: "0.625rem",
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "hsl(34, 42%, 44%)",
            marginBottom: "1.25rem",
          }}
        >
          Last updated March 2026
        </p>

        <h1
          style={{
            fontFamily: "var(--font-spectral), Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            color: "hsl(0, 0%, 8%)",
            marginBottom: "2.5rem",
          }}
        >
          Privacy Policy
        </h1>

        <div
          style={{
            fontFamily: "var(--font-inter), -apple-system, sans-serif",
            fontSize: "1rem",
            lineHeight: 1.75,
            color: "hsl(34, 18%, 32%)",
          }}
        >
          <p style={{ marginBottom: "1.5rem" }}>
            FadeJunkie collects only the information necessary to operate the
            service. We do not sell your data.
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            When you create an account, we store your email address and profile
            information you choose to share. Usage data helps us improve the
            platform, but we never share it with third parties for advertising
            purposes.
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            Full policy coming soon. If you have questions, reach out at{" "}
            <a
              href="mailto:hello@fadejunkie.com"
              style={{
                color: "hsl(34, 42%, 44%)",
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
            borderTop: "1px solid rgba(22,16,8,0.08)",
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: "0.6875rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "hsl(34, 22%, 44%)",
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
