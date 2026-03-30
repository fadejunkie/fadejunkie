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
        backgroundColor: "var(--background)",
        padding: "var(--section-gap-lg) var(--container-px)",
        borderTop: "1px solid var(--border)",
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
              className="font-display font-extrabold leading-[0.8] text-border select-none tracking-[-0.04em]"
              style={{
                fontSize: "clamp(3.5rem, 7vw, 5.5rem)",
                marginBottom: "0.5rem",
              }}
              aria-hidden="true"
            >
              &ldquo;
            </div>

            <p
              className="font-body font-normal italic leading-[1.35] text-foreground"
              style={{
                fontSize: "clamp(1.375rem, 3vw, 2.25rem)",
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
                  backgroundColor: "var(--border)",
                }}
              />
              <span
                className="font-mono font-medium text-[0.625rem] tracking-[0.18em] uppercase text-muted-foreground"
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
                  className="font-mono font-medium text-[0.625rem] tracking-[0.16em] uppercase text-muted-foreground mb-3"
                >
                  {pillar.label}
                </p>
                <p
                  className="font-body text-[0.9375rem] leading-[1.65] text-muted-foreground"
                >
                  {pillar.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export { Manifesto };
