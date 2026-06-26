"use client"

// Meet the Professionals — homepage preview (max 6 featured)
// No booking link on homepage cards — that's on /professionals page

import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const professionals = [
  {
    name: "Clarence H.",
    business: "Cuttt Game",
    suite: "Suite 2",
    specialty: "Barber",
    photo: "/images/team/clarence-h-cuttt-game-suite2.jpg",
  },
  {
    name: "Taylor R.",
    business: "The Royale Touch",
    suite: "Suite 3",
    specialty: "Nail Tech",
    photo: null,
  },
  {
    name: "Donielle P.",
    business: "Donielle Hair",
    suite: "Suite 5–6",
    specialty: "Stylist",
    photo: "/images/team/donielle-p-donielle-hair-suite5-6.jpg",
  },
  {
    name: "Jamie W.",
    business: "J. Warren Styles",
    suite: "Suite 4",
    specialty: "Stylist",
    photo: "/images/team/jamie-w-warren-styles-suite4.jpg",
  },
  {
    name: "Darquis K.",
    business: "Flawless Palace",
    suite: "Suite 31",
    specialty: "Barber",
    photo: "/images/team/darquis-k-flawless-palace-suite31.png",
  },
  {
    name: "Cassandra M.",
    business: null,
    suite: "Suite 17/24",
    specialty: "Stylist",
    photo: "/images/team/cassandra-m-suite17-24.jpg",
  },
]

const scaleUp = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.48, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export default function MeetProfessionals() {
  const gridRef = useRef<HTMLDivElement>(null)
  const inView = useInView(gridRef, { once: true, margin: "-80px" })

  return (
    <section
      style={{
        background: "var(--canvas)",
        borderTop: "1px solid var(--hairline)",
      }}
    >
      {/* Editorial header image */}
      <div
        style={{
          width: "100%",
          height: 360,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* AI placeholder — image may show "Classic Barbershop" sign; overlays handle it */}
        <Image
          src="/images/ai-1.png"
          alt="Barber crew in blue uniforms at Brashae's"
          fill
          style={{ objectFit: "cover", objectPosition: "center top" }}
          sizes="100vw"
          priority
        />
        {/* Dark overlay — mutes any background text in the image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
          }}
        />
        {/* Bottom gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 50%, #000000 100%)",
          }}
        />
        {/* Heading — absolute positioned bottom of image */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "0 clamp(24px, 5vw, 80px) 32px",
            zIndex: 10,
          }}
        >
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
              fontWeight: 700,
              color: "#ffffff",
              textWrap: "balance",
              lineHeight: 1.2,
            }}
          >
            Meet the Professionals
          </h2>
          <p
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: "rgba(255,255,255,0.82)",
              marginTop: 6,
            }}
          >
            30+ independent suite tenants. Your neighborhood experts.
          </p>
        </div>
      </div>

      {/* Cards grid */}
      <div
        style={{
          padding: "clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px)",
        }}
      >
        <div ref={gridRef} className="professionals-grid">
          {professionals.map((pro, i) => (
            <motion.div
              key={pro.name}
              custom={i}
              variants={scaleUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Photo or placeholder */}
              {pro.photo ? (
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid rgba(201,168,76,0.3)",
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  <Image
                    src={pro.photo}
                    alt={pro.name}
                    fill
                    style={{ objectFit: "cover", objectPosition: "top" }}
                    sizes="120px"
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "var(--surface-card)",
                    border: "2px solid rgba(201,168,76,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="/brashae-logo.svg"
                    alt=""
                    aria-hidden="true"
                    width={80}
                    height={80}
                    style={{ width: '60%', height: '60%', objectFit: 'contain', opacity: 0.4, display: 'block' }}
                  />
                </div>
              )}

              {/* Name */}
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--on-dark)",
                  marginTop: 12,
                  textAlign: "center",
                }}
              >
                {pro.name}
              </p>

              {/* Business */}
              {pro.business && (
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: "var(--body)",
                    textAlign: "center",
                    marginTop: 2,
                  }}
                >
                  {pro.business}
                </p>
              )}

              {/* Suite badge */}
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--gold)",
                  textTransform: "uppercase",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                {pro.suite}
              </p>

              {/* Specialty tag */}
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 400,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  textAlign: "center",
                  marginTop: 2,
                }}
              >
                {pro.specialty}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link
            href="/professionals"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--gold)",
              textDecoration: "none",
            }}
          >
            Meet All Our Professionals →
          </Link>
        </div>
      </div>

      {/* Responsive grid styles */}
      <style>{`
        .professionals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 32px 24px;
        }
        @media (max-width: 767px) {
          .professionals-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 28px 16px;
          }
        }
      `}</style>
    </section>
  )
}
