import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getGbpAssets = query({
  args: { clientSlug: v.string(), projectId: v.string() },
  handler: async (ctx, { clientSlug, projectId }) => {
    return await ctx.db
      .query("gbpAssets")
      .withIndex("by_client_project", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId)
      )
      .first();
  },
});

export const saveGbpAssets = mutation({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
    hours: v.optional(v.string()),
    photosLink: v.optional(v.string()),
    photosNote: v.optional(v.string()),
    yelpEmail: v.optional(v.string()),
    yelpPassword: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { clientSlug, projectId, ...fields } = args;
    const now = Date.now();
    const existing = await ctx.db
      .query("gbpAssets")
      .withIndex("by_client_project", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId)
      )
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { ...fields, updatedAt: now });
    } else {
      await ctx.db.insert("gbpAssets", {
        clientSlug,
        projectId,
        ...fields,
        updatedAt: now,
      });
    }
  },
});
