import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const submit = mutation({
  args: {
    clientSlug: v.string(),
    section: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("feedback", {
      ...args,
      submittedAt: Date.now(),
      resolved: false,
    });
  },
});

export const list = query({
  args: { clientSlug: v.string() },
  handler: async (ctx, { clientSlug }) => {
    return await ctx.db
      .query("feedback")
      .withIndex("by_client", (q) => q.eq("clientSlug", clientSlug))
      .order("desc")
      .collect();
  },
});

export const resolve = mutation({
  args: { id: v.id("feedback") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { resolved: true, resolvedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("feedback") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
