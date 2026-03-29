"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// ── Helpers ───────────────────────────────────────────────────────────────────

const PATH_LABELS: Record<string, string> = {
  barber: "Barber",
  student: "Student",
  shop: "Shop Owner",
  school: "School",
  vendor: "Vendor",
  event_coordinator: "Event Coordinator",
  client: "Client",
};

function humanizeToggleKey(key: string): string {
  return key.replace(/_/g, " ");
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86_400_000);
  if (days > 7) {
    return new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(diff / 3_600_000);
  if (hours > 0) return `${hours}h ago`;
  const mins = Math.floor(diff / 60_000);
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}

function formatDuration(activatedAt: number, archivedAt: number): string {
  const ms = archivedAt - activatedAt;
  const days = Math.floor(ms / 86_400_000);
  if (days >= 1) return `${days}d`;
  const hours = Math.floor(ms / 3_600_000);
  if (hours >= 1) return `${hours}h`;
  return "<1h";
}

// ── StatusHistory ─────────────────────────────────────────────────────────────

export default function StatusHistory() {
  const archived = useQuery(api.statuses.getMyArchivedStatuses);

  // ── Loading ──
  if (archived === undefined) {
    return (
      <div className="flex items-center h-16">
        <span className="font-body text-sm text-muted-foreground">
          Loading...
        </span>
      </div>
    );
  }

  // ── Group by path (preserving archivedAt-desc order within each group) ──
  const groups = new Map<string, typeof archived>();
  for (const s of archived) {
    if (!groups.has(s.path)) groups.set(s.path, []);
    groups.get(s.path)!.push(s);
  }

  return (
    <div className="space-y-5">
      {/* ── Section header ── */}
      <p className="font-display text-base font-semibold text-foreground">
        history
      </p>

      {/* ── Empty state ── */}
      {archived.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">
          no history yet
        </p>
      ) : (
        <div className="space-y-7">
          {[...groups.entries()].map(([path, statuses]) => (
            <div key={path}>
              {/* Path eyebrow label */}
              <p className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.08em] uppercase mb-2.5">
                {PATH_LABELS[path] ?? path}
              </p>

              {/* Status rows */}
              <div className="divide-y divide-border/40">
                {statuses.map((s) => {
                  const archivedTs = s.archivedAt ?? s.activatedAt;
                  const duration = formatDuration(s.activatedAt, archivedTs);

                  return (
                    <div
                      key={s._id}
                      className="flex items-center justify-between py-2.5 gap-4"
                    >
                      {/* Toggle label */}
                      <span className="font-body text-sm text-muted-foreground flex-1 min-w-0 truncate">
                        {humanizeToggleKey(s.toggleKey)}
                      </span>

                      {/* Timestamp + duration badge */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-[10px] text-muted-foreground/60">
                          {relativeTime(archivedTs)}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground/50 border border-border rounded px-1.5 py-0.5 tabular-nums">
                          {duration}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
