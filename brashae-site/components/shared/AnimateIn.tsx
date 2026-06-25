"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion, Variants } from "framer-motion"

type AnimateInVariant = "fadeUp" | "fadeLeft" | "fadeOnly" | "scaleUp"

interface AnimateInProps {
  children: React.ReactNode
  variant?: AnimateInVariant
  delay?: number
  className?: string
  style?: React.CSSProperties
}

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const fullVariants: Record<AnimateInVariant, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE },
    },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -24 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: EASE },
    },
  },
  fadeOnly: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, ease: EASE },
    },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.45, ease: EASE },
    },
  },
}

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: EASE },
  },
}

export default function AnimateIn({
  children,
  variant = "fadeUp",
  delay = 0,
  className,
  style,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const inView = useInView(ref, {
    once: true,
    margin: "-40px 0px",
    amount: 0.12,
  })

  const variants = shouldReduceMotion ? reducedVariants : fullVariants[variant]

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={delay ? { delay } : undefined}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
