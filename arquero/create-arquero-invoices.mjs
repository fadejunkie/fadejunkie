import Stripe from 'stripe';
import { writeFileSync } from 'node:fs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const CUSTOMER_ID = 'cus_UAm9HuXwaFHzak';
const DAYS_UNTIL_DUE = 7;

const PHASES = [
  {
    ref: 'ARQCO-2026-P1',
    name: 'Phase 1 — Domain Acquisition',
    lines: [
      { description: 'Domain acquisition — purchase & secure arquero.co (DNS config, domain lock, WHOIS privacy)', amount: 5000 },
    ],
  },
  {
    ref: 'ARQCO-2026-P2',
    name: 'Phase 2 — Brand Identity',
    lines: [
      { description: 'Logo design — primary mark, icon variant, wordmark (3 concepts, 2 revision rounds)', amount: 30000 },
      { description: 'Color palette, typography, brand guidelines PDF — delivered in PNG, SVG, PDF', amount: 25000 },
    ],
  },
  {
    ref: 'ARQCO-2026-P3',
    name: 'Phase 3 — Ecommerce Website Build (Shopify)',
    lines: [
      { description: 'Shopify store setup & theme customization aligned with brand identity', amount: 30000 },
      { description: 'Homepage, About, Contact, FAQ, Shipping/Returns policy pages', amount: 20000 },
      { description: 'Product page setup for up to 20 SKUs — images, descriptions, variants, pricing', amount: 40000 },
      { description: 'Collection pages, checkout config, payment gateway, shipping zones, mobile QA, on-page SEO', amount: 40000 },
    ],
  },
  {
    ref: 'ARQCO-2026-P4',
    name: 'Phase 4 — Launch + Handoff',
    lines: [
      { description: 'Full QA pass, DNS cutover to live Shopify store, GA4 + Google Search Console setup', amount: 15000 },
      { description: 'Client training session + full asset handoff (brand files, credentials, documentation)', amount: 10000 },
    ],
  },
];

const UPFRONT = {
  ref: 'ARQCO-2026-UPFRONT',
  name: 'Full Project — One-Time Upfront Payment (All 4 Phases)',
  lines: [
    { description: 'Phase 1 — Domain Acquisition', amount: 5000 },
    { description: 'Phase 2 — Brand Identity', amount: 55000 },
    { description: 'Phase 3 — Ecommerce Website Build (Shopify)', amount: 130000 },
    { description: 'Phase 4 — Launch + Handoff', amount: 25000 },
    { description: 'One-time upfront discount — pay in full, save $250', amount: -25000 },
  ],
};

const FOOTER = "Anthony Tatis · Anthony's Brand Builder · tatis.anthony@gmail.com · San Antonio, TX\nPayment due upon receipt. Work begins upon payment.";

async function cleanUp() {
  console.log('🧹 Voiding existing invoices...');
  const invoices = await stripe.invoices.list({ customer: CUSTOMER_ID, limit: 20 });
  for (const inv of invoices.data) {
    if (inv.status === 'open') {
      await stripe.invoices.voidInvoice(inv.id);
      console.log(`   Voided: ${inv.id}`);
    } else if (inv.status === 'draft') {
      await stripe.invoices.del(inv.id);
      console.log(`   Deleted draft: ${inv.id}`);
    }
  }

  console.log('🧹 Deleting pending invoice items...');
  const items = await stripe.invoiceItems.list({ customer: CUSTOMER_ID, limit: 50 });
  for (const item of items.data) {
    if (!item.invoice) {
      await stripe.invoiceItems.del(item.id);
      console.log(`   Deleted item: ${item.id}`);
    }
  }
  console.log('✅ Cleanup done\n');
}

async function createInvoice({ ref, name, lines }) {
  // 1. Create invoice first (empty)
  const invoice = await stripe.invoices.create({
    customer: CUSTOMER_ID,
    collection_method: 'send_invoice',
    days_until_due: DAYS_UNTIL_DUE,
    auto_advance: false,
    pending_invoice_items_behavior: 'exclude', // CRITICAL: don't pull in stray items
    description: name,
    custom_fields: [{ name: 'Invoice Ref', value: ref }],
    footer: FOOTER,
    metadata: { invoice_ref: ref },
  });

  // 2. Attach each line item directly to this invoice
  for (const line of lines) {
    await stripe.invoiceItems.create({
      customer: CUSTOMER_ID,
      invoice: invoice.id,   // attach directly — not pending
      amount: line.amount,
      currency: 'usd',
      description: line.description,
    });
  }

  // 3. Finalize → generates invoice number + hosted payment URL
  const finalized = await stripe.invoices.finalizeInvoice(invoice.id, {
    auto_advance: false,
  });

  return {
    stripe_id: finalized.id,
    stripe_number: finalized.number,
    amount_due: finalized.amount_due,
    due_date: finalized.due_date ? new Date(finalized.due_date * 1000).toISOString().split('T')[0] : null,
    status: finalized.status,
    hosted_invoice_url: finalized.hosted_invoice_url,
    invoice_pdf: finalized.invoice_pdf,
  };
}

async function run() {
  await cleanUp();

  const results = [];

  for (const phase of PHASES) {
    console.log(`📄 Creating ${phase.ref}...`);
    const inv = await createInvoice(phase);
    results.push({
      ref: phase.ref,
      label: phase.name,
      amount: `$${(inv.amount_due / 100).toLocaleString()}`,
      due_date: inv.due_date,
      stripe_invoice_id: inv.stripe_id,
      stripe_invoice_number: inv.stripe_number,
      status: inv.status,
      payment_link: inv.hosted_invoice_url,
      pdf: inv.invoice_pdf,
    });
    console.log(`   ✅ $${inv.amount_due / 100} · due ${inv.due_date} — ${inv.hosted_invoice_url}`);
  }

  console.log(`\n📄 Creating ARQCO-2026-UPFRONT...`);
  const upfront = await createInvoice(UPFRONT);
  results.push({
    ref: UPFRONT.ref,
    label: UPFRONT.name,
    amount: `$${(upfront.amount_due / 100).toLocaleString()}`,
    due_date: upfront.due_date,
    stripe_invoice_id: upfront.stripe_id,
    stripe_invoice_number: upfront.stripe_number,
    status: upfront.status,
    payment_link: upfront.hosted_invoice_url,
    pdf: upfront.invoice_pdf,
  });
  console.log(`   ✅ $${upfront.amount_due / 100} · due ${upfront.due_date} — ${upfront.hosted_invoice_url}`);

  // Save to JSON
  const output = {
    client: 'Arquero Co.',
    customer_id: CUSTOMER_ID,
    contract_date: '2026-03-18',
    generated_at: new Date().toISOString(),
    expires_days: DAYS_UNTIL_DUE,
    invoices: results,
  };
  const outPath = 'C:/Users/twani/Desktop/_CLIENTS/arquero/invoices/arquero-invoice-links.json';
  writeFileSync(outPath, JSON.stringify(output, null, 2));

  console.log('\n═══════════════════════════════════════════════════');
  console.log('  ARQUERO CO. — INVOICES READY (share via WhatsApp)');
  console.log('═══════════════════════════════════════════════════');
  for (const r of results) {
    console.log(`\n  ${r.ref} · ${r.amount} · due ${r.due_date}`);
    console.log(`  ${r.label}`);
    console.log(`  ${r.payment_link}`);
  }
  console.log(`\n  ✅ Saved: ${outPath}`);
  console.log('═══════════════════════════════════════════════════\n');
}

run().catch(console.error);
