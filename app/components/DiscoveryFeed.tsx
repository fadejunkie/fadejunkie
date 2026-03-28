"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DiscoveryCard from "@/components/DiscoveryCard";

// ── Skeleton card (matches DiscoveryCard layout) ──────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-muted animate-pulse shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
          <div className="h-2.5 bg-muted animate-pulse rounded w-1/3" />
        </div>
      </div>
      <div className="h-2.5 bg-muted animate-pulse rounded w-4/5" />
      <div className="flex items-center justify-between">
        <div className="h-2.5 bg-muted animate-pulse rounded w-12" />
        <div className="h-5 bg-muted animate-pulse rounded-full w-16" />
      </div>
    </div>
  );
}

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

  // ── Loading (paths not yet fetched) ──
  if (paths === undefined) {
    return (
      <div className="space-y-5">
        {/* Skeleton tab strip */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {[80, 64, 96, 72].map((w, i) => (
            <div
              key={i}
              className="h-7 bg-muted animate-pulse rounded-full shrink-0"
              style={{ width: w }}
            />
          ))}
        </div>
        {/* Skeleton cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
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
