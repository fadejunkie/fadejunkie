import { query, mutation, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// ── Queries ────────────────────────────────────────────────────────────────────

export const listDecks = query({
  args: {},
  handler: async (ctx) => {
    const decks = await ctx.db
      .query("flashcardDecks")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect();
    return decks.sort((a, b) => a.order - b.order);
  },
});

export const listCardsByDeck = query({
  args: { deckId: v.id("flashcardDecks") },
  handler: async (ctx, { deckId }) => {
    const cards = await ctx.db
      .query("flashcards")
      .withIndex("by_deckId", (q) => q.eq("deckId", deckId))
      .collect();
    return cards.sort((a, b) => a.order - b.order);
  },
});

export const listAllCards = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("flashcards").collect();
  },
});

export const getTopicsForDeck = query({
  args: { deckId: v.id("flashcardDecks") },
  handler: async (ctx, { deckId }) => {
    const cards = await ctx.db
      .query("flashcards")
      .withIndex("by_deckId", (q) => q.eq("deckId", deckId))
      .collect();
    const topics = [...new Set(cards.map((c) => c.topic))].sort();
    return topics;
  },
});

export const getStarredCards = query({
  args: { deckId: v.optional(v.id("flashcardDecks")) },
  handler: async (ctx, { deckId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const starred = await ctx.db
      .query("starredCards")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const cards = await Promise.all(starred.map((s) => ctx.db.get(s.cardId)));
    const valid = cards.filter(Boolean) as NonNullable<(typeof cards)[number]>[];

    if (deckId) return valid.filter((c) => c.deckId === deckId);
    return valid;
  },
});

export const getStarredCardIds = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const starred = await ctx.db
      .query("starredCards")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    return starred.map((s) => s.cardId);
  },
});

export const getMyTestResults = query({
  args: { deckId: v.optional(v.id("flashcardDecks")) },
  handler: async (ctx, { deckId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const results = await ctx.db
      .query("testResults")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const filtered = deckId
      ? results.filter((r) => r.deckId === deckId)
      : results;

    return filtered
      .sort((a, b) => b.completedAt - a.completedAt)
      .slice(0, 3);
  },
});

// ── Mutations ──────────────────────────────────────────────────────────────────

export const starCard = mutation({
  args: { cardId: v.id("flashcards") },
  handler: async (ctx, { cardId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("starredCards")
      .withIndex("by_userId_cardId", (q) =>
        q.eq("userId", userId).eq("cardId", cardId)
      )
      .unique();

    if (!existing) {
      await ctx.db.insert("starredCards", {
        userId,
        cardId,
        createdAt: Date.now(),
      });
    }
  },
});

export const unstarCard = mutation({
  args: { cardId: v.id("flashcards") },
  handler: async (ctx, { cardId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("starredCards")
      .withIndex("by_userId_cardId", (q) =>
        q.eq("userId", userId).eq("cardId", cardId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const saveTestResult = mutation({
  args: {
    deckId: v.id("flashcardDecks"),
    score: v.number(),
    total: v.number(),
    answers: v.array(
      v.object({
        cardId: v.id("flashcards"),
        selectedAnswer: v.optional(v.string()),
        isCorrect: v.boolean(),
      })
    ),
  },
  handler: async (ctx, { deckId, score, total, answers }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const percentage = Math.round((score / total) * 10000) / 100;

    await ctx.db.insert("testResults", {
      userId,
      deckId,
      score,
      total,
      percentage,
      answers,
      completedAt: Date.now(),
    });
  },
});

// ── Seeder Action ──────────────────────────────────────────────────────────────

const CSV_SOURCES = [
  {
    url: "https://raw.githubusercontent.com/barefoottico/milady-flashcards/main/mbf_exam_1.csv",
    title: "MBF Exam 1",
    order: 1,
  },
  {
    url: "https://raw.githubusercontent.com/barefoottico/milady-flashcards/main/mbf_exam_2.csv",
    title: "MBF Exam 2",
    order: 2,
  },
];

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQ = !inQ;
    } else if (ch === "," && !inQ) {
      fields.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  fields.push(cur.trim());
  return fields;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n");
  const headers = parseCSVLine(lines[0]);
  return lines
    .slice(1)
    .map((line) => {
      const fields = parseCSVLine(line);
      const row: Record<string, string> = {};
      headers.forEach((h, i) => (row[h] = fields[i] ?? ""));
      return row;
    })
    .filter((r) => r.id && r.question);
}

export const seedFlashcards = action({
  args: {},
  handler: async (ctx): Promise<string> => {
    // Idempotency guard
    const existing = (await ctx.runQuery(api.flashcards.listDecks)) as Array<{ title: string }>;
    if (existing.length > 0) {
      return `Already seeded: ${existing.map((d: { title: string }) => d.title).join(", ")}`;
    }

    let totalInserted = 0;

    for (const src of CSV_SOURCES) {
      const res = await fetch(src.url);
      if (!res.ok) throw new Error(`Failed to fetch ${src.url}: ${res.status}`);
      const text = await res.text();
      const rows = parseCSV(text);

      const deckId = await ctx.runMutation(api.flashcards.insertDeck, {
        title: src.title,
        source: "milady",
        questionCount: rows.length,
        order: src.order,
      });

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        await ctx.runMutation(api.flashcards.insertCard, {
          deckId,
          externalId: row.id ?? `Q-${String(i + 1).padStart(4, "0")}`,
          question: row.question ?? "",
          optionA: row.option_a ?? "",
          optionB: row.option_b ?? "",
          optionC: row.option_c ?? "",
          optionD: row.option_d || undefined,
          correctAnswer: (row.correct_options ?? "A").trim().toUpperCase().charAt(0),
          topic: row.topic || "General",
          sourceRef: row.source || undefined,
          order: i + 1,
        });
        totalInserted++;
      }
    }

    return `Seeded ${totalInserted} flashcards across ${CSV_SOURCES.length} decks`;
  },
});

// ── TDLR Practical Exam Seeder ─────────────────────────────────────────────

const TDLR_CARDS: Array<{
  externalId: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  topic: string;
}> = [
  // General / Bag Rules
  {
    externalId: "tdlr-001",
    question: "What type of bag is required for each service during the Texas TDLR Practical Exam?",
    optionA: "Colored opaque bag with a label on the outside",
    optionB: "Clear 2.5-gallon Ziploc bag labeled with the service name",
    optionC: "Any bag as long as it is sealed",
    optionD: "A brown paper bag with a printed sticker",
    correctAnswer: "B",
    topic: "General / Bag Rules",
  },
  {
    externalId: "tdlr-002",
    question: "How must the service name be written on each service bag?",
    optionA: "Handwritten in any color ink",
    optionB: "Stamped with an official TDLR stamp",
    optionC: "Printed or written clearly in large black lettering on the front",
    optionD: "Written in pencil on a white index card taped to the bag",
    correctAnswer: "C",
    topic: "General / Bag Rules",
  },
  {
    externalId: "tdlr-003",
    question: "What should be packed inside each service bag?",
    optionA: "All your tools for the entire exam",
    optionB: "Only items required for that specific service — no extras or duplicates",
    optionC: "A full backup kit plus the required items",
    optionD: "Items for the current service plus the next service",
    correctAnswer: "B",
    topic: "General / Bag Rules",
  },
  {
    externalId: "tdlr-004",
    question: "After completing each service, what must you do to notify the examiner?",
    optionA: "Call out 'Done!' loud enough to be heard",
    optionB: "Walk to the examiner's desk",
    optionC: "Raise your hand",
    optionD: "Place your tools face-down on the station",
    correctAnswer: "C",
    topic: "General / Bag Rules",
  },
  {
    externalId: "tdlr-005",
    question: "What organization administers the Texas Barber Practical Exam?",
    optionA: "Texas State Board of Cosmetology (TSBC)",
    optionB: "National Interstate Council of State Boards of Cosmetology (NIC)",
    optionC: "Texas Department of Licensing and Regulation (TDLR)",
    optionD: "American Barber Association (ABA)",
    correctAnswer: "C",
    topic: "General / Bag Rules",
  },
  // Pre-Exam Setup
  {
    externalId: "tdlr-006",
    question: "What is the time limit for Pre-Exam Setup & Disinfection?",
    optionA: "5 minutes",
    optionB: "10 minutes",
    optionC: "15 minutes",
    optionD: "20 minutes",
    correctAnswer: "B",
    topic: "Pre-Exam Setup & Disinfection",
  },
  {
    externalId: "tdlr-007",
    question: "What is the very first action you must perform when the exam begins?",
    optionA: "Set up the tripod or clamp",
    optionB: "Spray the station with EPA disinfectant",
    optionC: "Sanitize your hands",
    optionD: "Remove the mannequin head from the bag",
    correctAnswer: "C",
    topic: "Pre-Exam Setup & Disinfection",
  },
  {
    externalId: "tdlr-008",
    question: "Which surfaces must be sprayed and wiped during Pre-Exam Setup?",
    optionA: "Large haircutting station only",
    optionB: "Both chairs only",
    optionC: "Large haircutting station, small manicure table, and both chairs",
    optionD: "All surfaces in the exam room",
    correctAnswer: "C",
    topic: "Pre-Exam Setup & Disinfection",
  },
  {
    externalId: "tdlr-009",
    question: "What items are contained inside the First-Aid Kit in the Pre-Exam Setup bag?",
    optionA: "Scissors, tape, and a cold pack",
    optionB: "Roll of gauze, alcohol wipes, Band-Aids, and disposable gloves",
    optionC: "Antiseptic cream, bandages, and tweezers",
    optionD: "Styptic pencil, cotton rounds, and adhesive strips",
    correctAnswer: "B",
    topic: "Pre-Exam Setup & Disinfection",
  },
  {
    externalId: "tdlr-010",
    question: "After wiping down the station, what must be done with the used paper towels?",
    optionA: "Set them aside for reuse during cleanup",
    optionB: "Fold them and place them in the supply area",
    optionC: "Discard them in the trash",
    optionD: "Return them to the Pre-Exam Setup bag",
    correctAnswer: "C",
    topic: "Pre-Exam Setup & Disinfection",
  },
  // Manicure
  {
    externalId: "tdlr-011",
    question: "What is the time limit for Manicure Service?",
    optionA: "15 minutes",
    optionB: "17 minutes",
    optionC: "22 minutes",
    optionD: "30 minutes",
    correctAnswer: "C",
    topic: "Manicure Service",
  },
  {
    externalId: "tdlr-012",
    question: "How many nails are serviced during the Manicure Service?",
    optionA: "All ten nails",
    optionB: "Five nails on a mannequin hand",
    optionC: "Three nails — thumb, index, and middle",
    optionD: "Five nails on a live model",
    correctAnswer: "B",
    topic: "Manicure Service",
  },
  {
    externalId: "tdlr-013",
    question: "How long should the fingers soak in the finger bowl during the manicure?",
    optionA: "30 seconds",
    optionB: "2 minutes",
    optionC: "1 minute",
    optionD: "3 minutes",
    correctAnswer: "C",
    topic: "Manicure Service",
  },
  {
    externalId: "tdlr-014",
    question: "What are the acceptable nail shapes during the Manicure Service?",
    optionA: "Oval, almond, or stiletto",
    optionB: "Coffin, ballerina, or square",
    optionC: "Round, square, or point",
    optionD: "Any shape the examiner requests",
    correctAnswer: "C",
    topic: "Manicure Service",
  },
  {
    externalId: "tdlr-015",
    question: "After pushing back cuticles with the wooden pusher, what do you do with it?",
    optionA: "Sanitize it and return it to the implements bag",
    optionB: "Wipe it on a towel and set it aside for the next nail",
    optionC: "Snap it in half and discard it",
    optionD: "Soak it in disinfectant for 10 minutes",
    correctAnswer: "C",
    topic: "Manicure Service",
  },
  // Professional Shave
  {
    externalId: "tdlr-016",
    question: "What is the time limit for Professional Shave Service?",
    optionA: "22 minutes",
    optionB: "30 minutes",
    optionC: "37 minutes",
    optionD: "42 minutes",
    correctAnswer: "D",
    topic: "Professional Shave Service",
  },
  {
    externalId: "tdlr-017",
    question: "How many towels are required in the Professional Shave Service bag?",
    optionA: "2 towels",
    optionB: "4 towels",
    optionC: "6 towels",
    optionD: "8 towels",
    correctAnswer: "C",
    topic: "Professional Shave Service",
  },
  {
    externalId: "tdlr-018",
    question: "How long is the hot towel draped over the beard area during steaming?",
    optionA: "30 seconds",
    optionB: "1 minute",
    optionC: "2 minutes",
    optionD: "5 minutes",
    correctAnswer: "C",
    topic: "Professional Shave Service",
  },
  {
    externalId: "tdlr-019",
    question: "What three shaving strokes must be demonstrated during the Professional Shave exam?",
    optionA: "Straight, curved, and diagonal strokes",
    optionB: "Freehand, backhand, and reverse freehand strokes",
    optionC: "Upward, downward, and lateral strokes",
    optionD: "Light, medium, and heavy pressure strokes",
    correctAnswer: "B",
    topic: "Professional Shave Service",
  },
  {
    externalId: "tdlr-020",
    question: "How many strokes are performed in sequence during the complete shave service?",
    optionA: "7 strokes",
    optionB: "10 strokes",
    optionC: "12 strokes",
    optionD: "14 strokes",
    correctAnswer: "D",
    topic: "Professional Shave Service",
  },
  // Blood Exposure Incident
  {
    externalId: "tdlr-021",
    question: "What is the time limit for the Blood Exposure Incident service?",
    optionA: "8 minutes",
    optionB: "10 minutes",
    optionC: "12 minutes",
    optionD: "15 minutes",
    correctAnswer: "C",
    topic: "Blood Exposure Incident",
  },
  {
    externalId: "tdlr-022",
    question: "How many labeled sub-bags are required inside the Blood Exposure Incident service bag?",
    optionA: "1 — Biohazard only",
    optionB: "2 — Biohazard and Trash",
    optionC: "3 — Biohazard, Trash, and Pre-Sanitized/Disinfected",
    optionD: "4 — Biohazard, Trash, Sanitized Implements, and Supplies",
    correctAnswer: "C",
    topic: "Blood Exposure Incident",
  },
  {
    externalId: "tdlr-023",
    question: "How long do you apply pressure to the simulated cut during the Blood Exposure Incident?",
    optionA: "5 seconds",
    optionB: "10 seconds",
    optionC: "15 seconds",
    optionD: "30 seconds",
    correctAnswer: "C",
    topic: "Blood Exposure Incident",
  },
  {
    externalId: "tdlr-024",
    question: "After sealing the biohazard bag, where does it go?",
    optionA: "Directly into the exam room trash receptacle",
    optionB: "Back into the main service bag",
    optionC: "Into the labeled trash bag",
    optionD: "Given to the examiner for disposal",
    correctAnswer: "C",
    topic: "Blood Exposure Incident",
  },
  // Facial Service
  {
    externalId: "tdlr-025",
    question: "What is the time limit for Facial Service?",
    optionA: "12 minutes",
    optionB: "15 minutes",
    optionC: "17 minutes",
    optionD: "22 minutes",
    correctAnswer: "C",
    topic: "Facial Service",
  },
  {
    externalId: "tdlr-026",
    question: "Which massage technique uses a pinch-and-roll motion during the facial?",
    optionA: "Effleurage",
    optionB: "Tapotement",
    optionC: "Petrissage",
    optionD: "Vibration",
    correctAnswer: "C",
    topic: "Facial Service",
  },
  {
    externalId: "tdlr-027",
    question: "How many cotton rounds are used to remove facial cleanser?",
    optionA: "One cotton round",
    optionB: "Two cotton rounds",
    optionC: "Three cotton rounds",
    optionD: "One cotton round per quadrant",
    correctAnswer: "B",
    topic: "Facial Service",
  },
  {
    externalId: "tdlr-028",
    question: "What is the minimum number of spatulas required in the Facial Service Sanitized Implements?",
    optionA: "1 spatula",
    optionB: "2 spatulas",
    optionC: "3 spatulas",
    optionD: "5 spatulas",
    correctAnswer: "C",
    topic: "Facial Service",
  },
  // Haircutting
  {
    externalId: "tdlr-029",
    question: "What is the time limit for Haircutting Service?",
    optionA: "22 minutes",
    optionB: "30 minutes",
    optionC: "37 minutes",
    optionD: "42 minutes",
    correctAnswer: "C",
    topic: "Haircutting Service",
  },
  {
    externalId: "tdlr-030",
    question: "How deep is the central guideline established at the crown during shear cutting?",
    optionA: "1-finger depth",
    optionB: "2-finger depth",
    optionC: "3-finger depth",
    optionD: "4-finger depth",
    correctAnswer: "C",
    topic: "Haircutting Service",
  },
  {
    externalId: "tdlr-031",
    question: "What is the minimum amount of hair that must be cut during the Haircutting Service?",
    optionA: "Half an inch",
    optionB: "1 inch",
    optionC: "2 inches",
    optionD: "3 inches",
    correctAnswer: "B",
    topic: "Haircutting Service",
  },
  {
    externalId: "tdlr-032",
    question: "After completing the haircut, what single tool must remain on the station for examiner review?",
    optionA: "Clippers",
    optionB: "Trimmers",
    optionC: "Shears",
    optionD: "One comb",
    correctAnswer: "D",
    topic: "Haircutting Service",
  },
  // Blow-Drying & Thermal Curling
  {
    externalId: "tdlr-033",
    question: "What is the time limit for Blow-Drying & Thermal Curling Service?",
    optionA: "15 minutes",
    optionB: "20 minutes",
    optionC: "22 minutes",
    optionD: "30 minutes",
    correctAnswer: "C",
    topic: "Blow-Drying & Thermal Curling",
  },
  {
    externalId: "tdlr-034",
    question: "What temperature must the curling iron be set above for the Blow-Drying & Thermal Curling exam?",
    optionA: "200°F",
    optionB: "300°F",
    optionC: "350°F",
    optionD: "400°F",
    correctAnswer: "D",
    topic: "Blow-Drying & Thermal Curling",
  },
  {
    externalId: "tdlr-035",
    question: "How long should you hold the curl on the curling iron?",
    optionA: "5 seconds",
    optionB: "10 seconds",
    optionC: "20 seconds",
    optionD: "45 seconds",
    correctAnswer: "C",
    topic: "Blow-Drying & Thermal Curling",
  },
  // Permanent Wave
  {
    externalId: "tdlr-036",
    question: "What is the time limit for Permanent Wave Service?",
    optionA: "15 minutes",
    optionB: "20 minutes",
    optionC: "22 minutes",
    optionD: "30 minutes",
    correctAnswer: "B",
    topic: "Permanent Wave Service",
  },
  {
    externalId: "tdlr-037",
    question: "What is the minimum number of perm rods required during the Permanent Wave Service?",
    optionA: "2 rods",
    optionB: "3 rods",
    optionC: "4 rods",
    optionD: "6 rods",
    correctAnswer: "C",
    topic: "Permanent Wave Service",
  },
  {
    externalId: "tdlr-038",
    question: "What three perm rod wrapping methods are acceptable during the exam?",
    optionA: "Forward, reverse, and spiral",
    optionB: "Single flat, double flat, and bookend",
    optionC: "Base, off-base, and half-base",
    optionD: "Cotton, paper, and foil wrap",
    correctAnswer: "B",
    topic: "Permanent Wave Service",
  },
  {
    externalId: "tdlr-039",
    question: "What liquid is used in the mock perm solution container for the exam?",
    optionA: "Actual perm chemicals",
    optionB: "Hydrogen peroxide",
    optionC: "Water or gel",
    optionD: "Isopropyl alcohol",
    correctAnswer: "C",
    topic: "Permanent Wave Service",
  },
  // Single Color Retouch
  {
    externalId: "tdlr-040",
    question: "What is the time limit for Single Color Retouch Service?",
    optionA: "15 minutes",
    optionB: "17 minutes",
    optionC: "20 minutes",
    optionD: "22 minutes",
    correctAnswer: "D",
    topic: "Single Color Retouch Service",
  },
  {
    externalId: "tdlr-041",
    question: "How much new growth should the color be applied to during Single Color Retouch?",
    optionA: "The entire hair shaft",
    optionB: "2 inches of regrowth",
    optionC: "1 inch of regrowth",
    optionD: "Half an inch of regrowth",
    correctAnswer: "C",
    topic: "Single Color Retouch Service",
  },
  {
    externalId: "tdlr-042",
    question: "What two tests must be performed before applying hair color during Single Color Retouch?",
    optionA: "Strand test and elasticity test",
    optionB: "Patch test and porosity test",
    optionC: "Patch test and strand test",
    optionD: "Predisposition test and processing test",
    correctAnswer: "C",
    topic: "Single Color Retouch Service",
  },
  {
    externalId: "tdlr-043",
    question: "Where is the patch test applied during the Single Color Retouch Service?",
    optionA: "Inside the elbow",
    optionB: "Behind the ear",
    optionC: "At the nape of the neck",
    optionD: "On the back of the wrist",
    correctAnswer: "B",
    topic: "Single Color Retouch Service",
  },
  {
    externalId: "tdlr-044",
    question: "How wide are the subsections when applying color during Single Color Retouch?",
    optionA: "1 inch wide",
    optionB: "1/4 to 1/2 inch wide",
    optionC: "1/8 to 1/4 inch wide",
    optionD: "As wide as the applicator brush",
    correctAnswer: "B",
    topic: "Single Color Retouch Service",
  },
];

export const seedTdlrDeck = action({
  args: {},
  handler: async (ctx): Promise<string> => {
    // Idempotency: check if this deck already exists
    const existing = (await ctx.runQuery(api.flashcards.listDecks)) as Array<{ source: string; title: string }>;
    const alreadySeeded = existing.find((d) => d.source === "tdlr-practical");
    if (alreadySeeded) {
      return `Already seeded: ${alreadySeeded.title} (${TDLR_CARDS.length} cards)`;
    }

    const deckId = await ctx.runMutation(api.flashcards.insertDeck, {
      title: "TDLR Practical Exam",
      source: "tdlr-practical",
      questionCount: TDLR_CARDS.length,
      order: 10,
    });

    for (let i = 0; i < TDLR_CARDS.length; i++) {
      const card = TDLR_CARDS[i];
      await ctx.runMutation(api.flashcards.insertCard, {
        deckId,
        externalId: card.externalId,
        question: card.question,
        optionA: card.optionA,
        optionB: card.optionB,
        optionC: card.optionC,
        optionD: card.optionD,
        correctAnswer: card.correctAnswer,
        topic: card.topic,
        sourceRef: "TDLR Barber Practical Exam Guide vol.1",
        order: i + 1,
      });
    }

    return `Seeded TDLR Practical Exam deck with ${TDLR_CARDS.length} cards across 9 topics`;
  },
});

// Internal mutations used by the seeder action
export const insertDeck = mutation({
  args: {
    title: v.string(),
    source: v.string(),
    questionCount: v.number(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("flashcardDecks", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const insertCard = mutation({
  args: {
    deckId: v.id("flashcardDecks"),
    externalId: v.string(),
    question: v.string(),
    optionA: v.string(),
    optionB: v.string(),
    optionC: v.string(),
    optionD: v.optional(v.string()),
    correctAnswer: v.string(),
    topic: v.string(),
    sourceRef: v.optional(v.string()),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("flashcards", args);
  },
});
