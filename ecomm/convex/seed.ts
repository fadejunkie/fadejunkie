import { mutation } from "./_generated/server";

export const run = mutation({
  args: {},
  handler: async (ctx) => {
    // Wipe existing seed data to keep reruns idempotent
    const existingProducts = await ctx.db.query("products").collect();
    const existingCollections = await ctx.db.query("collections").collect();
    for (const p of existingProducts) await ctx.db.delete(p._id);
    for (const c of existingCollections) await ctx.db.delete(c._id);

    // Collections
    const apparelId = await ctx.db.insert("collections", {
      name: "Apparel",
      slug: "apparel",
      description: "Clothing and wearables",
      sortOrder: 1,
    });

    const accessoriesId = await ctx.db.insert("collections", {
      name: "Accessories",
      slug: "accessories",
      description: "Bags, hats, and more",
      sortOrder: 2,
    });

    const drinkwareId = await ctx.db.insert("collections", {
      name: "Drinkware",
      slug: "drinkware",
      description: "Mugs and bottles",
      sortOrder: 3,
    });

    // Products
    await ctx.db.insert("products", {
      name: "Heavyweight Tee",
      slug: "heavyweight-tee",
      description:
        "320 GSM 100% cotton. Dropped shoulder, boxy fit. Pre-shrunk and garment-washed for a lived-in feel from day one. Built to last.",
      price: 5500,
      compareAtPrice: 7000,
      collectionId: apparelId,
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80",
      ],
      variants: [
        { name: "Size", options: ["S", "M", "L", "XL", "2XL"] },
        { name: "Color", options: ["Black", "White", "Slate"] },
      ],
      inStock: true,
      featured: true,
      sortOrder: 1,
    });

    await ctx.db.insert("products", {
      name: "Coach Jacket",
      slug: "coach-jacket",
      description:
        "Woven nylon shell, snap-button closure, elastic cuffs and hem. Minimal branding. The kind of jacket you reach for without thinking.",
      price: 13500,
      collectionId: apparelId,
      images: [
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
        "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&q=80",
      ],
      variants: [
        { name: "Size", options: ["S", "M", "L", "XL"] },
        { name: "Color", options: ["Black", "Navy", "Olive"] },
      ],
      inStock: true,
      featured: true,
      sortOrder: 2,
    });

    await ctx.db.insert("products", {
      name: "French Terry Hoodie",
      slug: "french-terry-hoodie",
      description:
        "Midweight 400 GSM French terry. Relaxed fit, kangaroo pocket, adjustable drawcord. Made for the shoulder season — and every other one.",
      price: 9800,
      compareAtPrice: 11500,
      collectionId: apparelId,
      images: [
        "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&q=80",
      ],
      variants: [
        { name: "Size", options: ["XS", "S", "M", "L", "XL", "2XL"] },
        { name: "Color", options: ["Charcoal", "Bone", "Black"] },
      ],
      inStock: true,
      featured: true,
      sortOrder: 3,
    });

    await ctx.db.insert("products", {
      name: "5-Panel Cap",
      slug: "five-panel-cap",
      description:
        "Structured nylon 5-panel with a flat brim and brass strapback. One size. Unisex. Does what it's supposed to.",
      price: 3800,
      collectionId: accessoriesId,
      images: [
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
      ],
      variants: [
        { name: "Color", options: ["Black", "White", "Camo"] },
      ],
      inStock: true,
      featured: true,
      sortOrder: 4,
    });

    await ctx.db.insert("products", {
      name: "Tote Bag",
      slug: "tote-bag",
      description:
        "12 oz. natural canvas tote. 22\" handles, reinforced bottom gusset. Fits a 15\" laptop. The daily carry that doesn't try too hard.",
      price: 2800,
      collectionId: accessoriesId,
      images: [
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
      ],
      variants: [
        { name: "Color", options: ["Natural", "Black"] },
      ],
      inStock: true,
      sortOrder: 5,
    });

    await ctx.db.insert("products", {
      name: "Sling Pack",
      slug: "sling-pack",
      description:
        "4L capacity. 600D ripstop nylon, YKK zippers, padded back panel. Single shoulder strap with sternum pass-through. Fits everything, takes nothing.",
      price: 7500,
      collectionId: accessoriesId,
      images: [
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80",
      ],
      variants: [
        { name: "Color", options: ["Black", "Slate"] },
      ],
      inStock: true,
      sortOrder: 6,
    });

    await ctx.db.insert("products", {
      name: "Camp Mug",
      slug: "camp-mug",
      description:
        "12 oz. ceramic camp-style mug. Microwave and dishwasher safe. Heavy base, thumb-through handle. Good for coffee. Better for everything else.",
      price: 2400,
      collectionId: drinkwareId,
      images: [
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
      ],
      inStock: true,
      sortOrder: 7,
    });

    await ctx.db.insert("products", {
      name: "Insulated Bottle",
      slug: "insulated-bottle",
      description:
        "18 oz. double-wall stainless. Keeps cold 24 hours, hot 12. Wide-mouth lid. Powder-coated finish. Fits most cup holders — barely.",
      price: 4500,
      collectionId: drinkwareId,
      images: [
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
      ],
      variants: [
        { name: "Color", options: ["Matte Black", "White", "Forest"] },
      ],
      inStock: true,
      sortOrder: 8,
    });

    await ctx.db.insert("products", {
      name: "Track Pant",
      slug: "track-pant",
      description:
        "Lightweight woven nylon track pant. Elastic waistband with internal drawcord, tapered leg, zip ankle. Two side pockets, one rear zip.",
      price: 8800,
      collectionId: apparelId,
      images: [
        "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80",
      ],
      variants: [
        { name: "Size", options: ["XS", "S", "M", "L", "XL"] },
        { name: "Color", options: ["Black", "Navy"] },
      ],
      inStock: true,
      sortOrder: 9,
    });

    await ctx.db.insert("products", {
      name: "Beanie",
      slug: "beanie",
      description:
        "100% merino wool, ribbed knit. Cuffed. One size. Softer than it looks, warmer than it should be.",
      price: 3200,
      collectionId: accessoriesId,
      images: [
        "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80",
      ],
      variants: [
        { name: "Color", options: ["Black", "Charcoal", "Cream"] },
      ],
      inStock: false, // intentional — to show out-of-stock state
      sortOrder: 10,
    });

    return { success: true, message: "Seeded 3 collections and 10 products." };
  },
});
