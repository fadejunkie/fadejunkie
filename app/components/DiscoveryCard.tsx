"use client";

import Link from "next/link";
import Image from "next/image";
import { Link2 } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DiscoveryStatus {
  _id: string;
  toggleKey: string;
  path: string;
  activatedAt: number;
  expiresAt: number;
  barberName: string | null;
  barberSlug: string | null;
  barberAvatarUrl: string | null;
  defaultDays: number;
  maxDays: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function humanizeKey(key: string): string {
  return key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatCountdown(expiresAt: number): string {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return "expired";
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  if (days >= 1) return `${days}d left`;
  if (hours >= 1) return `${hours}h left`;
  return "< 1 day";
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// ── DiscoveryCard ─────────────────────────────────────────────────────────────

interface DiscoveryCardProps {
  status: DiscoveryStatus;
  pathLabel: string;
  showMatchIndicator?: boolean;
}

export default function DiscoveryCard({ status, pathLabel, showMatchIndicator }: DiscoveryCardProps) {
  const {
    toggleKey,
    expiresAt,
    barberName,
    barberSlug,
    barberAvatarUrl,
  } = status;

  const displayName = barberName ?? "Anonymous";
  const initials = getInitials(barberName);
  const countdown = formatCountdown(expiresAt);
  const toggleLabel = humanizeKey(toggleKey);

  return (
    <div
      className="rounded-xl border border-border bg-card p-4 transition-all duration-150 hover:border-foreground/25 hover:shadow-sm"
    >
      {/* ── Top row: avatar + name + slug ── */}
      <div className="flex items-center gap-2.5 mb-3">
        {/* Avatar */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-muted flex items-center justify-center">
          {barberAvatarUrl ? (
            <Image
              src={barberAvatarUrl}
              alt={displayName}
              fill
              className="object-cover"
            />
          ) : (
            <span
              className="text-[11px] font-semibold text-muted-foreground select-none"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              {initials}
            </span>
          )}
        </div>

        {/* Name + slug */}
        <div className="flex-1 min-w-0">
          {barberSlug ? (
            <Link
              href={`/barber/${barberSlug}`}
              className="text-sm font-semibold text-foreground leading-tight hover:underline underline-offset-2 transition-colors block truncate"
              style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
            >
              {displayName}
            </Link>
          ) : (
            <span
              className="text-sm font-semibold text-foreground leading-tight block truncate"
              style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
            >
              {displayName}
            </span>
          )}
          {barberSlug && (
            <span
              className="text-[10px] text-muted-foreground/60 truncate block"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              @{barberSlug}
            </span>
          )}
        </div>
      </div>

      {/* ── Middle: toggle label ── */}
      <p
        className="text-xs text-foreground/80 mb-3 leading-snug"
        style={{ fontFamily: "var(--font-mono), monospace" }}
      >
        {toggleLabel}
      </p>

      {/* ── Bottom row: countdown + path pill ── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {showMatchIndicator && (
            <Link2
              className="text-muted-foreground/40 shrink-0"
              style={{ width: 14, height: 14 }}
            />
          )}
          <span
            className="text-[11px] text-muted-foreground"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            {countdown}
          </span>
        </div>
        <span
          className="text-[10px] text-muted-foreground/70 border border-border rounded-full px-2 py-0.5 shrink-0"
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          {pathLabel}
        </span>
      </div>
    </div>
  );
}
