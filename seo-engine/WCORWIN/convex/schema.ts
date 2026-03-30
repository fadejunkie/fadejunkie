import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  wcorwinTasks: defineTable({
    projectId: v.string(),
    taskKey: v.string(),
    status: v.optional(v.string()),
    name: v.optional(v.string()),
    detail: v.optional(v.string()),
    doc: v.optional(v.string()),
  }).index("by_project_key", ["projectId", "taskKey"]),

  seoAudits: defineTable({
    projectId: v.string(),               // "wcorwin"
    runAt: v.number(),                   // Unix timestamp (ms)
    overallScore: v.number(),            // 0–10
    onPage: v.number(),
    technical: v.number(),
    content: v.number(),
    local: v.number(),
    authority: v.number(),
    summary: v.string(),                 // 1-paragraph executive summary
    recommendations: v.array(v.string()), // top 3–5 action items
    rawReport: v.string(),               // full markdown audit text
  }).index("by_project_runAt", ["projectId", "runAt"]),
});
