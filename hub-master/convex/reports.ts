import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getReports = query({
  args: { clientSlug: v.string(), projectId: v.string() },
  handler: async (ctx, { clientSlug, projectId }) => {
    return await ctx.db
      .query("reports")
      .withIndex("by_client_project", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId)
      )
      .order("desc")
      .collect();
  },
});

export const saveReport = mutation({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
    taskKey: v.optional(v.string()),
    title: v.string(),
    content: v.string(),
    type: v.union(v.literal("task"), v.literal("master")),
    generatedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reports", {
      ...args,
      generatedAt: Date.now(),
    });
  },
});

export const deleteReport = mutation({
  args: { reportId: v.id("reports") },
  handler: async (ctx, { reportId }) => {
    await ctx.db.delete(reportId);
  },
});
