import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getDirectionPick = query({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
  },
  handler: async (ctx, { clientSlug, projectId }) => {
    return await ctx.db
      .query("directionPicks")
      .withIndex("by_client_project", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId)
      )
      .first();
  },
});

export const saveDirectionPick = mutation({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
    pick: v.string(),
  },
  handler: async (ctx, { clientSlug, projectId, pick }) => {
    const existing = await ctx.db
      .query("directionPicks")
      .withIndex("by_client_project", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { pick, pickedAt: Date.now() });
    } else {
      await ctx.db.insert("directionPicks", {
        clientSlug,
        projectId,
        pick,
        pickedAt: Date.now(),
      });
    }
  },
});
