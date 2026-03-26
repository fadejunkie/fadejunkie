"use client";

import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const PILLARS = [
  {
    label: "Who we built this for",
    text: "FadeJunkie is for barbers who treat the craft like a calling — not a job. The ones who study flash cards between clients, post their work for honest critique, and are always watching the next barber's technique.",
  },
  {
    label: "What we built",
    text: "A platform that meets you where you are. Whether you're studying for state boards, looking for tools to run your business, or just want to connect with barbers who get it — it's all here.",
  },
  {
    label: "Why it's free",
    text: "Because the best communities start with access, not paywalls. Join, use the tools, build something. The rest follows.",
  },
] as const;

const Manifesto = () => {
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        padding: "7rem clamp(1.5rem, 5vw, 6rem)",
        borderTop: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "4rem",
          }}
          className="manifesto-grid"
        >
          {/* Left — editorial quote */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease }}
          >
            {/* Opening mark */}
            <div
              style={{
                fontFamily:
                  "var(--font-display), 'League Spartan', sans-serif",
                fontSize: "clamp(3.5rem, 7vw, 5.5rem)",
                fontWeight: 800,
                lineHeight: 0.8,
                color: "rgba(0,0,0,0.1)",
                marginBottom: "0.5rem",
                userSelect: "none",
                letterSpacing: "-0.04em",
              }}
              aria-hidden="true"
            >
              &ldquo;
            </div>

            <p
              style={{
                fontFamily:
                  "var(--font-body), 'Courier Prime', monospace",
                fontSize: "clamp(1.375rem, 3vw, 2.25rem)",
                fontWeight: 400,
                fontStyle: "italic",
                letterSpacing: "0",
                lineHeight: 1.35,
                color: "#000000",
                marginBottom: "2.5rem",
              }}
            >
              Every barber remembers their first clean fade.
              <br />
              <br />
              This is for that feeling.
            </p>

            {/* Attribution */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  height: 1,
                  width: 36,
                  backgroundColor: "rgba(0,0,0,0.2)",
                }}
              />
              <span
                style={{
                  fontFamily:
                    "var(--font-geist-mono), ui-monospace, monospace",
                  fontSize: "0.625rem",
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(0,0,0,0.4)",
                }}
              >
                Shop Talk
              </span>
            </div>
          </motion.div>

          {/* Right — pillars */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease, delay: i * 0.08 }}
              >
                <p
                  style={{
                    fontFamily:
                      "var(--font-geist-mono), ui-monospace, monospace",
                    fontSize: "0.625rem",
                    fontWeight: 500,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(0,0,0,0.4)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {pillar.label}
                </p>
                <p
                  style={{
                    fontFamily:
                      "var(--font-body), 'Courier Prime', monospace",
                    fontSize: "0.9375rem",
                    lineHeight: 1.65,
                    color: "rgba(0,0,0,0.65)",
                  }}
                >
                  {pillar.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .manifesto-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 6rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export { Manifesto };
