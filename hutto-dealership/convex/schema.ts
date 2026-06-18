import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    // Core identity
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.number(), // cents
    compareAtPrice: v.optional(v.number()), // cents
    collectionId: v.optional(v.id("collections")),
    images: v.array(v.string()),
    variants: v.optional(
      v.array(
        v.object({
          name: v.string(),
          options: v.array(v.string()),
        })
      )
    ),
    tags: v.optional(v.array(v.string())),
    inStock: v.boolean(),
    featured: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),

    // Vehicle-specific fields (all optional for template compat)
    year: v.optional(v.number()),
    make: v.optional(v.string()),       // Ford, Toyota, Chevrolet, etc.
    model: v.optional(v.string()),      // F-150, Camry, Silverado, etc.
    trim: v.optional(v.string()),       // XLT, LE, LTZ, etc.
    mileage: v.optional(v.number()),    // odometer reading
    vin: v.optional(v.string()),
    bodyType: v.optional(v.string()),   // Truck, SUV, Sedan, Coupe, Minivan, etc.
    transmission: v.optional(v.string()), // Automatic, Manual
    exteriorColor: v.optional(v.string()),
    condition: v.optional(v.string()), // New, Used, Certified Pre-Owned
  })
    .index("by_slug", ["slug"])
    .index("by_collection", ["collectionId"]),

  collections: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
  }).index("by_slug", ["slug"]),

  orders: defineTable({
    stripeSessionId: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
    status: v.string(), // "pending" | "paid" | "shipped" | "fulfilled" | "cancelled"
    customerEmail: v.string(),
    customerName: v.string(),
    shippingAddress: v.object({
      line1: v.string(),
      line2: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      postalCode: v.string(),
      country: v.string(),
    }),
    items: v.array(
      v.object({
        productId: v.string(),
        productName: v.string(),
        variant: v.optional(v.string()),
        quantity: v.number(),
        unitPrice: v.number(), // cents
      })
    ),
    subtotal: v.number(),
    shipping: v.number(),
    total: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_stripe_session", ["stripeSessionId"])
    .index("by_status", ["status"]),

  leads: defineTable({
    vehicleId: v.optional(v.string()),
    vehicleName: v.string(),
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    message: v.optional(v.string()),
    type: v.string(), // "test-drive" | "question" | "offer"
    createdAt: v.number(),
  }).index("by_created", ["createdAt"]),

  cartItems: defineTable({
    sessionId: v.string(),
    productId: v.id("products"),
    productName: v.string(),
    variant: v.optional(v.string()),
    quantity: v.number(),
    unitPrice: v.number(),
    image: v.optional(v.string()),
  }).index("by_session", ["sessionId"]),
});
