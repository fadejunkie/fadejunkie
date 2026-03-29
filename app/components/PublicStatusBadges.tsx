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
            className="font-mono text-[0.625rem] text-foreground/60 border border-foreground/[18%] rounded-[2px] px-[5px] py-px tracking-[0.02em]"
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
          <p className="font-mono text-[9px] font-medium tracking-[0.12em] uppercase text-muted-foreground mb-1.5">
            {group.pathLabel}
          </p>
          <div className="flex flex-wrap gap-1">
            {group.statuses.map((s) => (
              <span
                key={s.toggleKey}
                className="font-mono text-[0.625rem] text-foreground border border-foreground/[18%] rounded-[2px] px-1.5 py-0.5 tracking-[0.02em]"
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
