import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { brand } from "@/brand.config";
import { FeaturedProducts } from "@/components/FeaturedProducts";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>

        {/* Hero — light, clean */}
        <section
          style={{
            background: "var(--surface-soft)",
            borderBottom: "1px solid var(--hairline)",
            padding: "80px 24px",
          }}
        >
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Label */}
              <span
                style={{
                  display: "inline-block",
                  background: "var(--accent-light, #e8eef7)",
                  color: "var(--accent)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "11px",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  width: "fit-content",
                }}
              >
                Hutto, Texas · Est. 2020
              </span>

              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(36px, 6vw, 64px)",
                  lineHeight: 1.05,
                  letterSpacing: "-1.5px",
                  color: "var(--on-dark)",
                  margin: 0,
                }}
              >
                {brand.copy.heroHeadline}
              </h1>

              <p
                style={{
                  fontWeight: 400,
                  fontSize: "18px",
                  color: "var(--body)",
                  maxWidth: "560px",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {brand.copy.heroSubline}
              </p>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link
                  href="/shop"
                  style={{
                    display: "inline-block",
                    background: "var(--accent)",
                    color: "#fff",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "14px",
                    letterSpacing: "0.3px",
                    textDecoration: "none",
                    padding: "14px 28px",
                    borderRadius: "4px",
                    transition: "opacity 0.15s",
                  }}
                >
                  {brand.copy.heroCta}
                </Link>
                <Link
                  href="tel:+15128550000"
                  style={{
                    display: "inline-block",
                    background: "transparent",
                    color: "var(--on-dark)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "14px",
                    letterSpacing: "0.3px",
                    textDecoration: "none",
                    padding: "14px 28px",
                    borderRadius: "4px",
                    border: "1.5px solid var(--hairline)",
                    transition: "border-color 0.15s",
                  }}
                >
                  Call (512) 855-0000
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section
          style={{
            borderBottom: "1px solid var(--hairline)",
            background: "var(--canvas)",
            padding: "20px 24px",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              gap: "40px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              { icon: "🚗", label: "25–75 Vehicles In Stock" },
              { icon: "📋", label: "Clean Carfax Reports" },
              { icon: "🔧", label: "Pre-Sale Inspected" },
              { icon: "📍", label: "Hutto, TX" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>{item.icon}</span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "13px",
                    color: "var(--body-strong)",
                    letterSpacing: "0.1px",
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured inventory */}
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "64px 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "32px" }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "var(--muted)",
                margin: 0,
              }}
            >
              Featured Vehicles
            </p>
            <Link
              href="/shop"
              style={{
                color: "var(--accent)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "13px",
                textDecoration: "none",
              }}
            >
              View All →
            </Link>
          </div>
          <FeaturedProducts />
        </section>
      </main>
      <Footer />
    </>
  );
}
