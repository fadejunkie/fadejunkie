/**
 * Seed Wcorwin agreement + invoice ledger into hub-master.
 * - Saves signed agreement (offline/scanned PDF, March 4, 2026)
 * - Adds invoice ledger as a deliverable
 *
 * Run: node seed-wcorwin.mjs
 */

const HUB_MASTER_URL = "https://warmhearted-cormorant-536.convex.cloud";
const CLIENT_SLUG = "wcorwin";
const PROJECT_ID = "wcorwin-seo";

async function mutation(path, args) {
  const res = await fetch(`${HUB_MASTER_URL}/api/mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${path} failed: ${text}`);
  return JSON.parse(text);
}

// ─── 1. Agreement ────────────────────────────────────────────────────────────
console.log("── Agreement (offline/scanned PDF) ──");
await mutation("agreements:saveAgreement", {
  clientSlug: CLIENT_SLUG,
  projectId: PROJECT_ID,
  sigData: "SIGNED_OFFLINE",
  signedDate: "2026-03-04",
  agreementType: "retainer",
  invoiceNumber: "WCORWIN-2026-M1",
  paymentStatus: "paid",
  paidAt: new Date("2026-03-09").getTime(),
});
console.log("  ✓ Agreement: SIGNED_OFFLINE | paid (Month 1: 2026-03-09)");

// ─── 2. Invoice ledger as a deliverable ──────────────────────────────────────
console.log("\n── Invoice ledger deliverable ──");

const invoiceLedger = `# Weichert Corwin — Invoice Ledger

**Stripe Customer ID:** \`cus_U5VUurj8P5fZqE\`
**Engagement Type:** Monthly SEO Retainer ($950/mo)
**Agreement Signed:** 2026-03-04 (scanned PDF via email)
**Terms:** Month-to-month, 30 days notice to cancel. Kickoff waived (included free).

---

## Invoices

| Ref | Label | Amount | Invoice # | Stripe ID | Status |
|-----|-------|--------|-----------|-----------|--------|
| WCORWIN-2026-M1 | SEO Retainer — Month 1 (March 2026) | $950 | _(no prefix)_ | in_1T7KTGPhBvpkIVx0ZED6qtRV | ✅ **PAID** (2026-03-09) |
| WCORWIN-2026-M2 | SEO Retainer — Month 2 (April 2026) | $950 | NPRYS7ZO-0005 | in_1TNGBZPhBvpkIVx0TDlxfTlB | ✅ **PAID** (2026-04-22) |
| ~~M2 attempt 1~~ | ~~Voided~~ | ~~$950~~ | ~~NPRYS7ZO-0003~~ | ~~in_1THrcKPhBvpkIVx07gLM7uhx~~ | 🚫 VOIDED |
| ~~M2 attempt 2~~ | ~~Abandoned~~ | ~~$950~~ | ~~NPRYS7ZO-0004~~ | ~~in_1TK4UYPhBvpkIVx0O2MwVGUN~~ | 🚫 ABANDONED (replaced by 0005) |

---

## Payment Details

### Month 1 (Paid)
- **Stripe Invoice:** in_1T7KTGPhBvpkIVx0ZED6qtRV
- **Amount:** $950
- **Sent:** 2026-03-04 (first Stripe invoice)
- **Paid:** 2026-03-09
- **Payment Intent:** pi_3T7KxXPhBvpkIVx00d3hCRAB

### Month 2 (Paid)
- **Invoice:** NPRYS7ZO-0005
- **Stripe Invoice:** in_1TNGBZPhBvpkIVx0TDlxfTlB
- **Amount:** $950
- **Paid:** 2026-04-22
- **Method:** Visa debit ···1802
- **Stripe Charge:** ch_3TNGCePhBvpkIVx00adQOhSY
- **Payment Intent:** pi_3TNGCePhBvpkIVx00DQ8yIOO

---

## Agreement Terms

- Kickoff fee waived ($950 value — includes SEO audit, technical foundation, strategy call)
- Month 1: $950 one-time, standalone engagement
- Ongoing: $950/mo, month-to-month, 30 days notice to cancel
- Signed by: Joe Corwin (scanned PDF, emailed by Deanna Bazan on 2026-03-04)
- Agreement PDF: \`~/Desktop/_CLIENTS/wcorwin/wcorwin-service-agreement.pdf\`
`;

await mutation("deliverables:addDeliverable", {
  clientSlug: CLIENT_SLUG,
  projectId: PROJECT_ID,
  milestoneKey: "0-AGREEMENT",
  label: "Invoice Ledger + Payment Status",
  url: "",
  type: "md",
  markdownContent: invoiceLedger,
});
console.log("  ✓ Invoice ledger stored as deliverable (milestoneKey: 0-AGREEMENT)");

console.log("\n✅ Wcorwin seed complete.");
console.log("\n   Month 1 + Month 2 both paid. No Month 3 invoice created yet.");
