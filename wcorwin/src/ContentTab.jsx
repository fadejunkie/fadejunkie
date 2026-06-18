import { INK, MUTED, LIGHT, BG, WHITE, ACCENT, BODY } from "./data";

const font = "'DM Sans', 'Satoshi', -apple-system, sans-serif";

const PAGES = [
  {
    slug: "canyon-lake",
    label: "Canyon Lake, TX",
    type: "Neighborhood Guide",
    keyword: "Canyon Lake TX real estate",
    pdf: "/deliverables/wcorwin-canyon-lake-guide-2026-04-17.pdf",
    designUrl: "/canyon-lake/",
    liveUrl: "https://www.wcorwin.com/canyon-lake-tx-real-estate",
  },
  {
    slug: "gruene",
    label: "Gruene, TX",
    type: "Neighborhood Guide",
    keyword: "Gruene TX real estate",
    pdf: "/deliverables/wcorwin-gruene-guide-2026-04-17.pdf",
    designUrl: "/gruene/",
    liveUrl: "https://www.wcorwin.com/gruene-tx-real-estate",
  },
  {
    slug: "spring-branch",
    label: "Spring Branch, TX",
    type: "Neighborhood Guide",
    keyword: "Spring Branch TX real estate",
    pdf: "/deliverables/wcorwin-spring-branch-guide-2026-04-17.pdf",
    designUrl: "/spring-branch/",
    liveUrl: "https://www.wcorwin.com/spring-branch-tx-real-estate",
  },
  {
    slug: "seguin",
    label: "Seguin, TX",
    type: "Neighborhood Guide",
    keyword: "Seguin TX real estate",
    pdf: "/deliverables/wcorwin-seguin-guide-2026-04-17.pdf",
    designUrl: "/seguin/",
    liveUrl: "https://www.wcorwin.com/seguin-tx-real-estate",
  },
  {
    slug: "va-home-loans",
    label: "VA Home Loans",
    type: "Landing Page",
    keyword: "VA home loan New Braunfels TX",
    pdf: "/deliverables/wcorwin-va-home-loans-2026-04-17.pdf",
    designUrl: "/va-home-loans/",
    liveUrl: "https://www.wcorwin.com/va-military-homebuyer",
  },
  {
    slug: "first-time-buyer",
    label: "First-Time Home Buyer Guide",
    type: "Landing Page",
    keyword: "first time home buyer New Braunfels TX",
    pdf: "/deliverables/wcorwin-first-time-buyer-2026-04-17.pdf",
    designUrl: "/first-time-buyer/",
    liveUrl: "https://www.wcorwin.com/first-time-home-buyer",
  },
  {
    slug: "buyer-rebate",
    label: "Buyer Rebate Program",
    type: "Landing Page",
    keyword: "buyer rebate New Braunfels TX",
    designUrl: "/buyer-rebate/",
    pending: true,
  },
];

const badge = (type) => ({
  display: "inline-block",
  fontSize: 10,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  padding: "3px 8px",
  borderRadius: 4,
  background: type === "Landing Page" ? "rgba(37,99,235,0.08)" : "rgba(22,163,74,0.08)",
  color: type === "Landing Page" ? "#2563eb" : "#16a34a",
  fontFamily: font,
});

export default function ContentTab() {
  return (
    <div style={{ padding: "32px 24px", maxWidth: 900, margin: "0 auto", fontFamily: font }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: INK, margin: 0 }}>Month 2 Content</h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 6 }}>
          6 pages live on wcorwin.com · 1 pending (Buyer Rebate)
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {PAGES.map((page) => (
          <div
            key={page.slug}
            style={{
              background: WHITE,
              border: `1px solid ${LIGHT}`,
              borderRadius: 10,
              padding: "20px 22px",
              opacity: page.pending ? 0.55 : 1,
              position: "relative",
            }}
          >
            {page.pending && (
              <div style={{
                position: "absolute", top: 12, right: 12,
                fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.06em", color: "#ca8a04",
                background: "rgba(202,138,4,0.1)", padding: "2px 7px", borderRadius: 4,
                fontFamily: font,
              }}>
                Pending
              </div>
            )}
            <div style={{ marginBottom: 10 }}>
              <span style={badge(page.type)}>{page.type}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: INK, marginBottom: 6 }}>
              {page.label}
            </div>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>
              🎯 {page.keyword}
            </div>
            {page.pdf || page.designUrl ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {page.pdf && (
                  <a
                    href={page.pdf}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      fontSize: 12, fontWeight: 600, color: ACCENT,
                      textDecoration: "none",
                    }}
                  >
                    View PDF →
                  </a>
                )}
                {page.designUrl && (
                  <a
                    href={page.designUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      fontSize: 12, fontWeight: 600,
                      color: WHITE,
                      background: INK,
                      textDecoration: "none",
                      padding: "4px 10px",
                      borderRadius: 5,
                    }}
                  >
                    View Design ↗
                  </a>
                )}
              </div>
            ) : page.pending ? (
              <span style={{ fontSize: 12, color: MUTED }}>Awaiting confirmation</span>
            ) : (
              <span style={{ fontSize: 12, color: MUTED }}>Not yet produced</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
