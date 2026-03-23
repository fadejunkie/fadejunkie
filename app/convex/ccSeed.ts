import { mutation } from "./_generated/server";

export const seedMetrics = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("ccMetrics").first();
    if (existing) {
      console.log("ccMetrics already seeded — skipping");
      return;
    }

    const metrics: Record<string, { count: number; target: number; label: string; unit: string; updated: string }> = {
      users: { count: 0, target: 10, label: "Real Barbers", unit: "users", updated: "2026-03-14" },
      mrr: { count: 950, target: 950, label: "Monthly Revenue", unit: "USD", updated: "2026-03-14" },
      prospects: { count: 1, target: 3, label: "Warm Prospects", unit: "leads", updated: "2026-03-14" },
      outreach: { count: 1, target: 1, label: "Outreach Sent", unit: "msgs", updated: "2026-03-14" },
      clients: { count: 1, target: 1, label: "First Client", unit: "clients", updated: "2026-03-14" },
      affiliate: { count: 0, target: 0, label: "Affiliate Clicks", unit: "clicks", updated: "" },
      profiles: { count: 0, target: 3, label: "Demo Profiles", unit: "live", updated: "" },
    };

    for (const [key, data] of Object.entries(metrics)) {
      await ctx.db.insert("ccMetrics", { key, ...data });
    }

    console.log("Seeded 7 CC metrics");
  },
});

export const seedCrm = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("ccProspects").first();
    if (existing) {
      console.log("ccProspects already seeded — skipping");
      return;
    }

    await ctx.db.insert("ccProspects", {
      name: "Weichert Realtors — Corwin & Associates",
      type: "Real Estate SEO",
      contact: "Joe Corwin (Owner) · Deanna Bazan (Office Mgr)",
      location: "New Braunfels, TX",
      email: "Joe@joecorwin.com",
      phone: "",
      status: "active",
      value: 950,
      notes: "ACTIVE CLIENT. Month 1 paid $950 on 2026-03-09 (Visa -1802). Veteran-owned RE brokerage on Weichert franchise. Live site: wcorwin.anthonytatis.com. Original: wcorwin.com. iHouseWeb admin GRANTED 2026-03-14. Waiting on: GSC access, GBP access.",
      lastContact: "2026-03-14",
      createdAt: "2026-03-14",
      payments: [
        {
          month: 1,
          amount: 950,
          date: "2026-03-09",
          invoiceNumber: "NPRYS7ZO-0001",
          receiptNumber: "2644-0954",
          method: "Visa -1802",
          receipt: "seo-engine/WCORWIN/WCORWIN MONTH 1 RECEIPT.pdf",
        },
      ],
      history: [
        { status: "identified", date: "2026-03-01", note: "Initial contact" },
        { status: "contacted", date: "2026-03-05", note: "SEO audit delivered" },
        { status: "meeting", date: "2026-03-10", note: "Kickoff strategy discussion" },
        { status: "proposal", date: "2026-03-14", note: "Contract signed. Invoice sent — awaiting payment" },
        { status: "active", date: "2026-03-14", note: "Month 1 paid ($950) — receipt NPRYS7ZO-0001" },
        { status: "active", date: "2026-03-14", note: "iHouseWeb admin access granted — title tags, meta, schema work unblocked" },
      ],
    });

    console.log("Seeded 1 CC prospect (Weichert/Corwin)");
  },
});

export const seedContent = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("ccContent").first();
    if (existing) {
      console.log("ccContent already seeded — skipping");
      return;
    }

    const items = [
      { title: "How to Nail the TDLR Practical Exam", type: "blog", status: "idea", audience: "Students", priority: "high" },
      { title: "Top 10 Clippers for Barbers in 2026", type: "blog", status: "idea", audience: "Barbers", priority: "high" },
      { title: "FadeJunkie Platform Launch Announcement", type: "social", status: "idea", audience: "All", priority: "medium" },
      { title: "State Board Prep Guide: What Every TX Barber Student Needs to Know", type: "blog", status: "writing", audience: "Students", priority: "high", targetDate: "2026-03-21", notes: "SEO target: tdlr barber exam", createdAt: "2026-03-14" },
      { title: "Top 5 Clippers Every Texas Barber Needs in 2026", type: "blog", status: "idea", audience: "Barbers", priority: "high", targetDate: "2026-03-28", notes: "Affiliate angle: link to clippers in resources directory", createdAt: "2026-03-14" },
      { title: "FadeJunkie Launch: Free Tools for Barber Students", type: "social", status: "idea", audience: "Students", priority: "high", targetDate: "2026-03-15", notes: "IG caption + story series. Drive signups.", createdAt: "2026-03-14" },
      { title: "How Barbers Can Use AI to Grow Their Business", type: "blog", status: "writing", audience: "Barbers", priority: "medium", targetDate: "2026-04-01", notes: "FJ services arm thought leadership. SEO target: AI for barbers", createdAt: "2026-03-14" },
      { title: "TDLR Exam 2026: Everything You Need to Know", type: "blog", status: "idea", audience: "Students", priority: "high", targetDate: "2026-03-20", notes: "SEO gold. Target: tdlr barber exam texas 2026", createdAt: "2026-03-14" },
    ];

    for (const item of items) {
      await ctx.db.insert("ccContent", {
        title: item.title,
        type: item.type,
        status: item.status,
        audience: item.audience,
        priority: item.priority,
        targetDate: item.targetDate,
        notes: item.notes,
        createdAt: item.createdAt,
      });
    }

    console.log("Seeded 8 CC content items");
  },
});

export const seedNotes = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("ccNotes").first();
    if (existing) {
      console.log("ccNotes already seeded — skipping");
      return;
    }

    const notes = [
      { text: "Cycle 2 complete. Dashboard has Insights, CRM, Content, Notes, Git Diff panels. Server has projections API.", createdAt: "2026-03-14T18:37:19.072Z" },
      { text: "First note — working through the night building CC. Feeling good about progress.", createdAt: "2026-03-14T07:48:29.110Z" },
    ];

    for (const note of notes) {
      await ctx.db.insert("ccNotes", note);
    }

    console.log("Seeded 2 CC notes");
  },
});
