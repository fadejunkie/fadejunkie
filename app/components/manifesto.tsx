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
        backgroundColor: "#fff4ea",
        padding: "7rem clamp(1.5rem, 5vw, 6rem)",
        borderTop: "1px solid rgba(22,16,8,0.1)",
        borderBottom: "1px solid rgba(22,16,8,0.1)",
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
                  "var(--font-spectral), Georgia, 'Times New Roman', serif",
                fontSize: "clamp(5rem, 10vw, 9rem)",
                fontWeight: 300,
                lineHeight: 0.8,
                color: "hsl(34, 42%, 44%)",
                marginBottom: "0.5rem",
                userSelect: "none",
              }}
              aria-hidden="true"
            >
              &ldquo;
            </div>

            <p
              style={{
                fontFamily:
                  "var(--font-spectral), Georgia, 'Times New Roman', serif",
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                fontWeight: 300,
                fontStyle: "italic",
                letterSpacing: "-0.015em",
                lineHeight: 1.25,
                color: "hsl(0, 0%, 8%)",
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
                  backgroundColor: "rgba(22,16,8,0.2)",
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
                  color: "hsl(34, 22%, 44%)",
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
                    color: "hsl(34, 42%, 44%)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {pillar.label}
                </p>
                <p
                  style={{
                    fontFamily:
                      "var(--font-inter), -apple-system, sans-serif",
                    fontSize: "0.9375rem",
                    lineHeight: 1.65,
                    color: "hsl(34, 18%, 38%)",
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
