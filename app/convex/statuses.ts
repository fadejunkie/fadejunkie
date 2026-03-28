import { query, mutation, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v, ConvexError } from "convex/values";
import { getToggleConfig, USER_PATHS } from "./statusConfig";
import type { UserPath } from "./statusConfig";

const DAY_MS = 86_400_000;

// ── Mutations ──

export const activateStatus = mutation({
  args: {
    path: v.string(),
    toggleKey: v.string(),
  },
  handler: async (ctx, { path, toggleKey }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    // Validate path
    if (!USER_PATHS.includes(path as UserPath)) {
      throw new ConvexError("Invalid user path");
    }

    // Validate toggleKey exists for this path
    const config = getToggleConfig(path as UserPath, toggleKey);
    if (!config) {
      throw new ConvexError("Invalid toggle key for this path");
    }

    // Check for existing active status with same toggle
    const existing = await ctx.db
      .query("statuses")
      .withIndex("by_userId_toggleKey", (q) =>
        q.eq("userId", userId).eq("toggleKey", toggleKey)
      )
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (existing) {
      throw new ConvexError("Status already active");
    }

    const now = Date.now();
    return ctx.db.insert("statuses", {
      userId,
      path,
      toggleKey,
      isActive: true,
      activatedAt: now,
      expiresAt: now + config.default_days * DAY_MS,
      refreshCount: 0,
    });
  },
});

export const deactivateStatus = mutation({
  args: {
    statusId: v.id("statuses"),
  },
  handler: async (ctx, { statusId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const status = await ctx.db.get(statusId);
    if (!status) throw new ConvexError("Status not found");
    if (status.userId !== userId) throw new ConvexError("Not your status");

    await ctx.db.patch(statusId, {
      isActive: false,
      archivedAt: Date.now(),
    });
  },
});

export const refreshStatus = mutation({
  args: {
    statusId: v.id("statuses"),
    customDays: v.optional(v.number()),
  },
  handler: async (ctx, { statusId, customDays }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const status = await ctx.db.get(statusId);
    if (!status) throw new ConvexError("Status not found");
    if (status.userId !== userId) throw new ConvexError("Not your status");
    if (!status.isActive) throw new ConvexError("Status is not active");

    const config = getToggleConfig(status.path as UserPath, status.toggleKey);
    if (!config) throw new ConvexError("Toggle config not found");

    const days = Math.min(customDays ?? config.default_days, config.max_days);
    const now = Date.now();

    await ctx.db.patch(statusId, {
      expiresAt: now + days * DAY_MS,
      refreshCount: (status.refreshCount ?? 0) + 1,
    });
  },
});

// ── Queries ──

export const getMyStatuses = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const statuses = await ctx.db
      .query("statuses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Sort by activatedAt descending and enrich with toggle config
    return statuses
      .sort((a, b) => b.activatedAt - a.activatedAt)
      .map((s) => {
        const config = getToggleConfig(s.path as UserPath, s.toggleKey);
        return {
          ...s,
          defaultDays: config?.default_days ?? 0,
          maxDays: config?.max_days ?? 0,
        };
      });
  },
});

export const getActiveByPath = query({
  args: { path: v.string() },
  handler: async (ctx, { path }) => {
    const now = Date.now();

    const statuses = await ctx.db
      .query("statuses")
      .withIndex("by_path_active", (q) =>
        q.eq("path", path).eq("isActive", true)
      )
      .collect();

    // Filter out expired statuses (don't mutate, just filter)
    return statuses
      .filter((s) => s.expiresAt > now)
      .sort((a, b) => b.activatedAt - a.activatedAt);
  },
});

export const getActiveStatusesForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const now = Date.now();

    const statuses = await ctx.db
      .query("statuses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return statuses
      .filter((s) => s.isActive && s.expiresAt > now)
      .sort((a, b) => b.activatedAt - a.activatedAt);
  },
});

export const getMyArchivedStatuses = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const statuses = await ctx.db
      .query("statuses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return statuses
      .filter((s) => !s.isActive)
      .sort((a, b) => (b.archivedAt ?? b.activatedAt) - (a.archivedAt ?? a.activatedAt))
      .map((s) => {
        const config = getToggleConfig(s.path as UserPath, s.toggleKey);
        return {
          ...s,
          defaultDays: config?.default_days ?? 0,
          maxDays: config?.max_days ?? 0,
        };
      });
  },
});

// ── Internal (cron-only) ──

export const expireStatuses = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Find all expired but still active statuses
    const expired = await ctx.db
      .query("statuses")
      .withIndex("by_expiresAt")
      .filter((q) =>
        q.and(
          q.lt(q.field("expiresAt"), now),
          q.eq(q.field("isActive"), true)
        )
      )
      .collect();

    for (const status of expired) {
      await ctx.db.patch(status._id, {
        isActive: false,
        archivedAt: now,
      });
    }

    return { archived: expired.length };
  },
});
