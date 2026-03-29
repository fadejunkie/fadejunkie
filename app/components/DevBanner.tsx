"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const SESSION_KEY = "fj-dev-banner-dismissed";

export default function DevBanner() {
  const [dismissed, setDismissed] = useState(false);

  // Check sessionStorage after mount — avoids SSR hydration mismatch
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div
      role="banner"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        backgroundColor: "var(--foreground)",
        borderBottom: "1px solid color-mix(in oklch, var(--background) 6%, transparent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.5625rem 3.5rem",
      }}
    >
      <span
        className="font-mono"
        style={{
          fontSize: "0.6875rem",
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--background)",
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        We&rsquo;re building this live. Pull up a chair.
      </span>

      <button
        onClick={handleDismiss}
        aria-label="Dismiss banner"
        style={{
          position: "absolute",
          right: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          color: "color-mix(in oklch, var(--background) 45%, transparent)",
          cursor: "pointer",
          padding: "0.3125rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 0,
          transition: "color 0.15s ease",
          borderRadius: "0.25rem",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color = "var(--background)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color =
            "color-mix(in oklch, var(--background) 45%, transparent)")
        }
      >
        <X size={11} strokeWidth={2} />
      </button>
    </div>
  );
}
