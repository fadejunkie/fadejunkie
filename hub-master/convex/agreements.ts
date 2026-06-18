import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAgreement = query({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
  },
  handler: async (ctx, { clientSlug, projectId }) => {
    return await ctx.db
      .query("agreements")
      .withIndex("by_client_project", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId)
      )
      .first();
  },
});

export const saveAgreement = mutation({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
    sigData: v.string(),
    signedDate: v.string(),
    agreementType: v.optional(v.string()),
    invoiceNumber: v.optional(v.string()),
    paymentStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("agreements")
      .withIndex("by_client_project", (q) =>
        q.eq("clientSlug", args.clientSlug).eq("projectId", args.projectId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        sigData: args.sigData,
        signedDate: args.signedDate,
        signedAt: Date.now(),
        agreementType: args.agreementType,
        invoiceNumber: args.invoiceNumber,
        paymentStatus: args.paymentStatus,
      });
    } else {
      await ctx.db.insert("agreements", {
        clientSlug: args.clientSlug,
        projectId: args.projectId,
        sigData: args.sigData,
        signedDate: args.signedDate,
        signedAt: Date.now(),
        agreementType: args.agreementType,
        invoiceNumber: args.invoiceNumber,
        paymentStatus: args.paymentStatus,
      });
    }
  },
});

export const clearAgreement = mutation({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
  },
  handler: async (ctx, { clientSlug, projectId }) => {
    const existing = await ctx.db
      .query("agreements")
      .withIndex("by_client_project", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId)
      )
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const updatePayment = mutation({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
    paymentStatus: v.string(),
    receiptUrl: v.optional(v.string()),
    paidAt: v.optional(v.number()),
  },
  handler: async (ctx, { clientSlug, projectId, paymentStatus, receiptUrl, paidAt }) => {
    const existing = await ctx.db
      .query("agreements")
      .withIndex("by_client_project", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId)
      )
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { paymentStatus, receiptUrl, paidAt });
    }
  },
});
