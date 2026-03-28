"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DiscoveryCard, { DiscoveryStatus } from "@/components/DiscoveryCard";

// ── Helpers ───────────────────────────────────────────────────────────────────

const PATH_LABELS: Record<string, string> = {
  barber: "Barbers",
  student: "Students",
  shop: "Shops",
  school: "Schools",
  vendor: "Vendors",
  event_coordinator: "Event Coordinators",
  client: "Clients",
};

function humanizeKeyLower(key: string): string {
  return key.replace(/_/g, " ").toLowerCase();
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

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

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {[0, 1].map((i) => (
        <div key={i} className="space-y-3">
          <div className="h-3 bg-muted animate-pulse rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── MatchesFeed ───────────────────────────────────────────────────────────────

export default function MatchesFeed() {
  const matchGroups = useQuery(api.statuses.getComplementaryMatches);
  const myStatuses = useQuery(api.statuses.getMyStatuses);

  // Loading
  if (matchGroups === undefined || myStatuses === undefined) {
    return <LoadingSkeleton />;
  }

  // Distinguish empty states
  const now = Date.now();
  const hasActiveStatuses = myStatuses.some((s) => s.isActive && s.expiresAt > now);

  if (matchGroups.length === 0) {
    if (!hasActiveStatuses) {
      return (
        <div className="flex flex-col items-center justify-center h-44 gap-3 text-center">
          <p
            className="text-sm text-muted-foreground max-w-xs leading-relaxed"
            style={{ fontFamily: "var(--font-body), 'Courier Prime', monospace" }}
          >
            activate some statuses to see who you match with
          </p>
          <Link
            href="/status"
            className="text-xs text-foreground underline underline-offset-3 hover:text-muted-foreground transition-colors"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            go to statuses &rarr;
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-44 gap-2 text-center">
        <p
          className="text-sm text-muted-foreground max-w-xs leading-relaxed"
          style={{ fontFamily: "var(--font-body), 'Courier Prime', monospace" }}
        >
          no matches right now &mdash; check back as more people activate statuses
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {matchGroups.map((group) => (
        <div key={group.myStatus._id} className="space-y-3">
          {/* ── Section header ── */}
          <p
            className="text-xs text-muted-foreground"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            because you&apos;re{" "}
            <strong
              className="text-foreground font-medium"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              {humanizeKeyLower(group.myStatus.toggleKey)}
            </strong>
          </p>

          {/* ── Match grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {group.matches.map((match) => {
              const status: DiscoveryStatus = {
                _id: match._id,
                toggleKey: match.toggleKey,
                path: match.path,
                activatedAt: match.activatedAt,
                expiresAt: match.expiresAt,
                barberName: match.barberName,
                barberSlug: match.barberSlug,
                barberAvatarUrl: match.barberAvatarUrl,
                defaultDays: 0,
                maxDays: 0,
              };
              return (
                <DiscoveryCard
                  key={match._id}
                  status={status}
                  pathLabel={PATH_LABELS[match.path] ?? match.path}
                  showMatchIndicator
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
