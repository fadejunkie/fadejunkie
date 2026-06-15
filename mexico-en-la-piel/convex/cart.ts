import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getCart = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) =>
    ctx.db
      .query("cartItems")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect(),
});

export const addItem = mutation({
  args: {
    sessionId: v.string(),
    productId: v.id("products"),
    productName: v.string(),
    variant: v.optional(v.string()),
    quantity: v.number(),
    unitPrice: v.number(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if same product+variant already in cart
    const existing = await ctx.db
      .query("cartItems")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .filter((q) =>
        q.and(
          q.eq(q.field("productId"), args.productId),
          q.eq(q.field("variant"), args.variant ?? null)
        )
      )
      .unique();

    if (existing) {
      return ctx.db.patch(existing._id, {
        quantity: existing.quantity + args.quantity,
      });
    }
    return ctx.db.insert("cartItems", args);
  },
});

export const updateQty = mutation({
  args: { id: v.id("cartItems"), quantity: v.number() },
  handler: async (ctx, args) => {
    if (args.quantity <= 0) return ctx.db.delete(args.id);
    return ctx.db.patch(args.id, { quantity: args.quantity });
  },
});

export const removeItem = mutation({
  args: { id: v.id("cartItems") },
  handler: async (ctx, args) => ctx.db.delete(args.id),
});

export const clearCart = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("cartItems")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
    await Promise.all(items.map((i) => ctx.db.delete(i._id)));
  },
});

// Dashboard: count of active (non-converted) cart sessions + total value
export const abandonedSummary = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("cartItems").collect();
    const sessions = new Map<string, number>();
    for (const item of items) {
      sessions.set(
        item.sessionId,
        (sessions.get(item.sessionId) ?? 0) + item.unitPrice * item.quantity
      );
    }
    const totalValue = Array.from(sessions.values()).reduce((s, v) => s + v, 0);
    return { sessionCount: sessions.size, totalValue };
  },
});
