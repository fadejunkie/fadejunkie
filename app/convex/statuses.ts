import { query, mutation, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v, ConvexError } from "convex/values";
import { getToggleConfig, USER_PATHS, getComplementsFor } from "./statusConfig";
import type { UserPath } from "./statusConfig";

const DAY_MS = 86_400_000;

const PATH_LABELS: Record<string, string> = {
  barber: "Barbers",
  student: "Students",
  shop: "Shops",
  school: "Schools",
  vendor: "Vendors",
  event_coordinator: "Event Coordinators",
  client: "Clients",
};

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

export const getPublicStatusSummary = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const now = Date.now();

    const statuses = await ctx.db
      .query("statuses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const active = statuses.filter((s) => s.isActive && s.expiresAt > now);

    const grouped = new Map<string, { toggleKey: string; label: string; expiresAt: number }[]>();
    for (const s of active) {
      const list = grouped.get(s.path) ?? [];
      list.push({
        toggleKey: s.toggleKey,
        label: s.toggleKey.replace(/_/g, " "),
        expiresAt: s.expiresAt,
      });
      grouped.set(s.path, list);
    }

    return [...grouped.entries()]
      .map(([path, statuses]) => ({
        path,
        pathLabel: PATH_LABELS[path] ?? path,
        statuses: statuses.sort((a, b) => a.expiresAt - b.expiresAt),
      }))
      .sort((a, b) => b.statuses.length - a.statuses.length);
  },
});

// ── Discovery ──

export const discoverStatuses = query({
  args: {
    path: v.string(),
    toggleKey: v.optional(v.string()),
  },
  handler: async (ctx, { path, toggleKey }) => {
    const userId = await getAuthUserId(ctx);
    const now = Date.now();

    const statuses = await ctx.db
      .query("statuses")
      .withIndex("by_path_active", (q) =>
        q.eq("path", path).eq("isActive", true)
      )
      .collect();

    const filtered = statuses.filter((s) => {
      if (userId && s.userId === userId) return false;
      if (s.expiresAt <= now) return false;
      if (toggleKey && s.toggleKey !== toggleKey) return false;
      return true;
    });

    // Batch-lookup barber profiles for unique userIds
    const userIds = [...new Set(filtered.map((s) => s.userId))];
    const barberMap = new Map<string, { name: string | null; slug: string | null; avatarUrl: string | null }>();

    for (const uid of userIds) {
      const barber = await ctx.db
        .query("barbers")
        .withIndex("by_userId", (q) => q.eq("userId", uid))
        .unique();
      barberMap.set(uid, {
        name: barber?.name ?? null,
        slug: barber?.slug ?? null,
        avatarUrl: barber?.avatarUrl ?? null,
      });
    }

    return filtered
      .sort((a, b) => b.activatedAt - a.activatedAt)
      .map((s) => {
        const config = getToggleConfig(s.path as UserPath, s.toggleKey);
        const barber = barberMap.get(s.userId);
        return {
          ...s,
          defaultDays: config?.default_days ?? 0,
          maxDays: config?.max_days ?? 0,
          barberName: barber?.name ?? null,
          barberSlug: barber?.slug ?? null,
          barberAvatarUrl: barber?.avatarUrl ?? null,
        };
      });
  },
});

export const getDiscoveryPaths = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const results: { path: string; label: string; count: number }[] = [];

    for (const path of USER_PATHS) {
      const statuses = await ctx.db
        .query("statuses")
        .withIndex("by_path_active", (q) =>
          q.eq("path", path).eq("isActive", true)
        )
        .collect();

      const count = statuses.filter((s) => s.expiresAt > now).length;
      if (count > 0) {
        results.push({ path, label: PATH_LABELS[path] ?? path, count });
      }
    }

    return results.sort((a, b) => b.count - a.count);
  },
});

export const getComplementaryMatches = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const now = Date.now();

    // Get caller's active, non-expired statuses
    const myStatuses = (
      await ctx.db
        .query("statuses")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .collect()
    ).filter((s) => s.isActive && s.expiresAt > now);

    if (myStatuses.length === 0) return [];

    const seenIds = new Set<string>();
    const groups: {
      myStatus: { path: string; toggleKey: string; _id: typeof myStatuses[0]["_id"] };
      matches: typeof myStatuses;
    }[] = [];

    for (const my of myStatuses) {
      const complements = getComplementsFor(my.path as UserPath, my.toggleKey);
      const matches: typeof myStatuses = [];

      for (const target of complements) {
        const candidates = await ctx.db
          .query("statuses")
          .withIndex("by_path_active", (q) =>
            q.eq("path", target.path).eq("isActive", true)
          )
          .collect();

        for (const c of candidates) {
          if (c.toggleKey !== target.toggleKey) continue;
          if (c.userId === userId) continue;
          if (c.expiresAt <= now) continue;
          if (seenIds.has(c._id)) continue;
          seenIds.add(c._id);
          matches.push(c);
        }
      }

      if (matches.length > 0) {
        groups.push({
          myStatus: { path: my.path, toggleKey: my.toggleKey, _id: my._id },
          matches: matches.sort((a, b) => b.activatedAt - a.activatedAt),
        });
      }
    }

    // Batch-lookup barber profiles
    const allUserIds = [...new Set(groups.flatMap((g) => g.matches.map((m) => m.userId)))];
    const barberMap = new Map<string, { name: string | null; slug: string | null; avatarUrl: string | null }>();

    for (const uid of allUserIds) {
      const barber = await ctx.db
        .query("barbers")
        .withIndex("by_userId", (q) => q.eq("userId", uid))
        .unique();
      barberMap.set(uid, {
        name: barber?.name ?? null,
        slug: barber?.slug ?? null,
        avatarUrl: barber?.avatarUrl ?? null,
      });
    }

    return groups.map((g) => ({
      myStatus: g.myStatus,
      matches: g.matches.map((m) => {
        const barber = barberMap.get(m.userId);
        return {
          _id: m._id,
          userId: m.userId,
          path: m.path,
          toggleKey: m.toggleKey,
          activatedAt: m.activatedAt,
          expiresAt: m.expiresAt,
          barberName: barber?.name ?? null,
          barberSlug: barber?.slug ?? null,
          barberAvatarUrl: barber?.avatarUrl ?? null,
        };
      }),
    }));
  },
});

// ── Connections ──

export const connectOnStatus = mutation({
  args: {
    statusId: v.id("statuses"),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { statusId, note }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const status = await ctx.db.get(statusId);
    if (!status) throw new ConvexError("Status not found");
    if (!status.isActive || status.expiresAt <= Date.now()) {
      throw new ConvexError("Status is no longer active");
    }
    if (status.userId === userId) {
      throw new ConvexError("Cannot connect to your own status");
    }

    const existing = await ctx.db
      .query("statusConnections")
      .withIndex("by_fromUserId_statusId", (q) =>
        q.eq("fromUserId", userId).eq("statusId", statusId)
      )
      .unique();

    if (existing) {
      throw new ConvexError("Already sent a connection request for this status");
    }

    const trimmedNote = note?.trim().slice(0, 280);

    return ctx.db.insert("statusConnections", {
      fromUserId: userId,
      toUserId: status.userId,
      statusId,
      note: trimmedNote || undefined,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const getMyConnectionRequests = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const connections = await ctx.db
      .query("statusConnections")
      .withIndex("by_toUserId", (q) => q.eq("toUserId", userId))
      .collect();

    // Batch-lookup statuses and barber profiles
    const statusIds = [...new Set(connections.map((c) => c.statusId))];
    const statusMap = new Map<string, { path: string; toggleKey: string }>();
    for (const sid of statusIds) {
      const s = await ctx.db.get(sid);
      if (s) statusMap.set(sid, { path: s.path, toggleKey: s.toggleKey });
    }

    const senderIds = [...new Set(connections.map((c) => c.fromUserId))];
    const barberMap = new Map<string, { name: string | null; slug: string | null; avatarUrl: string | null }>();
    for (const uid of senderIds) {
      const barber = await ctx.db
        .query("barbers")
        .withIndex("by_userId", (q) => q.eq("userId", uid))
        .unique();
      barberMap.set(uid, {
        name: barber?.name ?? null,
        slug: barber?.slug ?? null,
        avatarUrl: barber?.avatarUrl ?? null,
      });
    }

    return connections
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((c) => {
        const statusInfo = statusMap.get(c.statusId);
        const barber = barberMap.get(c.fromUserId);
        return {
          _id: c._id,
          fromUserId: c.fromUserId,
          statusId: c.statusId,
          note: c.note,
          status: c.status,
          createdAt: c.createdAt,
          statusPath: statusInfo?.path ?? null,
          statusToggleKey: statusInfo?.toggleKey ?? null,
          barberName: barber?.name ?? null,
          barberSlug: barber?.slug ?? null,
          barberAvatarUrl: barber?.avatarUrl ?? null,
        };
      });
  },
});

export const markConnectionSeen = mutation({
  args: {
    connectionId: v.id("statusConnections"),
  },
  handler: async (ctx, { connectionId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const connection = await ctx.db.get(connectionId);
    if (!connection) throw new ConvexError("Connection not found");
    if (connection.toUserId !== userId) throw new ConvexError("Not your connection");

    await ctx.db.patch(connectionId, { status: "seen" });
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
