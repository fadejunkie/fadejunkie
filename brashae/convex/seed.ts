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
    const clippersId = await ctx.db.insert("collections", {
      name: "Clippers",
      slug: "clippers",
      description: "Professional cordless and corded clippers from top barber brands",
      sortOrder: 1,
    });

    const trimmersId = await ctx.db.insert("collections", {
      name: "Trimmers",
      slug: "trimmers",
      description: "Zero-gap trimmers, liners, and detailers for clean edges",
      sortOrder: 2,
    });

    const hairCareId = await ctx.db.insert("collections", {
      name: "Hair Care",
      slug: "hair-care",
      description: "Shampoos, conditioners, treatments, and styling products",
      sortOrder: 3,
    });

    const stylingToolsId = await ctx.db.insert("collections", {
      name: "Styling Tools",
      slug: "styling-tools",
      description: "Flat irons, curling wands, blow dryers, and heat tools",
      sortOrder: 4,
    });

    const proProductsId = await ctx.db.insert("collections", {
      name: "Professional Products",
      slug: "professional-products",
      description: "Salon-grade color, chemicals, and treatments",
      sortOrder: 5,
    });

    const specialsId = await ctx.db.insert("collections", {
      name: "Specials",
      slug: "specials",
      description: "Limited-time deals and discounted items",
      sortOrder: 6,
    });

    const bundlesId = await ctx.db.insert("collections", {
      name: "Bundles",
      slug: "bundles",
      description: "Curated tool sets at bundle pricing",
      sortOrder: 7,
    });

    // ── CLIPPERS ────────────────────────────────────────────────────────────

    await ctx.db.insert("products", {
      name: "Andis Masters Cordless Clipper",
      slug: "andis-master-clipper",
      description:
        "The industry standard. Magnetic motor, adjustable blade, runs cooler and quieter than the competition. Built for all-day use in the chair.",
      price: 24570,
      compareAtPrice: 26000,
      collectionId: clippersId,
      images: [
        "https://thebarberplug.com/cdn/shop/files/12660-master-cordless-li-clipper-mlc-straight-stand-6_1000x1000_png.webp?v=1698080986&width=1920",
        "https://thebarberplug.com/cdn/shop/files/12660-master-cordless-li-clipper-mlc-hero-2_1000x1000_png.webp?v=1698080986&width=1920",
      ],
      variants: [{ name: "Color", options: ["Chrome", "Black"] }],
      tags: ["Andis", "clippers"],
      inStock: true,
      featured: true,
      sortOrder: 1,
    });

    await ctx.db.insert("products", {
      name: "Andis Masters Corded Clipper",
      slug: "andis-masters-corded",
      description:
        "The original. Electromagnetic motor with adjustable blade for precise fade work. Runs all day without heat buildup. The corded workhorse every shop needs as a backup.",
      price: 12228,
      collectionId: clippersId,
      images: [
        "https://thebarberplug.com/cdn/shop/files/AN1007_1000x1000_png.webp?v=1698080896&width=1920",
        "https://thebarberplug.com/cdn/shop/files/AN1007_2_1000x1000_png.webp?v=1698080895&width=1920",
      ],
      tags: ["Andis", "clippers"],
      inStock: true,
      sortOrder: 2,
    });

    await ctx.db.insert("products", {
      name: "Andis Supra ZR II Clipper",
      slug: "andis-supra-zr-ii",
      description:
        "Rotary motor with detachable blade system. Heavy-duty construction for non-stop shop use. Takes any Andis detachable blade — clipper-over-comb, shears, or fades.",
      price: 35799,
      compareAtPrice: 37400,
      collectionId: clippersId,
      images: [
        "https://thebarberplug.com/cdn/shop/files/3_a92df497-dceb-483e-b266-f364f7f540af.png?v=1698082999&width=1920",
        "https://thebarberplug.com/cdn/shop/files/6_f5e6634c-37b6-4a36-a81e-4611994eb5f3.png?v=1698082999&width=1920",
      ],
      tags: ["Andis", "clippers"],
      inStock: true,
      sortOrder: 3,
    });

    await ctx.db.insert("products", {
      name: "JRL Fresh Fade 2020C Clipper",
      slug: "jrl-fresh-fade-2020c",
      description:
        "Zero-gap-ready out of the box. Brushless motor, 150-minute battery, magnetic charge. Built for the fade, built for the grind.",
      price: 15999,
      compareAtPrice: 22500,
      collectionId: clippersId,
      images: [
        "https://thebarberplug.com/cdn/shop/files/image_98933770-9f79-4544-ba8e-0383c3c12bc1.jpg?v=1690675065&width=1920",
        "https://thebarberplug.com/cdn/shop/files/image_5a1430ac-0901-409e-a6ad-551021230e61.jpg?v=1690675066&width=1920",
      ],
      variants: [{ name: "Style", options: ["Standard", "Onyx"] }],
      tags: ["JRL", "clippers"],
      inStock: true,
      featured: true,
      sortOrder: 4,
    });

    await ctx.db.insert("products", {
      name: "JRL Ghost Clipper",
      slug: "jrl-ghost-clipper",
      description:
        "Whisper-quiet brushless motor with an ultra-light aluminum shell. Runs so smooth you forget it's on. JRL's most refined fade machine to date.",
      price: 16995,
      compareAtPrice: 22500,
      collectionId: clippersId,
      images: [
        "https://thebarberplug.com/cdn/shop/files/IMG-5418.webp?v=1728879047&width=1920",
        "https://thebarberplug.com/cdn/shop/files/8C18E6EA-AA76-4895-B4B7-70267EFAD753.jpg?v=1770154932&width=1920",
      ],
      tags: ["JRL", "clippers"],
      inStock: true,
      sortOrder: 5,
    });

    await ctx.db.insert("products", {
      name: "Wahl Magic Clip Cordless 8148",
      slug: "wahl-5star-detailer",
      description:
        "The clipper barbers have trusted for decades, now fully cordless. Taper lever, 90-minute battery, lithium ion. Does the fade, does the blend. That's it.",
      price: 14499,
      compareAtPrice: 15000,
      collectionId: clippersId,
      images: [
        "https://thebarberplug.com/cdn/shop/files/wahl-cordless-magic-clip-8148.png?v=1714687957&width=1200",
        "https://thebarberplug.com/cdn/shop/products/productresize_magicclip.png?v=1714687945&width=832",
      ],
      tags: ["Wahl", "clippers"],
      inStock: true,
      featured: true,
      sortOrder: 6,
    });

    await ctx.db.insert("products", {
      name: "Wahl Cordless Gold Magic Clip",
      slug: "wahl-cordless-gold-magic-clip",
      description:
        "Gold edition Magic Clip with all the same internals — brushless motor, 90-minute run time — just way sharper looking on the shelf and in the hand.",
      price: 18900,
      compareAtPrice: 22999,
      collectionId: clippersId,
      images: [
        "https://thebarberplug.com/cdn/shop/products/image_4ad1d071-bbd1-49ba-878d-7f0bf0807adf.jpg?v=1660260577&width=832",
        "https://thebarberplug.com/cdn/shop/files/wahl-cordless-gold-magic-clip-8148-700-included.jpg?v=1714687578&width=832",
      ],
      tags: ["Wahl", "clippers"],
      inStock: true,
      sortOrder: 7,
    });

    await ctx.db.insert("products", {
      name: "Wahl Senior Cordless",
      slug: "wahl-senior-cordless",
      description:
        "The full-size Senior clipper that barbers know, now cut the cord. Powerful rotary motor in the body you already know how to handle.",
      price: 17999,
      collectionId: clippersId,
      images: [
        "https://thebarberplug.com/cdn/shop/products/image_3846ffb5-ab6c-4e43-b656-628dd853712d.jpg?v=1665965901&width=1920",
      ],
      tags: ["Wahl", "clippers"],
      inStock: true,
      sortOrder: 8,
    });

    await ctx.db.insert("products", {
      name: "Wahl Cordless Legend Clipper",
      slug: "wahl-cordless-legend",
      description:
        "High-torque motor in the slim Legend body. Taper lever, adjustable blade, 100-minute battery. Built for the barber who wants Wahl power without the cord.",
      price: 16499,
      collectionId: clippersId,
      images: [
        "https://thebarberplug.com/cdn/shop/products/image_41c2912e-662c-4220-93e0-1b696e256259.png?v=1653435097&width=1200",
        "https://thebarberplug.com/cdn/shop/files/wahl-cordless-legend-clipper-8594-in-package.png?v=1714687669&width=1200",
      ],
      tags: ["Wahl", "clippers"],
      inStock: true,
      sortOrder: 9,
    });

    await ctx.db.insert("products", {
      name: "BaByliss FX Clipper",
      slug: "babyliss-pro-goldfx-trimmer",
      description:
        "All-metal body, high-torque brushless motor, zero-gap blade with DLC coating. Available in Gold and Silver. The GoldFX stands up to full days in the shop.",
      price: 18300,
      compareAtPrice: 21900,
      collectionId: clippersId,
      images: [
        "https://thebarberplug.com/cdn/shop/files/goldfxclipper.png?v=1690079193&width=1200",
        "https://thebarberplug.com/cdn/shop/files/silverfxclipper.png?v=1690079193&width=1200",
      ],
      variants: [{ name: "Color", options: ["Gold", "Silver"] }],
      tags: ["BaByliss PRO", "clippers"],
      inStock: true,
      featured: true,
      sortOrder: 10,
    });

    await ctx.db.insert("products", {
      name: "BaByliss Lo-PRO FX Clipper",
      slug: "babyliss-lo-pro-fx",
      description:
        "Low-profile housing sits flat against the head — better sightlines on the fade, less hand fatigue on long cuts. Brushless motor, zero-gap blade. The ergonomic upgrade.",
      price: 17999,
      compareAtPrice: 20500,
      collectionId: clippersId,
      images: [
        "https://thebarberplug.com/cdn/shop/products/image_d8ffe82a-7bee-4ae4-b035-98095c9d13fc.jpg?v=1653357495&width=1920",
      ],
      tags: ["BaByliss PRO", "clippers"],
      inStock: true,
      sortOrder: 11,
    });

    await ctx.db.insert("products", {
      name: "BaByliss FXONE Clipper",
      slug: "babyliss-fxone-clipper",
      description:
        "Full-size all-metal clipper with BaByliss Pro's brushless motor. Heavy, balanced, and precise. The kind of tool you buy once and use for years.",
      price: 19999,
      compareAtPrice: 22900,
      collectionId: clippersId,
      images: [
        "https://thebarberplug.com/cdn/shop/files/2_43e56d1d-829f-472d-9177-b90541432e38.png?v=1706212236&width=1920",
        "https://thebarberplug.com/cdn/shop/files/s-l1600__75192.jpg?v=1706212236&width=1920",
      ],
      tags: ["BaByliss PRO", "clippers"],
      inStock: true,
      sortOrder: 12,
    });

    await ctx.db.insert("products", {
      name: "BaByliss FXONE Lo-ProFX Clipper FX829",
      slug: "babyliss-fxone-lo-profx",
      description:
        "Low-profile FXONE body with the all-metal build. Sits flat, fades clean. Magnetic charge, brushless motor, full-day battery.",
      price: 20999,
      compareAtPrice: 22900,
      collectionId: clippersId,
      images: [
        "https://thebarberplug.com/cdn/shop/files/9F40E963-0B72-4784-A4F6-832E963AF2F3.jpg?v=1700677699&width=1200",
        "https://thebarberplug.com/cdn/shop/files/247407FB-7881-4078-960F-192451A0307C.jpg?v=1700677700&width=1200",
      ],
      tags: ["BaByliss PRO", "clippers"],
      inStock: true,
      sortOrder: 13,
    });

    await ctx.db.insert("products", {
      name: "Gamma+ Boosted Clipper GP601M",
      slug: "gamma-plus-rebel",
      description:
        "Brushless motor technology with 9000 RPM and ultra-light aluminum housing. 4-hour runtime. Comes zero-gapped factory. Built for the working barber.",
      price: 18999,
      compareAtPrice: 22000,
      collectionId: clippersId,
      images: [
        "https://thebarberplug.com/cdn/shop/products/image.webp?v=1653435087&width=1200",
        "https://thebarberplug.com/cdn/shop/files/gamma-boosted-cordless-clipper-gp601m-black-cover.png?v=1701798324&width=1200",
      ],
      variants: [{ name: "Color", options: ["Matte Black", "Gunmetal"] }],
      tags: ["Gamma+", "clippers"],
      inStock: true,
      featured: true,
      sortOrder: 14,
    });

    await ctx.db.insert("products", {
      name: "Gamma+ X-Ergo Clipper",
      slug: "gamma-plus-x-ergo",
      description:
        "Ergonomic grip, brushless motor, modular design. The X-Ergo sits naturally in the hand on long cuts. Interchangeable panels, zero vibration.",
      price: 19999,
      compareAtPrice: 27500,
      collectionId: clippersId,
      images: [
        "https://thebarberplug.com/cdn/shop/products/85f04b88-489c-4efd-8aa9-dd85fcd6f9fb.png?v=1634952041&width=1200",
        "https://thebarberplug.com/cdn/shop/files/9163_5efa1221-c32a-47b5-9171-35017f15df13_600x_jpg.webp?v=1701799064&width=1200",
      ],
      tags: ["Gamma+", "clippers"],
      inStock: true,
      sortOrder: 15,
    });

    await ctx.db.insert("products", {
      name: "Gamma+ Ergo Clipper",
      slug: "gamma-plus-ergo",
      description:
        "The entry point to the Gamma+ cordless lineup. Brushless motor, lightweight body, ready to zero-gap. Punches above its price.",
      price: 12999,
      compareAtPrice: 15999,
      collectionId: clippersId,
      images: [
        "https://thebarberplug.com/cdn/shop/products/image_445db045-9680-449e-8c5c-3f7118f225d4.png?v=1635022030&width=832",
        "https://thebarberplug.com/cdn/shop/files/gamma-x-ergo-cordless-clipper-back.jpg?v=1701798563&width=1200",
      ],
      tags: ["Gamma+", "clippers"],
      inStock: true,
      sortOrder: 16,
    });

    await ctx.db.insert("products", {
      name: "Oster Octane Clipper",
      slug: "oster-octane",
      description:
        "Heavy-duty detachable blade clipper built for salon-grade use. Powerful pivot motor runs all day without overheating. Oster's flagship for the professional chair.",
      price: 39999,
      collectionId: clippersId,
      images: [
        "https://thebarberplug.com/cdn/shop/products/image_7b7f3d27-50bd-4e8a-b4cf-8df501c6c370.jpg?v=1635027082&width=1920",
      ],
      tags: ["Oster", "clippers"],
      inStock: true,
      sortOrder: 17,
    });

    await ctx.db.insert("products", {
      name: "Cocco Hyper Veloce Pro Clipper",
      slug: "cocco-hyper-veloce-pro",
      description:
        "Italian-engineered high-velocity motor in a sleek all-metal housing. Ultra-fast blade speed with surgical precision. Built for barbers who want something different.",
      price: 19000,
      compareAtPrice: 22999,
      collectionId: clippersId,
      images: [
        "https://thebarberplug.com/cdn/shop/files/2_5bc39c73-8b8a-4b83-a069-0dc7159e1559.png?v=1737400311&width=832",
        "https://thebarberplug.com/cdn/shop/files/3_7728b46a-1f7b-4e20-8ecd-7b0c05140877.png?v=1737400311&width=832",
      ],
      tags: ["Cocco", "clippers"],
      inStock: true,
      sortOrder: 18,
    });

    // ── TRIMMERS ────────────────────────────────────────────────────────────

    await ctx.db.insert("products", {
      name: "Andis Pro Foil Shaver",
      slug: "andis-pro-foil-shaver",
      description:
        "Hypo-allergenic gold titanium foil. Ultra-close shave without irritation. Great for bald fades, skin taps, and final touch-up after the fade.",
      price: 7999,
      collectionId: trimmersId,
      images: [
        "https://thebarberplug.com/cdn/shop/files/AN1007_1000x1000_png.webp?v=1698080896&width=1920",
      ],
      tags: ["Andis", "trimmers"],
      inStock: true,
      sortOrder: 19,
    });

    await ctx.db.insert("products", {
      name: "Wahl Professional 5-Star Detailer",
      slug: "wahl-5star-detailer-t",
      description:
        "T-wide blade for clean outlines and detailed work. Rotary motor, adjustable taper lever. A detailer that lives in the apron pocket.",
      price: 8999,
      collectionId: trimmersId,
      images: [
        "https://thebarberplug.com/cdn/shop/files/wahl-cordless-magic-clip-8148.png?v=1714687957&width=1200",
      ],
      variants: [{ name: "Cord", options: ["Corded", "Cordless"] }],
      tags: ["Wahl", "trimmers"],
      inStock: true,
      sortOrder: 20,
    });

    await ctx.db.insert("products", {
      name: "BaByliss PRO GoldFX Trimmer",
      slug: "babyliss-goldfx-trimmer",
      description:
        "All-metal body, zero-gap blade with DLC coating. The GoldFX trimmer stands up to full days in the shop. Tight lines every time.",
      price: 15500,
      collectionId: trimmersId,
      images: [
        "https://thebarberplug.com/cdn/shop/files/goldfxclipper.png?v=1690079193&width=1200",
      ],
      tags: ["BaByliss PRO", "trimmers"],
      inStock: true,
      featured: true,
      sortOrder: 21,
    });

    // ── HAIR CARE ────────────────────────────────────────────────────────────

    await ctx.db.insert("products", {
      name: "OGX Coconut Milk Shampoo",
      slug: "ogx-coconut-milk-shampoo",
      description:
        "Strengthening, sulfate-free formula with coconut milk and white orchid extract. Restores elasticity and shine without stripping natural oils.",
      price: 1299,
      collectionId: hairCareId,
      images: [
        "https://placehold.co/600x800/111111/C9A84C?text=OGX+Shampoo",
      ],
      tags: ["OGX", "hair-care"],
      inStock: true,
      sortOrder: 22,
    });

    await ctx.db.insert("products", {
      name: "Mizani True Textures Curl Define Cream",
      slug: "mizani-curl-define-cream",
      description:
        "Defines and elongates natural curls while fighting frizz. Formulated specifically for textured hair. Leaves hair touchable, not crunchy.",
      price: 2499,
      compareAtPrice: 3200,
      collectionId: hairCareId,
      images: [
        "https://placehold.co/600x800/111111/C9A84C?text=Mizani+Curl",
      ],
      tags: ["Mizani", "hair-care"],
      inStock: true,
      sortOrder: 23,
    });

    // ── STYLING TOOLS ────────────────────────────────────────────────────────

    await ctx.db.insert("products", {
      name: "BaByliss PRO Nano Titanium Flat Iron",
      slug: "babyliss-pro-nano-titanium-flat-iron",
      description:
        "Nano titanium plates heat evenly and hold temperature under load. Ultra-fast 30-second heat-up. 50 heat settings from 250°F to 450°F.",
      price: 12500,
      compareAtPrice: 16000,
      collectionId: stylingToolsId,
      images: [
        "https://placehold.co/600x800/111111/C9A84C?text=BaByliss+Flat+Iron",
      ],
      variants: [{ name: "Width", options: ["1 inch", "1.5 inch", "2 inch"] }],
      tags: ["BaByliss PRO", "styling-tools"],
      inStock: true,
      featured: true,
      sortOrder: 24,
    });

    await ctx.db.insert("products", {
      name: "CHI G2 Ceramic & Titanium Flat Iron",
      slug: "chi-g2-flat-iron",
      description:
        "Titanium-infused ceramic plates for smooth glide and consistent heat. Negative ion generator reduces frizz. Auto shut-off, dual voltage.",
      price: 9800,
      collectionId: stylingToolsId,
      images: [
        "https://placehold.co/600x800/111111/C9A84C?text=CHI+G2",
      ],
      variants: [{ name: "Width", options: ["1 inch", "1.75 inch"] }],
      tags: ["CHI", "styling-tools"],
      inStock: true,
      sortOrder: 25,
    });

    // ── PROFESSIONAL PRODUCTS ────────────────────────────────────────────────

    await ctx.db.insert("products", {
      name: "Mizani Butter Blend Relaxer",
      slug: "mizani-butter-blend-relaxer",
      description:
        "Professional-strength relaxer with a butter-enriched base for added conditioning. Formulated to minimize scalp irritation. Available in mild, regular, and super.",
      price: 4500,
      compareAtPrice: 5500,
      collectionId: proProductsId,
      images: [
        "https://placehold.co/600x800/111111/C9A84C?text=Mizani+Relaxer",
      ],
      variants: [{ name: "Strength", options: ["Mild", "Regular", "Super"] }],
      tags: ["Mizani", "professional-products"],
      inStock: true,
      sortOrder: 26,
    });

    await ctx.db.insert("products", {
      name: "Avlon Affirm Fiberguard Relaxer",
      slug: "avlon-affirm-fiberguard",
      description:
        "Fiber-protection technology reduces breakage during the chemical process. The go-to for clients with fragile or previously treated hair.",
      price: 5200,
      collectionId: proProductsId,
      images: [
        "https://placehold.co/600x800/111111/C9A84C?text=Avlon+Affirm",
      ],
      variants: [
        { name: "Strength", options: ["Mild", "Regular", "Super"] },
        { name: "Size", options: ["16 oz", "32 oz"] },
      ],
      tags: ["Avlon", "professional-products"],
      inStock: true,
      featured: true,
      sortOrder: 27,
    });

    // ── BUNDLES & SPECIALS ───────────────────────────────────────────────────

    await ctx.db.insert("products", {
      name: "Barber Starter Kit",
      slug: "barber-starter-kit",
      description:
        "Everything you need to set up your first station. Wahl Magic Clip Cordless + BaByliss PRO GoldFX Trimmer. Two pro-grade tools, one bundle price. Start cutting, stop second-guessing.",
      price: 26999,
      compareAtPrice: 29999,
      collectionId: bundlesId,
      images: [
        "https://thebarberplug.com/cdn/shop/files/wahl-cordless-magic-clip-8148.png?v=1714687957&width=1200",
        "https://thebarberplug.com/cdn/shop/files/goldfxclipper.png?v=1690079193&width=1200",
      ],
      tags: ["bundles", "specials", "Wahl", "BaByliss PRO"],
      inStock: true,
      featured: true,
      sortOrder: 28,
    });

    await ctx.db.insert("products", {
      name: "Fade Master Bundle",
      slug: "fade-master-bundle",
      description:
        "The fade combo that handles everything from skin to blend. JRL Fresh Fade 2020C Clipper + BaByliss PRO GoldFX Trimmer. Zero-gap-ready from the box. One price, full setup.",
      price: 29999,
      compareAtPrice: 37499,
      collectionId: bundlesId,
      images: [
        "https://thebarberplug.com/cdn/shop/files/image_98933770-9f79-4544-ba8e-0383c3c12bc1.jpg?v=1690675065&width=1920",
        "https://thebarberplug.com/cdn/shop/files/goldfxclipper.png?v=1690079193&width=1200",
      ],
      tags: ["bundles", "specials", "JRL", "BaByliss PRO"],
      inStock: true,
      featured: true,
      sortOrder: 29,
    });

    await ctx.db.insert("products", {
      name: "Gold Duo Bundle",
      slug: "gold-duo-bundle",
      description:
        "Two of Wahl's finest in one kit. Cordless Gold Magic Clip + Wahl 5-Star Detailer. Premium look, premium cut, priced as a set.",
      price: 24999,
      compareAtPrice: 27899,
      collectionId: bundlesId,
      images: [
        "https://thebarberplug.com/cdn/shop/products/image_4ad1d071-bbd1-49ba-878d-7f0bf0807adf.jpg?v=1660260577&width=832",
        "https://thebarberplug.com/cdn/shop/files/wahl-cordless-magic-clip-8148.png?v=1714687957&width=1200",
      ],
      tags: ["bundles", "specials", "Wahl"],
      inStock: true,
      sortOrder: 30,
    });

    return {
      success: true,
      message: "Seeded 7 collections and 30 Brashae products (18 clippers, 3 trimmers, 2 hair care, 2 styling tools, 2 pro products, 3 bundles).",
    };
  },
});
