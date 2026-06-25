import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  saFinestTasks: defineTable({
    projectId: v.string(),
    taskKey: v.string(),
    completed: v.boolean(),
  }).index("by_project_key", ["projectId", "taskKey"]),

  saFinestDeliverables: defineTable({
    projectId: v.string(),
    milestoneKey: v.string(),
    label: v.string(),
    url: v.optional(v.string()),
    type: v.string(),
    addedAt: v.number(),
    markdownContent: v.optional(v.string()),
  }).index("by_project_milestone", ["projectId", "milestoneKey"]),

  saFinestDiscovery: defineTable({
    projectId: v.string(),
    responses: v.string(),
    submittedAt: v.number(),
  }).index("by_project", ["projectId"]),

  saFinestAgreements: defineTable({
    projectId: v.string(),
    sigData: v.string(),
    signedDate: v.string(),
    signedAt: v.number(),
    invoiceNumber: v.string(),
    paymentStatus: v.optional(v.string()),
    receiptUrl: v.optional(v.string()),
    paidAt: v.optional(v.number()),
  }).index("by_project", ["projectId"]),

  saFinestSubmissions: defineTable({
    projectId: v.string(),
    type: v.string(),
    payload: v.string(),
    submittedAt: v.number(),
  }).index("by_project", ["projectId"]),
});
