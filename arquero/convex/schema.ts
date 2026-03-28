import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  arqueroTasks: defineTable({
    projectId: v.string(),
    taskKey: v.string(),
    completed: v.boolean(),
  }).index("by_project_key", ["projectId", "taskKey"]),

  arqueroAgreements: defineTable({
    projectId: v.string(),
    agreementType: v.string(),
    sigData: v.string(),
    signedDate: v.string(),
    signedAt: v.number(),
    invoiceNumber: v.string(),
    paymentStatus: v.optional(v.string()),
    receiptUrl: v.optional(v.string()),
    paidAt: v.optional(v.number()),
  }).index("by_project", ["projectId"]),
});
