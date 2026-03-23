import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("ccNotes").order("desc").collect();
  },
});

export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, { text }) => {
    return await ctx.db.insert("ccNotes", {
      text,
      createdAt: new Date().toISOString(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("ccNotes") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
