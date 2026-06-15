import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getDiscovery = query({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
  },
  handler: async (ctx, { clientSlug, projectId }) => {
    return await ctx.db
      .query("discovery")
      .withIndex("by_client_project", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId)
      )
      .first();
  },
});

export const saveDiscovery = mutation({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
    responses: v.string(),
  },
  handler: async (ctx, { clientSlug, projectId, responses }) => {
    const existing = await ctx.db
      .query("discovery")
      .withIndex("by_client_project", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { responses, submittedAt: Date.now() });
    } else {
      await ctx.db.insert("discovery", {
        clientSlug,
        projectId,
        responses,
        submittedAt: Date.now(),
      });
    }
  },
});
