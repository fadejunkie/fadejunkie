import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCredentials = query({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
  },
  handler: async (ctx, { clientSlug, projectId }) => {
    return await ctx.db
      .query("credentials")
      .withIndex("by_client_project", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId)
      )
      .first();
  },
});

export const saveCredentials = mutation({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
    data: v.string(), // JSON-stringified credential fields
  },
  handler: async (ctx, { clientSlug, projectId, data }) => {
    const existing = await ctx.db
      .query("credentials")
      .withIndex("by_client_project", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { data, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("credentials", {
        clientSlug,
        projectId,
        data,
        updatedAt: Date.now(),
      });
    }
  },
});
