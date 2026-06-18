import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { brand } from "@/brand.config";

export const metadata = {
  title: `About | ${brand.name}`,
  description: `The story behind ${brand.name} — ${brand.tagline}`,
};

export default function AboutPage() {
  const sectionStyle: React.CSSProperties = {
    maxWidth: "720px",
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
    marginBottom: "24px",
  };

  const h1Style: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "clamp(36px, 6vw, 60px)",
    lineHeight: 1.1,
    color: "var(--body-strong)",
    marginBottom: "32px",
    letterSpacing: "-0.5px",
  };

  const pStyle: React.CSSProperties = {
    fontSize: "17px",
    lineHeight: "1.75",
    color: "var(--body)",
    fontWeight: 300,
    marginBottom: "24px",
  };

  const dividerStyle: React.CSSProperties = {
    border: "none",
    borderTop: "1px solid var(--hairline)",
    margin: "48px 0",
  };

  const valueLabelStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: "var(--primary)",
    marginBottom: "8px",
  };

  const valueHeadStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "20px",
    color: "var(--body-strong)",
    marginBottom: "10px",
  };

  const valueBodyStyle: React.CSSProperties = {
    fontSize: "15px",
    lineHeight: "1.65",
    color: "var(--muted)",
    fontWeight: 300,
  };

  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        {/* Hero band */}
        <div
          style={{
            background: "var(--primary)",
            padding: "clamp(48px, 8vw, 80px) 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "var(--on-dark)",
              opacity: 0.6,
              marginBottom: "16px",
            }}
          >
            Our Story
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(40px, 7vw, 72px)",
              lineHeight: 1.05,
              color: "var(--on-dark)",
              letterSpacing: "-1px",
            }}
          >
            {brand.tagline}
          </h1>
        </div>

        {/* Story section */}
        <section style={sectionStyle}>
          <p style={labelStyle}>About {brand.name}</p>
          <h2 style={h1Style}>Built for the people who build things.</h2>
          <p style={pStyle}>
            Arquero Co. was born on the job site — not in a boardroom. We make apparel for
            tradesmen, ranchers, and anyone who earns their calluses. Every piece is designed
            to move with you, hold up under pressure, and look sharp when the work day's done.
          </p>
          <p style={pStyle}>
            The name comes from the Spanish word for archer — someone who takes aim with
            precision, commits fully, and doesn't flinch. That's the standard we hold our
            craft to. No shortcuts. No filler. Just gear that means something.
          </p>
          <p style={pStyle}>
            We're based in the Southwest, and the land shows in everything we do: the palette,
            the materials, the attitude. Sun-faded cream. Ranch gold. Deep sky blue. Colors
            that have earned their place.
          </p>

          <hr style={dividerStyle} />

          {/* Values grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "40px",
            }}
          >
            <div>
              <p style={valueLabelStyle}>01</p>
              <p style={valueHeadStyle}>Aim True</p>
              <p style={valueBodyStyle}>
                Precision matters — in trade, in craft, in the clothes you wear to work.
                We don't make anything we wouldn't wear ourselves.
              </p>
            </div>
            <div>
              <p style={valueLabelStyle}>02</p>
              <p style={valueHeadStyle}>Weld True</p>
              <p style={valueBodyStyle}>
                Quality that holds under heat. Seams, stitching, and materials tested for
                the real world — not a photoshoot.
              </p>
            </div>
            <div>
              <p style={valueLabelStyle}>03</p>
              <p style={valueHeadStyle}>Earned, Not Gifted</p>
              <p style={valueBodyStyle}>
                We build for people who've put in the reps. Every collection is a nod to
                the trade, the ritual, and the long haul.
              </p>
            </div>
          </div>

          <hr style={dividerStyle} />

          <p style={{ ...pStyle, color: "var(--muted)", fontSize: "15px" }}>
            Questions? Reach us at{" "}
            <a
              href="/contact"
              style={{ color: "var(--primary)", textDecoration: "underline" }}
            >
              our contact page
            </a>{" "}
            or find us on Instagram{" "}
            <a
              href={`https://instagram.com/${brand.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--primary)", textDecoration: "underline" }}
            >
              @{brand.instagram}
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
