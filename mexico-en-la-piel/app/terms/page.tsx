import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { brand } from "@/brand.config";

export const metadata = {
  title: `Terms of Service | ${brand.name}`,
  description: `Terms of service for ${brand.name} at ${brand.domain}.`,
};

export default function TermsPage() {
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

  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <section style={sectionStyle}>
          <p style={labelStyle}>Legal</p>
          <h1 style={h1Style}>Terms of Service</h1>
          <p style={metaStyle}>Last updated: May 2025</p>

          <p style={pStyle}>
            By accessing and using {brand.domain}, you agree to be bound by these Terms
            of Service. Please read them carefully. If you do not agree, do not use the site.
          </p>

          <h2 style={h2Style}>Use of the Site</h2>
          <p style={pStyle}>
            You agree to use this site only for lawful purposes and in a way that does not
            infringe the rights of others. You may not attempt to gain unauthorized access
            to any part of the site or its related systems.
          </p>

          <h2 style={h2Style}>Products & Orders</h2>
          <p style={pStyle}>
            All product descriptions, prices, and availability are subject to change without
            notice. We reserve the right to refuse or cancel any order at our discretion,
            including orders that appear fraudulent or in violation of these terms.
          </p>
          <p style={pStyle}>
            Prices are listed in US Dollars. Sales tax may be applied at checkout based
            on your delivery address.
          </p>

          <h2 style={h2Style}>Payment</h2>
          <p style={pStyle}>
            Payment is processed securely through Stripe. By placing an order, you represent
            that you are authorized to use the payment method provided. {brand.name} does not
            store your payment card details.
          </p>

          <h2 style={h2Style}>Shipping & Returns</h2>
          <p style={pStyle}>
            For shipping rates, delivery timelines, and return procedures, see our{" "}
            <a
              href="/shipping"
              style={{ color: "var(--primary)", textDecoration: "underline" }}
            >
              Shipping & Returns
            </a>{" "}
            page.
          </p>

          <h2 style={h2Style}>Intellectual Property</h2>
          <p style={pStyle}>
            All content on this site — including logos, graphics, text, and product images —
            is the property of {brand.name} and may not be reproduced or distributed without
            prior written consent.
          </p>

          <h2 style={h2Style}>Disclaimer of Warranties</h2>
          <p style={pStyle}>
            This site and its content are provided "as is" without warranty of any kind.
            {brand.name} makes no representations about the accuracy or completeness of
            the content and disclaims all warranties, express or implied, to the fullest
            extent permitted by law.
          </p>

          <h2 style={h2Style}>Limitation of Liability</h2>
          <p style={pStyle}>
            {brand.name} shall not be liable for any indirect, incidental, special, or
            consequential damages arising from your use of the site or any products purchased
            through it. Our total liability shall not exceed the amount paid for the
            specific product giving rise to the claim.
          </p>

          <h2 style={h2Style}>Governing Law</h2>
          <p style={pStyle}>
            These terms are governed by the laws of the State of Texas, without regard to
            its conflict-of-law provisions.
          </p>

          <h2 style={h2Style}>Changes to These Terms</h2>
          <p style={pStyle}>
            We reserve the right to update these Terms at any time. Updated terms will be
            posted here with a revised date. Continued use of the site constitutes acceptance.
          </p>

          <h2 style={h2Style}>Contact</h2>
          <p style={pStyle}>
            Questions? Contact us at{" "}
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
