import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v, ConvexError } from "convex/values";
import { USER_PATHS } from "./statusConfig";
import type { UserPath } from "./statusConfig";

// ── Mutations ──

export const selectPath = mutation({
  args: { path: v.string() },
  handler: async (ctx, { path }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    if (!USER_PATHS.includes(path as UserPath)) {
      throw new ConvexError("Invalid user path");
    }

    // Check for duplicate
    const existing = await ctx.db
      .query("userPaths")
      .withIndex("by_userId_path", (q) =>
        q.eq("userId", userId).eq("path", path)
      )
      .unique();

    if (existing) {
      throw new ConvexError("Path already selected");
    }

    // First path is automatically primary
    const allPaths = await ctx.db
      .query("userPaths")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const isPrimary = allPaths.length === 0;

    return ctx.db.insert("userPaths", {
      userId,
      path,
      isPrimary,
      createdAt: Date.now(),
    });
  },
});

export const removePath = mutation({
  args: { path: v.string() },
  handler: async (ctx, { path }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const record = await ctx.db
      .query("userPaths")
      .withIndex("by_userId_path", (q) =>
        q.eq("userId", userId).eq("path", path)
      )
      .unique();

    if (!record) throw new ConvexError("Path not found");

    // If removing primary and other paths exist, promote the oldest
    if (record.isPrimary) {
      const remaining = await ctx.db
        .query("userPaths")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .collect();

      const others = remaining
        .filter((p) => p._id !== record._id)
        .sort((a, b) => a.createdAt - b.createdAt);

      if (others.length > 0) {
        await ctx.db.patch(others[0]._id, { isPrimary: true });
      }
    }

    await ctx.db.delete(record._id);
  },
});

export const setPrimaryPath = mutation({
  args: { path: v.string() },
  handler: async (ctx, { path }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const allPaths = await ctx.db
      .query("userPaths")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const target = allPaths.find((p) => p.path === path);
    if (!target) throw new ConvexError("Path not found");

    for (const p of allPaths) {
      if (p._id === target._id && !p.isPrimary) {
        await ctx.db.patch(p._id, { isPrimary: true });
      } else if (p._id !== target._id && p.isPrimary) {
        await ctx.db.patch(p._id, { isPrimary: false });
      }
    }
  },
});

// ── Queries ──

export const getMyPaths = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const paths = await ctx.db
      .query("userPaths")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Primary first, then by creation date
    return paths.sort((a, b) => {
      if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
      return a.createdAt - b.createdAt;
    });
  },
});

export const getUserPaths = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const paths = await ctx.db
      .query("userPaths")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return paths.sort((a, b) => {
      if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
      return a.createdAt - b.createdAt;
    });
  },
});
