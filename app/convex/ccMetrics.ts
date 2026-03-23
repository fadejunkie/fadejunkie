import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("ccMetrics").collect();
  },
});

export const getByKey = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    return await ctx.db
      .query("ccMetrics")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
  },
});

export const update = mutation({
  args: {
    key: v.string(),
    count: v.optional(v.number()),
    target: v.optional(v.number()),
    label: v.optional(v.string()),
    unit: v.optional(v.string()),
  },
  handler: async (ctx, { key, ...updates }) => {
    const existing = await ctx.db
      .query("ccMetrics")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();

    if (!existing) {
      throw new Error(`Metric "${key}" not found`);
    }

    const filtered: Record<string, unknown> = { updated: new Date().toISOString().split("T")[0] };
    if (updates.count !== undefined) filtered.count = updates.count;
    if (updates.target !== undefined) filtered.target = updates.target;
    if (updates.label !== undefined) filtered.label = updates.label;
    if (updates.unit !== undefined) filtered.unit = updates.unit;

    await ctx.db.patch(existing._id, filtered);
    return existing._id;
  },
});

export const upsert = mutation({
  args: {
    key: v.string(),
    count: v.number(),
    target: v.number(),
    label: v.string(),
    unit: v.string(),
  },
  handler: async (ctx, { key, count, target, label, unit }) => {
    const existing = await ctx.db
      .query("ccMetrics")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();

    const updated = new Date().toISOString().split("T")[0];

    if (existing) {
      await ctx.db.patch(existing._id, { count, target, label, unit, updated });
      return existing._id;
    }

    return await ctx.db.insert("ccMetrics", { key, count, target, label, unit, updated });
  },
});
