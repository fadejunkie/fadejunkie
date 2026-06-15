import { mutation } from "./_generated/server";

export const run = mutation({
  args: {},
  handler: async (ctx) => {
    // Wipe existing data to keep reruns idempotent
    const existingProducts = await ctx.db.query("products").collect();
    const existingCollections = await ctx.db.query("collections").collect();
    for (const p of existingProducts) await ctx.db.delete(p._id);
    for (const c of existingCollections) await ctx.db.delete(c._id);

    // Collections
    const apparelId = await ctx.db.insert("collections", {
      name: "Apparel",
      slug: "apparel",
      description: "Welding-ready clothing built for the modern tradesman.",
      sortOrder: 1,
    });

    const accessoriesId = await ctx.db.insert("collections", {
      name: "Accessories",
      slug: "accessories",
      description: "Gear and tools for the workshop and beyond.",
      sortOrder: 2,
    });

    // Products
    await ctx.db.insert("products", {
      name: "Arquero Logo Tee",
      slug: "arquero-logo-tee",
      description:
        "The foundational piece. 100% heavyweight cotton, pre-shrunk. Arquero Co. wordmark screen-printed in earth tone ink on a washed black canvas. Built to hold up after a long day in the shop.",
      price: 3500,
      collectionId: apparelId,
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80",
      ],
      variants: [
        { name: "Size", options: ["S", "M", "L", "XL", "2XL"] },
      ],
      inStock: true,
      featured: true,
      sortOrder: 1,
    });

    await ctx.db.insert("products", {
      name: "Workshop Hoodie",
      slug: "workshop-hoodie",
      description:
        "Midweight fleece built for the shop floor. Kangaroo pocket, ribbed cuffs, and a relaxed fit that won't bind when you're working overhead. Arquero arc logo embroidered on the chest.",
      price: 7500,
      collectionId: apparelId,
      images: [
        "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80",
      ],
      variants: [
        { name: "Size", options: ["S", "M", "L", "XL", "2XL"] },
        { name: "Color", options: ["Charcoal", "Black", "Tan"] },
      ],
      inStock: true,
      featured: true,
      sortOrder: 2,
    });

    await ctx.db.insert("products", {
      name: "Tradesman Work Shirt",
      slug: "tradesman-work-shirt",
      description:
        "Flame-resistant cotton blend work shirt. Triple-stitched seams, two chest pockets, and a relaxed cut for real range of motion. The shirt you'll reach for every morning.",
      price: 8900,
      collectionId: apparelId,
      images: [
        "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80",
      ],
      variants: [
        { name: "Size", options: ["S", "M", "L", "XL", "2XL"] },
        { name: "Color", options: ["Tan", "Olive", "Black"] },
      ],
      inStock: true,
      featured: true,
      sortOrder: 3,
    });

    await ctx.db.insert("products", {
      name: "Arquero Snapback",
      slug: "arquero-snapback",
      description:
        "6-panel structured snapback in washed tan. Embroidered Arquero Co. arc on the front, undervisor in desert orange. One size fits most.",
      price: 3200,
      collectionId: apparelId,
      images: [
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
      ],
      inStock: true,
      featured: true,
      sortOrder: 4,
    });

    await ctx.db.insert("products", {
      name: "Heavy-Duty Welding Gloves",
      slug: "heavy-duty-welding-gloves",
      description:
        "Thick split-cowhide leather with a reinforced palm and Kevlar stitching. Heat-rated to 600°F. A necessary tool dressed to match the brand.",
      price: 4500,
      collectionId: accessoriesId,
      images: [
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
      ],
      inStock: true,
      featured: false,
      sortOrder: 5,
    });

    await ctx.db.insert("products", {
      name: "Arquero Patch Set",
      slug: "arquero-patch-set",
      description:
        "Iron-on and sew-on patches from the first Arquero collection. Set of 4: wordmark, arc symbol, San Miguel shield, and Aim True graphic. Made to put on anything.",
      price: 1800,
      collectionId: accessoriesId,
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      ],
      inStock: true,
      featured: false,
      sortOrder: 6,
    });

    return { success: true, message: "Seeded 2 collections and 6 Arquero Co. products." };
  },
});
