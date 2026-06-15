import { mutation } from "./_generated/server";

// One-shot patch — adds secondary images to all products by slug.
// Safe to run multiple times (idempotent — always sets to the defined pair).
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    const secondaries: Record<string, string> = {
      "forged-heavyweight-tee":
        "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80",
      "aim-true-hoodie":
        "https://images.unsplash.com/photo-1614330842748-8a9fc3394668?w=800&q=80",
      "tradesman-crewneck":
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
      "fr-bandana-3-pack":
        "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80",
      "tradesman-tool-pouch":
        "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&q=80",
      "welding-cap-liner":
        "https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?w=800&q=80",
      "arquero-snapback":
        "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=800&q=80",
      "rancher-beanie":
        "https://images.unsplash.com/photo-1511128542900-f8773ece28cb?w=800&q=80",
      "san-miguel-heritage-tee":
        "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
      "heritage-snapback-san-miguel":
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
    };

    const products = await ctx.db.query("products").collect();
    let updated = 0;

    for (const product of products) {
      const secondary = secondaries[product.slug];
      if (!secondary) continue;
      const primary = product.images[0];
      await ctx.db.patch(product._id, { images: [primary, secondary] });
      updated++;
    }

    return { updated };
  },
});
