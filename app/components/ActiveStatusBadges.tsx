"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toToggleLabel } from "@/components/StatusToggleCard";
import Link from "next/link";

export default function ActiveStatusBadges() {
  const myStatuses = useQuery(api.statuses.getMyStatuses);

  const active = myStatuses?.filter((s) => s.isActive) ?? [];

  if (myStatuses === undefined) return null;
  if (active.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {active.map((s) => (
        <Link
          key={s._id}
          href="/status"
          className="group inline-flex items-center gap-1.5 border border-foreground/20 rounded-full px-2.5 py-1 hover:border-foreground/60 transition-colors duration-150"
          title={`Active on your ${s.path} path`}
        >
          {/* Active dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 group-hover:bg-foreground shrink-0 transition-colors duration-150" />
          <span
            className="font-mono text-[10px] text-foreground/60 group-hover:text-foreground transition-colors duration-150 leading-none"
          >
            {toToggleLabel(s.toggleKey)}
          </span>
        </Link>
      ))}
    </div>
  );
}
