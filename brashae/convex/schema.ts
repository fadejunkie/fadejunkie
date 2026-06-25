import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.number(), // cents
    compareAtPrice: v.optional(v.number()), // cents
    collectionId: v.optional(v.id("collections")),
    images: v.array(v.string()), // Convex storage IDs or external URLs
    variants: v.optional(
      v.array(
        v.object({
          name: v.string(), // e.g. "Size"
          options: v.array(v.string()), // e.g. ["S", "M", "L", "XL"]
        })
      )
    ),
    tags: v.optional(v.array(v.string())),
    inStock: v.boolean(),
    featured: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
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
    subtotal: v.number(), // cents
    shipping: v.number(), // cents
    total: v.number(), // cents
    notes: v.optional(v.string()),
  })
    .index("by_stripe_session", ["stripeSessionId"])
    .index("by_status", ["status"]),

  cartItems: defineTable({
    sessionId: v.string(),
    productId: v.id("products"),
    productName: v.string(),
    variant: v.optional(v.string()),
    quantity: v.number(),
    unitPrice: v.number(), // cents
    image: v.optional(v.string()),
  }).index("by_session", ["sessionId"]),
});
