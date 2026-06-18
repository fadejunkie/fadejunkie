import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { brand } from "@/brand.config";

export const metadata = {
  title: `Shipping & Returns | ${brand.name}`,
  description: `Shipping rates, delivery times, and return policy for ${brand.name}.`,
};

const flatRate = (brand.shipping.flatRate / 100).toFixed(2);
const freeThreshold = (brand.shipping.freeThreshold / 100).toFixed(0);

export default function ShippingPage() {
  const sectionStyle: React.CSSProperties = {
    maxWidth: "720px",
    margin: "0 auto",
    padding: "clamp(64px, 10vw, 112px) 24px",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "13px",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: "var(--muted)",
    marginBottom: "16px",
  };

  const h1Style: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "clamp(32px, 5vw, 52px)",
    lineHeight: 1.1,
    color: "var(--body-strong)",
    marginBottom: "40px",
    letterSpacing: "-0.5px",
  };

  const h2Style: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "20px",
    color: "var(--body-strong)",
    marginBottom: "12px",
    letterSpacing: "0.5px",
  };

  const pStyle: React.CSSProperties = {
    fontSize: "16px",
    lineHeight: "1.7",
    color: "var(--body)",
    fontWeight: 300,
    marginBottom: "16px",
  };

  const dividerStyle: React.CSSProperties = {
    border: "none",
    borderTop: "1px solid var(--hairline)",
    margin: "40px 0",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse" as const,
    marginBottom: "24px",
  };

  const thStyle: React.CSSProperties = {
    textAlign: "left" as const,
    padding: "10px 16px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    textTransform: "uppercase" as const,
    color: "var(--muted)",
    borderBottom: "1px solid var(--hairline)",
    background: "var(--surface-soft)",
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px 16px",
    fontSize: "15px",
    color: "var(--body)",
    fontWeight: 300,
    borderBottom: "1px solid rgba(218,172,88,0.25)",
  };

  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <section style={sectionStyle}>
          <p style={labelStyle}>Shipping & Returns</p>
          <h1 style={h1Style}>We ship fast. We stand behind every order.</h1>

          {/* Shipping rates */}
          <h2 style={h2Style}>Shipping Rates</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Order Total</th>
                <th style={thStyle}>Shipping Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>Under ${freeThreshold}</td>
                <td style={tdStyle}>${flatRate} flat rate</td>
              </tr>
              <tr>
                <td style={tdStyle}>${freeThreshold}+</td>
                <td style={{ ...tdStyle, color: "var(--primary)", fontWeight: 500 }}>
                  FREE shipping
                </td>
              </tr>
            </tbody>
          </table>

          <hr style={dividerStyle} />

          {/* Processing & delivery */}
          <h2 style={h2Style}>Processing & Delivery</h2>
          <p style={pStyle}>
            Orders are processed within <strong>1–2 business days</strong> of purchase. Once
            shipped, you'll receive a tracking number via email.
          </p>
          <p style={pStyle}>
            Domestic delivery typically takes <strong>3–7 business days</strong> depending
            on your location. Expedited options may be available at checkout.
          </p>
          <p style={pStyle}>
            Orders placed on weekends or federal holidays begin processing the next business day.
          </p>

          <hr style={dividerStyle} />

          {/* Returns */}
          <h2 style={h2Style}>Returns & Exchanges</h2>
          <p style={pStyle}>
            We accept returns within <strong>30 days</strong> of delivery for unworn,
            unwashed items in original condition with tags attached.
          </p>
          <p style={pStyle}>
            To start a return or exchange, contact us at{" "}
            <a
              href="/contact"
              style={{ color: "var(--primary)", textDecoration: "underline" }}
            >
              our contact page
            </a>{" "}
            with your order number. We'll send a prepaid return label within 1 business day.
          </p>
          <p style={pStyle}>
            <strong>Sale items are final sale.</strong> Refunds are issued to the original
            payment method within 5–7 business days of receiving the return.
          </p>

          <hr style={dividerStyle} />

          {/* Damaged / wrong items */}
          <h2 style={h2Style}>Wrong or Damaged Items</h2>
          <p style={pStyle}>
            If you received the wrong item or something arrived damaged, we'll make it right
            immediately — no questions, no hassle. Contact us within 7 days of delivery and
            we'll ship a replacement at no cost.
          </p>

          <hr style={dividerStyle} />

          <p style={{ ...pStyle, color: "var(--muted)", fontSize: "15px" }}>
            Have a question not answered here?{" "}
            <a
              href="/contact"
              style={{ color: "var(--primary)", textDecoration: "underline" }}
            >
              Reach out
            </a>{" "}
            and we'll get back to you within one business day.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
