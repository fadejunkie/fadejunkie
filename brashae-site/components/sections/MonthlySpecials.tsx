"use client"

import { useRef } from "react"
import Link from "next/link"
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion"

// TODO: Load from BRAND/kit/specials.json when available
const specials = [
  {
    brand: "ANDIS",
    name: "Master MX Cordless Clipper",
    price: "$189.99",
    originalPrice: "$219.99",
    slug: "andis-master-mx",
  },
  {
    brand: "JRL",
    name: "2020C Professional Clipper",
    price: "$249.99",
    originalPrice: "$299.99",
    slug: "jrl-2020c",
  },
  {
    brand: "BABYLISS PRO",
    name: "FX870 Boost+ Clipper",
    price: "$129.99",
    originalPrice: "$159.99",
    slug: "babyliss-fx870",
  },
]

// ── Inline animation variants ────────────────────────────────────────────────

const fadeUpFull: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

const scaleUpFull: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

const reducedOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

function AnimFadeUp({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: "-40px 0px", amount: 0.12 })
  const variants = shouldReduceMotion ? reducedOnly : fadeUpFull

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

function AnimScaleUp({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: "-40px 0px", amount: 0.12 })
  const variants = shouldReduceMotion ? reducedOnly : scaleUpFull

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

// ── SpecialCard ──────────────────────────────────────────────────────────────

function SpecialCard({
  brand,
  name,
  price,
  originalPrice,
  slug,
  animDelay,
}: {
  brand: string
  name: string
  price: string
  originalPrice: string
  slug: string
  animDelay: number
}) {
  const href = `https://brashae-shop.vercel.app/shop/${slug}`

  return (
    <AnimScaleUp delay={animDelay}>
      <div
        style={{
          background: "var(--surface-card)",
          border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: 8,
          overflow: "hidden",
          minWidth: 260,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Image placeholder with SPECIAL badge */}
        <div
          style={{
            position: "relative",
            height: 200,
            background: "var(--surface-elevated)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "var(--muted)",
              textTransform: "uppercase",
            }}
          >
            Photo Coming Soon
          </span>

          {/* SPECIAL badge */}
          <span
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              background: "var(--gold)",
              color: "#000000",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              borderRadius: 20,
              padding: "4px 10px",
              lineHeight: 1.4,
            }}
          >
            Special
          </span>
        </div>

        {/* Card body */}
        <div
          style={{
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            flex: 1,
          }}
        >
          {/* Brand eyebrow */}
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--gold)",
              textTransform: "uppercase",
            }}
          >
            {brand}
          </span>

          {/* Product name */}
          <p
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--on-dark)",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textWrap: "pretty",
              margin: 0,
            }}
          >
            {name}
          </p>

          {/* Price row */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginTop: 4,
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "var(--gold)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {price}
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "var(--muted)",
                textDecoration: "line-through",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {originalPrice}
            </span>
          </div>

          {/* CTA */}
          <Link
            href={href}
            style={{
              display: "block",
              marginTop: 12,
              background: "var(--gold)",
              color: "#000000",
              fontSize: 14,
              fontWeight: 600,
              textAlign: "center",
              borderRadius: 6,
              padding: "12px 0",
              textDecoration: "none",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.background =
                "var(--gold-light)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.background =
                "var(--gold)"
            }}
          >
            Shop This Deal
          </Link>
        </div>
      </div>
    </AnimScaleUp>
  )
}

// ── Section ──────────────────────────────────────────────────────────────────

export default function MonthlySpecials() {
  return (
    <section
      style={{
        background: "rgba(17,17,17,0.6)",
        padding: "80px clamp(24px, 5vw, 80px)",
      }}
    >
      {/* Heading */}
      <AnimFadeUp delay={0}>
        <h2
          style={{
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
            fontWeight: 700,
            color: "var(--on-dark)",
            textWrap: "balance",
            marginBottom: 12,
          }}
        >
          Monthly Specials
        </h2>
      </AnimFadeUp>

      {/* Subheading */}
      <AnimFadeUp delay={0.1}>
        <p
          style={{
            fontSize: 16,
            fontWeight: 400,
            color: "var(--body)",
            textWrap: "pretty",
            marginBottom: 40,
          }}
        >
          This month&apos;s best deals for your chair.
        </p>
      </AnimFadeUp>

      {/* Empty state */}
      {specials.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: "var(--muted)",
            fontSize: 16,
            padding: "48px 0",
          }}
        >
          No specials this month — check back soon.
        </p>
      ) : (
        <>
          {/* Cards grid (desktop) / horizontal scroll (mobile) */}
          <div
            className="specials-grid"
            style={{
              display: "flex",
              flexWrap: "nowrap",
              gap: 16,
              overflowX: "auto",
              paddingBottom: 8,
            }}
          >
            {specials.map((special, i) => (
              <div
                key={special.slug}
                style={{ flex: "0 0 auto", width: "min(280px, 85vw)" }}
                className="special-card-wrapper"
              >
                <SpecialCard
                  brand={special.brand}
                  name={special.name}
                  price={special.price}
                  originalPrice={special.originalPrice}
                  slug={special.slug}
                  animDelay={i * 0.08}
                />
              </div>
            ))}
          </div>

          {/* Section CTA */}
          <AnimFadeUp delay={0.32}>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <Link
                href="https://brashae-shop.vercel.app/shop/monthly-specials"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--gold)",
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--gold-light)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--gold)"
                }}
              >
                See All Specials →
              </Link>
            </div>
          </AnimFadeUp>
        </>
      )}

      {/* Responsive: 3-col grid on desktop */}
      <style>{`
        @media (min-width: 768px) {
          .specials-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            flex-wrap: unset !important;
            overflow-x: unset !important;
          }
          .special-card-wrapper {
            width: auto !important;
            flex: unset !important;
          }
        }
      `}</style>
    </section>
  )
}
