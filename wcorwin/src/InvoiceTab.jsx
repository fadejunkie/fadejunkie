import { INK, MUTED, LIGHT, WHITE, ACCENT, ACCENT_SOFT, GREEN, GREEN_SOFT, YELLOW, YELLOW_SOFT, BG } from "./data";

const font = "'DM Sans', 'Satoshi', -apple-system, sans-serif";
const mono = "'DM Mono', monospace";

const INVOICES = [
  {
    ref: "WCORWIN-2026-M2",
    label: "SEO Retainer — Month 2",
    period: "April 2026",
    amount: "$950",
    issued: "April 17, 2026",
    dueDate: "April 25, 2026",
    paidDate: "April 22, 2026",
    invoiceNumber: "NPRYS7ZO-0005",
    status: "paid",
    paymentMethod: "Visa debit ···1802",
    receipt: "ch_3TNGCePhBvpkIVx00adQOhSY",
    deliverables: [
      "Canyon Lake, TX neighborhood guide",
      "Gruene, TX neighborhood guide",
      "Spring Branch, TX neighborhood guide",
      "Seguin, TX neighborhood guide",
      "VA / Military Homebuyer landing page",
      "First-Time Home Buyer Guide",
      "Buyer Rebate Program landing page",
      "CTR optimization brief (12 pages)",
      "Internal linking map",
      "Month 2 performance report",
    ],
  },
  {
    ref: "WCORWIN-2026-M1",
    label: "SEO Retainer — Month 1",
    period: "March 2026",
    amount: "$950",
    issued: "March 1, 2026",
    dueDate: "March 9, 2026",
    paidDate: "March 9, 2026",
    invoiceNumber: "NPRYS7ZO-0001",
    status: "paid",
    paymentMethod: "Visa ···1802",
    receipt: "#2644-0954",
    deliverables: [
      "Full 5-pillar SEO audit (3.5 → 4.2/10)",
      "Title tags rewritten — 10 key pages",
      "Meta descriptions written — 10 key pages",
      "LocalBusiness + RealEstateAgent schema",
      "XML sitemap submitted & verified in GSC",
      "Google Business Profile optimized",
      "Top 20 keyword baseline established",
    ],
  },
];

function StatusBadge({ status }) {
  if (status === "paid") return (
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", padding: "5px 11px", borderRadius: 5, background: GREEN_SOFT, color: GREEN }}>
      Paid
    </div>
  );
  return (
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", padding: "5px 11px", borderRadius: 5, background: YELLOW_SOFT, color: YELLOW }}>
      Payment Due
    </div>
  );
}

function InvoiceCard({ inv, defaultOpen }) {
  return (
    <div style={{ background: WHITE, border: `1px solid ${inv.status === "open" ? ACCENT + "44" : LIGHT}`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>

      {/* Header row */}
      <div style={{ padding: "20px 28px 18px", borderBottom: `1px solid ${LIGHT}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: INK, marginBottom: 3 }}>{inv.label}</div>
          <div style={{ fontSize: 12, color: MUTED, fontFamily: mono }}>{inv.invoiceNumber} · {inv.period}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: inv.status === "paid" ? GREEN : INK }}>{inv.amount}</div>
          <StatusBadge status={inv.status} />
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: "16px 28px", borderBottom: `1px solid ${LIGHT}` }}>
        {[
          ["Issued", inv.issued],
          ["Due", inv.dueDate],
          ...(inv.status === "paid" ? [
            ["Paid", inv.paidDate],
            ["Method", inv.paymentMethod],
            ["Receipt", inv.receipt],
          ] : []),
        ].map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, marginBottom: 8, borderBottom: `1px solid ${LIGHT}` }}>
            <span style={{ fontSize: 12, color: MUTED }}>{label}</span>
            <span style={{ fontSize: 13, color: INK, fontWeight: 500 }}>{value}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>Total</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: inv.status === "paid" ? GREEN : INK }}>{inv.amount}</span>
        </div>
      </div>

      {/* CTAs — open invoices only */}
      {inv.status === "open" && (
        <div style={{ padding: "16px 28px", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href={inv.paymentLink} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: 160, display: "flex", alignItems: "center", justifyContent: "center", background: ACCENT, color: WHITE, fontFamily: font, fontSize: 14, fontWeight: 700, padding: "13px 20px", borderRadius: 8, textDecoration: "none", textAlign: "center" }}>
            Pay Now — $950
          </a>
          <a href={inv.pdfLink} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", color: INK, border: `1px solid ${LIGHT}`, fontFamily: font, fontSize: 13, fontWeight: 600, padding: "13px 18px", borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap" }}>
            Download PDF
          </a>
        </div>
      )}

      {/* Deliverables */}
      <div style={{ padding: "16px 28px 20px", background: BG }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: MUTED, marginBottom: 12, fontFamily: mono }}>
          Deliverables
        </div>
        {inv.deliverables.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: INK, paddingBottom: i < inv.deliverables.length - 1 ? 8 : 0, marginBottom: i < inv.deliverables.length - 1 ? 8 : 0, borderBottom: i < inv.deliverables.length - 1 ? `1px solid ${LIGHT}` : "none" }}>
            <span style={{ color: GREEN, fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
            {item}
          </div>
        ))}
      </div>

    </div>
  );
}

export default function InvoiceTab() {
  const open = INVOICES.find(i => i.status === "open");
  const paid = INVOICES.filter(i => i.status === "paid");

  return (
    <div style={{ padding: "32px 24px", maxWidth: 640, margin: "0 auto", fontFamily: font }}>

      {/* Current invoice */}
      {open && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: INK, margin: 0, fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.05em" }}>Current Invoice</h2>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: mono }}>Due {open.dueDate}</span>
          </div>
          <InvoiceCard inv={open} />
        </>
      )}

      {/* Payment history */}
      {paid.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: MUTED, marginBottom: 16, marginTop: 8, fontFamily: mono }}>
            Payment History
          </div>
          {paid.map(inv => <InvoiceCard key={inv.ref} inv={inv} />)}
        </>
      )}

    </div>
  );
}
