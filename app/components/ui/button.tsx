import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * FadeJunkie Button
 * ─────────────────────────────────────────────────────────────────────────────
 * Design tokens this component derives from:
 *   --primary / --primary-foreground   → default variant
 *   --secondary / --secondary-foreground → secondary variant
 *   --accent / --accent-foreground     → ghost hover
 *   --destructive                      → destructive variant
 *   --ring                             → focus ring
 *
 * The `data-slot="button"` attribute lets globals.css drive
 * hover lift + active depress without extra class noise.
 *
 * Variants
 *   default     — jet-black pill, white text  (primary CTA)
 *   outline     — transparent, black border   (secondary CTA)
 *   secondary   — light gray pill             (utility)
 *   ghost       — no bg/border, hover fill    (inline actions)
 *   destructive — red pill                    (danger actions)
 *   link        — text-only, underline hover  (inline links)
 *
 * Sizes
 *   sm      — compact  (32px h, 14px px)
 *   default — standard (40px h, 28px px)
 *   lg      — prominent (48px h, 32px px)
 *   icon    — square   (40×40)
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-sans font-semibold tracking-tight",
    "rounded-full",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
    "cursor-pointer select-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/85 active:bg-primary/95",
        outline:
          "border border-foreground/20 bg-background text-foreground hover:bg-accent hover:border-foreground/30",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        ghost:
          "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/88",
        link: "bg-transparent text-foreground underline-offset-4 hover:underline p-0 h-auto rounded-none",
      },
      size: {
        sm:      "h-8 px-3.5 text-xs gap-1.5",
        default: "h-10 px-7 text-sm",
        lg:      "h-12 px-8 text-sm",
        icon:    "h-10 w-10 p-0 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** Shows a spinner and disables interaction */
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, disabled, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              aria-hidden="true"
              className="h-[1em] w-[1em] animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-80"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </Comp>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
