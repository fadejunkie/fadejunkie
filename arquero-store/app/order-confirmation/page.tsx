"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { formatPrice } from "@/lib/cart";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function Confirmation() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "";

  const order = useQuery(
    api.orders.getByStripeSession,
    sessionId ? { stripeSessionId: sessionId } : "skip"
  );

  if (!sessionId) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(20px, 3vw, 32px)",
            textTransform: "uppercase",
            color: "var(--on-dark)",
            marginBottom: "12px",
          }}
        >
          Order Not Found
        </h1>
        <Link
          href="/shop"
          style={{
            color: "var(--muted)",
            fontSize: "13px",
            fontWeight: 300,
            textDecoration: "underline",
          }}
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  if (order === undefined) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--muted)", fontWeight: 300 }}>
        Loading your order…
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "560px",
        margin: "0 auto",
        textAlign: "center",
        padding: "80px 24px",
      }}
    >
      {/* Checkmark */}
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "1px solid var(--accent)",
          borderRadius: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
          color: "var(--accent)",
          fontSize: "20px",
          fontWeight: 700,
        }}
      >
        ✓
      </div>

      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "clamp(24px, 4vw, 36px)",
          textTransform: "uppercase",
          letterSpacing: "-0.5px",
          color: "var(--on-dark)",
          marginBottom: "12px",
        }}
      >
        Order Confirmed
      </h1>

      <p
        style={{
          color: "var(--body)",
          fontWeight: 300,
          lineHeight: 1.6,
          marginBottom: "40px",
        }}
      >
        Thanks for your order. We&apos;ll send a confirmation to{" "}
        <span style={{ color: "var(--body-strong)", fontWeight: 700 }}>{order?.customerEmail}</span>.
      </p>

      {/* Order details panel */}
      {order && (
        <div
          style={{
            background: "var(--surface-card)",
            borderRadius: 0,
            padding: "24px",
            marginBottom: "32px",
            textAlign: "left",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "16px",
            }}
          >
            Order Details
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "var(--body)", fontWeight: 300 }}>
                  {item.productName}
                  {item.variant && (
                    <span style={{ color: "var(--muted)", marginLeft: "6px" }}>({item.variant})</span>
                  )}
                  {" × "}
                  {item.quantity}
                </span>
                <span style={{ color: "var(--body-strong)", fontWeight: 300 }}>
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: "1px solid var(--hairline)",
              marginTop: "16px",
              paddingTop: "16px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: "var(--on-dark)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px" }}>
              Total
            </span>
            <span style={{ color: "var(--on-dark)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px" }}>
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
      )}

      {/* CTA */}
      <Link
        href="/shop"
        style={{
          display: "inline-block",
          height: "48px",
          padding: "0 32px",
          lineHeight: "46px",
          borderRadius: 0,
          border: "1px solid var(--on-dark)",
          background: "transparent",
          color: "var(--on-dark)",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "14px",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          textDecoration: "none",
          transition: "opacity 0.15s",
        }}
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1, background: "var(--canvas)" }}>
        <Suspense fallback={<div style={{ padding: "80px", textAlign: "center", color: "var(--muted)", fontWeight: 300 }}>Loading…</div>}>
          <Confirmation />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
