import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const paymentValidator = v.object({
  month: v.number(),
  amount: v.number(),
  date: v.string(),
  invoiceNumber: v.optional(v.string()),
  receiptNumber: v.optional(v.string()),
  method: v.optional(v.string()),
  receipt: v.optional(v.string()),
});

const historyEntryValidator = v.object({
  status: v.string(),
  date: v.string(),
  note: v.string(),
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("ccProspects").collect();
  },
});

export const getById = query({
  args: { id: v.id("ccProspects") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const listByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, { status }) => {
    return await ctx.db
      .query("ccProspects")
      .withIndex("by_status", (q) => q.eq("status", status))
      .collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    contact: v.optional(v.string()),
    location: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    instagram: v.optional(v.string()),
    status: v.string(),
    value: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("ccProspects", {
      ...args,
      lastContact: now.split("T")[0],
      createdAt: now.split("T")[0],
      payments: [],
      history: [{ status: args.status, date: now.split("T")[0], note: "Created" }],
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("ccProspects"),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    contact: v.optional(v.string()),
    location: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    instagram: v.optional(v.string()),
    status: v.optional(v.string()),
    value: v.optional(v.number()),
    notes: v.optional(v.string()),
    lastContact: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Prospect not found");

    const filtered: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(updates)) {
      if (val !== undefined) filtered[k] = val;
    }

    // If status changed, add history entry
    if (updates.status && updates.status !== existing.status) {
      const history = existing.history ?? [];
      history.push({
        status: updates.status,
        date: new Date().toISOString().split("T")[0],
        note: `Status changed to ${updates.status}`,
      });
      filtered.history = history;
    }

    await ctx.db.patch(id, filtered);
    return id;
  },
});

export const addPayment = mutation({
  args: {
    id: v.id("ccProspects"),
    payment: paymentValidator,
  },
  handler: async (ctx, { id, payment }) => {
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Prospect not found");

    const payments = existing.payments ?? [];
    payments.push(payment);

    const history = existing.history ?? [];
    history.push({
      status: existing.status,
      date: payment.date,
      note: `Payment: $${payment.amount} (Month ${payment.month})`,
    });

    await ctx.db.patch(id, { payments, history, lastContact: payment.date });
    return id;
  },
});

export const addHistoryEntry = mutation({
  args: {
    id: v.id("ccProspects"),
    entry: historyEntryValidator,
  },
  handler: async (ctx, { id, entry }) => {
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Prospect not found");

    const history = existing.history ?? [];
    history.push(entry);

    await ctx.db.patch(id, { history, lastContact: entry.date });
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("ccProspects") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
