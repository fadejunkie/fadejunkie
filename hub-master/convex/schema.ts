import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ─── Client Registry ────────────────────────────────────────────────────────
  clients: defineTable({
    slug: v.string(),
    name: v.string(),
    status: v.union(v.literal("active"), v.literal("prospect"), v.literal("archived")),
    hubUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  // ─── Tasks ──────────────────────────────────────────────────────────────────
  // Simple boolean tasks (all clients except wcorwin): completed = true/false
  // Wcorwin retainer tasks: status string (e.g. "done", "in-progress"), optional name/detail/doc
  tasks: defineTable({
    clientSlug: v.string(),
    projectId: v.string(),
    taskKey: v.string(),
    completed: v.optional(v.boolean()),     // standard project hubs
    status: v.optional(v.string()),          // wcorwin retainer (overrides completed)
    name: v.optional(v.string()),            // wcorwin: task display name
    detail: v.optional(v.string()),          // wcorwin: task detail/notes
    doc: v.optional(v.string()),             // wcorwin: linked doc URL
  })
    .index("by_client", ["clientSlug"])
    .index("by_client_project", ["clientSlug", "projectId"])
    .index("by_client_project_key", ["clientSlug", "projectId", "taskKey"]),

  // ─── Deliverables ───────────────────────────────────────────────────────────
  deliverables: defineTable({
    clientSlug: v.string(),
    projectId: v.string(),
    milestoneKey: v.string(),
    label: v.string(),
    url: v.optional(v.string()),
    type: v.string(),
    addedAt: v.number(),
    markdownContent: v.optional(v.string()),
  })
    .index("by_client", ["clientSlug"])
    .index("by_client_project_milestone", ["clientSlug", "projectId", "milestoneKey"]),

  // ─── Discovery Questionnaire ─────────────────────────────────────────────────
  discovery: defineTable({
    clientSlug: v.string(),
    projectId: v.string(),
    responses: v.string(), // JSON-stringified answers
    submittedAt: v.number(),
  })
    .index("by_client", ["clientSlug"])
    .index("by_client_project", ["clientSlug", "projectId"]),

  // ─── Agreements / Contracts ──────────────────────────────────────────────────
  agreements: defineTable({
    clientSlug: v.string(),
    projectId: v.string(),
    sigData: v.string(),
    signedDate: v.string(),
    signedAt: v.number(),
    agreementType: v.optional(v.string()),   // e.g. "upfront" | "per-phase"
    invoiceNumber: v.optional(v.string()),
    paymentStatus: v.optional(v.string()),   // "paid" | "pending" | "failed"
    receiptUrl: v.optional(v.string()),
    paidAt: v.optional(v.number()),
  })
    .index("by_client", ["clientSlug"])
    .index("by_client_project", ["clientSlug", "projectId"]),

  // ─── Direction Picks (brand direction voting, early phases) ─────────────────
  directionPicks: defineTable({
    clientSlug: v.string(),
    projectId: v.string(),
    pick: v.string(),
    pickedAt: v.number(),
  })
    .index("by_client", ["clientSlug"])
    .index("by_client_project", ["clientSlug", "projectId"]),

  // ─── Real Estate Listings (Sydney) ──────────────────────────────────────────
  listings: defineTable({
    clientSlug: v.string(),
    address: v.string(),
    price: v.optional(v.number()),
    beds: v.optional(v.number()),
    baths: v.optional(v.number()),
    sqft: v.optional(v.number()),
    status: v.optional(v.string()),         // "active" | "pending" | "sold"
    listingUrl: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    description: v.optional(v.string()),
  }).index("by_client", ["clientSlug"]),

  // ─── Monthly Signoffs (Wcorwin retainer) ─────────────────────────────────────
  signoffs: defineTable({
    clientSlug: v.string(),
    projectId: v.string(),
    notes: v.optional(v.string()),
    notesAt: v.optional(v.number()),
    signature: v.optional(v.string()),
    signedAt: v.optional(v.number()),
  })
    .index("by_client", ["clientSlug"])
    .index("by_client_project", ["clientSlug", "projectId"]),

  // ─── SEO Audits (Wcorwin) ───────────────────────────────────────────────────
  seoAudits: defineTable({
    clientSlug: v.string(),
    projectId: v.string(),
    runAt: v.number(),
    overallScore: v.number(),
    onPage: v.number(),
    technical: v.number(),
    content: v.number(),
    local: v.number(),
    authority: v.number(),
    summary: v.string(),
    recommendations: v.array(v.string()),
    rawReport: v.optional(v.string()),
  })
    .index("by_client", ["clientSlug"])
    .index("by_client_project_runAt", ["clientSlug", "projectId", "runAt"]),

  // ─── Form Submissions Audit Trail (Chuco) ───────────────────────────────────
  submissions: defineTable({
    clientSlug: v.string(),
    type: v.string(),
    payload: v.string(), // JSON-stringified form data
    submittedAt: v.number(),
  }).index("by_client", ["clientSlug"]),

  // ─── Account Credentials (SEO clients — stored for agency access) ────────────
  credentials: defineTable({
    clientSlug: v.string(),
    projectId: v.string(),
    data: v.string(), // JSON-stringified credential fields
    updatedAt: v.number(),
  })
    .index("by_client", ["clientSlug"])
    .index("by_client_project", ["clientSlug", "projectId"]),

  // ─── Client Feedback (design preview / wireframe comments) ─────────────────
  feedback: defineTable({
    clientSlug: v.string(),
    section: v.string(),
    message: v.string(),
    submittedAt: v.number(),
    resolved: v.boolean(),
    resolvedAt: v.optional(v.number()),
  }).index("by_client", ["clientSlug"]),

  // ─── Task Reports + Master PDF Reports ──────────────────────────────────────
  reports: defineTable({
    clientSlug: v.string(),
    projectId: v.string(),
    taskKey: v.optional(v.string()),         // null/undefined = master report
    title: v.string(),
    content: v.string(),                     // full report text (markdown)
    type: v.union(v.literal("task"), v.literal("master")),
    generatedAt: v.number(),
    generatedBy: v.optional(v.string()),     // e.g. "Anthony Tatis"
  })
    .index("by_client", ["clientSlug"])
    .index("by_client_project", ["clientSlug", "projectId"]),

  // ─── GBP Assets (photos link + business hours from client) ──────────────────
  gbpAssets: defineTable({
    clientSlug: v.string(),
    projectId: v.string(),
    hours: v.optional(v.string()),        // JSON: { mon: { closed, open, close }, ... }
    photosLink: v.optional(v.string()),   // Google Drive/Photos share URL
    photosNote: v.optional(v.string()),   // free-form notes
    yelpEmail: v.optional(v.string()),    // biz.yelp.com login email
    yelpPassword: v.optional(v.string()), // biz.yelp.com login password
    updatedAt: v.number(),
  })
    .index("by_client", ["clientSlug"])
    .index("by_client_project", ["clientSlug", "projectId"]),
});
