'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// TODO: Replace with dark-styled map when Google Maps API key obtained

const hoursData = [
  { days: 'Monday – Tuesday', hours: '10:00 AM – 6:00 PM', dayNums: [1, 2] },
  { days: 'Wednesday – Friday', hours: '8:00 AM – 7:00 PM', dayNums: [3, 4, 5] },
  { days: 'Saturday', hours: '8:00 AM – 6:00 PM', dayNums: [6] },
  { days: 'Sunday', hours: 'Closed', dayNums: [0] },
]

const fadeLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.52, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

export default function LocationHours() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const todayDay = new Date().getDay() // 0=Sun, 1=Mon…6=Sat

  return (
    <section
      id="location"
      style={{
        background: 'var(--canvas)',
        padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)',
        borderTop: '1px solid var(--hairline)',
      }}
    >
      {/* Section heading */}
      <motion.h2
        ref={ref}
        variants={fadeUp}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
          fontWeight: 700,
          color: 'var(--on-dark)',
          textWrap: 'balance',
          marginBottom: 48,
        }}
      >
        Find Us in Houston
      </motion.h2>

      <div className="location-grid">
        {/* Left: Map */}
        <motion.div
          custom={0}
          variants={fadeLeft}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="location-map-wrap"
          style={{ borderRadius: 8, overflow: 'hidden', minHeight: 400 }}
        >
          <iframe
            src="https://maps.google.com/maps?q=11902+S+Gessner+Rd+Houston+TX+77071&output=embed"
            width="100%"
            height="400"
            style={{ border: 'none', display: 'block' }}
            loading="lazy"
            title="Brashae's Barber Beauty Supply — 11902 S Gessner Rd, Houston TX 77071"
          />
        </motion.div>

        {/* Right: Info card */}
        <motion.div
          custom={0.1}
          variants={fadeLeft}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{
            background: 'var(--surface-card)',
            borderRadius: 8,
            padding: 32,
            border: '1px solid var(--hairline)',
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--gold)',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            HOURS &amp; LOCATION
          </p>

          {/* Hours table */}
          <div>
            {hoursData.map((row, i) => {
              const isToday = row.dayNums.includes(todayDay)
              const isClosed = row.hours === 'Closed'
              return (
                <div
                  key={row.days}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: isToday ? '10px 0 10px 12px' : '10px 0',
                    borderBottom: i < hoursData.length - 1 ? '1px solid var(--hairline)' : 'none',
                    borderLeft: isToday ? '3px solid var(--gold)' : '3px solid transparent',
                    background: isToday ? 'var(--surface-elevated)' : 'transparent',
                    borderRadius: isToday ? 4 : 0,
                    marginLeft: isToday ? -3 : 0,
                    transition: 'background 0.2s',
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--on-dark)',
                    }}
                  >
                    {row.days}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: isClosed ? 'var(--muted)' : 'var(--body)',
                    }}
                  >
                    {row.hours}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Address block */}
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ color: 'var(--gold)', fontSize: 16, lineHeight: 1.5 }}>📍</span>
              <p style={{ fontSize: 14, fontWeight: 400, color: 'var(--body)', lineHeight: 1.6 }}>
                11902 S Gessner Rd, Houston, TX 77071
              </p>
            </div>
            <p style={{ fontSize: 14, fontWeight: 400, color: 'var(--body)', paddingLeft: 24 }}>
              713-541-2279 (main)
            </p>
            <p style={{ fontSize: 14, fontWeight: 400, color: 'var(--muted)', paddingLeft: 24 }}>
              832-314-1668 (alt)
            </p>
          </div>

          {/* CTA */}
          <a
            href="https://maps.google.com?q=11902+S+Gessner+Rd+Houston+TX+77071"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-directions"
            style={{
              display: 'inline-block',
              marginTop: 24,
              padding: '12px 24px',
              background: 'var(--gold)',
              color: '#000',
              fontSize: 14,
              fontWeight: 600,
              borderRadius: 6,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Get Directions →
          </a>
        </motion.div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        .location-grid {
          display: grid;
          grid-template-columns: 55fr 45fr;
          gap: clamp(32px, 5vw, 56px);
          align-items: start;
        }
        .btn-directions:hover {
          background: var(--gold-light) !important;
        }
        @media (max-width: 767px) {
          .location-grid {
            grid-template-columns: 1fr !important;
          }
          .location-map-wrap iframe {
            height: 280px !important;
          }
          .location-map-wrap {
            min-height: 280px !important;
          }
        }
      `}</style>
    </section>
  )
}
