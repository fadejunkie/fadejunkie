import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const getMyProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("examProgress")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const markPracticed = mutation({
  args: { serviceId: v.string() },
  handler: async (ctx, { serviceId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("examProgress")
      .withIndex("by_userId_serviceId", (q) =>
        q.eq("userId", userId).eq("serviceId", serviceId)
      )
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        practicedCount: existing.practicedCount + 1,
        lastPracticedAt: now,
      });
    } else {
      await ctx.db.insert("examProgress", {
        userId,
        serviceId,
        practicedCount: 1,
        lastPracticedAt: now,
      });
    }
  },
});

export const resetProgress = mutation({
  args: { serviceId: v.string() },
  handler: async (ctx, { serviceId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("examProgress")
      .withIndex("by_userId_serviceId", (q) =>
        q.eq("userId", userId).eq("serviceId", serviceId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
