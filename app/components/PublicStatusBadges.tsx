export interface StatusGroup {
  path: string;
  pathLabel: string;
  statuses: Array<{ toggleKey: string; label: string; expiresAt: number }>;
}

interface PublicStatusBadgesProps {
  summary: StatusGroup[] | null | undefined;
  compact?: boolean;
}

export default function PublicStatusBadges({
  summary,
  compact = false,
}: PublicStatusBadgesProps) {
  if (!summary || summary.length === 0) return null;

  const allStatuses = summary.flatMap((g) => g.statuses);
  if (allStatuses.length === 0) return null;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {allStatuses.map((s) => (
          <span
            key={s.toggleKey}
            style={{
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: "0.625rem",
              color: "var(--foreground)",
              opacity: 0.6,
              border: "1px solid color-mix(in oklch, var(--foreground) 18%, transparent)",
              borderRadius: "2px",
              padding: "1px 5px",
              letterSpacing: "0.02em",
            }}
          >
            {s.label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {summary.map((group) => (
        <div key={group.path}>
          <p
            style={{
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: "0.5625rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--muted-foreground)",
              marginBottom: "0.375rem",
            }}
          >
            {group.pathLabel}
          </p>
          <div className="flex flex-wrap gap-1">
            {group.statuses.map((s) => (
              <span
                key={s.toggleKey}
                style={{
                  fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                  fontSize: "0.625rem",
                  color: "var(--foreground)",
                  border: "1px solid color-mix(in oklch, var(--foreground) 18%, transparent)",
                  borderRadius: "2px",
                  padding: "2px 6px",
                  letterSpacing: "0.02em",
                }}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
