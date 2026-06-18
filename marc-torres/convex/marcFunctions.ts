import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTasks = query({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    const tasks = await ctx.db
      .query("marcTasks")
      .withIndex("by_project_key", (q) => q.eq("projectId", projectId))
      .collect();
    return Object.fromEntries(tasks.map((t) => [t.taskKey, t.completed]));
  },
});

export const setTask = mutation({
  args: { projectId: v.string(), taskKey: v.string(), completed: v.boolean() },
  handler: async (ctx, { projectId, taskKey, completed }) => {
    const existing = await ctx.db
      .query("marcTasks")
      .withIndex("by_project_key", (q) =>
        q.eq("projectId", projectId).eq("taskKey", taskKey)
      )
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { completed });
    } else {
      await ctx.db.insert("marcTasks", { projectId, taskKey, completed });
    }
  },
});

export const getDiscovery = query({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    return await ctx.db
      .query("marcDiscovery")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .first();
  },
});

export const saveDiscovery = mutation({
  args: { projectId: v.string(), responses: v.string() },
  handler: async (ctx, { projectId, responses }) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("marcDiscovery")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { responses, submittedAt: now });
    } else {
      await ctx.db.insert("marcDiscovery", { projectId, responses, submittedAt: now });
    }
    await ctx.db.insert("marcSubmissions", {
      projectId,
      type: "discovery",
      payload: responses,
      submittedAt: now,
    });
  },
});

export const getAgreement = query({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    return await ctx.db
      .query("marcAgreements")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .first();
  },
});

export const saveAgreement = mutation({
  args: {
    projectId: v.string(),
    sigData: v.string(),
    signedDate: v.string(),
    invoiceNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.insert("marcAgreements", {
      ...args,
      signedAt: now,
      paymentStatus: "pending",
    });
    await ctx.db.insert("marcSubmissions", {
      projectId: args.projectId,
      type: "agreement",
      payload: JSON.stringify({ signedDate: args.signedDate, invoiceNumber: args.invoiceNumber }),
      submittedAt: now,
    });
  },
});

export const getSubmissions = query({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    return await ctx.db
      .query("marcSubmissions")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .order("desc")
      .collect();
  },
});
