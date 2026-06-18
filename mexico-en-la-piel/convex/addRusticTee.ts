import { mutation } from "./_generated/server";

// One-shot: adds the Rustic Workwear Tee to the Apparel collection.
// Safe to run multiple times — skips insert if slug already exists.
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", "rustic-workwear-tee"))
      .unique();

    if (existing) {
      return { status: "already exists", id: existing._id };
    }

    const apparel = await ctx.db
      .query("collections")
      .withIndex("by_slug", (q) => q.eq("slug", "apparel"))
      .unique();

    const id = await ctx.db.insert("products", {
      name: "Rustic Workwear Tee",
      slug: "rustic-workwear-tee",
      description:
        "100% heavyweight cotton, garment-dyed for that lived-in feel straight out of the bag. Reinforced collar, double-stitched hem, and the Arquero mark chest-printed in aged ink. Made for long days in the sun and longer nights at the fire. Not fashion — function.",
      price: 3200, // $32.00
      compareAtPrice: 4000,
      collectionId: apparel?._id,
      images: [
        "/products/rustic-workwear-tee/front-facing.png",
        "/products/rustic-workwear-tee/backfacing.png",
        "/products/rustic-workwear-tee/lifestyle-shot.png",
        "/products/rustic-workwear-tee/stitch-detail.png",
      ],
      variants: [
        { name: "Size", options: ["S", "M", "L", "XL", "2XL"] },
      ],
      tags: ["apparel", "tee", "workwear", "cotton"],
      inStock: true,
      featured: true,
      sortOrder: 12,
    });

    return { status: "inserted", id };
  },
});
