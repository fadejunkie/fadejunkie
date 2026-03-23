import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("ccContent").collect();
  },
});

export const listByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, { status }) => {
    return await ctx.db
      .query("ccContent")
      .withIndex("by_status", (q) => q.eq("status", status))
      .collect();
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    type: v.string(),
    status: v.string(),
    audience: v.string(),
    priority: v.string(),
    targetDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ccContent", {
      ...args,
      createdAt: new Date().toISOString().split("T")[0],
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("ccContent"),
    title: v.optional(v.string()),
    type: v.optional(v.string()),
    status: v.optional(v.string()),
    audience: v.optional(v.string()),
    priority: v.optional(v.string()),
    targetDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Content item not found");

    const filtered: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(updates)) {
      if (val !== undefined) filtered[k] = val;
    }

    await ctx.db.patch(id, filtered);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("ccContent") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
