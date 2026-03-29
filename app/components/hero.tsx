"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Scissors } from "lucide-react";

const ease = [0.25, 0.1, 0.25, 1] as const;

/* Grain texture — SVG noise at 4% opacity over white */
const GrainOverlay = () => (
  <svg
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 h-full w-full"
    style={{ opacity: 0.04, mixBlendMode: "multiply" }}
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
    style={{ opacity: 0.08 }}
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
            fill="rgba(0,0,0,1)"
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
          backgroundColor: "var(--foreground)",
          borderRadius: "1.375rem",
          padding: "1.875rem",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 40px 80px rgba(0,0,0,0.22), 0 12px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
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
              backgroundColor: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily:
                  "var(--font-display), 'League Spartan', sans-serif",
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "-0.01em",
              }}
            >
              JM
            </span>
          </div>
          <div>
            <p
              style={{
                fontFamily:
                  "var(--font-display), 'League Spartan', sans-serif",
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--background)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                marginBottom: "0.25rem",
              }}
            >
              Jordan Morales
            </p>
            <p
              style={{
                fontFamily:
                  "var(--font-mono), ui-monospace, monospace",
                fontSize: "0.5625rem",
                fontWeight: 500,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
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
                    "var(--font-body), 'Courier Prime', monospace",
                  fontSize: "0.6875rem",
                  color: "rgba(255,255,255,0.5)",
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
                  backgroundColor: "rgba(255,255,255,0.07)",
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
                    backgroundColor: "#ffffff",
                    opacity: 0.55,
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
            borderTop: "1px solid rgba(255,255,255,0.07)",
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
                    "var(--font-display), 'League Spartan', sans-serif",
                  fontSize: "1.125rem",
                  fontWeight: 800,
                  color: "var(--background)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  marginBottom: "0.2rem",
                }}
              >
                {stat.v}
              </p>
              <p
                style={{
                  fontFamily:
                    "var(--font-mono), ui-monospace, monospace",
                  fontSize: "0.5rem",
                  fontWeight: 500,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.32)",
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
          {/* Thumbnail 1 */}
          <div
            style={{
              aspectRatio: "1",
              borderRadius: "0.625rem",
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.09)",
              overflow: "hidden",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "65%",
              background: "linear-gradient(to top, rgba(255,255,255,0.09), transparent)",
            }} />
            <div style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              border: "1.5px solid rgba(255,255,255,0.22)",
              position: "relative",
              zIndex: 1,
            }} />
          </div>

          {/* Thumbnail 2 — Scissors */}
          <div
            style={{
              aspectRatio: "1",
              borderRadius: "0.625rem",
              backgroundColor: "rgba(255,255,255,0.09)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Scissors
              style={{
                width: 15,
                height: 15,
                color: "rgba(255,255,255,0.55)",
                strokeWidth: 1.5,
              }}
            />
          </div>

          {/* Thumbnail 3 — lines */}
          <div
            style={{
              aspectRatio: "1",
              borderRadius: "0.625rem",
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.09)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              padding: "0.5rem",
            }}
          >
            {[0.65, 1, 0.8, 0.5].map((w, i) => (
              <div
                key={i}
                style={{
                  height: 1.5,
                  width: `${w * 100}%`,
                  backgroundColor: "rgba(255,255,255,0.25)",
                  borderRadius: 1,
                }}
              />
            ))}
          </div>
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
          backgroundColor: "var(--background)",
          borderRadius: "3rem",
          padding: "0.5rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          boxShadow:
            "0 4px 24px rgba(0,0,0,0.12), 0 1px 6px rgba(0,0,0,0.06)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="hero-active-dot" />
        <span
          style={{
            fontFamily:
              "var(--font-mono), ui-monospace, monospace",
            fontSize: "0.5rem",
            fontWeight: 500,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            color: "var(--muted-foreground)",
          }}
        >
          2,400+ barbers online
        </span>
      </motion.div>

      {/* ── Secondary floating card — recent post ── */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
          delay: 1.2,
        }}
        style={{
          position: "absolute",
          top: 195,
          left: -56,
          backgroundColor: "var(--background)",
          borderRadius: "1rem",
          padding: "0.875rem 1rem",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid var(--border)",
          maxWidth: 176,
        }}
        className="hero-side-pill"
      >
        <p
          style={{
            fontFamily:
              "var(--font-mono), ui-monospace, monospace",
            fontSize: "0.5rem",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted-foreground)",
            marginBottom: "0.3rem",
          }}
        >
          Board exam
        </p>
        <p
          style={{
            fontFamily:
              "var(--font-body), 'Courier Prime', monospace",
            fontSize: "0.6875rem",
            lineHeight: 1.45,
            color: "var(--foreground)",
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
        backgroundColor: "var(--background)",
        display: "flex",
        alignItems: "center",
        minHeight: "calc(100dvh - 57px)",
      }}
    >
      {/* Texture layers */}
      <GrainOverlay />
      <HalftoneAccent />

      <div
        className="relative mx-auto w-full hero-inner"
        style={{
          maxWidth: 1200,
          padding: "5rem clamp(1.5rem, 5vw, 6rem) 4rem",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "4rem",
          alignItems: "center",
        }}
      >
        {/* ── Left: copy ──────────────────────── */}
        <div>
          {/* Eyebrow */}
          <motion.p
            style={{
              fontFamily:
                "var(--font-mono), 'Geist Mono', ui-monospace, monospace",
              fontSize: "0.6875rem",
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--muted-foreground)",
              marginBottom: "1.25rem",
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            The barber community
          </motion.p>

          {/* Headline — League Spartan 800, tight tracking */}
          <div style={{ marginBottom: "1.5rem" }}>
            <motion.h1
              style={{
                fontFamily:
                  "var(--font-display), 'League Spartan', sans-serif",
                fontSize: "clamp(3rem, 6.5vw, 6.25rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                color: "var(--foreground)",
                margin: 0,
                textTransform: "lowercase",
              }}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.05 }}
            >
              Addicted
              <br />
              <span
                style={{
                  fontFamily:
                    "var(--font-body), 'Courier Prime', monospace",
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: "0.72em",
                  letterSpacing: "0.01em",
                  color: "color-mix(in oklch, var(--foreground) 50%, transparent)",
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
                "var(--font-body), 'Courier Prime', 'Courier New', monospace",
              fontSize: "1rem",
              lineHeight: 1.65,
              color: "var(--muted-foreground)",
              maxWidth: "29rem",
              marginBottom: "2rem",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.28 }}
          >
            Study for boards. Build your brand. Find barbers who take it
            seriously. fadejunkie is where the craft lives online.
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

          {/* ── Mobile social proof strip ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.6 }}
            className="hero-mobile-proof"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginTop: "2.25rem",
              paddingTop: "1.75rem",
              borderTop: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            {/* Stacked avatars */}
            <div style={{ display: "flex", alignItems: "center" }}>
              {["JM", "DR", "KH", "MT"].map((initials, i) => (
                <div
                  key={initials}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor:
                      i % 2 === 0
                        ? "rgba(0,0,0,0.08)"
                        : "rgba(0,0,0,0.05)",
                    border: "1.5px solid var(--background)",
                    marginLeft: i > 0 ? -8 : 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    zIndex: 4 - i,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "var(--font-display), 'League Spartan', sans-serif",
                      fontSize: "0.4375rem",
                      fontWeight: 700,
                      color: "rgba(0,0,0,0.55)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {initials}
                  </span>
                </div>
              ))}
            </div>

            {/* Text */}
            <div>
              <p
                style={{
                  fontFamily:
                    "var(--font-display), 'League Spartan', sans-serif",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.3,
                }}
              >
                2,400+ barbers already in
              </p>
              <p
                style={{
                  fontFamily:
                    "var(--font-mono), ui-monospace, monospace",
                  fontSize: "0.5rem",
                  fontWeight: 500,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: "rgba(0,0,0,0.4)",
                  marginTop: "0.2rem",
                }}
              >
                Free to join · No credit card
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Right: product visual ─────────── */}
        <div className="hero-card-col">
          <HeroCard />
        </div>
      </div>

      {/* ── Scroll cue ───────────────────────────────────────────────── */}
      <motion.div
        className="fj-scroll-cue"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.8, duration: 0.7 }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M5.5 8.5L11 14L16.5 8.5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>

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
          animation: fj-float 9s ease-in-out infinite;
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

        /* Active dot pulse — B&W: jet black pulse, no color */
        @keyframes fj-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(0,0,0,0.32); }
          50%       { opacity: 0.7; box-shadow: 0 0 0 4px rgba(0,0,0,0); }
        }
        .hero-active-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: var(--foreground);
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

        /* Mobile proof strip — hidden on desktop */
        .hero-mobile-proof {
          display: flex;
        }
        @media (min-width: 1024px) {
          .hero-mobile-proof {
            display: none !important;
          }
        }

        /* Scroll cue */
        .fj-scroll-cue {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
        }
        @keyframes fj-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50%       { transform: translateX(-50%) translateY(6px); }
        }
        .fj-scroll-cue {
          animation: fj-bounce 2s ease-in-out infinite;
          animation-delay: 2.5s;
        }
      `}</style>
    </section>
  );
};

export { Hero };
