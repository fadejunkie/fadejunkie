import { mutation } from "./_generated/server";
import { v } from "convex/values";

// One-time seed: populate the clients registry
// Run: npx convex run seed:seedClients
export const seedClients = mutation({
  args: {},
  handler: async (ctx) => {
    const clients = [
      { slug: "wcorwin", name: "Weichert Corwin", status: "active" as const, hubUrl: "https://wcorwin.anthonytatis.com" },
      { slug: "arquero", name: "Arquero Co.", status: "active" as const, hubUrl: "https://arqueroco.anthonytatis.com" },
      { slug: "sydney", name: "Sydney Spillman", status: "active" as const, hubUrl: "https://sydneyspillman.anthonytatis.com" },
      { slug: "wizardry", name: "Wizardry Ink", status: "active" as const, hubUrl: "https://wizardry.anthonytatis.com" },
      { slug: "allison-bond", name: "Allison Bond", status: "prospect" as const, hubUrl: "https://allison-bond.anthonytatis.com" },
      { slug: "chuco", name: "Chuco", status: "prospect" as const, hubUrl: "https://chuco.anthonytatis.com" },
    ];

    for (const client of clients) {
      const existing = await ctx.db
        .query("clients")
        .withIndex("by_slug", (q) => q.eq("slug", client.slug))
        .first();

      if (!existing) {
        await ctx.db.insert("clients", { ...client, createdAt: Date.now() });
        console.log(`Seeded: ${client.slug}`);
      } else {
        console.log(`Already exists: ${client.slug}`);
      }
    }
  },
});
