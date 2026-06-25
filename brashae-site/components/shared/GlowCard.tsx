"use client"

import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  href?: string
}

export default function GlowCard({
  children,
  className,
  style,
  onClick,
  href,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [spotlight, setSpotlight] = useState({ x: "50%", y: "50%", visible: false })

  // Spring-based tilt
  const rawRotateX = useMotionValue(0)
  const rawRotateY = useMotionValue(0)
  const rotateX = useSpring(rawRotateX, { stiffness: 300, damping: 30 })
  const rotateY = useSpring(rawRotateY, { stiffness: 300, damping: 30 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2

    // Tilt: ±8deg
    rawRotateY.set(((x - cx) / cx) * 8)
    rawRotateX.set(-((y - cy) / cy) * 8)

    // Spotlight position as percentage
    setSpotlight({
      x: `${(x / rect.width) * 100}%`,
      y: `${(y / rect.height) * 100}%`,
      visible: true,
    })
  }

  function handleMouseLeave() {
    rawRotateX.set(0)
    rawRotateY.set(0)
    setSpotlight((s) => ({ ...s, visible: false }))
  }

  const cardContent = (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
      style={{
        position: "relative",
        border: "1px solid var(--hairline)",
        borderRadius: 8,
        overflow: "hidden",
        cursor: href || onClick ? "pointer" : "default",
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
        transition: "border-color 0.2s ease",
        ...style,
      }}
      whileHover={{ borderColor: "rgba(201,168,76,0.35)" }}
    >
      {/* Spotlight radial gradient */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          opacity: spotlight.visible ? 1 : 0,
          transition: "opacity 0.2s ease",
          background: `radial-gradient(600px circle at ${spotlight.x} ${spotlight.y}, rgba(201,168,76,0.08), transparent 80%)`,
        }}
      />
      {/* Children sit above spotlight */}
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </motion.div>
  )

  if (href) {
    return (
      <a href={href} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
        {cardContent}
      </a>
    )
  }

  return cardContent
}
