import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Admin-only: returns ALL vehicles regardless of availability
export const listAll = query({
  args: {},
  handler: async (ctx) => ctx.db.query("products").collect(),
});

export const list = query({
  args: {
    collectionId: v.optional(v.id("collections")),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.collectionId) {
      return ctx.db
        .query("products")
        .withIndex("by_collection", (q) => q.eq("collectionId", args.collectionId))
        .filter((q) => q.eq(q.field("inStock"), true))
        .collect();
    }
    let q = ctx.db.query("products").filter((q) => q.eq(q.field("inStock"), true));
    if (args.featured) {
      q = q.filter((q) => q.eq(q.field("featured"), true));
    }
    return q.collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

const vehicleFields = {
  name: v.string(),
  slug: v.string(),
  description: v.string(),
  price: v.number(),
  compareAtPrice: v.optional(v.number()),
  collectionId: v.optional(v.id("collections")),
  images: v.array(v.string()),
  variants: v.optional(
    v.array(v.object({ name: v.string(), options: v.array(v.string()) }))
  ),
  tags: v.optional(v.array(v.string())),
  inStock: v.boolean(),
  featured: v.optional(v.boolean()),
  sortOrder: v.optional(v.number()),
  // Vehicle fields
  year: v.optional(v.number()),
  make: v.optional(v.string()),
  model: v.optional(v.string()),
  trim: v.optional(v.string()),
  mileage: v.optional(v.number()),
  vin: v.optional(v.string()),
  bodyType: v.optional(v.string()),
  transmission: v.optional(v.string()),
  exteriorColor: v.optional(v.string()),
  condition: v.optional(v.string()),
};

export const create = mutation({
  args: vehicleFields,
  handler: async (ctx, args) => ctx.db.insert("products", args),
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    compareAtPrice: v.optional(v.number()),
    collectionId: v.optional(v.id("collections")),
    images: v.optional(v.array(v.string())),
    variants: v.optional(
      v.array(v.object({ name: v.string(), options: v.array(v.string()) }))
    ),
    tags: v.optional(v.array(v.string())),
    inStock: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
    // Vehicle fields
    year: v.optional(v.number()),
    make: v.optional(v.string()),
    model: v.optional(v.string()),
    trim: v.optional(v.string()),
    mileage: v.optional(v.number()),
    vin: v.optional(v.string()),
    bodyType: v.optional(v.string()),
    transmission: v.optional(v.string()),
    exteriorColor: v.optional(v.string()),
    condition: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patch }) => ctx.db.patch(id, patch),
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => ctx.db.delete(args.id),
});
