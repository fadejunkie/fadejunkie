'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

// Pro Supply Program — the ONE cream (inverted) section on the homepage
// Background is var(--cream) = #FFF8F0 — inverted light section, all text flips for light bg

const benefits = [
  {
    icon: '🚚',
    title: 'Fast Delivery',
    desc: 'Same-week delivery in Greater Houston area.',
  },
  {
    icon: '💰',
    title: 'Wholesale Pricing',
    desc: 'Pro rates on all major brands when you apply.',
  },
  {
    icon: '🔑',
    title: 'Pro Access',
    desc: 'Exclusive items and early access to new arrivals.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export default function ProSupplyProgram() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      style={{
        background: 'var(--cream)',
        padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)',
      }}
    >
      <div
        ref={ref}
        style={{
          display: 'grid',
          gridTemplateColumns: '55fr 45fr',
          gap: 'clamp(40px, 6vw, 80px)',
          alignItems: 'center',
        }}
        className="pro-supply-grid"
      >
        {/* Left: Content */}
        <div>
          {/* Eyebrow */}
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--gold-dim)',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            PRO SUPPLY
          </motion.p>

          {/* Headline */}
          <motion.h2
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: 800,
              color: '#000000',
              lineHeight: 1.1,
              textWrap: 'balance',
            }}
          >
            Professional Supply. Delivered.
          </motion.h2>

          {/* Body */}
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: '#3A3A3A',
              lineHeight: 1.65,
              margin: '20px 0 32px',
              textWrap: 'pretty',
            }}
          >
            Wholesale pricing, flexible delivery, and professional-grade access — built for working
            barbers and stylists in Houston.
          </motion.p>

          {/* Benefits */}
          <div className="pro-benefits-grid">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                custom={i + 3}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
              >
                <span style={{ fontSize: 22 }}>{b.icon}</span>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#000000', lineHeight: 1.3 }}>
                  {b.title}
                </p>
                <p style={{ fontSize: 13, fontWeight: 400, color: '#3A3A3A', lineHeight: 1.5 }}>
                  {b.desc}
                </p>
                {/* TODO: Pro Supply program details (minimum order, delivery radius) pending from Raimons */}
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            custom={7}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            style={{ marginTop: 36 }}
          >
            <a
              href="/#pro-supply"
              className="btn-cream"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: '#000000',
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 6,
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              Learn More About Pro Supply
            </a>
          </motion.div>
        </div>

        {/* Right: Photo */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{
            position: 'relative',
            minHeight: 400,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          {/*
            AI placeholder — real photo preferred at launch
            ⚠️ TODO: towel in image shows "BENNETTS BEAUTY SUPPLY" — crop/blur bottom text band
            when real photo is available
          */}
          <Image
            src="/images/ai-5.png"
            alt="Professional barber in black apron"
            fill
            style={{
              objectFit: 'cover',
              filter: 'brightness(0.88) contrast(1.05)',
            }}
          />
        </motion.div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 767px) {
          .pro-supply-grid {
            grid-template-columns: 1fr !important;
          }
          .pro-supply-grid > div:last-child {
            order: -1;
            min-height: 280px !important;
          }
          .pro-benefits-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        .pro-benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .btn-cream:hover {
          background: #1a1a1a !important;
        }
      `}</style>
    </section>
  )
}
