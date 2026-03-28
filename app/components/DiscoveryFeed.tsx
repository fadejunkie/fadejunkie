"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DiscoveryCard from "@/components/DiscoveryCard";

// ── DiscoveryFeed ─────────────────────────────────────────────────────────────

export default function DiscoveryFeed() {
  const paths = useQuery(api.statuses.getDiscoveryPaths);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  // Default to the first (highest-count) path once loaded
  useEffect(() => {
    if (paths && paths.length > 0 && selectedPath === null) {
      setSelectedPath(paths[0].path);
    }
  }, [paths, selectedPath]);

  const statuses = useQuery(
    api.statuses.discoverStatuses,
    selectedPath ? { path: selectedPath } : "skip"
  );

  // ── Loading ──
  if (paths === undefined) {
    return (
      <div className="flex items-center justify-center h-32">
        <span
          className="text-sm text-muted-foreground"
          style={{ fontFamily: "var(--font-body), 'Courier Prime', monospace" }}
        >
          Loading...
        </span>
      </div>
    );
  }

  // ── Empty ecosystem ──
  if (paths.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2 text-center">
        <p
          className="text-sm text-muted-foreground"
          style={{ fontFamily: "var(--font-body), 'Courier Prime', monospace" }}
        >
          no active statuses in the ecosystem yet
        </p>
      </div>
    );
  }

  const activePath = paths.find((p) => p.path === selectedPath);

  return (
    <div className="space-y-5">
      {/* ── Path filter tabs ── */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none -mx-0.5 px-0.5">
        {paths.map(({ path, label, count }) => {
          const isActive = path === selectedPath;
          return (
            <button
              key={path}
              type="button"
              onClick={() => setSelectedPath(path)}
              className={
                isActive
                  ? "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 bg-foreground text-background font-sans"
                  : "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 text-muted-foreground border border-border hover:text-foreground hover:border-foreground/30 bg-transparent font-sans"
              }
            >
              <span>{label}</span>
              <span
                className={
                  isActive
                    ? "text-[10px] opacity-70"
                    : "text-[10px] opacity-50"
                }
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Results ── */}
      {statuses === undefined ? (
        <div className="flex items-center justify-center h-24">
          <span
            className="text-sm text-muted-foreground"
            style={{
              fontFamily: "var(--font-body), 'Courier Prime', monospace",
            }}
          >
            Loading...
          </span>
        </div>
      ) : statuses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 gap-1.5 text-center">
          <p
            className="text-sm text-muted-foreground"
            style={{
              fontFamily: "var(--font-body), 'Courier Prime', monospace",
            }}
          >
            no active {activePath?.label.toLowerCase() ?? selectedPath} statuses
            right now
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {statuses.map((status) => (
            <DiscoveryCard
              key={status._id}
              status={status}
              pathLabel={activePath?.label ?? status.path}
            />
          ))}
        </div>
      )}
    </div>
  );
}
