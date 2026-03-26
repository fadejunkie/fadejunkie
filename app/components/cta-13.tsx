"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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
        backgroundColor: "var(--foreground)",
        padding: "var(--section-gap-lg) var(--container-px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grain on black */}
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

      {/* Halftone accent — bottom-right corner */}
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 40,
          right: 60,
          opacity: 0.08,
          pointerEvents: "none",
        }}
        width="148"
        height="148"
        viewBox="0 0 148 148"
      >
        {Array.from({ length: 6 }, (_, row) =>
          Array.from({ length: 6 }, (_, col) => {
            const r = 1.2 + (row + col) * 0.36;
            return (
              <circle
                key={`${row}-${col}`}
                cx={col * 24 + 12}
                cy={row * 24 + 12}
                r={r}
                fill="rgba(255,255,255,1)"
              />
            );
          })
        )}
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
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
            fontSize: "0.625rem",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            marginBottom: "1.5rem",
          }}
        >
          Ready to get in
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1], delay: 0.07 }}
          style={{
            fontFamily:
              "var(--font-display), 'League Spartan', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 0.98,
            color: "#ffffff",
            marginBottom: "1.5rem",
            textTransform: "lowercase",
          }}
        >
          {heading}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1], delay: 0.14 }}
          style={{
            fontFamily:
              "var(--font-body), 'Courier Prime', monospace",
            fontSize: "0.9375rem",
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.55)",
            maxWidth: "28rem",
            margin: "0 auto 3rem",
          }}
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.22 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          {buttons.primary && (
            <Link href={buttons.primary.url} className="fj-btn-light">
              {buttons.primary.text}
              <ArrowRight style={{ width: 15, height: 15 }} />
            </Link>
          )}
          {buttons.secondary && (
            <Link href={buttons.secondary.url} className="fj-btn-text-on-dark">
              {buttons.secondary.text}
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export { Cta13 };
