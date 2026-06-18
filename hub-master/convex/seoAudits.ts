import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const getLatestAudit = query({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
  },
  handler: async (ctx, { clientSlug, projectId }) => {
    return await ctx.db
      .query("seoAudits")
      .withIndex("by_client_project_runAt", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId)
      )
      .order("desc")
      .first();
  },
});

export const listAudits = query({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
  },
  handler: async (ctx, { clientSlug, projectId }) => {
    return await ctx.db
      .query("seoAudits")
      .withIndex("by_client_project_runAt", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId)
      )
      .order("desc")
      .collect();
  },
});

export const insertAudit = mutation({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
    overallScore: v.number(),
    onPage: v.number(),
    technical: v.number(),
    content: v.number(),
    local: v.number(),
    authority: v.number(),
    summary: v.string(),
    recommendations: v.array(v.string()),
    rawReport: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("seoAudits", {
      ...args,
      runAt: Date.now(),
    });
  },
});

// Internal version for cron-triggered audits
export const insertAuditInternal = internalMutation({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
    overallScore: v.number(),
    onPage: v.number(),
    technical: v.number(),
    content: v.number(),
    local: v.number(),
    authority: v.number(),
    summary: v.string(),
    recommendations: v.array(v.string()),
    rawReport: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("seoAudits", {
      ...args,
      runAt: Date.now(),
    });
  },
});
