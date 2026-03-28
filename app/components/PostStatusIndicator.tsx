"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import PublicStatusBadges from "@/components/PublicStatusBadges";

interface PostStatusIndicatorProps {
  authorId: Id<"users">;
}

export default function PostStatusIndicator({ authorId }: PostStatusIndicatorProps) {
  const summary = useQuery(api.statuses.getPublicStatusSummary, { userId: authorId });

  // undefined = loading, null/[] = no statuses
  if (!summary || summary.length === 0) return null;

  return <PublicStatusBadges summary={summary} compact />;
}
