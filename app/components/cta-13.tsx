import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Cta13Props {
  heading: string;
  description: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
}

const Cta13 = ({
  heading = "Call to Action",
  description = "Build faster with our collection of pre-built blocks.",
  buttons = {
    primary: { text: "Get started", url: "#" },
    secondary: { text: "Learn more", url: "#" },
  },
}: Cta13Props) => {
  return (
    <section
      style={{
        backgroundColor: "rgba(22,16,8,0.97)",
        padding: "8rem clamp(1.5rem, 5vw, 6rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grain on dark */}
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.04,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      >
        <filter id="fj-grain-dark">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#fj-grain-dark)" />
      </svg>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Small label */}
        <p
          style={{
            fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
            fontSize: "0.625rem",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "hsl(34, 42%, 44%)",
            marginBottom: "1.5rem",
          }}
        >
          Ready to get in
        </p>

        <h2
          style={{
            fontFamily:
              "var(--font-spectral), Georgia, 'Times New Roman', serif",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 300,
            fontStyle: "italic",
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            color: "#fff4ea",
            marginBottom: "1.5rem",
          }}
        >
          {heading}
        </h2>

        <p
          style={{
            fontFamily:
              "var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "0.9375rem",
            lineHeight: 1.65,
            color: "rgba(255,244,234,0.5)",
            maxWidth: "28rem",
            margin: "0 auto 3rem",
          }}
        >
          {description}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          {buttons.primary && (
            <Link href={buttons.primary.url} className="fj-btn-cream">
              {buttons.primary.text}
              <ArrowRight style={{ width: 15, height: 15 }} />
            </Link>
          )}
          {buttons.secondary && (
            <Link href={buttons.secondary.url} className="fj-btn-text-on-dark">
              {buttons.secondary.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export { Cta13 };
