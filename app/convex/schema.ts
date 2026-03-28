import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  barbers: defineTable({
    userId: v.id("users"),
    slug: v.string(),
    name: v.string(),
    bio: v.optional(v.string()),
    phone: v.optional(v.string()),
    instagram: v.optional(v.string()),
    bookingUrl: v.optional(v.string()),
    shopName: v.optional(v.string()),
    location: v.optional(v.string()),
    services: v.array(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_slug", ["slug"]),

  gallery: defineTable({
    barberId: v.id("barbers"),
    storageId: v.id("_storage"),
    url: v.string(),
    caption: v.optional(v.string()),
    order: v.number(),
    createdAt: v.number(),
  })
    .index("by_barberId", ["barberId"])
    .index("by_barberId_order", ["barberId", "order"]),

  posts: defineTable({
    authorId: v.id("users"),
    barberId: v.optional(v.id("barbers")),
    content: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_authorId", ["authorId"]),

  likes: defineTable({
    postId: v.id("posts"),
    userId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_postId", ["postId"])
    .index("by_postId_userId", ["postId", "userId"]),

  shops: defineTable({
    userId: v.id("users"),
    shopName: v.string(),
    tagline: v.optional(v.string()),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    hours: v.optional(v.string()),
    about: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
    logoUrl: v.optional(v.string()),
    barberSlugs: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"]),

  resources: defineTable({
    category: v.string(),
    audience: v.optional(v.string()),
    audiences: v.optional(v.array(v.string())),
    businessName: v.string(),
    tagline: v.optional(v.string()),
    description: v.string(),
    logoUrl: v.optional(v.string()),
    offerUrl: v.string(),
    isInternal: v.optional(v.boolean()),
    badge: v.optional(v.string()),
    price: v.optional(v.string()),
    affiliate: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    order: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_audience", ["audience"])
    .index("by_isActive", ["isActive"]),

  flashcardDecks: defineTable({
    title: v.string(),
    source: v.string(),
    questionCount: v.number(),
    isActive: v.boolean(),
    order: v.number(),
    createdAt: v.number(),
  })
    .index("by_source", ["source"])
    .index("by_isActive", ["isActive"]),

  flashcards: defineTable({
    deckId: v.id("flashcardDecks"),
    externalId: v.string(),
    question: v.string(),
    optionA: v.string(),
    optionB: v.string(),
    optionC: v.string(),
    optionD: v.optional(v.string()),
    correctAnswer: v.string(),
    topic: v.string(),
    sourceRef: v.optional(v.string()),
    order: v.number(),
  })
    .index("by_deckId", ["deckId"])
    .index("by_deckId_topic", ["deckId", "topic"]),

  starredCards: defineTable({
    userId: v.id("users"),
    cardId: v.id("flashcards"),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_cardId", ["userId", "cardId"]),

  examProgress: defineTable({
    userId: v.id("users"),
    serviceId: v.string(),
    practicedCount: v.number(),
    lastPracticedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_serviceId", ["userId", "serviceId"]),

  testResults: defineTable({
    userId: v.id("users"),
    deckId: v.id("flashcardDecks"),
    score: v.number(),
    total: v.number(),
    percentage: v.number(),
    answers: v.array(
      v.object({
        cardId: v.id("flashcards"),
        selectedAnswer: v.optional(v.string()),
        isCorrect: v.boolean(),
      })
    ),
    completedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_deckId", ["userId", "deckId"]),

  locations: defineTable({
    type: v.string(),
    name: v.string(),
    address: v.string(),
    city: v.optional(v.string()),
    state: v.string(),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    website: v.optional(v.string()),
    phone: v.optional(v.string()),
    status: v.string(),
    programs: v.optional(v.array(v.string())),
    schedule: v.optional(v.string()),
    hoursRequired: v.optional(v.number()),
    tuition: v.optional(v.string()),
    description: v.optional(v.string()),
    externalId: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_state", ["state"])
    .index("by_type_state", ["type", "state"])
    .index("by_isActive", ["isActive"]),

  // ── Status ecosystem ──

  statuses: defineTable({
    userId: v.id("users"),
    path: v.string(),
    toggleKey: v.string(),
    isActive: v.boolean(),
    activatedAt: v.number(),
    expiresAt: v.number(),
    archivedAt: v.optional(v.number()),
    refreshCount: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_path_active", ["path", "isActive"])
    .index("by_userId_toggleKey", ["userId", "toggleKey"])
    .index("by_expiresAt", ["expiresAt"]),

  userPaths: defineTable({
    userId: v.id("users"),
    path: v.string(),
    isPrimary: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_path", ["path"])
    .index("by_userId_path", ["userId", "path"]),

  statusConnections: defineTable({
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
    statusId: v.id("statuses"),
    note: v.optional(v.string()),
    status: v.string(), // "pending" | "seen"
    createdAt: v.number(),
  })
    .index("by_toUserId", ["toUserId"])
    .index("by_fromUserId", ["fromUserId"])
    .index("by_fromUserId_statusId", ["fromUserId", "statusId"]),

  // ── Control Center tables ──

  ccMetrics: defineTable({
    key: v.string(),
    count: v.number(),
    target: v.number(),
    label: v.string(),
    unit: v.string(),
    updated: v.string(),
  }).index("by_key", ["key"]),

  ccProspects: defineTable({
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
    lastContact: v.optional(v.string()),
    createdAt: v.string(),
    payments: v.optional(
      v.array(
        v.object({
          month: v.number(),
          amount: v.number(),
          date: v.string(),
          invoiceNumber: v.optional(v.string()),
          receiptNumber: v.optional(v.string()),
          method: v.optional(v.string()),
          receipt: v.optional(v.string()),
        })
      )
    ),
    history: v.optional(
      v.array(
        v.object({
          status: v.string(),
          date: v.string(),
          note: v.string(),
        })
      )
    ),
  })
    .index("by_status", ["status"])
    .index("by_name", ["name"]),

  ccContent: defineTable({
    title: v.string(),
    type: v.string(),
    status: v.string(),
    audience: v.string(),
    priority: v.string(),
    targetDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_priority", ["priority"]),

  ccNotes: defineTable({
    text: v.string(),
    createdAt: v.string(),
  }),

  // ── Arquero client project tracker ──

  arqueroTasks: defineTable({
    projectId: v.string(),
    taskKey: v.string(),
    completed: v.boolean(),
  }).index("by_project_key", ["projectId", "taskKey"]),

  arqueroAgreements: defineTable({
    projectId: v.string(),
    agreementType: v.string(),          // "one-time" | "monthly"
    sigData: v.string(),                // base64 PNG of signature
    signedDate: v.string(),             // human-readable date
    signedAt: v.number(),               // unix timestamp
    invoiceNumber: v.optional(v.string()),   // e.g. "CAPLYORH-0010"
    paymentStatus: v.optional(v.string()),   // "pending" | "paid"
    receiptUrl: v.optional(v.string()),
    paidAt: v.optional(v.number()),
  }).index("by_project", ["projectId"]),
});
