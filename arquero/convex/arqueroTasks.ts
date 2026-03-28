import { mutation, query, action } from "./_generated/server";
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

/* ── Agreement functions ── */

export const getAgreement = query({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    return await ctx.db
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
    invoiceNumber: v.string(),
    paymentStatus: v.optional(v.string()),
    paidAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("arqueroAgreements")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();
    const doc: any = {
      agreementType: args.agreementType,
      sigData: args.sigData,
      signedDate: args.signedDate,
      signedAt: args.signedAt,
      invoiceNumber: args.invoiceNumber,
    };
    if (args.paymentStatus !== undefined) doc.paymentStatus = args.paymentStatus;
    if (args.paidAt !== undefined) doc.paidAt = args.paidAt;
    if (existing) {
      await ctx.db.patch(existing._id, doc);
    } else {
      await ctx.db.insert("arqueroAgreements", { projectId: args.projectId, ...doc });
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
  handler: async (ctx, { projectId, paymentStatus, receiptUrl, paidAt }) => {
    const existing = await ctx.db
      .query("arqueroAgreements")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .first();
    if (!existing) throw new Error("No agreement found for project");
    await ctx.db.patch(existing._id, {
      paymentStatus,
      ...(receiptUrl !== undefined && { receiptUrl }),
      ...(paidAt !== undefined && { paidAt }),
    });
  },
});

export const checkInvoiceStatus = action({
  args: { invoiceNumber: v.string() },
  handler: async (_ctx, { invoiceNumber }) => {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured in Convex environment");
    }

    const query = encodeURIComponent(`number:"${invoiceNumber}"`);
    const res = await fetch(
      `https://api.stripe.com/v1/invoices/search?query=${query}`,
      { headers: { Authorization: `Bearer ${stripeKey}` } }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Stripe API error: ${res.status} — ${err}`);
    }

    const data = await res.json();
    const invoice = data.data?.[0];

    if (!invoice) {
      return { status: "unpaid" as const, invoiceNumber, receiptUrl: null, paidAt: null };
    }

    if (invoice.status === "paid") {
      return {
        status: "paid" as const,
        invoiceNumber,
        receiptUrl: invoice.hosted_invoice_url ?? null,
        paidAt: invoice.status_transitions?.paid_at
          ? invoice.status_transitions.paid_at * 1000
          : null,
      };
    }

    return { status: "unpaid" as const, invoiceNumber, receiptUrl: null, paidAt: null };
  },
});

export const clearAgreement = mutation({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    const existing = await ctx.db
      .query("arqueroAgreements")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
