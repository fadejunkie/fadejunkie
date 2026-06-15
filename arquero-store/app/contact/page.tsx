import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { brand } from "@/brand.config";

export const metadata = {
  title: `Contact | ${brand.name}`,
  description: `Get in touch with ${brand.name}.`,
};

export default function ContactPage() {
  const sectionStyle: React.CSSProperties = {
    maxWidth: "640px",
    margin: "0 auto",
    padding: "clamp(64px, 10vw, 112px) 24px",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "13px",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: "var(--muted)",
    marginBottom: "16px",
  };

  const h1Style: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "clamp(32px, 5vw, 52px)",
    lineHeight: 1.1,
    color: "var(--body-strong)",
    marginBottom: "24px",
    letterSpacing: "-0.5px",
  };

  const pStyle: React.CSSProperties = {
    fontSize: "16px",
    lineHeight: "1.7",
    color: "var(--body)",
    fontWeight: 300,
    marginBottom: "40px",
  };

  const dividerStyle: React.CSSProperties = {
    border: "none",
    borderTop: "1px solid var(--hairline)",
    margin: "40px 0",
  };

  const channelRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "28px",
  };

  const channelIconStyle: React.CSSProperties = {
    width: "40px",
    height: "40px",
    background: "var(--primary)",
    borderRadius: "var(--radius-sm)",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--on-dark)",
    fontSize: "18px",
    fontWeight: 700,
    fontFamily: "var(--font-display)",
  };

  const channelLabelStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "13px",
    letterSpacing: "1.5px",
    textTransform: "uppercase" as const,
    color: "var(--muted)",
    marginBottom: "4px",
  };

  const channelValueStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: 400,
    color: "var(--body-strong)",
  };

  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <section style={sectionStyle}>
          <p style={labelStyle}>Get in Touch</p>
          <h1 style={h1Style}>We're here to help.</h1>
          <p style={pStyle}>
            Questions about an order, need sizing advice, or just want to talk shop?
            Reach out through any of the channels below and we'll get back to you
            within one business day.
          </p>

          {/* Contact channels */}
          <div style={channelRowStyle}>
            <div style={channelIconStyle}>@</div>
            <div>
              <p style={channelLabelStyle}>Email</p>
              <a
                href="mailto:hello@arqueroco.com"
                style={{ ...channelValueStyle, color: "var(--primary)", textDecoration: "none" }}
              >
                hello@arqueroco.com
              </a>
              <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px", fontWeight: 300 }}>
                Response within 1 business day
              </p>
            </div>
          </div>

          {brand.instagram && (
            <div style={channelRowStyle}>
              <div style={channelIconStyle}>IG</div>
              <div>
                <p style={channelLabelStyle}>Instagram</p>
                <a
                  href={`https://instagram.com/${brand.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...channelValueStyle, color: "var(--primary)", textDecoration: "none" }}
                >
                  @{brand.instagram}
                </a>
                <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px", fontWeight: 300 }}>
                  DMs open — fastest response
                </p>
              </div>
            </div>
          )}

          {brand.tiktok && (
            <div style={channelRowStyle}>
              <div style={channelIconStyle}>TT</div>
              <div>
                <p style={channelLabelStyle}>TikTok</p>
                <a
                  href={`https://tiktok.com/@${brand.tiktok}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...channelValueStyle, color: "var(--primary)", textDecoration: "none" }}
                >
                  @{brand.tiktok}
                </a>
              </div>
            </div>
          )}

          <hr style={dividerStyle} />

          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "8px",
              }}
            >
              Order Issues
            </p>
            <p style={{ fontSize: "15px", lineHeight: "1.65", color: "var(--body)", fontWeight: 300 }}>
              For returns, exchanges, or items that arrived wrong or damaged —
              see our{" "}
              <a
                href="/shipping"
                style={{ color: "var(--primary)", textDecoration: "underline" }}
              >
                Shipping & Returns
              </a>{" "}
              page, or email us directly with your order number.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
