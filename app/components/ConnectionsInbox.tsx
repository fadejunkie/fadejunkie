"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Inbox } from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

function humanizeKey(key: string): string {
  return key.replace(/_/g, " ");
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86_400_000);
  if (days > 7)
    return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(diff / 3_600_000);
  if (hours > 0) return `${hours}h ago`;
  const mins = Math.floor(diff / 60_000);
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// ── ConnectionsInbox ──────────────────────────────────────────────────────────

export default function ConnectionsInbox() {
  const connections = useQuery(api.statuses.getMyConnectionRequests);
  const markSeen = useMutation(api.statuses.markConnectionSeen);
  const hasMarkedRef = useRef(false);

  // Auto-mark all pending as seen on first render with data
  useEffect(() => {
    if (!connections || hasMarkedRef.current) return;
    const pending = connections.filter((c) => c.status === "pending");
    if (pending.length === 0) return;
    hasMarkedRef.current = true;
    for (const c of pending) {
      markSeen({ connectionId: c._id as Id<"statusConnections"> }).catch(() => {});
    }
  }, [connections, markSeen]);

  // Unseen count (pending — before the effect clears them on first render)
  const unseenCount =
    connections?.filter((c) => c.status === "pending").length ?? 0;

  // ── Loading ──
  if (connections === undefined) {
    return (
      <div className="flex items-center h-16">
        <span className="font-body text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Section header ── */}
      <div className="flex items-center gap-2">
        <p className="font-display text-base font-semibold text-foreground">
          connections
        </p>

        {/* Unseen badge */}
        {unseenCount > 0 && (
          <span
            className="font-mono flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-foreground text-background text-[9px] font-semibold tabular-nums leading-none"
            aria-label={`${unseenCount} new`}
          >
            {unseenCount > 9 ? "9+" : unseenCount}
          </span>
        )}

        <Inbox
          className="text-muted-foreground/30 ml-auto"
          style={{ width: 15, height: 15 }}
        />
      </div>

      {/* ── Empty state ── */}
      {connections.length === 0 ? (
        <div className="flex flex-col gap-1.5">
          <p className="font-body text-sm text-muted-foreground">
            no connections yet
          </p>
          <p className="font-body text-xs text-muted-foreground/60">
            activate statuses to get discovered &mdash;{" "}
            <Link
              href="#status-toggles"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              set your status
            </Link>
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/40">
          {connections.map((c) => {
            const isPending = c.status === "pending";
            const name = c.barberName ?? "Anonymous";
            const initials = getInitials(c.barberName);
            const toggleLabel = c.statusToggleKey
              ? humanizeKey(c.statusToggleKey)
              : "your status";

            return (
              <div
                key={c._id}
                className={`py-4 flex gap-3 transition-colors ${
                  isPending ? "opacity-100" : "opacity-80"
                }`}
              >
                {/* Pending accent bar */}
                <div
                  className={`w-0.5 self-stretch rounded-full shrink-0 ${
                    isPending ? "bg-foreground" : "bg-transparent"
                  }`}
                />

                {/* Avatar */}
                <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-muted flex items-center justify-center mt-0.5">
                  {c.barberAvatarUrl ? (
                    <Image
                      src={c.barberAvatarUrl}
                      alt={name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="font-mono text-[11px] font-semibold text-muted-foreground select-none">
                      {initials}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* Name + context */}
                  <p className="font-body text-sm text-foreground leading-snug">
                    {c.barberSlug ? (
                      <Link
                        href={`/barber/${c.barberSlug}`}
                        className="font-display font-semibold hover:underline underline-offset-2 transition-colors"
                      >
                        {name}
                      </Link>
                    ) : (
                      <strong className="font-display font-semibold">
                        {name}
                      </strong>
                    )}{" "}
                    <span className="text-muted-foreground">
                      interested in your{" "}
                      <strong className="text-foreground font-medium">{toggleLabel}</strong>
                    </span>
                  </p>

                  {/* Optional note */}
                  {c.note && (
                    <blockquote className="font-body border-l-2 border-border pl-3 text-sm text-muted-foreground leading-relaxed">
                      {c.note}
                    </blockquote>
                  )}

                  {/* Timestamp */}
                  <p className="font-mono text-[10px] text-muted-foreground/50 tabular-nums">
                    {relativeTime(c.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
