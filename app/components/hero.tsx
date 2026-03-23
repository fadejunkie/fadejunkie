"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Scissors } from "lucide-react";

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

/* ── Hero profile card — "product in frame" visual ─────────────────── */
const HeroCard = () => {
  const skills = [
    { label: "Skin fades", level: 0.94 },
    { label: "Tapers", level: 0.87 },
    { label: "Beard sculpting", level: 0.76 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 48, y: 12 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.38 }}
      style={{ position: "relative", width: "100%", maxWidth: 316 }}
    >
      {/* ── Primary card ────────────────────────── */}
      <div
        className="hero-profile-card"
        style={{
          backgroundColor: "rgba(22,16,8,0.97)",
          borderRadius: "1.375rem",
          padding: "1.875rem",
          border: "1px solid rgba(255,244,234,0.07)",
          boxShadow:
            "0 40px 80px rgba(22,16,8,0.18), 0 12px 32px rgba(22,16,8,0.1), 0 2px 8px rgba(22,16,8,0.08)",
        }}
      >
        {/* Header: avatar + meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.875rem",
            marginBottom: "1.625rem",
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              backgroundColor: "rgba(255,244,234,0.07)",
              border: "1px solid rgba(255,244,234,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily:
                  "var(--font-spectral), Georgia, 'Times New Roman', serif",
                fontSize: "1.125rem",
                fontWeight: 300,
                color: "rgba(255,244,234,0.45)",
                fontStyle: "italic",
              }}
            >
              JM
            </span>
          </div>
          <div>
            <p
              style={{
                fontFamily:
                  "var(--font-spectral), Georgia, 'Times New Roman', serif",
                fontSize: "1.0625rem",
                fontWeight: 400,
                color: "#fff4ea",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
                marginBottom: "0.25rem",
              }}
            >
              Jordan Morales
            </p>
            <p
              style={{
                fontFamily:
                  "var(--font-geist-mono), ui-monospace, monospace",
                fontSize: "0.5625rem",
                fontWeight: 500,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                color: "hsl(34, 42%, 44%)",
              }}
            >
              Brooklyn, NY · Licensed 2019
            </p>
          </div>
        </div>

        {/* Specialties / skill bars */}
        <div style={{ marginBottom: "1.5rem" }}>
          {skills.map((skill) => (
            <div key={skill.label} style={{ marginBottom: "0.7rem" }}>
              <span
                style={{
                  fontFamily:
                    "var(--font-inter), -apple-system, sans-serif",
                  fontSize: "0.6875rem",
                  color: "rgba(255,244,234,0.55)",
                  letterSpacing: "-0.005em",
                  display: "block",
                  marginBottom: "0.3rem",
                }}
              >
                {skill.label}
              </span>
              <div
                style={{
                  height: 2,
                  borderRadius: 9999,
                  backgroundColor: "rgba(255,244,234,0.05)",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level * 100}%` }}
                  transition={{
                    duration: 1.1,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.7,
                  }}
                  style={{
                    height: 2,
                    borderRadius: 9999,
                    backgroundColor: "hsl(34, 42%, 44%)",
                    opacity: 0.65,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid rgba(255,244,234,0.06)",
            marginBottom: "1.375rem",
          }}
        >
          {[
            { v: "847", l: "Clients" },
            { v: "2.1k", l: "Posts" },
            { v: "4.9", l: "Rating" },
          ].map((stat) => (
            <div key={stat.l}>
              <p
                style={{
                  fontFamily:
                    "var(--font-spectral), Georgia, 'Times New Roman', serif",
                  fontSize: "1.125rem",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "#fff4ea",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  marginBottom: "0.2rem",
                }}
              >
                {stat.v}
              </p>
              <p
                style={{
                  fontFamily:
                    "var(--font-geist-mono), ui-monospace, monospace",
                  fontSize: "0.5rem",
                  fontWeight: 500,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: "rgba(255,244,234,0.38)",
                }}
              >
                {stat.l}
              </p>
            </div>
          ))}
        </div>

        {/* Recent work thumbnails */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.375rem",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                aspectRatio: "1",
                borderRadius: "0.625rem",
                backgroundColor: i === 0 ? "rgba(255,244,234,0.07)" : i === 1 ? "rgba(255,244,234,0.10)" : "rgba(255,244,234,0.08)",
                border: "1px solid rgba(255,244,234,0.09)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i === 1 && (
                <Scissors
                  style={{
                    width: 14,
                    height: 14,
                    color: "rgba(255,244,234,0.30)",
                    strokeWidth: 1.5,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Floating "Active now" pill ────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.75, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
          delay: 1.05,
        }}
        style={{
          position: "absolute",
          bottom: -18,
          right: -18,
          backgroundColor: "#fff4ea",
          borderRadius: "3rem",
          padding: "0.5rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          boxShadow:
            "0 4px 24px rgba(22,16,8,0.14), 0 1px 6px rgba(22,16,8,0.06)",
          border: "1px solid rgba(22,16,8,0.07)",
        }}
      >
        <div className="hero-active-dot" />
        <span
          style={{
            fontFamily:
              "var(--font-geist-mono), ui-monospace, monospace",
            fontSize: "0.5rem",
            fontWeight: 500,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            color: "hsl(34, 22%, 44%)",
          }}
        >
          2,400+ barbers online
        </span>
      </motion.div>

      {/* ── Secondary floating card — recent post ── */}
      <motion.div
        initial={{ opacity: 0, x: -24, y: -8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
          delay: 1.2,
        }}
        style={{
          position: "absolute",
          top: 32,
          left: -56,
          backgroundColor: "#fff4ea",
          borderRadius: "1rem",
          padding: "0.875rem 1rem",
          boxShadow:
            "0 8px 32px rgba(22,16,8,0.12), 0 2px 8px rgba(22,16,8,0.06)",
          border: "1px solid rgba(22,16,8,0.07)",
          maxWidth: 176,
        }}
        className="hero-side-pill"
      >
        <p
          style={{
            fontFamily:
              "var(--font-geist-mono), ui-monospace, monospace",
            fontSize: "0.5rem",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "hsl(34, 42%, 44%)",
            marginBottom: "0.3rem",
          }}
        >
          Board exam
        </p>
        <p
          style={{
            fontFamily:
              "var(--font-inter), -apple-system, sans-serif",
            fontSize: "0.6875rem",
            lineHeight: 1.45,
            color: "hsl(0, 0%, 8%)",
          }}
        >
          Just passed.
          <br />
          First client tomorrow 🔥
        </p>
      </motion.div>
    </motion.div>
  );
};

/* ── Main Hero ───────────────────────────────────────────────────────── */
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

      {/* Ambient glow — warmth behind the card on desktop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background: "radial-gradient(ellipse 55% 50% at 75% 55%, rgba(255,220,170,0.12) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative mx-auto w-full hero-inner"
        style={{
          maxWidth: 1200,
          padding: "7rem clamp(1.5rem, 5vw, 6rem) 6rem",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "4rem",
          alignItems: "center",
        }}
      >
        {/* ── Left: copy ──────────────────────── */}
        <div>
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
            <Link href="/directory" className="fj-btn-text fj-arrow-link">
              Browse barbers
              <ArrowRight
                className="fj-arrow-icon"
                style={{ width: 13, height: 13, marginLeft: "0.3rem" }}
              />
            </Link>
          </motion.div>
        </div>

        {/* ── Right: product visual ─────────── */}
        <div className="hero-card-col">
          <HeroCard />
        </div>
      </div>

      <style>{`
        /* Two-column layout on desktop */
        @media (min-width: 1024px) {
          .hero-inner {
            grid-template-columns: 1fr 1fr !important;
          }
          .hero-card-col {
            display: flex !important;
            justify-content: flex-end;
            align-items: center;
            padding-right: 2rem;
          }
        }

        /* Profile card float animation */
        @keyframes fj-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-9px); }
        }
        .hero-profile-card {
          animation: fj-float 7s ease-in-out infinite;
        }

        /* Side pill float (offset phase) */
        @keyframes fj-float-offset {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50%       { transform: translateY(-5px) translateX(2px); }
        }
        .hero-side-pill {
          animation: fj-float-offset 5s ease-in-out infinite;
          animation-delay: 1.2s;
        }

        /* Active dot pulse */
        @keyframes fj-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          50%       { opacity: 0.8; box-shadow: 0 0 0 4px rgba(34,197,94,0); }
        }
        .hero-active-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #22c55e;
          animation: fj-pulse 2.2s ease-in-out infinite;
          flex-shrink: 0;
        }

        /* Arrow link micro-interaction */
        .fj-arrow-link {
          display: inline-flex;
          align-items: center;
        }
        .fj-arrow-icon {
          transition: transform 0.2s ease;
        }
        .fj-arrow-link:hover .fj-arrow-icon {
          transform: translateX(4px);
        }

        /* Hero card col hidden on mobile */
        .hero-card-col {
          display: none;
        }
      `}</style>
    </section>
  );
};

export { Hero };
