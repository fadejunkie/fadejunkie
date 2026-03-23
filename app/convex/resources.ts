import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listResources = query({
  args: {
    audience: v.optional(v.string()),
  },
  handler: async (ctx, { audience }) => {
    const all = await ctx.db
      .query("resources")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect();

    const filtered = audience
      ? all.filter((r) => {
          if (r.audiences) return r.audiences.includes(audience);
          return r.audience === audience;
        })
      : all;

    return filtered.sort((a, b) => a.order - b.order);
  },
});

export const listCategories = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db
      .query("resources")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect();
    const cats = [...new Set(all.map((r) => r.category))].sort();
    return cats;
  },
});

export const seedResources = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("resources").collect();
    const hasAffiliate = all.some((r) => r.businessName === "Milady");
    if (hasAffiliate) return "already seeded";

    const now = Date.now();
    const seeds = [
      {
        category: "Education",
        audience: "Students",
        businessName: "Milady",
        description: "Industry-leading barbering textbooks, study guides, and state board prep.",
        offerUrl: "https://milady.com",
        order: 0,
      },
      {
        category: "Education",
        audience: "Students",
        businessName: "BarberEVO",
        description: "Online barbering courses and mentorship programs for all skill levels.",
        offerUrl: "https://barberevo.com",
        order: 1,
      },
      {
        category: "Supplies",
        audience: "Barbers",
        businessName: "Andis",
        description: "Professional clippers, trimmers, and grooming tools trusted by top barbers.",
        offerUrl: "https://andis.com",
        order: 2,
      },
      {
        category: "Equipment",
        audience: "Shops",
        businessName: "Takara Belmont",
        description: "Premium barber chairs and salon furniture built to last.",
        offerUrl: "https://takarabelmont.com",
        order: 3,
      },
      {
        category: "Business",
        audience: "Shops",
        businessName: "Square Appointments",
        description: "Booking, payments, and client management — free for individuals.",
        offerUrl: "https://squareup.com/us/en/appointments",
        order: 4,
      },
      {
        category: "Business",
        audience: "Shops",
        businessName: "GlossGenius",
        description: "All-in-one platform for appointment scheduling, payments, and marketing.",
        offerUrl: "https://glossgenius.com",
        order: 5,
      },
    ];

    await Promise.all(
      seeds.map((s) =>
        ctx.db.insert("resources", { ...s, isActive: true, createdAt: now })
      )
    );

    return "seeded";
  },
});

// Migrate existing resources: assign audience based on current category
export const migrateAudience = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("resources").collect();

    const audienceMap: Record<string, string> = {
      Education: "Students",
      Products: "Barbers",
      Supplies: "Barbers",
      Equipment: "Shops",
      Business: "Shops",
    };

    let updated = 0;
    for (const r of all) {
      if (!r.audience) {
        const audience = audienceMap[r.category] ?? "Barbers";
        await ctx.db.patch(r._id, { audience });
        updated++;
      }
    }

    return `Migrated ${updated} resources`;
  },
});

// Seed rich resource directory (idempotent by businessName)
export const seedRichResources = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("resources").collect();
    const existingNames = new Set(existing.map((r) => r.businessName));
    const now = Date.now();

    const resources = [
      // Clippers & Tools
      {
        businessName: "Wahl Professional",
        category: "Clippers & Tools",
        audiences: ["Barbers", "Students", "Shops"],
        tagline: "Industry-standard clippers trusted by pros worldwide",
        description: "The Magic Clip & Senior are barbershop staples. Known for precision fades, long battery life, and durable stagger-tooth blades that last years.",
        logoUrl: "https://logo.clearbit.com/wahlpro.com",
        offerUrl: "https://www.wahlpro.com",
        badge: "#1 Clipper Brand",
        price: "From $100",
        affiliate: true,
        order: 10,
      },
      {
        businessName: "Andis",
        category: "Clippers & Tools",
        audiences: ["Barbers", "Students"],
        tagline: "The gold standard for precision line-ups",
        description: "The Andis Master and T-Outliner are go-to tools for razor-sharp edges and detail work. Preferred by barbers who specialize in fades and clean lines.",
        logoUrl: "https://logo.clearbit.com/andis.com",
        offerUrl: "https://www.andis.com",
        badge: "Best for Fades",
        price: "From $80",
        affiliate: true,
        order: 11,
      },
      {
        businessName: "Oster Professional",
        category: "Clippers & Tools",
        audiences: ["Barbers", "Shops"],
        tagline: "Built like a tank — legendary durability",
        description: "The Oster Classic 76 is the most iconic clipper in barbering history. Heavy-duty rotary motor handles thick hair with zero effort. Barbers pass these down for decades.",
        logoUrl: "https://logo.clearbit.com/osterpro.com",
        offerUrl: "https://www.osterpro.com",
        badge: "Most Durable",
        price: "From $120",
        affiliate: true,
        order: 12,
      },
      {
        businessName: "BaBylissPRO",
        category: "Clippers & Tools",
        audiences: ["Barbers", "Students"],
        tagline: "Next-gen performance for elite barbers",
        description: "The GoldFX and SilverFX trimmers feature powerful Ferrari-designed motors and zero-gap capability. A rising favorite in competitions and high-end shops.",
        logoUrl: "https://logo.clearbit.com/babylisspro.com",
        offerUrl: "https://www.babylisspro.com",
        badge: "Competition Grade",
        price: "From $130",
        affiliate: true,
        order: 13,
      },
      {
        businessName: "Gamma+",
        category: "Clippers & Tools",
        audiences: ["Barbers"],
        tagline: "Magnetic motor tech with 200-min battery life",
        description: "The Cyborg clipper delivers 7,500 RPM, full metal body, and 200 minutes of runtime. Built for barbers who grind all day without interruption.",
        logoUrl: "https://logo.clearbit.com/gammapiu.com",
        offerUrl: "https://www.gammapiu.com",
        badge: "Longest Runtime",
        price: "From $200",
        affiliate: true,
        order: 14,
      },
      // Booking & Business
      {
        businessName: "Booksy",
        category: "Booking & Business",
        audiences: ["Barbers", "Shops"],
        tagline: "The #1 barbershop booking platform worldwide",
        description: "Used by 125,000+ businesses in 40+ countries. Handles scheduling, payments, client management, marketing blasts, and reviews all in one app.",
        logoUrl: "https://logo.clearbit.com/booksy.com",
        offerUrl: "https://booksy.com",
        badge: "Most Popular",
        price: "From $29.99/mo",
        affiliate: true,
        order: 20,
      },
      {
        businessName: "theCut",
        category: "Booking & Business",
        audiences: ["Barbers", "Shops"],
        tagline: "Built by barbers, for barbers",
        description: "The only booking app designed exclusively for the barbering community. Manage bookings, booth rent tracking, and client relationships without the noise of general salon apps.",
        logoUrl: "https://logo.clearbit.com/thecut.co",
        offerUrl: "https://thecut.co",
        badge: "Barber-Built",
        price: "Free + Premium",
        affiliate: true,
        order: 21,
      },
      {
        businessName: "Square Appointments",
        category: "Booking & Business",
        audiences: ["Shops", "Barbers"],
        tagline: "Best-in-class POS + booking combo",
        description: "Perfect for shops already using Square for payments. Seamlessly integrates scheduling with your POS system, CRM, and team management in one ecosystem.",
        logoUrl: "https://logo.clearbit.com/squareup.com",
        offerUrl: "https://squareup.com/us/en/appointments",
        badge: "Best POS Integration",
        price: "Free – $69/mo",
        affiliate: true,
        order: 22,
      },
      {
        businessName: "Fresha",
        category: "Booking & Business",
        audiences: ["Barbers", "Shops"],
        tagline: "Free marketplace + booking software",
        description: "The only subscription-free booking platform with built-in marketplace exposure. Walk-ins, no-show protection, loyalty programs, and Google/Instagram integrations included.",
        logoUrl: "https://logo.clearbit.com/fresha.com",
        offerUrl: "https://fresha.com",
        badge: "No Monthly Fee",
        price: "Free (commission on new clients)",
        affiliate: true,
        order: 23,
      },
      {
        businessName: "GlossGenius",
        category: "Booking & Business",
        audiences: ["Barbers"],
        tagline: "Premium booking for independent barbers",
        description: "Mobile-first platform with a premium brand aesthetic. Perfect for solo operators who want a sleek booking page, automated reminders, and simple marketing without complexity.",
        logoUrl: "https://logo.clearbit.com/glossgenius.com",
        offerUrl: "https://glossgenius.com",
        badge: "Best for Solos",
        price: "From $24/mo",
        affiliate: true,
        order: 24,
      },
      // Education
      {
        businessName: "Milady",
        category: "Education",
        audiences: ["Students", "Schools"],
        tagline: "The industry's most trusted barbering curriculum",
        description: "Milady's Standard Barbering is used in schools nationwide. Their online platform includes digital textbooks, exam prep, and instructor resources for state board success.",
        logoUrl: "https://logo.clearbit.com/milady.com",
        offerUrl: "https://milady.com",
        badge: "Industry Standard",
        price: "Varies",
        affiliate: false,
        order: 30,
      },
      {
        businessName: "Barbicide",
        category: "Education",
        audiences: ["Students", "Barbers", "Schools"],
        tagline: "Official sanitation certification for barbers",
        description: "Barbicide Certification is required or strongly recommended in most states. Fast, free online course covering infection control, disinfection protocols, and professional safety.",
        logoUrl: "https://logo.clearbit.com/barbicide.com",
        offerUrl: "https://www.barbicide.com/certification",
        badge: "Required Cert",
        price: "Free",
        affiliate: false,
        order: 31,
      },
      {
        businessName: "Pivot Point",
        category: "Education",
        audiences: ["Students", "Schools"],
        tagline: "World-class cosmetology & barber education",
        description: "Comprehensive online learning platform used by top barber schools. Covers theory, technique, and business skills. Includes interactive digital lessons and instructor tools.",
        logoUrl: "https://logo.clearbit.com/pivot-point.com",
        offerUrl: "https://pivot-point.com",
        badge: "School Favorite",
        price: "School pricing",
        affiliate: false,
        order: 32,
      },
      {
        businessName: "YouTube – Barber Education",
        category: "Education",
        audiences: ["Students", "Barbers"],
        tagline: "Free technique library from the best in the game",
        description: "Channels like Chuka The Barber, Btcuts, and SeanFadeKing offer free world-class technique tutorials. From beginner fades to competition cuts — thousands of free lessons.",
        logoUrl: "https://logo.clearbit.com/youtube.com",
        offerUrl: "https://youtube.com",
        badge: "Free Forever",
        price: "Free",
        affiliate: false,
        order: 33,
      },
      // Marketing & Social
      {
        businessName: "Instagram",
        category: "Marketing & Social",
        audiences: ["Barbers", "Shops", "Students"],
        tagline: "The barber's portfolio & client acquisition engine",
        description: "The primary platform for building your brand, showcasing cuts, and attracting new clients. Reels of haircuts consistently go viral and bring in walk-ins from across the city.",
        logoUrl: "https://logo.clearbit.com/instagram.com",
        offerUrl: "https://instagram.com",
        badge: "Must-Have",
        price: "Free",
        affiliate: false,
        order: 40,
      },
      {
        businessName: "Google Business Profile",
        category: "Marketing & Social",
        audiences: ["Shops", "Barbers"],
        tagline: "Show up when clients search 'barber near me'",
        description: "A fully optimized Google Business Profile is your most powerful free marketing tool. Controls your map listing, reviews, hours, photos, and local search rankings.",
        logoUrl: "https://logo.clearbit.com/google.com",
        offerUrl: "https://business.google.com",
        badge: "Local SEO Essential",
        price: "Free",
        affiliate: false,
        order: 41,
      },
      {
        businessName: "Canva",
        category: "Marketing & Social",
        audiences: ["Barbers", "Shops", "Students"],
        tagline: "Design promo graphics in minutes",
        description: "Create social media posts, loyalty cards, service menus, and shop signage with zero design experience. Barber-specific templates available. Essential for consistent branding.",
        logoUrl: "https://logo.clearbit.com/canva.com",
        offerUrl: "https://canva.com",
        badge: "Easy Design",
        price: "Free + Pro $13/mo",
        affiliate: true,
        order: 42,
      },
      {
        businessName: "TikTok",
        category: "Marketing & Social",
        audiences: ["Barbers", "Students", "Shops"],
        tagline: "Go viral with your craft",
        description: "Short-form video content showing fade transformations, shop culture, and barber life reaches millions. TikTok has launched multiple barbers to 100k+ followers organically.",
        logoUrl: "https://logo.clearbit.com/tiktok.com",
        offerUrl: "https://tiktok.com",
        badge: "Viral Potential",
        price: "Free",
        affiliate: false,
        order: 43,
      },
      {
        businessName: "Mailchimp",
        category: "Marketing & Social",
        audiences: ["Shops", "Barbers"],
        tagline: "Email marketing for client retention",
        description: "Send appointment reminders, promotions, and newsletters to your client list. Automation sequences can re-engage lapsed clients and boost rebooking rates significantly.",
        logoUrl: "https://logo.clearbit.com/mailchimp.com",
        offerUrl: "https://mailchimp.com",
        badge: "Retention Tool",
        price: "Free – $13/mo",
        affiliate: true,
        order: 44,
      },
      // Supplies & Products
      {
        businessName: "BarberSupply.com",
        category: "Supplies & Products",
        audiences: ["Barbers", "Shops", "Students"],
        tagline: "Pro-grade supplies for the modern barber",
        description: "One-stop shop for clippers, trimmers, blades, capes, cleaning supplies, and grooming products from top brands like Andis, Wahl, BaByliss, and more.",
        logoUrl: "https://logo.clearbit.com/barbersupply.com",
        offerUrl: "https://barbersupply.com",
        badge: "Best Selection",
        price: "Varies",
        affiliate: true,
        order: 50,
      },
      {
        businessName: "Suavecito",
        category: "Supplies & Products",
        audiences: ["Barbers", "Shops"],
        tagline: "The barber-culture grooming brand",
        description: "Pomades, beard oils, and grooming products that barbers actually recommend to clients. Strong retail opportunity — shops carry Suavecito as a premium upsell at the chair.",
        logoUrl: "https://logo.clearbit.com/suavecito.com",
        offerUrl: "https://suavecito.com",
        badge: "Client Favorite",
        price: "Retail/Wholesale",
        affiliate: true,
        order: 51,
      },
      {
        businessName: "Amazon Professional",
        category: "Supplies & Products",
        audiences: ["Barbers", "Shops", "Students"],
        tagline: "Fast delivery on all your barber essentials",
        description: "Neck strips, capes, blade oil, clipper guards, barber chairs, and station equipment — all with Prime shipping. Ideal for stocking up a shop or student kit quickly.",
        logoUrl: "https://logo.clearbit.com/amazon.com",
        offerUrl: "https://amazon.com",
        badge: "Fast Shipping",
        price: "Varies",
        affiliate: true,
        order: 52,
      },
      {
        businessName: "Tomb45",
        category: "Supplies & Products",
        audiences: ["Barbers", "Shops"],
        tagline: "Wireless charging gear built for barbers",
        description: "Tomb45 makes wireless charging pods, clipper wraps, and organizers specifically designed for the barber station. Keeps your tools charged and your station clean.",
        logoUrl: "https://logo.clearbit.com/tomb45.com",
        offerUrl: "https://tomb45.com",
        badge: "Station Upgrade",
        price: "From $40",
        affiliate: true,
        order: 53,
      },
      // Community & Network
      {
        businessName: "Behind The Chair",
        category: "Community & Network",
        audiences: ["Barbers", "Students", "Schools"],
        tagline: "The largest pro beauty community online",
        description: "Education articles, technique breakdowns, product reviews, and a massive community of barbers and stylists. Great for staying current on trends and connecting with peers.",
        logoUrl: "https://logo.clearbit.com/behindthechair.com",
        offerUrl: "https://behindthechair.com",
        badge: "Largest Community",
        price: "Free",
        affiliate: false,
        order: 60,
      },
      {
        businessName: "BarberEVO",
        category: "Community & Network",
        audiences: ["Barbers", "Shops", "Schools"],
        tagline: "The barber industry's premier magazine & network",
        description: "International publication and community platform covering technique, business, competitions, and industry news. Widely read by shop owners and seasoned professionals.",
        logoUrl: "https://logo.clearbit.com/barberevo.com",
        offerUrl: "https://barberevo.com",
        badge: "Industry Press",
        price: "Free",
        affiliate: false,
        order: 61,
      },
      {
        businessName: "Reddit r/Barber",
        category: "Community & Network",
        audiences: ["Students", "Barbers"],
        tagline: "Real talk from working barbers",
        description: "Unfiltered advice, critique sessions, tool recommendations, and troubleshooting from an active global barber community. Great for students seeking honest feedback on their work.",
        logoUrl: "https://logo.clearbit.com/reddit.com",
        offerUrl: "https://reddit.com/r/barber",
        badge: "Honest Advice",
        price: "Free",
        affiliate: false,
        order: 62,
      },
    ];

    let inserted = 0;
    for (const r of resources) {
      if (!existingNames.has(r.businessName)) {
        await ctx.db.insert("resources", { ...r, isActive: true, createdAt: now });
        inserted++;
      }
    }

    return inserted > 0 ? `Inserted ${inserted} resources` : "Already seeded";
  },
});

// Delete old-format resources (no audiences array, not internal) — run once to clean up legacy seeds
export const purgeOldResources = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("resources").collect();
    const toDelete = all.filter((r) => !r.isInternal && !r.audiences);
    for (const r of toDelete) {
      await ctx.db.delete(r._id);
    }
    return `Deleted ${toDelete.length} old resources`;
  },
});

// Seed the three tool resources (idempotent by businessName)
export const seedToolResources = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("resources").collect();
    const existingNames = new Set(existing.map((r) => r.businessName));

    const now = Date.now();
    const tools = [
      {
        businessName: "TDLR Practical Exam Guide",
        category: "State Board Prep",
        audience: "Students",
        description:
          "Step-by-step service breakdowns, bag checklists, and pro tips for every section of the Texas Class A Barber Practical Exam.",
        offerUrl: "/tools/exam-guide",
        isInternal: true,
        order: 10,
      },
      {
        businessName: "Flashcards",
        category: "State Board Prep",
        audience: "Students",
        description:
          "Study key terminology, anatomy, and barbering theory. Flip cards until you've got it locked in.",
        offerUrl: "/tools/flashcards",
        isInternal: true,
        order: 11,
      },
      {
        businessName: "Practice Tests",
        category: "State Board Prep",
        audience: "Students",
        description:
          "Multiple-choice quizzes modeled after real state board exams. Track your score and review missed questions.",
        offerUrl: "/tools/practice-test",
        isInternal: true,
        order: 12,
      },
    ];

    let inserted = 0;
    for (const t of tools) {
      if (!existingNames.has(t.businessName)) {
        await ctx.db.insert("resources", { ...t, isActive: true, createdAt: now });
        inserted++;
      }
    }

    return inserted > 0 ? `Inserted ${inserted} tool resources` : "Already seeded";
  },
});
