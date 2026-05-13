import { useState } from "react";
import { INK, MUTED, LIGHT, BG, WHITE, BLUE, BLUE_SOFT, GREEN, GREEN_SOFT } from "./data";

const font = "'DM Sans', 'Satoshi', -apple-system, sans-serif";
const mono = "'DM Mono', monospace";

const TEXT_MSG_BODY =
  `Hey [First Name] — it was great working with you on [address / "your new place in Canyon Lake"]. Really glad we got that closed.

If you have a minute, a Google review means a lot to us — especially for a small, veteran-owned brokerage. Here's the direct link: [GOOGLE REVIEW LINK]

Thanks again. Welcome home. — Joe`;

const EMAIL_SUBJECT = "Thank you — one quick ask";

const EMAIL_BODY =
  `Hi [First Name],

Congratulations again on the closing. It was a real privilege to help you through it.

If the experience was worth sharing, a Google review helps other buyers find us — and it matters a lot to a small, veteran-owned brokerage like ours.

It takes about 60 seconds:
[GOOGLE REVIEW LINK]

No pressure either way. We appreciate you trusting us with such a big decision, and we hope [address/city] treats you well for years to come.

Talk soon,
Joe Corwin
Weichert Realtors — Corwin & Associates
(830) 632-5725`;

function Badge({ label, color, bg }) {
  return (
    <span style={{
      display: "inline-block",
      fontSize: 10,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      padding: "3px 8px",
      borderRadius: 4,
      background: bg,
      color: color,
      fontFamily: font,
    }}>
      {label}
    </span>
  );
}

function CopyButton({ getText }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text = getText();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12,
        fontWeight: 600,
        color: WHITE,
        background: copied ? "#16a34a" : INK,
        border: "none",
        borderRadius: 5,
        padding: "5px 12px",
        cursor: "pointer",
        fontFamily: font,
        transition: "background 0.2s",
        whiteSpace: "nowrap",
      }}
    >
      {copied ? "Copied \u2713" : "Copy to clipboard"}
    </button>
  );
}

function TemplateCard({ badge, title, subject, body, copyText }) {
  return (
    <div style={{
      background: WHITE,
      border: `1px solid ${LIGHT}`,
      borderRadius: 10,
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: 14,
    }}>
      {/* Badge + title row */}
      <div>
        <div style={{ marginBottom: 8 }}>
          <Badge label={badge.label} color={badge.color} bg={badge.bg} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: INK, lineHeight: 1.3 }}>
          {title}
        </div>
      </div>

      {/* Subject line (email only) */}
      {subject && (
        <div style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          padding: "8px 12px",
          background: BG,
          border: `1px solid ${LIGHT}`,
          borderRadius: 6,
        }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, fontFamily: mono, whiteSpace: "nowrap" }}>
            Subject:
          </span>
          <span style={{ fontSize: 13, fontWeight: 500, color: INK, fontFamily: font }}>
            {subject}
          </span>
        </div>
      )}

      {/* Template body */}
      <div style={{
        background: BG,
        border: `1px solid ${LIGHT}`,
        borderRadius: 6,
        padding: "12px 14px",
        fontSize: 12,
        lineHeight: 1.7,
        color: INK,
        fontFamily: mono,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>
        {body}
      </div>

      {/* Copy button */}
      <div>
        <CopyButton getText={copyText} />
      </div>
    </div>
  );
}

export default function TemplatesTab() {
  return (
    <div style={{ padding: "32px 24px", maxWidth: 900, margin: "0 auto", fontFamily: font }}>

      {/* Section header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: INK, margin: 0 }}>
          Collect Reviews Post-Close
        </h2>
        <p style={{ fontSize: 13, color: MUTED, marginTop: 6 }}>
          Send within 24\u201348 hrs of closing. Google reviews are the top local SEO signal.
        </p>
      </div>

      {/* Two template cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: 16,
        marginBottom: 20,
      }}>
        <TemplateCard
          badge={{ label: "Text Message", color: BLUE, bg: BLUE_SOFT }}
          title="Version A \u2014 Text Message"
          subject={null}
          body={TEXT_MSG_BODY}
          copyText={() => TEXT_MSG_BODY}
        />
        <TemplateCard
          badge={{ label: "Email", color: GREEN, bg: GREEN_SOFT }}
          title="Version B \u2014 Email"
          subject={EMAIL_SUBJECT}
          body={EMAIL_BODY}
          copyText={() => `Subject: ${EMAIL_SUBJECT}\n\n${EMAIL_BODY}`}
        />
      </div>

      {/* Usage tip */}
      <div style={{
        fontSize: 12,
        color: MUTED,
        padding: "10px 14px",
        background: BG,
        border: `1px solid ${LIGHT}`,
        borderRadius: 6,
        fontFamily: mono,
        lineHeight: 1.5,
      }}>
        <strong style={{ color: INK, fontFamily: font, fontWeight: 600 }}>Tip:</strong>{" "}
        Replace bracketed fields before sending. Use Version A for text, Version B for email.
      </div>
    </div>
  );
}
