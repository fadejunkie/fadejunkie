import { mutation } from "./_generated/server";

// One-shot: adds the Brown Leather Welding Glove product to the Work Gear collection.
// Safe to run multiple times — skips insert if slug already exists.
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if product already exists
    const existing = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", "brown-leather-glove"))
      .unique();

    if (existing) {
      return { status: "already exists", id: existing._id };
    }

    // Look up Work Gear collection
    const workGear = await ctx.db
      .query("collections")
      .withIndex("by_slug", (q) => q.eq("slug", "work-gear"))
      .unique();

    const id = await ctx.db.insert("products", {
      name: "Brown Leather Welding Glove",
      slug: "brown-leather-glove",
      description:
        "Full-grain cowhide, reinforced palm. Built for the welder who doesn't quit when it gets hot. Heat-resistant lining, extended gauntlet cuff, double-stitched at every stress point. The Arquero mark on the back. Pair it with the FR Bandana and mean it.",
      price: 3800, // $38.00
      compareAtPrice: 4800,
      collectionId: workGear?._id,
      images: [
        "/products/brown-leather-glove/front-facing-leather-glove-thumbnail.png",
        "/products/brown-leather-glove/5-img-welder-glove-display.png",
        "/products/brown-leather-glove/brown-leather-glove-infographic.png",
      ],
      variants: [
        { name: "Size", options: ["S", "M", "L", "XL"] },
      ],
      tags: ["work-gear", "gloves", "welding", "leather"],
      inStock: true,
      featured: false,
      sortOrder: 11,
    });

    return { status: "inserted", id };
  },
});
