"use client"

import { useRef } from "react"
import Link from "next/link"
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion"

// TODO: Replace emoji icons with Lucide icons when installed,
//       and load from BRAND/kit/shop-categories.json
const categories = [
  { name: "Hair Care", icon: "💆", count: null },
  { name: "Barber Supplies", icon: "✂️", count: null },
  { name: "Wigs & Extensions", icon: "💫", count: null },
  { name: "Styling Tools", icon: "🔧", count: null },
  { name: "Pro Products", icon: "⭐", count: null },
  { name: "New Arrivals", icon: "✨", count: null },
  { name: "Monthly Specials", icon: "🏷️", count: null },
  { name: "Clearance", icon: "🔖", count: null },
] as const

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
}

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
  style,
}: {
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
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
      style={style}
    >
      {children}
    </motion.div>
  )
}

// ── CategoryCard ─────────────────────────────────────────────────────────────

function CategoryCard({
  name,
  icon,
  count,
  href,
  animDelay,
}: {
  name: string
  icon: string
  count: number | null
  href: string
  animDelay: number
}) {
  return (
    <AnimScaleUp delay={animDelay} style={{ height: "100%" }}>
      <Link
        href={href}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          background: "var(--surface-card)",
          border: "1px solid rgba(201,168,76,0.12)",
          borderRadius: 8,
          padding: 24,
          height: "100%",
          cursor: "pointer",
          transition: "border-color 0.25s ease, transform 0.2s ease",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.borderColor = "rgba(201,168,76,0.35)"
          el.style.transform = "translateY(-2px)"
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.borderColor = "rgba(201,168,76,0.12)"
          el.style.transform = "translateY(0)"
        }}
      >
        {/* Icon + arrow row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: 28, lineHeight: 1 }}>{icon}</span>
          <span style={{ color: "var(--gold)", fontSize: 16 }}>→</span>
        </div>

        {/* Category name */}
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "var(--on-dark)",
            marginTop: 4,
          }}
        >
          {name}
        </span>

        {/* Item count — skip if null */}
        {/* TODO: add counts when shop data connected */}
        {count !== null && (
          <span
            style={{
              fontSize: 13,
              fontWeight: 400,
              color: "var(--muted)",
            }}
          >
            {count} items
          </span>
        )}
      </Link>
    </AnimScaleUp>
  )
}

// ── Section ──────────────────────────────────────────────────────────────────

export default function ShopCategories() {
  return (
    <section
      style={{
        background: "var(--canvas)",
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
          Shop by Category
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
          Everything your chair needs.
        </p>
      </AnimFadeUp>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
        }}
        className="shop-categories-grid"
      >
        {categories.map((cat, i) => (
          <CategoryCard
            key={cat.name}
            name={cat.name}
            icon={cat.icon}
            count={cat.count}
            href={`https://brashae-shop.vercel.app/shop/${toSlug(cat.name)}`}
            animDelay={Math.min(i * 0.08, 0.6)}
          />
        ))}
      </div>

      {/* Responsive: 4-col on desktop */}
      <style>{`
        @media (min-width: 768px) {
          .shop-categories-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </section>
  )
}
