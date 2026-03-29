"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { USER_PATHS, STATUS_TOGGLES } from "@/convex/statusConfig";
import type { UserPath } from "@/convex/statusConfig";
import { cn } from "@/lib/utils";
import { Star, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";

// ── Path metadata ──────────────────────────────────────────────────────────────

const PATH_META: Record<UserPath, { name: string; description: string }> = {
  barber: {
    name: "Barber",
    description: "Licensed pros who cut, fade, and style clients for a living.",
  },
  student: {
    name: "Student",
    description: "Cosmetology or barber school students building their craft.",
  },
  shop: {
    name: "Shop Owner",
    description: "Barbershop owners running their space and managing their team.",
  },
  school: {
    name: "School",
    description: "Cosmetology and barber schools shaping the next generation.",
  },
  vendor: {
    name: "Vendor",
    description: "Product and equipment suppliers serving the barber community.",
  },
  event_coordinator: {
    name: "Event Coordinator",
    description: "Organizers of competitions, showcases, and community events.",
  },
  client: {
    name: "Client",
    description: "Anyone who loves a fresh cut and supports the culture.",
  },
};

// ── PathCard ───────────────────────────────────────────────────────────────────

interface PathCardProps {
  path: UserPath;
  index: number;
  isSelected: boolean;
  isPrimary: boolean;
  isPending: boolean;
  onToggle: () => void;
  onSetPrimary: (e: React.MouseEvent) => void;
}

function PathCard({
  path,
  index,
  isSelected,
  isPrimary,
  isPending,
  onToggle,
  onSetPrimary,
}: PathCardProps) {
  const meta = PATH_META[path];
  const toggleCount = Object.keys(STATUS_TOGGLES[path]).length;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`${meta.name} path${isSelected ? ", selected" : ""}${isPrimary ? ", primary" : ""}`}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className={cn(
        "path-card relative flex flex-col gap-3 rounded-xl p-5 select-none",
        "outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2",
        isPrimary
          ? "dark-card bg-foreground text-background border-2 border-foreground"
          : isSelected
            ? "bg-card border-2 border-foreground"
            : "bg-card border border-border hover:border-foreground/40",
        isPending && "opacity-50 pointer-events-none"
      )}
    >
      {/* ── Top row: index + star ── */}
      <div className="flex items-center justify-between min-h-[18px]">
        <span
          className={cn(
            "font-mono text-[10px] tracking-[0.12em] uppercase",
            isPrimary ? "text-background/35" : "text-muted-foreground/50"
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {isSelected && (
          <button
            type="button"
            aria-label={isPrimary ? "Primary path" : "Set as primary path"}
            onClick={onSetPrimary}
            className={cn(
              "rounded p-0.5 -m-0.5 transition-opacity duration-150",
              isPrimary
                ? "opacity-100 cursor-default"
                : "opacity-35 hover:opacity-90"
            )}
          >
            <Star
              size={12}
              className={
                isPrimary
                  ? "text-background fill-background"
                  : "text-foreground"
              }
              fill={isPrimary ? "currentColor" : "none"}
            />
          </button>
        )}
      </div>

      {/* ── Path name + description ── */}
      <div className="flex-1 space-y-1.5">
        {/* h3 inherits: League Spartan, lowercase, -0.03em tracking from globals.css */}
        <h3
          className={cn(
            "text-sm font-semibold leading-tight",
            isPrimary ? "text-background" : "text-foreground"
          )}
        >
          {meta.name}
        </h3>
        <p
          className={cn(
            "font-body text-[11px] leading-[1.55]",
            isPrimary ? "text-background/60" : "text-muted-foreground"
          )}
        >
          {meta.description}
        </p>
      </div>

      {/* ── Footer: toggle count + status badge ── */}
      <div
        className={cn(
          "flex items-center justify-between pt-2.5 border-t",
          "font-mono text-[10px] tracking-[0.06em] uppercase",
          isPrimary
            ? "border-background/15 text-background/35"
            : "border-border text-muted-foreground/60"
        )}
      >
        <span>
          {toggleCount} toggle{toggleCount !== 1 ? "s" : ""}
        </span>

        {isSelected && (
          <span
            className={cn(
              "font-mono text-[10px] tracking-[0.06em]",
              isPrimary ? "text-background/55" : "text-foreground/45"
            )}
          >
            {isPrimary ? "primary" : "active"}
          </span>
        )}
      </div>
    </div>
  );
}

// ── PathSelector (exported) ────────────────────────────────────────────────────

export default function PathSelector() {
  const myPaths = useQuery(api.userPaths.getMyPaths);
  const doSelect = useMutation(api.userPaths.selectPath);
  const doRemove = useMutation(api.userPaths.removePath);
  const doSetPrimary = useMutation(api.userPaths.setPrimaryPath);

  const [open, setOpen] = useState(true);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  // Auto-collapse once data loads if user already has paths set up
  useEffect(() => {
    if (myPaths !== undefined && !hasInitialized.current) {
      hasInitialized.current = true;
      if (myPaths.length > 0) setOpen(false);
    }
  }, [myPaths]);

  const selectedSet = new Set(myPaths?.map((p) => p.path) ?? []);
  const primaryPath = myPaths?.find((p) => p.isPrimary)?.path;
  const selectedPaths = myPaths ?? [];

  // ── Collapsed header summary ──
  const summaryText =
    selectedPaths.length === 0
      ? "choose your role to unlock status toggles"
      : selectedPaths
          .slice(0, 3)
          .map((p) => PATH_META[p.path as UserPath]?.name ?? p.path)
          .join(" · ")
          .toLowerCase() +
        (selectedPaths.length > 3 ? ` +${selectedPaths.length - 3} more` : "");

  async function handleToggle(path: UserPath) {
    if (pendingPath) return;
    setPendingPath(path);
    try {
      if (selectedSet.has(path)) {
        await doRemove({ path });
      } else {
        await doSelect({ path });
      }
    } catch (err) {
      console.error("Path toggle failed:", err);
    } finally {
      setPendingPath(null);
    }
  }

  async function handleSetPrimary(path: UserPath, e: React.MouseEvent) {
    e.stopPropagation();
    if (pendingPath || primaryPath === path) return;
    setPendingPath(path);
    try {
      await doSetPrimary({ path });
    } catch (err) {
      console.error("Set primary failed:", err);
    } finally {
      setPendingPath(null);
    }
  }

  return (
    <Card className="rounded-xl shadow-sm" style={{ borderRadius: '0.75rem' }}>
      {/* ── Collapsible header ── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="path-selector-content"
        className="w-full flex items-center justify-between px-6 pt-5 pb-5 text-left"
      >
        <div className="space-y-0.5 min-w-0 flex-1 mr-4">
          {/* h2 inherits: League Spartan, lowercase, -0.04em tracking from globals.css */}
          <h2 className="text-base font-semibold text-foreground">
            your paths
          </h2>
          {myPaths !== undefined && (
            <p className="font-body text-xs text-muted-foreground truncate">
              {summaryText}
            </p>
          )}
        </div>
        <ChevronDown
          size={15}
          className={cn(
            "text-muted-foreground shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* ── Expandable grid ── */}
      {open && (
        <div
          id="path-selector-content"
          className="px-6 pb-6 space-y-4 border-t border-border pt-5"
        >
          {myPaths === undefined ? (
            <div className="flex items-center justify-center h-16">
              <span className="font-body text-sm text-muted-foreground">
                Loading...
              </span>
            </div>
          ) : (
            <>
              {myPaths.length === 0 && (
                <p className="font-body text-xs text-muted-foreground leading-relaxed">
                  Pick one or more roles. The first you select becomes your
                  primary — tap the{" "}
                  <Star
                    size={10}
                    className="inline-block align-middle mb-0.5"
                  />{" "}
                  to change it anytime.
                </p>
              )}

              <div className="grid paths-grid gap-3">
                {USER_PATHS.map((path, i) => (
                  <PathCard
                    key={path}
                    path={path}
                    index={i}
                    isSelected={selectedSet.has(path)}
                    isPrimary={primaryPath === path}
                    isPending={pendingPath === path}
                    onToggle={() => handleToggle(path)}
                    onSetPrimary={(e) => handleSetPrimary(path, e)}
                  />
                ))}
              </div>

              {myPaths.length > 0 && (
                <p className="font-body text-[11px] text-muted-foreground/70 text-center leading-relaxed">
                  {myPaths.length === 1
                    ? "Add more paths if you wear multiple hats."
                    : `${myPaths.length} paths active.`}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </Card>
  );
}
