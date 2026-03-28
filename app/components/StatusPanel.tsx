"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { STATUS_TOGGLES } from "@/convex/statusConfig";
import type { UserPath, StatusToggleConfig } from "@/convex/statusConfig";
import type { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/Card";
import StatusToggleCard from "@/components/StatusToggleCard";
import Link from "next/link";

// ── Path display names ────────────────────────────────────────────────────────

const PATH_LABELS: Record<UserPath, string> = {
  barber: "Barber",
  student: "Student",
  shop: "Shop Owner",
  school: "School",
  vendor: "Vendor",
  event_coordinator: "Event Coordinator",
  client: "Client",
};

// ── StatusPanel ───────────────────────────────────────────────────────────────

export default function StatusPanel() {
  const myPaths = useQuery(api.userPaths.getMyPaths);
  const myStatuses = useQuery(api.statuses.getMyStatuses);
  const doActivate = useMutation(api.statuses.activateStatus);
  const doDeactivate = useMutation(api.statuses.deactivateStatus);
  const doRefresh = useMutation(api.statuses.refreshStatus);

  const [pendingKey, setPendingKey] = useState<string | null>(null);

  // Build active status map: toggleKey → status doc
  const activeMap = useMemo(() => {
    const map = new Map<
      string,
      { _id: Id<"statuses">; expiresAt: number; refreshCount?: number; isActive: boolean }
    >();
    myStatuses
      ?.filter((s) => s.isActive)
      .forEach((s) => map.set(s.toggleKey, s));
    return map;
  }, [myStatuses]);

  // ── Loading state ──
  if (myPaths === undefined || myStatuses === undefined) {
    return (
      <div className="space-y-8">
        {[0, 1].map((i) => (
          <div key={i}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-3 w-12 bg-muted animate-pulse rounded" />
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {[0, 1, 2, 3].map((j) => (
                <div key={j} className="rounded-xl p-4 border border-border bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-3.5 w-28 bg-muted animate-pulse rounded" />
                    <div className="w-9 h-5 bg-muted animate-pulse rounded-full shrink-0" />
                  </div>
                  <div className="h-2.5 w-16 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Empty state: no paths selected ──
  if (myPaths.length === 0) {
    return (
      <Card className="rounded-xl p-8 text-center">
        <p
          className="text-xl font-semibold text-foreground mb-2"
          style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
        >
          no paths selected
        </p>
        <p className="font-body text-sm text-muted-foreground mb-6 max-w-xs mx-auto leading-relaxed">
          Select a role on your profile to unlock your status toggles.
        </p>
        <Link
          href="/profile"
          className="inline-flex items-center font-body text-sm text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
        >
          Go to Profile &rarr; choose a path
        </Link>
      </Card>
    );
  }

  // ── Mutation handlers ──
  async function handleActivate(path: UserPath, toggleKey: string) {
    if (pendingKey) return;
    setPendingKey(`${path}:${toggleKey}`);
    try {
      await doActivate({ path, toggleKey });
    } catch (err) {
      console.error("Activate failed:", err);
    } finally {
      setPendingKey(null);
    }
  }

  async function handleDeactivate(
    statusId: Id<"statuses">,
    toggleKey: string,
    path: string
  ) {
    if (pendingKey) return;
    setPendingKey(`${path}:${toggleKey}`);
    try {
      await doDeactivate({ statusId });
    } catch (err) {
      console.error("Deactivate failed:", err);
    } finally {
      setPendingKey(null);
    }
  }

  async function handleRefresh(
    statusId: Id<"statuses">,
    toggleKey: string,
    path: string
  ) {
    if (pendingKey) return;
    setPendingKey(`${path}:${toggleKey}`);
    try {
      await doRefresh({ statusId });
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setPendingKey(null);
    }
  }

  return (
    <div className="space-y-8">
      {myPaths.map(({ path, isPrimary }) => {
        const p = path as UserPath;
        const toggleEntries = Object.entries(
          STATUS_TOGGLES[p] as Record<string, StatusToggleConfig>
        );

        // Sort: active toggles first, then alphabetical
        const sorted = [...toggleEntries].sort(([keyA], [keyB]) => {
          const aActive = activeMap.has(keyA);
          const bActive = activeMap.has(keyB);
          if (aActive && !bActive) return -1;
          if (!aActive && bActive) return 1;
          return keyA.localeCompare(keyB);
        });

        const activeCount = sorted.filter(([key]) => activeMap.has(key)).length;

        return (
          <div key={path}>
            {/* ── Path group header ── */}
            <div className="flex items-center gap-3 mb-4">
              <p
                className="text-base font-semibold text-foreground"
                style={{
                  fontFamily: "var(--font-heading), system-ui, sans-serif",
                  textTransform: "none",
                }}
              >
                {PATH_LABELS[p]}
              </p>

              {isPrimary && (
                <span
                  className="text-[10px] text-muted-foreground/60 tracking-[0.08em] uppercase"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  primary
                </span>
              )}

              {activeCount > 0 && (
                <span
                  className="text-[10px] text-foreground/45"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  {activeCount}/{sorted.length} on
                </span>
              )}
            </div>

            {/* ── Toggle card grid ── */}
            <div className="grid gap-2.5 sm:grid-cols-2">
              {sorted.map(([toggleKey, config]) => {
                const status = activeMap.get(toggleKey);
                const isPending = pendingKey === `${p}:${toggleKey}`;

                return (
                  <StatusToggleCard
                    key={toggleKey}
                    toggleKey={toggleKey}
                    path={p}
                    config={config}
                    status={status}
                    isPending={isPending}
                    onActivate={() => handleActivate(p, toggleKey)}
                    onDeactivate={() =>
                      status
                        ? handleDeactivate(status._id, toggleKey, p)
                        : undefined
                    }
                    onRefresh={() =>
                      status
                        ? handleRefresh(status._id, toggleKey, p)
                        : undefined
                    }
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
