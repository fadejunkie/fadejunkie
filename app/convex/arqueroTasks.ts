import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTasks = query({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    const rows = await ctx.db
      .query("arqueroTasks")
      .withIndex("by_project_key", (q) => q.eq("projectId", projectId))
      .collect();
    const result: Record<string, boolean> = {};
    for (const row of rows) {
      result[row.taskKey] = row.completed;
    }
    return result;
  },
});

export const getAgreement = query({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    return ctx.db
      .query("arqueroAgreements")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .first();
  },
});

export const saveAgreement = mutation({
  args: {
    projectId: v.string(),
    agreementType: v.string(),
    sigData: v.string(),
    signedDate: v.string(),
    signedAt: v.number(),
    invoiceNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("arqueroAgreements")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        agreementType: args.agreementType,
        sigData: args.sigData,
        signedDate: args.signedDate,
        signedAt: args.signedAt,
        invoiceNumber: args.invoiceNumber,
        paymentStatus: "pending",
      });
    } else {
      await ctx.db.insert("arqueroAgreements", { ...args, paymentStatus: "pending" });
    }
  },
});

export const updateAgreementPayment = mutation({
  args: {
    projectId: v.string(),
    paymentStatus: v.string(),
    receiptUrl: v.optional(v.string()),
    paidAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("arqueroAgreements")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        paymentStatus: args.paymentStatus,
        receiptUrl: args.receiptUrl,
        paidAt: args.paidAt,
      });
    }
  },
});

export const checkInvoiceStatus = action({
  args: { invoiceNumber: v.string() },
  handler: async (_ctx, { invoiceNumber }) => {
    const key = process.env.stripe_secret;
    if (!key) throw new Error("Stripe key not configured");
    const resp = await fetch(
      "https://api.stripe.com/v1/invoices?customer=cus_UAm9HuXwaFHzak&limit=20",
      { headers: { Authorization: `Bearer ${key}` } }
    );
    const data = await resp.json();
    const inv = (data.data ?? []).find((i: any) => i.number === invoiceNumber);
    if (!inv) return { status: "not_found", receiptUrl: null, paidAt: null };
    let receiptUrl: string | null = null;
    if (inv.status === "paid" && inv.charge) {
      const cr = await fetch(`https://api.stripe.com/v1/charges/${inv.charge}`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      const charge = await cr.json();
      receiptUrl = charge.receipt_url ?? null;
    }
    return {
      status: inv.status as string,
      receiptUrl,
      paidAt: inv.status_transitions?.paid_at ?? null,
    };
  },
});

export const clearAgreement = mutation({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    const existing = await ctx.db
      .query("arqueroAgreements")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .first();
    if (existing) await ctx.db.delete(existing._id);
  },
});

export const setTask = mutation({
  args: {
    projectId: v.string(),
    key: v.string(),
    value: v.boolean(),
  },
  handler: async (ctx, { projectId, key, value }) => {
    const existing = await ctx.db
      .query("arqueroTasks")
      .withIndex("by_project_key", (q) =>
        q.eq("projectId", projectId).eq("taskKey", key)
      )
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { completed: value });
    } else {
      await ctx.db.insert("arqueroTasks", { projectId, taskKey: key, completed: value });
    }
  },
});
