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
        {/* Hero — full-bleed black band */}
        <section
          style={{
            background: "var(--canvas)",
            color: "var(--on-dark)",
            padding: "96px 24px",
            textAlign: "center",
            borderBottom: "1px solid var(--hairline)",
          }}
        >
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {/* Accent stripe — tricolor-inspired */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "4px",
                marginBottom: "32px",
              }}
            >
              <div style={{ width: "32px", height: "2px", background: "#1c69d3" }} />
              <div style={{ width: "32px", height: "2px", background: "#6f6f6f" }} />
              <div style={{ width: "32px", height: "2px", background: "var(--accent)" }} />
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(48px, 8vw, 80px)",
                lineHeight: 1.0,
                letterSpacing: "-1px",
                textTransform: "uppercase",
                color: "var(--on-dark)",
                marginBottom: "24px",
              }}
            >
              {brand.copy.heroHeadline}
            </h1>

            <p
              style={{
                fontWeight: 300,
                fontSize: "18px",
                color: "var(--body-strong)",
                marginBottom: "40px",
                maxWidth: "480px",
                margin: "0 auto 40px",
                lineHeight: 1.6,
              }}
            >
              {brand.copy.heroSubline}
            </p>

            {/* CTA — accent fill on hero only */}
            <Link
              href="/shop"
              style={{
                display: "inline-block",
                background: "var(--accent)",
                color: "var(--accent-fg)",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "14px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "16px 32px",
                height: "48px",
                borderRadius: 0,
                lineHeight: "16px",
                border: "1px solid var(--accent)",
              }}
            >
              {brand.copy.heroCta}
            </Link>
          </div>
        </section>

        {/* Featured products */}
        <section
          style={{
            maxWidth: "1152px",
            margin: "0 auto",
            padding: "96px 24px",
          }}
        >
          {/* Section label */}
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "32px",
            }}
          >
            Featured
          </p>
          <FeaturedProducts />
        </section>
      </main>
      <Footer />
    </>
  );
}
