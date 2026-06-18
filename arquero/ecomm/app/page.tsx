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
        {/* Hero — full-bleed video band */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: "600px",
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            borderBottom: "4px solid var(--accent)",
          }}
        >
          {/* Background video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>

          {/* Dark overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,30,80,0.55)",
            }}
          />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 1, width: "100%", padding: "96px 24px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {/* Accent mark */}
            <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "32px" }}>
              <div style={{ width: "48px", height: "3px", background: "var(--accent)" }} />
              <div style={{ width: "16px", height: "3px", background: "var(--on-dark)", opacity: 0.4 }} />
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
                color: "var(--on-dark)",
                marginBottom: "40px",
                maxWidth: "480px",
                margin: "0 auto 40px",
                lineHeight: 1.6,
                opacity: 0.85,
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
