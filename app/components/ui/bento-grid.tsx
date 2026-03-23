import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  variant = "light",
}: {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }>;
  description: string;
  href: string;
  cta: string;
  variant?: "light" | "dark";
}) => {
  const isDark = variant === "dark";

  return (
    <a
      href={href}
      className={cn(
        "group relative col-span-3 flex flex-col justify-end overflow-hidden cursor-pointer transition-all duration-300",
        isDark
          ? "hover:bg-[rgba(22,16,8,1)]"
          : "hover:shadow-[0_4px_20px_rgba(22,16,8,0.1)]",
        className,
      )}
      style={{
        borderRadius: "1rem",
        backgroundColor: isDark ? "rgba(22,16,8,0.85)" : "rgba(255,255,255,0.65)",
        border: isDark ? "1px solid rgba(255,244,234,0.07)" : "1px solid rgba(22,16,8,0.08)",
        boxShadow: isDark ? "none" : "0 2px 16px rgba(22,16,8,0.06)",
      }}
    >
      <div className="absolute inset-0">{background}</div>
      <div className="relative z-10 flex flex-col gap-2 p-6 transition-all duration-300 group-hover:-translate-y-8">
        <Icon
          className={cn(
            "h-7 w-7 origin-left transition-all duration-300 ease-in-out group-hover:scale-90",
          )}
          style={{
            color: isDark ? "rgba(255,244,234,0.3)" : "hsl(34, 22%, 50%)",
            strokeWidth: 1.5,
          }}
        />
        <h3
          style={{
            fontFamily: "var(--font-spectral), Georgia, 'Times New Roman', serif",
            fontSize: "1.125rem",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            color: isDark ? "#fff4ea" : "hsl(0, 0%, 8%)",
          }}
        >
          {name}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-inter), -apple-system, sans-serif",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            color: isDark ? "rgba(255,244,234,0.38)" : "hsl(34, 18%, 38%)",
            maxWidth: "28rem",
          }}
        >
          {description}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 z-10 flex w-full translate-y-8 items-center p-6 pt-0 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            fontFamily: "var(--font-inter), -apple-system, sans-serif",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: isDark ? "#fff4ea" : "hsl(34, 42%, 44%)",
          }}
        >
          {cta}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-0 transition-all duration-300",
          isDark ? "group-hover:bg-white/[.03]" : "group-hover:bg-black/[.01]",
        )}
        style={{ borderRadius: "1rem" }}
      />
    </a>
  );
};

export { BentoCard, BentoGrid };
