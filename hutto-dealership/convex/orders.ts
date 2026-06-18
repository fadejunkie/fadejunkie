import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const orderItemValidator = v.object({
  productId: v.string(),
  productName: v.string(),
  variant: v.optional(v.string()),
  quantity: v.number(),
  unitPrice: v.number(),
});

const shippingAddressValidator = v.object({
  line1: v.string(),
  line2: v.optional(v.string()),
  city: v.string(),
  state: v.string(),
  postalCode: v.string(),
  country: v.string(),
});

export const createOrder = mutation({
  args: {
    stripeSessionId: v.string(),
    customerEmail: v.string(),
    customerName: v.string(),
    shippingAddress: shippingAddressValidator,
    items: v.array(orderItemValidator),
    subtotal: v.number(),
    shipping: v.number(),
    total: v.number(),
  },
  handler: async (ctx, args) =>
    ctx.db.insert("orders", { ...args, status: "pending" }),
});

export const markPaid = mutation({
  args: {
    stripeSessionId: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_stripe_session", (q) =>
        q.eq("stripeSessionId", args.stripeSessionId)
      )
      .unique();
    if (!order) return null;
    return ctx.db.patch(order._id, {
      status: "paid",
      stripePaymentIntentId: args.stripePaymentIntentId,
    });
  },
});

export const updateStatus = mutation({
  args: { id: v.id("orders"), status: v.string() },
  handler: async (ctx, args) => ctx.db.patch(args.id, { status: args.status }),
});

export const list = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.status) {
      return ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    }
    return ctx.db.query("orders").order("desc").collect();
  },
});

export const getByStripeSession = query({
  args: { stripeSessionId: v.string() },
  handler: async (ctx, args) =>
    ctx.db
      .query("orders")
      .withIndex("by_stripe_session", (q) =>
        q.eq("stripeSessionId", args.stripeSessionId)
      )
      .unique(),
});
