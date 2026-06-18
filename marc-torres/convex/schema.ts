import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  marcTasks: defineTable({
    projectId: v.string(),
    taskKey: v.string(),
    completed: v.boolean(),
  }).index("by_project_key", ["projectId", "taskKey"]),

  marcDiscovery: defineTable({
    projectId: v.string(),
    responses: v.string(),
    submittedAt: v.number(),
  }).index("by_project", ["projectId"]),

  marcAgreements: defineTable({
    projectId: v.string(),
    sigData: v.string(),
    signedDate: v.string(),
    signedAt: v.number(),
    invoiceNumber: v.string(),
    paymentStatus: v.optional(v.string()),
    receiptUrl: v.optional(v.string()),
    paidAt: v.optional(v.number()),
  }).index("by_project", ["projectId"]),

  marcSubmissions: defineTable({
    projectId: v.string(),
    type: v.string(),
    payload: v.string(),
    submittedAt: v.number(),
  }).index("by_project", ["projectId"]),
});
