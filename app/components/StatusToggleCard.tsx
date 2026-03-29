"use client";

import { cn } from "@/lib/utils";
import type { UserPath, StatusToggleConfig } from "@/convex/statusConfig";
import type { Id } from "@/convex/_generated/dataModel";
import { RotateCcw } from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────

export function toToggleLabel(key: string): string {
  return key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatExpiry(expiresAt: number): string {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  if (days >= 1) return `${days}d left`;
  if (hours >= 1) return `${hours}h left`;
  if (mins >= 1) return `${mins}m left`;
  return "Expires soon";
}

// ── ToggleSwitch ──────────────────────────────────────────────────────────────

interface ToggleSwitchProps {
  on: boolean;
  onChange: () => void;
  disabled?: boolean;
}

function ToggleSwitch({ on, onChange, disabled }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onChange}
      disabled={disabled}
      className={cn(
        "relative w-9 h-5 rounded-full shrink-0",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2",
        on
          ? "bg-foreground"
          : "bg-muted border border-border hover:border-foreground/40",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 w-4 h-4 rounded-full",
          "transition-transform duration-200",
          on
            ? "translate-x-[18px] bg-background"
            : "translate-x-0.5 bg-foreground/30"
        )}
      />
    </button>
  );
}

// ── ActiveStatus type ─────────────────────────────────────────────────────────

export interface ActiveStatus {
  _id: Id<"statuses">;
  expiresAt: number;
  refreshCount?: number;
  isActive: boolean;
}

// ── StatusToggleCard ──────────────────────────────────────────────────────────

interface StatusToggleCardProps {
  toggleKey: string;
  path: UserPath;
  config: StatusToggleConfig;
  status?: ActiveStatus;
  isPending?: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onRefresh: () => void;
}

export default function StatusToggleCard({
  toggleKey,
  config,
  status,
  isPending,
  onActivate,
  onDeactivate,
  onRefresh,
}: StatusToggleCardProps) {
  const isActive = status?.isActive === true;
  const label = toToggleLabel(toggleKey);

  function handleToggle() {
    if (isPending) return;
    if (isActive) {
      onDeactivate();
    } else {
      onActivate();
    }
  }

  return (
    <div
      className={cn(
        "rounded-xl p-4 transition-all duration-150",
        isActive
          ? "border-2 border-foreground bg-card"
          : "border border-border bg-card hover:border-foreground/30",
        isPending && "opacity-50 pointer-events-none"
      )}
    >
      <div className="flex items-center justify-between gap-3 min-h-[44px]">
        {/* ── Left: label + meta ── */}
        <div className="flex-1 min-w-0">
          <p className="font-display text-[13px] font-semibold text-foreground leading-snug">
            {label}
          </p>

          {isActive && status ? (
            /* Active state — expiry timer + refresh */
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
              <span className="font-mono text-[11px] text-foreground">
                {formatExpiry(status.expiresAt)}
              </span>
              <span className="text-border select-none">&middot;</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRefresh();
                }}
                className={cn(
                  "flex items-center gap-1 font-sans",
                  "text-[10px] text-muted-foreground hover:text-foreground",
                  "transition-colors duration-150",
                )}
                aria-label="Refresh expiration timer"
              >
                <RotateCcw size={9} strokeWidth={2.5} />
                Refresh
              </button>
              {(status.refreshCount ?? 0) > 0 && (
                <span className="font-mono text-[10px] text-muted-foreground/50">
                  ×{status.refreshCount}
                </span>
              )}
            </div>
          ) : (
            /* Inactive state — duration hint */
            <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">
              up to {config.default_days}d
            </p>
          )}
        </div>

        {/* ── Right: toggle switch ── */}
        <ToggleSwitch
          on={isActive}
          onChange={handleToggle}
          disabled={isPending}
        />
      </div>
    </div>
  );
}
