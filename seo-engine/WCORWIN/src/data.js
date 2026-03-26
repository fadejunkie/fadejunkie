// ─── Colors ─────────────────────────────────────────────────────────────────
export const ACCENT = "#e8541a";
export const ACCENT_SOFT = "rgba(232, 84, 26, 0.08)";
export const ACCENT_MED = "rgba(232, 84, 26, 0.15)";
export const INK = "#111111";
export const BODY = "#444444";
export const MUTED = "#999999";
export const LIGHT = "#e5e5e5";
export const BG = "#fafaf9";
export const WHITE = "#ffffff";
export const GREEN = "#16a34a";
export const GREEN_SOFT = "rgba(22, 163, 74, 0.08)";
export const YELLOW = "#ca8a04";
export const YELLOW_SOFT = "rgba(202, 138, 4, 0.08)";
export const BLUE = "#2563eb";
export const BLUE_SOFT = "rgba(37, 99, 235, 0.08)";

// ─── Project metadata ────────────────────────────────────────────────────────
export const PROJECT = {
  name: "wcorwin.com SEO ENGINE",
  client: "Weichert Realtors — Corwin & Associates",
  location: "New Braunfels, TX",
  contact: "Joe Corwin (Owner) · Deanna Bazan (Office Mgr)",
  advisor: "Edward (Advisor)",
  retainer: "$950/mo",
  startDate: "March 2026",
  platform: "iHouseWeb (iHouseElite)",
};

// ─── Status config ───────────────────────────────────────────────────────────
export const STATUS_CONFIG = {
  done: { label: "Complete", color: GREEN, bg: GREEN_SOFT, icon: "✓" },
  active: { label: "In Progress", color: ACCENT, bg: ACCENT_SOFT, icon: "◉" },
  pending: { label: "Upcoming", color: MUTED, bg: "#f5f5f5", icon: "○" },
};

// ─── Phases & tasks ──────────────────────────────────────────────────────────
// THIS IS THE FILE TO UPDATE when tasks are completed.
// Change status: "active" → "done", or "pending" → "active" as work progresses.

export const PHASES = [
  {
    id: "kickoff",
    label: "Kickoff",
    subtitle: "Foundation Setup",
    color: ACCENT,
    softColor: ACCENT_SOFT,
    icon: "⚡",
    fee: "One-Time",
    tasks: [
      { name: "SEO audit delivered", status: "done", detail: "Full 5-pillar audit completed" },
      { name: "Contract signed & returned", status: "done", detail: "Month-to-month at $950/mo" },
      { name: "Invoice paid — $950 received", status: "done", detail: "Paid March 9, 2026 · Visa -1802 · Receipt #2644-0954" },
      { name: "GSC access requested", status: "active", detail: "Follow up with Deanna — still waiting" },
      { name: "GBP access granted", status: "done", detail: "Manager access granted 2026-03-26" },
      { name: "iHouseWeb admin access", status: "done", detail: "Admin access granted 2026-03-14" },
      { name: "Kickoff strategy call", status: "pending", detail: "Align on Month 1 priorities" },
    ],
  },
  {
    id: "month1",
    label: "Month 1",
    subtitle: "Fix the Foundation",
    color: ACCENT,
    softColor: ACCENT_SOFT,
    icon: "🔧",
    fee: "$950",
    tasks: [
      { name: "Rewrite all title tags", status: "pending", detail: "Unique title for every key non-IDX page" },
      { name: "Write unique meta descriptions", status: "pending", detail: "Eliminate site-wide duplication" },
      { name: "Implement LocalBusiness schema", status: "pending", detail: "JSON-LD: RealEstateAgent + Person for Joe" },
      { name: "Verify & submit XML sitemap", status: "pending", detail: "Confirm at /sitemap.xml → GSC + Bing" },
      { name: "Optimize Google Business Profile", status: "pending", detail: "Photos, messaging, categories, hours" },
      { name: "Baseline keyword tracking setup", status: "pending", detail: "Top 20 target keywords documented" },
      { name: "Client sign-off on foundation", status: "pending", detail: "Required before Month 2 begins" },
    ],
  },
  {
    id: "month2",
    label: "Month 2",
    subtitle: "Content Goes Live",
    color: YELLOW,
    softColor: YELLOW_SOFT,
    icon: "📝",
    fee: "$950",
    tasks: [
      { name: "Canyon Lake neighborhood guide", status: "pending", detail: "500+ words + internal links" },
      { name: "Gruene, TX neighborhood guide", status: "pending", detail: "500+ words + internal links" },
      { name: "Buyer Rebate Program page", status: "pending", detail: "Dedicated landing page — own this keyword" },
      { name: "VA / Military Homebuyer page", status: "pending", detail: "Perfect brand fit: veteran-owned office" },
      { name: "Homepage content expansion", status: "pending", detail: "Add 400-600 words above IDX feed" },
      { name: "First keyword movement report", status: "pending", detail: "Rankings vs. baseline comparison" },
    ],
  },
  {
    id: "month3",
    label: "Month 3",
    subtitle: "Build Authority",
    color: GREEN,
    softColor: GREEN_SOFT,
    icon: "🏗️",
    fee: "$950",
    tasks: [
      { name: "Chamber of Commerce listing", status: "pending", detail: "NB Chamber — citation + backlink" },
      { name: "Military directory submissions", status: "pending", detail: "VetBiz + 4 military relocation sites" },
      { name: "FAQ schema implementation", status: "pending", detail: "Buyer/seller FAQ → featured snippet potential" },
      { name: "Market Report 2026 published", status: "pending", detail: "NB TX real estate market data" },
      { name: "First-Time Homebuyer Guide", status: "pending", detail: "Long-form content play" },
      { name: "90-day performance review", status: "pending", detail: "Impressions, clicks, rankings vs. baseline" },
    ],
  },
  {
    id: "ongoing",
    label: "Ongoing",
    subtitle: "Month-to-Month Retainer",
    color: BLUE,
    softColor: BLUE_SOFT,
    icon: "🔄",
    fee: "$950/mo",
    tasks: [
      { name: "2 content pieces per month", status: "pending", detail: "Guides, blog posts, market reports" },
      { name: "Monthly rank tracking report", status: "pending", detail: "Top 20 keywords + movement" },
      { name: "GBP management", status: "pending", detail: "Posts, Q&A, review responses" },
      { name: "1 technical SEO task/month", status: "pending", detail: "Schema, internal linking, speed fixes" },
      { name: "Monthly performance summary", status: "pending", detail: "Plain-English report to client" },
    ],
  },
];
