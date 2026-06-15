import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getDeliverables = query({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
    milestoneKey: v.optional(v.string()),
  },
  handler: async (ctx, { clientSlug, projectId, milestoneKey }) => {
    if (milestoneKey) {
      return await ctx.db
        .query("deliverables")
        .withIndex("by_client_project_milestone", (q) =>
          q.eq("clientSlug", clientSlug).eq("projectId", projectId).eq("milestoneKey", milestoneKey)
        )
        .collect();
    }
    return await ctx.db
      .query("deliverables")
      .withIndex("by_client", (q) => q.eq("clientSlug", clientSlug))
      .filter((q) => q.eq(q.field("projectId"), projectId))
      .collect();
  },
});

export const addDeliverable = mutation({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
    milestoneKey: v.string(),
    label: v.string(),
    url: v.optional(v.string()),
    type: v.string(),
    markdownContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("deliverables", {
      ...args,
      addedAt: Date.now(),
    });
  },
});

export const removeDeliverable = mutation({
  args: { id: v.id("deliverables") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
