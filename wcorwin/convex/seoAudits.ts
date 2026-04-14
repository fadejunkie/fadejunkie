import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

// ─── Internal Mutation ────────────────────────────────────────────────────────
// Called by the cron action after the SEO Engine writes results.

export const insertAudit = internalMutation({
  args: {
    projectId: v.string(),
    runAt: v.number(),
    overallScore: v.number(),
    onPage: v.number(),
    technical: v.number(),
    content: v.number(),
    local: v.number(),
    authority: v.number(),
    summary: v.string(),
    recommendations: v.array(v.string()),
    rawReport: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("seoAudits", args);
  },
});

// ─── Public Queries ───────────────────────────────────────────────────────────

// Returns the most recent audit for a given projectId, or null if none exist.
export const getLatestAudit = query({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    return await ctx.db
      .query("seoAudits")
      .withIndex("by_project_runAt", (q) => q.eq("projectId", projectId))
      .order("desc")
      .first();
  },
});

// Returns the last N audits for a given projectId (for sparkline history).
export const listAudits = query({
  args: { projectId: v.string(), limit: v.number() },
  handler: async (ctx, { projectId, limit }) => {
    return await ctx.db
      .query("seoAudits")
      .withIndex("by_project_runAt", (q) => q.eq("projectId", projectId))
      .order("desc")
      .take(limit);
  },
});

