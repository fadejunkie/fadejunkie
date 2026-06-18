import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { brand } from "@/brand.config";

export const metadata = {
  title: `Privacy Policy | ${brand.name}`,
  description: `Privacy policy for ${brand.name} at ${brand.domain}.`,
};

export default function PrivacyPage() {
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
    fontSize: "clamp(28px, 4vw, 44px)",
    lineHeight: 1.1,
    color: "var(--body-strong)",
    marginBottom: "8px",
    letterSpacing: "-0.5px",
  };

  const metaStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "var(--muted)",
    fontWeight: 300,
    marginBottom: "48px",
  };

  const h2Style: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "18px",
    color: "var(--body-strong)",
    marginBottom: "10px",
    marginTop: "40px",
    letterSpacing: "0.5px",
  };

  const pStyle: React.CSSProperties = {
    fontSize: "15px",
    lineHeight: "1.75",
    color: "var(--body)",
    fontWeight: 300,
    marginBottom: "16px",
  };

  const liStyle: React.CSSProperties = {
    fontSize: "15px",
    lineHeight: "1.75",
    color: "var(--body)",
    fontWeight: 300,
    marginBottom: "8px",
  };

  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <section style={sectionStyle}>
          <p style={labelStyle}>Legal</p>
          <h1 style={h1Style}>Privacy Policy</h1>
          <p style={metaStyle}>Last updated: May 2025</p>

          <p style={pStyle}>
            {brand.name} ("we," "us," or "our") operates {brand.domain}. This page informs
            you of our policies regarding the collection, use, and disclosure of personal
            information when you use our service.
          </p>

          <h2 style={h2Style}>Information We Collect</h2>
          <p style={pStyle}>
            When you place an order or interact with our store, we may collect:
          </p>
          <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
            <li style={liStyle}>Name and contact information (email, phone number, shipping address)</li>
            <li style={liStyle}>Payment information (processed securely via Stripe — we never store card numbers)</li>
            <li style={liStyle}>Order history and cart contents</li>
            <li style={liStyle}>Device and browser information for analytics and fraud prevention</li>
          </ul>

          <h2 style={h2Style}>How We Use Your Information</h2>
          <p style={pStyle}>
            We use the information we collect to:
          </p>
          <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>
            <li style={liStyle}>Process and fulfill your orders</li>
            <li style={liStyle}>Send order confirmations and shipping updates</li>
            <li style={liStyle}>Respond to customer service inquiries</li>
            <li style={liStyle}>Improve our products and website experience</li>
            <li style={liStyle}>Comply with legal obligations</li>
          </ul>

          <h2 style={h2Style}>Sharing of Information</h2>
          <p style={pStyle}>
            We do not sell, trade, or rent your personal information to third parties.
            We may share data with trusted service providers (Stripe for payments, shipping
            carriers for delivery) solely to fulfill your order. These providers are
            contractually obligated to keep your information confidential.
          </p>

          <h2 style={h2Style}>Cookies</h2>
          <p style={pStyle}>
            We use cookies and similar tracking technologies to maintain your cart session
            and analyze site usage. You can instruct your browser to refuse cookies, but
            this may affect your ability to use certain features.
          </p>

          <h2 style={h2Style}>Data Security</h2>
          <p style={pStyle}>
            We implement industry-standard security measures to protect your personal
            information. All payment processing is handled by Stripe, which is PCI-DSS
            compliant. No method of transmission over the Internet is 100% secure, but
            we work to use commercially acceptable means to protect your data.
          </p>

          <h2 style={h2Style}>Your Rights</h2>
          <p style={pStyle}>
            You have the right to access, correct, or delete your personal information.
            To make a request, contact us at{" "}
            <a
              href="mailto:hello@arqueroco.com"
              style={{ color: "var(--primary)", textDecoration: "underline" }}
            >
              hello@arqueroco.com
            </a>
            . We will respond within 30 days.
          </p>

          <h2 style={h2Style}>Changes to This Policy</h2>
          <p style={pStyle}>
            We may update this Privacy Policy from time to time. Changes will be posted
            on this page with an updated date. Continued use of the site constitutes
            acceptance of the revised policy.
          </p>

          <h2 style={h2Style}>Contact</h2>
          <p style={pStyle}>
            Questions about this policy? Contact us at{" "}
            <a
              href="/contact"
              style={{ color: "var(--primary)", textDecoration: "underline" }}
            >
              our contact page
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
