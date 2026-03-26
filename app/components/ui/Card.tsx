import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border bg-card text-card-foreground", className)}
      style={{ borderRadius: "var(--radius-3xl, 1.375rem)", ...style }}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-5", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("font-display text-base font-semibold leading-none tracking-[-0.02em] lowercase", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-5 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;
