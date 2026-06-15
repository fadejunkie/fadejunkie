import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { ScrollVideoSection } from "@/components/ScrollVideoSection";

export default function HomePage() {
  return (
    <>
      <Navbar scrollReveal />
      <main style={{ flex: 1 }}>
        {/* Hero + scroll-driven video — merged full-bleed section */}
        <ScrollVideoSection />

        {/* Featured products */}
        <section
          style={{
            maxWidth: "1152px",
            margin: "0 auto",
            padding: "clamp(48px, 8vw, 96px) 24px",
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
