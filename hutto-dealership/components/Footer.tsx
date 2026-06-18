import Link from "next/link";
import { brand } from "@/brand.config";

export function Footer() {
  const linkStyle: React.CSSProperties = {
    color: "var(--muted)",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 400,
    transition: "color 0.15s",
  };

  const headingStyle: React.CSSProperties = {
    color: "var(--on-dark)",
    fontFamily: "var(--font-display)",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "14px",
  };

  return (
    <footer
      style={{
        background: "var(--surface-soft)",
        borderTop: "1px solid var(--hairline)",
        marginTop: "auto",
        padding: "56px 24px 32px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "40px",
            marginBottom: "48px",
          }}
        >
          {/* Brand column */}
          <div style={{ gridColumn: "span 1" }}>
            <p style={{ ...headingStyle, color: "var(--accent)", fontSize: "16px", letterSpacing: "-0.2px" }}>
              {brand.name}
            </p>
            <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.7" }}>
              {brand.tagline}
            </p>
            <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "10px", lineHeight: "1.6" }}>
              123 Main St<br />Hutto, TX 78634
            </p>
            <a
              href="tel:+15128550000"
              style={{ ...linkStyle, display: "block", marginTop: "8px", color: "var(--accent)", fontWeight: 600 }}
            >
              (512) 855-0000
            </a>
          </div>

          {/* Inventory column */}
          <div>
            <p style={headingStyle}>Inventory</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/shop" style={linkStyle}>All Vehicles</Link>
              <Link href="/shop?collection=trucks" style={linkStyle}>Trucks</Link>
              <Link href="/shop?collection=suvs" style={linkStyle}>SUVs</Link>
              <Link href="/shop?collection=sedans" style={linkStyle}>Sedans</Link>
            </div>
          </div>

          {/* Buy column */}
          <div>
            <p style={headingStyle}>Buy</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/shop" style={linkStyle}>Browse Inventory</Link>
              <a href="tel:+15128550000" style={linkStyle}>Schedule Test Drive</a>
              <a href="mailto:sales@huttodealership.com" style={linkStyle}>Email Us</a>
            </div>
          </div>

          {/* Hours column */}
          <div>
            <p style={headingStyle}>Hours</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[
                { day: "Mon – Fri", hours: "9am – 7pm" },
                { day: "Saturday", hours: "9am – 6pm" },
                { day: "Sunday", hours: "11am – 5pm" },
              ].map((h) => (
                <div key={h.day} style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
                  <span style={{ color: "var(--body)", fontSize: "13px" }}>{h.day}</span>
                  <span style={{ color: "var(--muted)", fontSize: "13px" }}>{h.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--hairline)",
            paddingTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <span style={{ color: "var(--muted)", fontSize: "12px" }}>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </span>
          <span style={{ color: "var(--muted)", fontSize: "12px" }}>
            Hutto, TX · Licensed Dealer
          </span>
        </div>
      </div>
    </footer>
  );
}
