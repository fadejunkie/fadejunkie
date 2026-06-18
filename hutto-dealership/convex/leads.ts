import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    vehicleId: v.optional(v.string()),
    vehicleName: v.string(),
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    message: v.optional(v.string()),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("leads", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Admin: list all leads newest first
export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("leads").withIndex("by_created").order("desc").collect();
  },
});
