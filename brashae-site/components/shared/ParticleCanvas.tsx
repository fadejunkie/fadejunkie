"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function makeParticle(w: number, h: number): Particle {
  return {
    x: randomBetween(0, w),
    y: randomBetween(0, h),
    vx: randomBetween(-0.3, 0.3),
    vy: randomBetween(-0.3, 0.3),
    radius: 1.5,
  }
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let particles: Particle[] = []
    let animId: number
    let w = 0
    let h = 0

    function resize() {
      if (!canvas) return
      const parent = canvas.parentElement
      if (!parent) return
      w = parent.clientWidth
      h = parent.clientHeight
      canvas.width = w
      canvas.height = h

      const count = w < 768 ? 30 : 60
      // Preserve existing particles count, reinitialize if needed
      if (particles.length !== count) {
        particles = Array.from({ length: count }, () => makeParticle(w, h))
      } else {
        // Clamp existing particles inside new bounds
        particles.forEach((p) => {
          p.x = Math.min(p.x, w)
          p.y = Math.min(p.y, h)
        })
      }
    }

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)

      // Connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.strokeStyle = "rgba(201,168,76,0.15)"
            ctx.lineWidth = 0.5
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // Particles
      particles.forEach((p) => {
        // Update position
        p.x += p.vx
        p.y += p.vy

        // Bounce off edges
        if (p.x <= p.radius || p.x >= w - p.radius) {
          p.vx *= -1
          p.x = Math.max(p.radius, Math.min(w - p.radius, p.x))
        }
        if (p.y <= p.radius || p.y >= h - p.radius) {
          p.vy *= -1
          p.y = Math.max(p.radius, Math.min(h - p.radius, p.y))
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(201,168,76,0.6)"
        ctx.fill()
      })
    }

    function loop() {
      if (document.visibilityState !== "hidden") {
        draw()
      }
      animId = requestAnimationFrame(loop)
    }

    // Initial setup
    resize()
    loop()

    // ResizeObserver on parent
    const observer = new ResizeObserver(() => resize())
    const parent = canvas.parentElement
    if (parent) observer.observe(parent)

    // Visibility change
    function onVisibility() {
      // Loop already checks visibilityState — no extra action needed
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      cancelAnimationFrame(animId)
      observer.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  )
}
