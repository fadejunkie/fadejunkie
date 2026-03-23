"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ease = [0.25, 0.1, 0.25, 1] as const;

/* Grain texture — SVG noise at 3.5% opacity over the cream background */
const GrainOverlay = () => (
  <svg
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 h-full w-full"
    style={{ opacity: 0.035, mixBlendMode: "multiply" }}
  >
    <filter id="fj-grain">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.65"
        numOctaves="3"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#fj-grain)" />
  </svg>
);

/* Halftone dot cluster — decorative bottom-right accent */
const HalftoneAccent = () => (
  <svg
    aria-hidden="true"
    className="pointer-events-none absolute bottom-16 right-12 hidden lg:block"
    width="180"
    height="180"
    viewBox="0 0 180 180"
    style={{ opacity: 0.07 }}
  >
    {Array.from({ length: 7 }, (_, row) =>
      Array.from({ length: 7 }, (_, col) => {
        const r = 1.5 + (row + col) * 0.42;
        return (
          <circle
            key={`${row}-${col}`}
            cx={col * 26 + 14}
            cy={row * 26 + 14}
            r={r}
            fill="rgba(22,16,8,1)"
          />
        );
      })
    )}
  </svg>
);

const Hero = () => {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#fff4ea",
        minHeight: "88vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Texture layers */}
      <GrainOverlay />
      <HalftoneAccent />

      <div
        className="relative mx-auto w-full"
        style={{
          maxWidth: 1200,
          padding: "7rem clamp(1.5rem, 5vw, 6rem) 6rem",
        }}
      >
        {/* Eyebrow — Geist Mono label */}
        <motion.p
          style={{
            fontFamily:
              "var(--font-geist-mono), 'Geist Mono', ui-monospace, monospace",
            fontSize: "0.6875rem",
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "hsl(34, 22%, 44%)",
            marginBottom: "2rem",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          The barber community
        </motion.p>

        {/* Headline — Spectral 300 light, editorial scale */}
        <div style={{ overflow: "hidden", marginBottom: "2.25rem" }}>
          <motion.h1
            style={{
              fontFamily:
                "var(--font-spectral), Georgia, 'Times New Roman', serif",
              fontSize: "clamp(3.75rem, 10vw, 8.5rem)",
              fontWeight: 300,
              letterSpacing: "-0.025em",
              lineHeight: 0.95,
              color: "hsl(0, 0%, 8%)",
              margin: 0,
            }}
            initial={{ y: "105%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, ease, delay: 0.08 }}
          >
            Addicted
            <br />
            <span
              style={{
                fontStyle: "italic",
                fontWeight: 300,
                color: "hsl(34, 22%, 44%)",
              }}
            >
              to the
            </span>
            <br />
            craft.
          </motion.h1>
        </div>

        {/* Description */}
        <motion.p
          style={{
            fontFamily:
              "var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "1rem",
            lineHeight: 1.65,
            color: "hsl(34, 20%, 38%)",
            maxWidth: "29rem",
            marginBottom: "3.5rem",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease, delay: 0.28 }}
        >
          Study for boards. Build your brand. Find barbers who take it
          seriously. FadeJunkie is where the craft lives online.
        </motion.p>

        {/* CTAs */}
        <motion.div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.42 }}
        >
          <Link href="/signin?mode=signup" className="fj-btn-primary">
            Join free
            <ArrowRight style={{ width: 15, height: 15 }} />
          </Link>
          <Link href="/directory" className="fj-btn-text">
            Browse barbers
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export { Hero };
