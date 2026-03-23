"use client";

import { forwardRef, ComponentPropsWithoutRef } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

const AvatarRoot = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
));
AvatarRoot.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

/* ── Convenience wrapper (same API as before) ─────────────── */
interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}

function Avatar({ src, name, size = 40, className = "" }: AvatarProps) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <AvatarRoot
      style={{ width: size, height: size, minWidth: size }}
      className={cn("border border-border", className)}
    >
      {src && <AvatarImage src={src} alt={name ?? "avatar"} />}
      <AvatarFallback style={{ fontSize: size < 32 ? 10 : size < 48 ? 13 : 16 }}>
        {initials}
      </AvatarFallback>
    </AvatarRoot>
  );
}

export { AvatarRoot, AvatarImage, AvatarFallback, Avatar };
export default Avatar;
