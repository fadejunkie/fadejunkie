"use client"

// TODO: swap hero option B to /images/ai-7.png if client prefers craft over location

import Image from "next/image"
import AnimateIn from "@/components/shared/AnimateIn"

const SHOP_URL = "https://brashae-shop.vercel.app/shop"
const BOOK_PHONE = "https://booksy.com"

const stats = [
  { number: "30+", label: "Brands" },
  { number: "17+", label: "Suites" },
  { number: "15+", label: "Years in Houston" },
]

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100svh",
        overflow: "hidden",
      }}
    >
      {/* ── Background photo ── */}
      <Image
        src="/images/storefront/storefront-exterior-dusk-main.jpg"
        alt="Brashae's Barber Beauty Supply storefront at dusk"
        fill
        priority
        style={{
          objectFit: "cover",
          objectPosition: "center 30%",
          zIndex: 0,
        }}
      />

      {/* ── Gradient overlay ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* ── Text content ── */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          transform: "translateY(-40%)",
          left: 0,
          right: 0,
          zIndex: 20,
          padding: "0 clamp(24px, 5vw, 80px)",
          maxWidth: "820px",
        }}
      >
        {/* 1. Label pill */}
        <AnimateIn variant="fadeOnly" delay={0}>
          <span
            style={{
              display: "inline-block",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--gold)",
              textTransform: "uppercase",
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: 20,
              padding: "6px 14px",
              marginBottom: 24,
            }}
          >
            Houston&apos;s Premier Beauty Supply
          </span>
        </AnimateIn>

        {/* 2. H1 line 1 */}
        <AnimateIn variant="fadeUp" delay={0.1}>
          <h1
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              color: "#ffffff",
              textWrap: "balance",
              margin: 0,
            }}
          >
            Where Houston
          </h1>
        </AnimateIn>

        {/* 3. H1 line 2 */}
        <AnimateIn variant="fadeUp" delay={0.2}>
          <h1
            aria-hidden="true"
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              color: "#ffffff",
              textWrap: "balance",
              margin: 0,
              marginBottom: 20,
            }}
          >
            Gets{" "}
            <span style={{ color: "var(--gold)" }}>Sharp.</span>
          </h1>
        </AnimateIn>

        {/* 4. Subline */}
        <AnimateIn variant="fadeUp" delay={0.3}>
          <p
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.82)",
              maxWidth: 520,
              lineHeight: 1.6,
              textWrap: "pretty",
              marginBottom: 36,
            }}
          >
            Professional supply store &amp; salon suite complex in Houston, TX.
          </p>
        </AnimateIn>

        {/* 5. CTA row */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 48,
          }}
        >
          <AnimateIn variant="fadeUp" delay={0.4}>
            <a
              href={SHOP_URL}
              style={{
                display: "inline-block",
                padding: "12px 28px",
                background: "var(--gold)",
                color: "#000",
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 6,
                border: "1px solid var(--gold)",
                cursor: "pointer",
                transition: "background 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.background =
                  "var(--gold-light)"
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "var(--gold-light)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.background =
                  "var(--gold)"
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "var(--gold)"
              }}
            >
              Shop Now
            </a>
          </AnimateIn>

          <AnimateIn variant="fadeUp" delay={0.45}>
            <a
              href={BOOK_PHONE}
              style={{
                display: "inline-block",
                padding: "12px 28px",
                background: "transparent",
                color: "#ffffff",
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.4)",
                cursor: "pointer",
                transition: "background 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(255,255,255,0.08)"
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(255,255,255,0.6)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent"
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(255,255,255,0.4)"
              }}
            >
              Book Appointment
            </a>
          </AnimateIn>
        </div>

        {/* 6. Stats bar */}
        <AnimateIn variant="fadeUp" delay={0.55}>
          <div
            className="scroll-hide"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              overflowX: "auto",
            }}
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  padding: "0 24px",
                  borderLeft:
                    i > 0 ? "1px solid rgba(255,255,255,0.15)" : "none",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: 1.1,
                  }}
                >
                  {stat.number}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: "var(--body)",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}
