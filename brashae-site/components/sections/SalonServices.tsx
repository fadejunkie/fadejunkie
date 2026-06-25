"use client"

// Salon Services section — co-branded with Raimon's Salon de Beauté
// TODO: Load services from BRAND/kit/services.json
// TODO: Replace booking link when Booksy/Fresha URL confirmed

import Image from "next/image"
import { useRef } from "react"
import { motion, useInView, type Variants } from "framer-motion"

const services = [
  { name: "Braids", description: "Knotless, box braids, cornrows, and protective styles." },
  { name: "Wig Fittings / Hair Replacement", description: "Custom wig fittings and non-surgical hair replacement." },
  { name: "Corrective Coloring", description: "Color correction and repair by licensed stylists." },
  { name: "Color / Highlights", description: "Full color, balayage, and highlights." },
  { name: "Permanents / Relaxers", description: "Chemical services for texture and curl patterns." },
  { name: "Custom Styling", description: "Special occasion and everyday styling by Raimon's team." },
]

const BOOK_LINK = "tel:7135412279" // TODO: replace with Booksy URL when confirmed

type BezierEase = [number, number, number, number]
const EASE: BezierEase = [0.22, 1, 0.36, 1]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, delay: i * 0.06, ease: EASE },
  }),
}

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.52, delay: i * 0.06, ease: EASE },
  }),
}

const imageReveal: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.64, ease: EASE },
  },
}

export default function SalonServices() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      style={{
        background: "var(--canvas)",
        padding: "clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)",
        borderTop: "1px solid var(--hairline)",
      }}
    >
      {/* Heading block */}
      <div ref={ref} style={{ marginBottom: 48 }}>
        <motion.h2
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
          variants={fadeUp}
          style={{
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
            fontWeight: 700,
            color: "var(--on-dark)",
            textWrap: "balance",
            lineHeight: 1.2,
          }}
        >
          Salon Services
        </motion.h2>
        <motion.p
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={1}
          variants={fadeUp}
          style={{
            fontSize: 18,
            fontWeight: 400,
            color: "var(--gold)",
            marginTop: 6,
          }}
        >
          by Raimon&apos;s Salon de Beauté
        </motion.p>
      </div>

      {/* Two-column layout */}
      <div className="salon-services-layout">
        {/* Left col — services list */}
        <div className="salon-services-left">
          <div>
            {services.map((service, i) => (
              <motion.div
                key={service.name}
                custom={i}
                variants={fadeLeft}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                style={{
                  padding: "16px 0",
                  borderBottom: i < services.length - 1 ? "1px solid var(--hairline)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span
                    style={{
                      color: "var(--gold)",
                      fontSize: 16,
                      lineHeight: 1.5,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    →
                  </span>
                  <div>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "var(--on-dark)",
                        lineHeight: 1.4,
                      }}
                    >
                      {service.name}
                    </p>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: "var(--body)",
                        marginTop: 4,
                        textWrap: "pretty",
                        lineHeight: 1.6,
                      }}
                    >
                      {service.description}
                    </p>
                    <a
                      href={BOOK_LINK}
                      style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--gold)",
                        marginTop: 6,
                        textDecoration: "none",
                      }}
                    >
                      Book →
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Primary CTA */}
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={services.length}
            variants={fadeLeft}
            style={{ marginTop: 36 }}
          >
            <a
              href={BOOK_LINK}
              style={{
                display: "inline-block",
                background: "var(--gold)",
                color: "#000",
                fontSize: 15,
                fontWeight: 600,
                padding: "12px 24px",
                borderRadius: 6,
                textDecoration: "none",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.background = "var(--gold-light)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.background = "var(--gold)"
              }}
            >
              Book an Appointment
            </a>
          </motion.div>
        </div>

        {/* Right col — image */}
        {/* AI placeholder — swap when Raimons provides real salon photography */}
        <motion.div
          className="salon-services-right"
          variants={imageReveal}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{
            position: "relative",
            minHeight: 400,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <Image
            src="/images/ai-3.png"
            alt="Stylist braiding hair at Raimon's Salon de Beauté"
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 767px) 100vw, 45vw"
          />
        </motion.div>
      </div>

      {/* Responsive styles */}
      <style>{`
        .salon-services-layout {
          display: grid;
          grid-template-columns: 55% 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 767px) {
          .salon-services-layout {
            grid-template-columns: 1fr;
          }
          .salon-services-right {
            order: -1;
          }
        }
      `}</style>
    </section>
  )
}
