"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Link2, UserPlus, Check } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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

export function humanizeKey(key: string): string {
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

// ── ConnectSheet ──────────────────────────────────────────────────────────────
// Mounted only when open — keeps mutation hook off the page until needed.

interface ConnectSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: DiscoveryStatus;
  pathLabel: string;
  toggleLabel: string;
  displayName: string;
  initials: string;
  onSent: () => void;
}

function ConnectSheet({
  open,
  onOpenChange,
  status,
  pathLabel,
  toggleLabel,
  displayName,
  initials,
  onSent,
}: ConnectSheetProps) {
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const connectOnStatus = useMutation(api.statuses.connectOnStatus);

  const MAX = 280;
  const remaining = MAX - note.length;
  // Disable Send if "already sent" error — user can't retry
  const alreadySent = error?.includes("already sent") ?? false;

  function handleClose() {
    if (sending) return;
    setNote("");
    setError(null);
    onOpenChange(false);
  }

  async function handleSend() {
    if (sending || alreadySent) return;
    setSending(true);
    setError(null);
    try {
      await connectOnStatus({
        statusId: status._id as Id<"statuses">,
        note: note.trim() || undefined,
      });
      setNote("");
      onOpenChange(false);
      onSent();
    } catch (err) {
      const msg =
        (err as { data?: string })?.data ??
        (err instanceof Error ? err.message : "Something went wrong");
      if (msg.includes("Already sent")) {
        setError("You\u2019ve already sent a request for this status");
      } else if (msg.toLowerCase().includes("no longer active")) {
        setError("This status is no longer active");
      } else {
        setError(msg);
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl px-5 pb-8 pt-6 max-h-[90svh] overflow-y-auto"
      >
        {/* ── Header ── */}
        <SheetHeader className="mb-5 text-left space-y-0.5">
          <SheetTitle className="font-display text-base font-semibold text-foreground leading-tight">
            connect
          </SheetTitle>
          <SheetDescription className="font-body text-sm text-muted-foreground">
            connecting about{" "}
            <strong className="text-foreground font-medium">{toggleLabel}</strong>
          </SheetDescription>
        </SheetHeader>

        {/* ── Target user ── */}
        <div className="flex items-center gap-2.5 mb-5 py-3 border-y border-border">
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-muted flex items-center justify-center">
            {status.barberAvatarUrl ? (
              <Image
                src={status.barberAvatarUrl}
                alt={displayName}
                fill
                className="object-cover"
              />
            ) : (
              <span className="font-mono text-[11px] font-semibold text-muted-foreground select-none">
                {initials}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
            <span className="font-display text-sm font-semibold text-foreground truncate">
              {displayName}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/70 border border-border rounded-full px-2 py-0.5 shrink-0">
              {pathLabel}
            </span>
          </div>
        </div>

        {/* ── Note textarea ── */}
        <div className="mb-4 space-y-1.5">
          <textarea
            value={note}
            onChange={(e) => {
              if (e.target.value.length <= MAX) setNote(e.target.value);
            }}
            placeholder="Add a short note..."
            rows={4}
            className="font-body w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:border-foreground/30 transition-colors"
            disabled={sending}
          />
          <p
            className={`font-mono text-[10px] text-right tabular-nums transition-colors ${
              remaining < 30 ? "text-foreground/60" : "text-muted-foreground/30"
            }`}
          >
            {remaining}
          </p>
        </div>

        {/* ── Inline error ── */}
        {error && (
          <p className="font-body text-xs text-destructive mb-4 leading-relaxed">
            {error}
          </p>
        )}

        {/* ── Actions ── */}
        <div className="flex gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 font-sans"
            onClick={handleClose}
            disabled={sending}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1 font-sans"
            onClick={handleSend}
            disabled={sending || alreadySent}
          >
            {sending ? "Sending\u2026" : "Send"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── DiscoveryCard ─────────────────────────────────────────────────────────────

interface DiscoveryCardProps {
  status: DiscoveryStatus;
  pathLabel: string;
  showMatchIndicator?: boolean;
}

export default function DiscoveryCard({
  status,
  pathLabel,
  showMatchIndicator,
}: DiscoveryCardProps) {
  const { toggleKey, expiresAt, barberName, barberSlug, barberAvatarUrl } = status;

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const sentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const displayName = barberName ?? "Anonymous";
  const initials = getInitials(barberName);
  const countdown = formatCountdown(expiresAt);
  const toggleLabel = humanizeKey(toggleKey);

  function handleSent() {
    setSent(true);
    if (sentTimerRef.current) clearTimeout(sentTimerRef.current);
    sentTimerRef.current = setTimeout(() => setSent(false), 4000);
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-4 transition-all duration-150 hover:border-foreground/25 hover:shadow-sm">
        {/* ── Top row: avatar + name + slug ── */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-muted flex items-center justify-center">
            {barberAvatarUrl ? (
              <Image
                src={barberAvatarUrl}
                alt={displayName}
                fill
                className="object-cover"
              />
            ) : (
              <span className="font-mono text-[11px] font-semibold text-muted-foreground select-none">
                {initials}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {barberSlug ? (
              <Link
                href={`/barber/${barberSlug}`}
                className="font-display text-sm font-semibold text-foreground leading-tight hover:underline underline-offset-2 transition-colors block truncate"
              >
                {displayName}
              </Link>
            ) : (
              <span className="font-display text-sm font-semibold text-foreground leading-tight block truncate">
                {displayName}
              </span>
            )}
            {barberSlug && (
              <span className="font-mono text-[10px] text-muted-foreground/60 truncate block">
                @{barberSlug}
              </span>
            )}
          </div>
        </div>

        {/* ── Toggle label ── */}
        <p className="font-mono text-xs text-foreground/80 mb-3 leading-snug">
          {toggleLabel}
        </p>

        {/* ── Bottom row: countdown · path pill · connect ── */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: match indicator + countdown */}
          <div className="flex items-center gap-1.5">
            {showMatchIndicator && (
              <Link2
                className="text-muted-foreground/40 shrink-0"
                style={{ width: 14, height: 14 }}
              />
            )}
            <span className="font-mono text-[11px] text-muted-foreground">
              {countdown}
            </span>
          </div>

          {/* Right: path pill + connect */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-[10px] text-muted-foreground/70 border border-border rounded-full px-2 py-0.5">
              {pathLabel}
            </span>

            {sent ? (
              <span className="font-mono flex items-center gap-0.5 text-[11px] text-muted-foreground/50">
                <Check style={{ width: 11, height: 11 }} />
                sent
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="font-sans flex items-center gap-1 text-[11px] text-muted-foreground/45 hover:text-foreground transition-colors duration-150"
                aria-label={`Connect with ${displayName} about ${toggleLabel}`}
              >
                <UserPlus style={{ width: 12, height: 12 }} />
                connect
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sheet — always rendered so the close animation runs correctly */}
      <ConnectSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        status={status}
        pathLabel={pathLabel}
        toggleLabel={toggleLabel}
        displayName={displayName}
        initials={initials}
        onSent={handleSent}
      />
    </>
  );
}
