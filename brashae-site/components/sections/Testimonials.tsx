'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// Testimonials — placeholder shell (no testimonials received yet)
// TODO: Replace with real testimonials from Raimons — pull from BRAND/kit/testimonials.json when available

const scaleUp = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.48, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

const placeholderCards = [
  {
    quote:
      "Brashae's is the only spot I trust for my supplies in Houston. Top quality, great prices.",
    reviewer: '— Happy Customer',
    source: 'Google',
  },
  {
    quote:
      "Brashae's is the only spot I trust for my supplies in Houston. Top quality, great prices.",
    reviewer: '— Happy Customer',
    source: 'Google',
  },
  {
    quote:
      "Brashae's is the only spot I trust for my supplies in Houston. Top quality, great prices.",
    reviewer: '— Happy Customer',
    source: 'Google',
  },
]

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      style={{
        background: 'var(--canvas)',
        padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)',
        borderTop: '1px solid var(--hairline)',
      }}
    >
      {/* Heading */}
      <motion.h2
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
          fontWeight: 700,
          color: 'var(--on-dark)',
          textWrap: 'balance',
          marginBottom: 48,
        }}
      >
        What They're Saying
      </motion.h2>

      {/* Cards grid */}
      <div className="testimonials-grid">
        {placeholderCards.map((card, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={scaleUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--hairline)',
              borderRadius: 8,
              padding: 24,
            }}
          >
            {/* Stars */}
            <p
              style={{
                fontSize: 16,
                color: 'var(--gold)',
                marginBottom: 12,
                lineHeight: 1,
              }}
            >
              ★★★★★
            </p>

            {/* Quote */}
            <p
              style={{
                fontSize: 15,
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'var(--body)',
                lineHeight: 1.65,
                textWrap: 'pretty',
              }}
            >
              &ldquo;{card.quote}&rdquo;
            </p>

            {/* Reviewer */}
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--on-dark)',
                marginTop: 16,
              }}
            >
              {card.reviewer}
            </p>

            {/* Source badge */}
            <p
              style={{
                fontSize: 11,
                fontWeight: 400,
                color: 'var(--muted)',
                marginTop: 4,
              }}
            >
              {card.source}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Responsive CSS */}
      <style>{`
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 767px) {
          .testimonials-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
