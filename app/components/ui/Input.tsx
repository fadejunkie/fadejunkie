import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * FadeJunkie Input / Textarea
 * ──────────────────────────────────────────────────────────────────────────
 * Design tokens:
 *   --input         → default border color (gray)
 *   --foreground    → focused border color (black / white in dark)
 *   --background    → fill
 *   --muted-foreground → placeholder
 *   --ring          → focus ring (accessible fallback)
 *
 * Apple-grade treatment:
 *   - Border transitions from muted → foreground on focus (no ring-offset halo)
 *   - Subtle border-radius (--radius-md ≈ 0.5rem) keeps it sharp, not pill
 *   - Smooth 160ms transition on border-color and box-shadow
 *   - Hover darkens border slightly to signal interactivity
 */

// Allow onChange to accept either HTMLInputElement or HTMLTextAreaElement
// so a shared handler can be passed to both Input and Textarea
type SharedChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

const inputBase = [
  "flex w-full font-sans text-sm",
  "bg-background text-foreground",
  "border border-input rounded-lg",
  "px-3 py-2",
  "placeholder:text-muted-foreground",
  // Smooth border-color transition on hover/focus
  "transition-[border-color,box-shadow] duration-150 ease-in-out",
  // Hover — slightly darker border
  "hover:border-foreground/30",
  // Focus — full foreground border + subtle depth shadow, no ring halo
  "focus:outline-none focus:border-foreground/60",
  "focus:shadow-focus-ring",
  // Disabled
  "disabled:cursor-not-allowed disabled:opacity-50",
  // File input styling
  "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
].join(" ")

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string
  onChange?: (e: SharedChangeEvent) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label: _label, onChange, ...props }, ref) => (
    <input
      type={type}
      data-slot="input"
      className={cn(inputBase, "h-10", className)}
      ref={ref}
      onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
      {...props}
    />
  ),
)
Input.displayName = "Input"

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label?: string
  onChange?: (e: SharedChangeEvent) => void
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label: _label, onChange, ...props }, ref) => (
    <textarea
      data-slot="textarea"
      className={cn(inputBase, "min-h-[80px] resize-y", className)}
      ref={ref}
      onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
      {...props}
    />
  ),
)
Textarea.displayName = "Textarea"

export { Input, Textarea }
