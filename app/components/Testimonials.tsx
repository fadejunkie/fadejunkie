"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const ease = [0.25, 0.1, 0.25, 1] as const;

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const TESTIMONIALS = [
  {
    quote:
      "Passed my state boards first try. The flashcards are insane — way better than anything my school gave us.",
    name: "Marcus T.",
    location: "Houston, TX",
    initials: "MT",
    specialty: "Licensed 2025",
  },
  {
    quote:
      "I had a client booking site up in 20 minutes. No Squarespace, no monthly fees, no drag and drop BS. Just clean.",
    name: "Destiny R.",
    location: "Atlanta, GA",
    initials: "DR",
    specialty: "Shop Owner",
  },
  {
    quote:
      "Finally a place where people actually understand what I'm posting. Real feedback from real barbers.",
    name: "J. Okafor",
    location: "Brooklyn, NY",
    initials: "JO",
    specialty: "8 Years In The Chair",
  },
  {
    quote:
      "The directory helped me find a mentor in my city who's been cutting for 15 years. That's not something Google gives you.",
    name: "Brianna M.",
    location: "Chicago, IL",
    initials: "BM",
    specialty: "Apprentice",
  },
] as const;

const TestimonialCard = ({
  quote,
  name,
  location,
  initials,
  specialty,
}: (typeof TESTIMONIALS)[number]) => (
  <motion.div
    variants={fadeUp}
    transition={{ duration: 0.5, ease }}
    className="fj-testimonial-card"
    style={{
      backgroundColor: "rgba(255,255,255,0.7)",
      border: "1px solid rgba(22,16,8,0.08)",
      borderRadius: "1rem",
      padding: "1.75rem",
      boxShadow: "0 2px 12px rgba(22,16,8,0.05)",
      display: "flex",
      flexDirection: "column",
      gap: "1.25rem",
    }}
  >
    {/* Stars */}
    <div style={{ display: "flex", gap: "0.2rem" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{
            width: 12,
            height: 12,
            fill: "hsl(34, 42%, 44%)",
            color: "hsl(34, 42%, 44%)",
            strokeWidth: 0,
          }}
        />
      ))}
    </div>

    {/* Quote */}
    <p
      style={{
        fontFamily:
          "var(--font-spectral), Georgia, 'Times New Roman', serif",
        fontSize: "clamp(1rem, 1.5vw, 1.0625rem)",
        fontWeight: 300,
        fontStyle: "italic",
        letterSpacing: "-0.01em",
        lineHeight: 1.6,
        color: "hsl(0, 0%, 8%)",
        flex: 1,
      }}
    >
      &ldquo;{quote}&rdquo;
    </p>

    {/* Attribution */}
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      {/* Avatar */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: "rgba(22,16,8,0.07)",
          border: "1px solid rgba(22,16,8,0.10)",
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
            fontSize: "0.6875rem",
            fontWeight: 400,
            fontStyle: "italic",
            color: "rgba(22,16,8,0.55)",
          }}
        >
          {initials}
        </span>
      </div>

      {/* Name + location */}
      <div>
        <p
          style={{
            fontFamily: "var(--font-inter), -apple-system, sans-serif",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "hsl(0, 0%, 8%)",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}
        >
          {name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
          <span
            style={{
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: "0.5rem",
              fontWeight: 500,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "hsl(34, 22%, 44%)",
            }}
          >
            {specialty}
          </span>
          <span
            style={{
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: "0.5rem",
              color: "rgba(22,16,8,0.20)",
            }}
          >
            ·
          </span>
          <span
            style={{
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: "0.5rem",
              fontWeight: 500,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "rgba(22,16,8,0.35)",
            }}
          >
            {location}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

const Testimonials = () => {
  return (
    <section
      style={{
        backgroundColor: "#fff4ea",
        padding: "5rem clamp(1.5rem, 5vw, 6rem)",
        borderTop: "1px solid rgba(22,16,8,0.08)",
        borderBottom: "1px solid rgba(22,16,8,0.08)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Section label */}
        <motion.p
          style={{
            fontFamily:
              "var(--font-geist-mono), ui-monospace, monospace",
            fontSize: "0.5625rem",
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "hsl(34, 42%, 44%)",
            marginBottom: "1rem",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease }}
        >
          From the community
        </motion.p>

        {/* Section headline */}
        <motion.h2
          style={{
            fontFamily:
              "var(--font-spectral), Georgia, 'Times New Roman', serif",
            fontSize: "clamp(2.25rem, 5vw, 4rem)",
            fontWeight: 300,
            fontStyle: "italic",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: "hsl(0, 0%, 8%)",
            marginBottom: "3rem",
          }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease, delay: 0.06 }}
        >
          Barbers.
          <br />
          <span style={{ fontStyle: "normal", fontWeight: 400, color: "hsl(34, 22%, 44%)" }}>
            In their own words.
          </span>
        </motion.h2>

        {/* Cards grid */}
        <motion.div
          className="testimonials-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: "1.5rem",
          }}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .testimonials-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        .fj-testimonial-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: default;
        }
        .fj-testimonial-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(22,16,8,0.10) !important;
        }
      `}</style>
    </section>
  );
};

export { Testimonials };
