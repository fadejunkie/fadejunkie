import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const getMyShop = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return ctx.db
      .query("shops")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const getShopByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return ctx.db
      .query("shops")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const upsertShop = mutation({
  args: {
    shopName: v.string(),
    tagline: v.optional(v.string()),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    hours: v.optional(v.string()),
    about: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
    barberSlugs: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    let logoUrl: string | undefined;
    if (args.logoStorageId) {
      logoUrl = (await ctx.storage.getUrl(args.logoStorageId)) ?? undefined;
    }

    const now = Date.now();
    const existing = await ctx.db
      .query("shops")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        ...(logoUrl ? { logoUrl } : {}),
        updatedAt: now,
      });
      return existing._id;
    } else {
      return ctx.db.insert("shops", {
        userId,
        ...args,
        logoUrl,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});
