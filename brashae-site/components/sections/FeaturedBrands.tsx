"use client"

import { useRef } from "react"
import Image from "next/image"
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion"

const BRANDS = [
  "Andis",
  "JRL",
  "Wahl",
  "BaByliss PRO",
  "Gamma+",
  "Oster",
  "Cocco",
  "Level3",
  "CHI",
  "Mizani",
  "Avlon",
  "Immortal",
]

// ── Inline AnimateIn (fadeOnly variant) ──────────────────────────────────────

const fadeOnlyFull: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

const fadeOnlyReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: "-40px 0px", amount: 0.12 })
  const variants = shouldReduceMotion ? fadeOnlyReduced : fadeOnlyFull

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </motion.div>
  )
}

// ── Marquee CSS injected as a style tag ──────────────────────────────────────

const MARQUEE_KEYFRAMES = `
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
`

export default function FeaturedBrands() {
  return (
    <section
      style={{
        background: "var(--canvas)",
        paddingTop: 64,
        paddingBottom: 64,
      }}
    >
      {/* Inject marquee keyframes */}
      <style>{MARQUEE_KEYFRAMES}</style>

      {/* ── Section label ── */}
      <div
        style={{
          padding: "0 clamp(24px, 5vw, 80px)",
          marginBottom: 40,
        }}
      >
        <FadeIn delay={0}>
          <span
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--muted)",
              textTransform: "uppercase",
            }}
          >
            Brands We Carry
          </span>
        </FadeIn>
      </div>

      {/* ── 2-col layout (desktop) / marquee only (mobile) ── */}
      <div
        style={{
          display: "flex",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Left col — editorial photo (desktop only) */}
        <div
          style={{
            position: "relative",
            flex: "0 0 40%",
            minHeight: 360,
            display: "none",

            // shown via inline media query workaround — use a wrapper div with responsive style
          }}
          className="featured-photo-col"
        >
          {/* AI placeholder — swap for real photography when available */}
          <Image
            src="/images/ai-2.png"
            alt="Barber holding Wahl clipper"
            fill
            style={{ objectFit: "cover" }}
          />
          {/* Right-edge fade into black */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, transparent 70%, #000000 100%)",
              zIndex: 1,
            }}
          />
        </div>

        {/* Marquee col */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 32,
            paddingTop: 32,
            paddingBottom: 32,
          }}
        >
          {/* Row 1 — left to right */}
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                width: "max-content",
                animation: "marquee 30s linear infinite",
              }}
            >
              {[...BRANDS, ...BRANDS].map((brand, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--body)",
                    paddingRight: 48,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>

          {/* Row 2 — reversed direction for visual depth */}
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                width: "max-content",
                animation: "marquee 30s linear infinite reverse",
              }}
            >
              {[...[...BRANDS].reverse(), ...[...BRANDS].reverse()].map(
                (brand, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--body)",
                      paddingRight: 48,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {brand}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Responsive: show photo col on desktop ── */}
      <style>{`
        @media (min-width: 768px) {
          .featured-photo-col {
            display: block !important;
          }
        }
      `}</style>
    </section>
  )
}
