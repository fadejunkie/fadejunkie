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
      .query("agreements")
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("agreements")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        agreementType: args.agreementType,
        sigData: args.sigData,
        signedDate: args.signedDate,
        signedAt: args.signedAt,
        invoiceNumber: args.invoiceNumber,
      });
    } else {
      await ctx.db.insert("agreements", {
        projectId: args.projectId,
        agreementType: args.agreementType,
        sigData: args.sigData,
        signedDate: args.signedDate,
        signedAt: args.signedAt,
        invoiceNumber: args.invoiceNumber,
      });
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
      .query("agreements")
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
    // Stripe invoice status check
    // In production, this would call the Stripe API with the invoice number
    // For now, return unpaid status — replace with real Stripe API call when key is configured
    return {
      status: "unpaid" as const,
      invoiceNumber,
      receiptUrl: null,
      paidAt: null,
    };
  },
});

export const clearAgreement = mutation({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    const existing = await ctx.db
      .query("agreements")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
