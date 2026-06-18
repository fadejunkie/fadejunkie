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
      description: "Heavyweight tees, hoodies, and crewnecks built for the job site and the street.",
      sortOrder: 1,
    });

    const workGearId = await ctx.db.insert("collections", {
      name: "Work Gear",
      slug: "work-gear",
      description: "FR bandanas, cap liners, and pouches that go where you go.",
      sortOrder: 2,
    });

    const headwearId = await ctx.db.insert("collections", {
      name: "Headwear",
      slug: "headwear",
      description: "Snapbacks and beanies for the site and beyond.",
      sortOrder: 3,
    });

    const heritageId = await ctx.db.insert("collections", {
      name: "Heritage",
      slug: "heritage",
      description: "San Miguel limited drops. When they're gone, they're gone.",
      sortOrder: 4,
    });

    // ── Apparel ────────────────────────────────────────────────────────────
    await ctx.db.insert("products", {
      name: "Forged Heavyweight Tee",
      slug: "forged-heavyweight-tee",
      description:
        "320 GSM 100% cotton. Dropped shoulder, boxy fit. Pre-shrunk and garment-washed for a lived-in feel from day one. The Arquero mark on the chest. Built to outlast the job.",
      price: 5500,
      compareAtPrice: 7000,
      collectionId: apparelId,
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80",
      ],
      variants: [
        { name: "Size", options: ["S", "M", "L", "XL", "2XL", "3XL"] },
        { name: "Color", options: ["Desert Tan", "Black", "Bone White"] },
      ],
      inStock: true,
      featured: true,
      sortOrder: 1,
    });

    await ctx.db.insert("products", {
      name: "Aim True Hoodie",
      slug: "aim-true-hoodie",
      description:
        "Midweight 400 GSM French terry. Relaxed fit, kangaroo pocket, adjustable drawcord. 'Aim True.' screen-printed on the back in cream. The one you reach for without thinking.",
      price: 8500,
      compareAtPrice: 9800,
      collectionId: apparelId,
      images: [
        "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
      ],
      variants: [
        { name: "Size", options: ["S", "M", "L", "XL", "2XL"] },
        { name: "Color", options: ["Midnight Blue", "Charcoal", "Sand"] },
      ],
      inStock: true,
      featured: true,
      sortOrder: 2,
    });

    await ctx.db.insert("products", {
      name: "Tradesman Crewneck",
      slug: "tradesman-crewneck",
      description:
        "10 oz. brushed fleece, ribbed collar and cuffs. Arquero nametag embroidered at the chest. The right weight for a morning on the rig or a night out West.",
      price: 7500,
      collectionId: apparelId,
      images: [
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
      ],
      variants: [
        { name: "Size", options: ["S", "M", "L", "XL", "2XL"] },
        { name: "Color", options: ["Cream", "Slate Blue", "Black"] },
      ],
      inStock: true,
      featured: true,
      sortOrder: 3,
    });

    // ── Work Gear ──────────────────────────────────────────────────────────
    await ctx.db.insert("products", {
      name: "FR Bandana 3-Pack",
      slug: "fr-bandana-3-pack",
      description:
        "Flame-resistant cotton blend. Standard 22\" square. Machine wash. The neck protection you wear because you want to, not because you have to. Arquero mark at the corner. Three per pack.",
      price: 3500,
      collectionId: workGearId,
      images: [
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
      ],
      variants: [
        { name: "Color", options: ["Cream/Blue", "Black/Gold", "All Black"] },
      ],
      inStock: true,
      featured: true,
      sortOrder: 4,
    });

    await ctx.db.insert("products", {
      name: "Tradesman Tool Pouch",
      slug: "tradesman-tool-pouch",
      description:
        "12\" waxed canvas roll pouch, leather tie closure. Fits markers, striker, pliers, and a knife. Rolls up clean. Unrolls ready. Brass grommets, reinforced stitching at stress points.",
      price: 4500,
      compareAtPrice: 5500,
      collectionId: workGearId,
      images: [
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80",
      ],
      inStock: true,
      sortOrder: 5,
    });

    await ctx.db.insert("products", {
      name: "Welding Cap Liner",
      slug: "welding-cap-liner",
      description:
        "FR cotton blend, breathable mesh panel at crown. Fits under any dome or hard hat. Sweat-wicking band. The one piece you forget you're wearing — until you're not.",
      price: 2000,
      collectionId: workGearId,
      images: [
        "https://images.unsplash.com/photo-1591163519009-17a66c483a3c?w=800&q=80",
      ],
      variants: [
        { name: "Size", options: ["S/M", "L/XL"] },
        { name: "Color", options: ["Black", "Tan"] },
      ],
      inStock: true,
      sortOrder: 6,
    });

    // ── Headwear ───────────────────────────────────────────────────────────
    await ctx.db.insert("products", {
      name: "Arquero Snapback",
      slug: "arquero-snapback",
      description:
        "Structured 6-panel, flat brim, brass snapback closure. Arquero nametag embroidered front, symbol at back strap. One size. Unisex. The cap that means something.",
      price: 4000,
      collectionId: headwearId,
      images: [
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
      ],
      variants: [
        { name: "Color", options: ["Cream/Blue", "All Black", "Desert Tan"] },
      ],
      inStock: true,
      featured: true,
      sortOrder: 7,
    });

    await ctx.db.insert("products", {
      name: "Rancher Beanie",
      slug: "rancher-beanie",
      description:
        "100% merino wool, ribbed knit, cuffed. Arquero symbol woven at the cuff. One size. Softer than it looks, warmer than it should be.",
      price: 3200,
      collectionId: headwearId,
      images: [
        "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80",
      ],
      variants: [
        { name: "Color", options: ["Charcoal", "Cream", "Blue"] },
      ],
      inStock: true,
      sortOrder: 8,
    });

    // ── Heritage ───────────────────────────────────────────────────────────
    await ctx.db.insert("products", {
      name: "San Miguel Heritage Tee",
      slug: "san-miguel-heritage-tee",
      description:
        "Limited run. 320 GSM cotton, vintage garment-wash. San Miguel heritage graphic screenprinted front — the city that built the tradesman. When they're gone, they're gone.",
      price: 6500,
      collectionId: heritageId,
      images: [
        "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80",
      ],
      variants: [
        { name: "Size", options: ["S", "M", "L", "XL", "2XL"] },
      ],
      inStock: true,
      featured: true,
      sortOrder: 9,
    });

    await ctx.db.insert("products", {
      name: "Heritage Snapback — San Miguel",
      slug: "heritage-snapback-san-miguel",
      description:
        "Limited drop. San Miguel map graphic on the crown, Arquero symbol at back strap. Same structured build as the flagship cap. Carries the origin story on the front.",
      price: 4500,
      collectionId: heritageId,
      images: [
        "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=800&q=80",
      ],
      inStock: false, // sold out — shows the out-of-stock state
      sortOrder: 10,
    });

    return { success: true, message: "Seeded 4 collections and 10 Arquero products." };
  },
});
