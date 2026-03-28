"use client";

import { useState } from "react";
import DiscoveryFeed from "@/components/DiscoveryFeed";
import MatchesFeed from "@/components/MatchesFeed";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "browse" | "matches";

const TABS: { id: Tab; label: string }[] = [
  { id: "browse", label: "browse" },
  { id: "matches", label: "matches" },
];

// ── DiscoverTabs ──────────────────────────────────────────────────────────────

export default function DiscoverTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("browse");

  return (
    <div className="space-y-5">
      {/* ── Tab bar ── */}
      <div className="flex gap-6 border-b border-border">
        {TABS.map(({ id, label }) => {
          const isActive = id === activeTab;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={[
                "pb-2.5 -mb-px text-sm transition-colors duration-150 font-sans",
                isActive
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground/70 border-b-2 border-transparent",
              ].join(" ")}
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ── */}
      {activeTab === "browse" ? <DiscoveryFeed /> : <MatchesFeed />}
    </div>
  );
}
