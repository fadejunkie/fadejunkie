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

// Dashboard: aggregated KPI stats
export const summary = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    const paid = orders.filter((o) =>
      ["paid", "shipped", "fulfilled"].includes(o.status)
    );
    const revenue = paid.reduce((s, o) => s + o.total, 0);
    const avgOrderValue = paid.length > 0 ? Math.round(revenue / paid.length) : 0;

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const recentPaid = paid.filter((o) => o._creationTime >= thirtyDaysAgo);

    // Count by status
    const byStatus: Record<string, number> = {};
    for (const o of orders) {
      byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
    }

    // Top products: sum quantities across all paid orders
    const productSales: Record<string, { name: string; qty: number; revenue: number }> = {};
    for (const o of paid) {
      for (const item of o.items) {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { name: item.productName, qty: 0, revenue: 0 };
        }
        productSales[item.productId].qty += item.quantity;
        productSales[item.productId].revenue += item.unitPrice * item.quantity;
      }
    }
    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5)
      .map(([id, data]) => ({ productId: id, ...data }));

    return {
      totalRevenue: revenue,
      totalOrders: orders.length,
      paidOrders: paid.length,
      avgOrderValue,
      ordersLast30Days: recentPaid.length,
      revenueLast30Days: recentPaid.reduce((s, o) => s + o.total, 0),
      byStatus,
      topProducts,
    };
  },
});

// Dashboard: daily revenue for the last 30 days (for bar chart)
export const revenueByDay = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const orders = await ctx.db.query("orders").collect();
    const paid = orders.filter(
      (o) =>
        ["paid", "shipped", "fulfilled"].includes(o.status) &&
        o._creationTime >= thirtyDaysAgo
    );

    // Build a map keyed by "YYYY-MM-DD"
    const byDay: Record<string, number> = {};
    for (const o of paid) {
      const d = new Date(o._creationTime);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      byDay[key] = (byDay[key] ?? 0) + o.total;
    }

    // Fill in every day of the last 30 so the chart has no gaps
    const result: { date: string; revenue: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      result.push({ date: label, revenue: byDay[key] ?? 0 });
    }
    return result;
  },
});
