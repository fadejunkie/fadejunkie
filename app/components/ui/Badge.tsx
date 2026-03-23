import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center font-semibold transition-colors",
  {
    variants: {
      variant: {
        /* category label style — UPPERCASE, olive, tracking wide */
        default:     "text-[10px] uppercase tracking-widest px-0 py-0",
        secondary:   "rounded-full px-2.5 py-0.5 text-xs bg-secondary text-secondary-foreground border border-border",
        destructive: "rounded-full px-2.5 py-0.5 text-xs bg-destructive text-destructive-foreground",
        outline:     "rounded-full px-2.5 py-0.5 text-xs border border-border bg-transparent text-muted-foreground",
        muted:       "text-[10px] uppercase tracking-widest px-0 py-0",
      },
    },
    defaultVariants: { variant: "muted" },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, style, ...props }: BadgeProps) {
  const isLabel = !variant || variant === "default" || variant === "muted";
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      style={isLabel ? { color: "var(--link)", ...style } : style}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
export default Badge;
