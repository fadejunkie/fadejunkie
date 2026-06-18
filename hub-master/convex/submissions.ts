import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getSubmissions = query({
  args: { clientSlug: v.string() },
  handler: async (ctx, { clientSlug }) => {
    return await ctx.db
      .query("submissions")
      .withIndex("by_client", (q) => q.eq("clientSlug", clientSlug))
      .order("desc")
      .collect();
  },
});

export const addSubmission = mutation({
  args: {
    clientSlug: v.string(),
    type: v.string(),
    payload: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("submissions", {
      ...args,
      submittedAt: Date.now(),
    });
  },
});
