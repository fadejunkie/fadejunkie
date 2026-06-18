import Link from "next/link";
import { brand } from "@/brand.config";

export function Footer() {
  const linkStyle: React.CSSProperties = {
    color: "var(--muted)",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 300,
    transition: "color 0.15s",
  };

  const headingStyle: React.CSSProperties = {
    color: "var(--on-dark)",
    fontFamily: "var(--font-display)",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginBottom: "16px",
  };

  const legalLinkStyle: React.CSSProperties = {
    color: "var(--muted)",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: 300,
    transition: "color 0.15s",
  };

  return (
    <footer
      style={{
        background: "var(--canvas)",
        borderTop: "1px solid var(--hairline)",
        marginTop: "auto",
        padding: "64px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1152px",
          margin: "0 auto",
        }}
      >
        {/* 4-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "40px",
            marginBottom: "48px",
          }}
        >
          {/* Brand column */}
          <div>
            <p style={headingStyle}>{brand.name}</p>
            <p style={{ color: "var(--muted)", fontSize: "13px", fontWeight: 300, lineHeight: "1.6" }}>
              {brand.tagline}
            </p>
          </div>

          {/* Shop column */}
          <div>
            <p style={headingStyle}>Shop</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/shop" style={linkStyle}>All Products</Link>
              <Link href="/shop?collection=apparel" style={linkStyle}>Apparel</Link>
              <Link href="/shop?collection=accessories" style={linkStyle}>Accessories</Link>
            </div>
          </div>

          {/* Info column */}
          <div>
            <p style={headingStyle}>Info</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/about" style={linkStyle}>About Us</Link>
              <Link href="/shipping" style={linkStyle}>Shipping & Returns</Link>
              <Link href="/contact" style={linkStyle}>Contact</Link>
            </div>
          </div>

          {/* Follow column */}
          <div>
            <p style={headingStyle}>Follow</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {brand.instagram && (
                <a
                  href={`https://instagram.com/${brand.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                >
                  Instagram
                </a>
              )}
              {brand.tiktok && (
                <a
                  href={`https://tiktok.com/@${brand.tiktok}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                >
                  TikTok
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--hairline)",
            paddingTop: "24px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <span
            style={{
              color: "var(--muted)",
              fontSize: "12px",
              fontWeight: 300,
            }}
          >
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link href="/privacy" style={legalLinkStyle}>Privacy Policy</Link>
            <Link href="/terms" style={legalLinkStyle}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
