/**
 * Transfer Arquero Stripe/payment data into hub-master.
 * - Updates agreement record with receiptUrl + paidAt
 * - Adds full invoice ledger as a deliverable
 *
 * Run: node seed-arquero-stripe.mjs
 */

const HUB_MASTER_URL = "https://warmhearted-cormorant-536.convex.cloud";
const CLIENT_SLUG = "arquero";
const PROJECT_ID = "arquero-co";

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

// ─── 1. Update agreement with receipt URL + paidAt ──────────────────────────
console.log("── Agreement: adding receipt URL + paidAt ──");

await mutation("agreements:updatePayment", {
  clientSlug: CLIENT_SLUG,
  projectId: PROJECT_ID,
  paymentStatus: "paid",
  receiptUrl: "https://pay.stripe.com/invoice/acct_1T4NzfPhBvpkIVx0/live_YWNjdF8xVDROemZQaEJ2cGtJVngwLF9VRURZYWlSSWtIbHNFR2o2bllaNWVjY05aZTc2TmNELDE2NTE5OTk4Ng0200HIAJe54Z/pdf?s=ap",
  paidAt: new Date("2026-03-27").getTime(),
});
console.log("  ✓ receiptUrl + paidAt set on agreement");

// ─── 2. Invoice ledger as a deliverable ──────────────────────────────────────
console.log("\n── Invoice ledger deliverable ──");

const invoiceLedger = `# Arquero Co. — Invoice Ledger

**Stripe Customer ID:** \`cus_UAm9HuXwaFHzak\`
**Payment Type:** One-Time Upfront (All 4 Phases)
**Total Paid:** $1,900
**Paid Date:** 2026-03-27

---

## Invoices

| Ref | Label | Amount | Invoice # | Stripe ID | Status |
|-----|-------|--------|-----------|-----------|--------|
| ARQCO-2026-P1 | Phase 1 — Domain Acquisition | $50 | CAPLYORH-0016 | in_1TFl7NPhBvpkIVx0TwiqRCEY | open (covered by upfront) |
| ARQCO-2026-P2 | Phase 2 — Brand Identity | $550 | CAPLYORH-0017 | in_1TFl7QPhBvpkIVx0J0V5bdPG | open (covered by upfront) |
| ARQCO-2026-P3 | Phase 3 — Ecommerce Website Build | $1,300 | CAPLYORH-0018 | in_1TFl7TPhBvpkIVx00w0BFcpD | open (covered by upfront) |
| ARQCO-2026-P4 | Phase 4 — Launch + Handoff | $250 | CAPLYORH-0019 | in_1TFl7XPhBvpkIVx01l4HAbEI | open (covered by upfront) |
| **ARQCO-2026-UPFRONT** | **Full Project — One-Time Upfront** | **$1,900** | **CAPLYORH-0020** | **in_1TFl7aPhBvpkIVx00b9rPvy8** | ✅ **PAID** |

---

## Payment Links

- **Upfront invoice (paid):** [CAPLYORH-0020](https://invoice.stripe.com/i/acct_1T4NzfPhBvpkIVx0/live_YWNjdF8xVDROemZQaEJ2cGtJVngwLF9VRURZYWlSSWtIbHNFR2o2bllaNWVjY05aZTc2TmNELDE2NTE5OTk4Ng0200HIAJe54Z?s=ap)
- **Receipt PDF:** [Download](https://pay.stripe.com/invoice/acct_1T4NzfPhBvpkIVx0/live_YWNjdF8xVDROemZQaEJ2cGtJVngwLF9VRURZYWlSSWtIbHNFR2o2bllaNWVjY05aZTc2TmNELDE2NTE5OTk4Ng0200HIAJe54Z/pdf?s=ap)

### Individual Phase Links (inactive — upfront used)
- Phase 1: [CAPLYORH-0016](https://invoice.stripe.com/i/acct_1T4NzfPhBvpkIVx0/live_YWNjdF8xVDROemZQaEJ2cGtJVngwLF9VRURZNHF1Wmh6cDd6SWdlNDc0cGEzcDV4UEkyYzdNLDE2NTE5OTk3Mg0200cU3erguh?s=ap)
- Phase 2: [CAPLYORH-0017](https://invoice.stripe.com/i/acct_1T4NzfPhBvpkIVx0/live_YWNjdF8xVDROemZQaEJ2cGtJVngwLF9VRURZTjJzVExIamVGRkRuNkJJcGZ4allvenN6VzFhLDE2NTE5OTk3NA02003Nliow43?s=ap)
- Phase 3: [CAPLYORH-0018](https://invoice.stripe.com/i/acct_1T4NzfPhBvpkIVx0/live_YWNjdF8xVDROemZQaEJ2cGtJVngwLF9VRURZcXQySHU4aEMyck4zeUdmRGxSbHN6T1BCVTJhLDE2NTE5OTk3OA0200BRPqwH9N?s=ap)
- Phase 4: [CAPLYORH-0019](https://invoice.stripe.com/i/acct_1T4NzfPhBvpkIVx0/live_YWNjdF8xVDROemZQaEJ2cGtJVngwLF9VRURZUTNkUTZIN1BpaktKQ3Z3OFdNZ3NOUGVQZzNXLDE2NTE5OTk4Mg0200DDcIx4BB?s=ap)
`;

await mutation("deliverables:addDeliverable", {
  clientSlug: CLIENT_SLUG,
  projectId: PROJECT_ID,
  milestoneKey: "0-AGREEMENT",
  label: "Invoice Ledger + Stripe Links",
  url: "",
  type: "md",
  markdownContent: invoiceLedger,
});
console.log("  ✓ Invoice ledger stored as deliverable (milestoneKey: 0-AGREEMENT)");

console.log("\n✅ Stripe transfer complete.");
