import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

// Client-facing: getDeliverables (hub displays them)
// Ops-only: addDeliverable, removeDeliverable → internalMutation (SEC-9)
// Access writes via HTTP action at /api/deliverables/* with Bearer token.
// addDeliverablePublic / removeDeliverablePublic kept for backwards-compat
// with existing `npx convex run` CLI calls — migrate to HTTP API then remove.

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

// Ops-only: deliverables are added by Anthony/agents, not clients
export const addDeliverable = internalMutation({
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

// Ops-only
export const removeDeliverable = internalMutation({
  args: { id: v.id("deliverables") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// TODO: remove these public variants once all callers use the HTTP API
export const addDeliverablePublic = mutation({
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

export const removeDeliverablePublic = mutation({
  args: { id: v.id("deliverables") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
