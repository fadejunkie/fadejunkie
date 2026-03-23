import * as React from "react"

import { cn } from "@/lib/utils"

// Allow onChange to accept either HTMLInputElement or HTMLTextAreaElement
// so a shared handler can be passed to both Input and Textarea
type SharedChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string
  onChange?: (e: SharedChangeEvent) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label: _label, onChange, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label?: string
  onChange?: (e: SharedChangeEvent) => void
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label: _label, onChange, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Input, Textarea }
