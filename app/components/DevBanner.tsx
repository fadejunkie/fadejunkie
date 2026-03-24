"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function DevBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 9999,
        backgroundColor: "rgba(22,16,8,0.96)",
        color: "rgba(255,244,234,0.70)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.5rem 3rem",
        fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
        fontSize: "0.6875rem",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        lineHeight: 1.4,
        gap: "0.625rem",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 5,
          height: 5,
          borderRadius: "50%",
          backgroundColor: "hsl(34, 60%, 55%)",
          flexShrink: 0,
          animation: "fj-banner-pulse 2s ease-in-out infinite",
        }}
      />
      <a
        href="/signin?mode=signup"
        style={{ color: "rgba(255,244,234,0.70)", textDecoration: "none", transition: "color 0.15s ease" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff4ea")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,244,234,0.70)")}
      >
        Shop Websites just launched — build yours free →
      </a>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss banner"
        style={{
          position: "absolute",
          right: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          color: "rgba(255,244,234,0.50)",
          cursor: "pointer",
          padding: "0.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "color 0.15s ease",
          lineHeight: 0,
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,244,234,0.90)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,244,234,0.50)")}
      >
        <X size={11} strokeWidth={2} />
      </button>
      <style>{`
        @keyframes fj-banner-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
