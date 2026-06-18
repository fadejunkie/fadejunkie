"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { formatPrice, getCartSessionId } from "@/lib/cart";
import { brand } from "@/brand.config";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAction } from "convex/react";

export default function CartPage() {
  const [sessionId, setSessionId] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    setSessionId(getCartSessionId());
  }, []);

  const cartItems = useQuery(
    api.cart.getCart,
    sessionId ? { sessionId } : "skip"
  );
  const updateQty = useMutation(api.cart.updateQty);
  const removeItem = useMutation(api.cart.removeItem);
  const createCheckout = useAction(api.stripe.createCheckoutSession);

  const subtotal = cartItems?.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0) ?? 0;
  const shipping = subtotal >= brand.shipping.freeThreshold ? 0 : brand.shipping.flatRate;
  const total = subtotal + shipping;

  async function handleCheckout() {
    if (!sessionId || !cartItems?.length) return;
    setCheckingOut(true);
    try {
      const url = await createCheckout({
        sessionId,
        successUrl: `${window.location.origin}/order-confirmation`,
        cancelUrl: `${window.location.origin}/cart`,
      });
      window.location.href = url;
    } catch (err) {
      console.error(err);
      setCheckingOut(false);
    }
  }

  const skeletonStyle: React.CSSProperties = {
    background: "var(--surface-card)",
    borderRadius: 0,
    animation: "pulse 1.5s ease-in-out infinite",
  };

  return (
    <>
      <Navbar />
      <main style={{ flex: 1, background: "var(--canvas)" }}>
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            padding: "64px 24px 96px",
          }}
        >
          {/* Heading */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(24px, 4vw, 40px)",
              textTransform: "uppercase",
              letterSpacing: "-0.5px",
              color: "var(--body-strong)",
              marginBottom: "40px",
              paddingBottom: "24px",
              borderBottom: "1px solid var(--hairline)",
            }}
          >
            Your Cart
          </h1>

          {!cartItems ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ height: "80px", ...skeletonStyle }} />
              ))}
            </div>
          ) : cartItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ color: "var(--muted)", fontWeight: 300, marginBottom: "16px" }}>
                Your cart is empty.
              </p>
              <a
                href="/shop"
                style={{
                  color: "var(--body-strong)",
                  fontFamily: "var(--font-display)",
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  textDecoration: "underline",
                }}
              >
                Continue Shopping
              </a>
            </div>
          ) : (
            <div
              style={{ display: "grid", gap: "32px" }}
              className="md:grid-cols-3"
            >
              {/* Cart items — 2/3 width on desktop */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} className="md:col-span-2">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      display: "flex",
                      gap: "16px",
                      padding: "20px",
                      background: "var(--surface-card)",
                      borderRadius: 0,
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: 0,
                        background: "var(--surface-elevated)",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.productName}
                          width={64}
                          height={64}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          color: "var(--body-strong)",
                          fontWeight: 700,
                          fontSize: "13px",
                          letterSpacing: "0.5px",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginBottom: "4px",
                        }}
                      >
                        {item.productName}
                      </p>
                      {item.variant && (
                        <p style={{ color: "var(--muted)", fontSize: "12px", fontWeight: 300, marginBottom: "4px" }}>
                          {item.variant}
                        </p>
                      )}
                      <p style={{ color: "var(--body-strong)", fontWeight: 300, fontSize: "14px" }}>
                        {formatPrice(item.unitPrice)}
                      </p>
                    </div>

                    {/* Qty controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        onClick={() => updateQty({ id: item._id, quantity: item.quantity - 1 })}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: 0,
                          border: "1px solid var(--hairline)",
                          background: "transparent",
                          color: "var(--body)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "16px",
                          transition: "border-color 0.15s",
                        }}
                      >
                        −
                      </button>
                      <span style={{ width: "24px", textAlign: "center", color: "var(--body-strong)", fontSize: "14px" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty({ id: item._id, quantity: item.quantity + 1 })}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: 0,
                          border: "1px solid var(--hairline)",
                          background: "transparent",
                          color: "var(--body)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "16px",
                          transition: "border-color 0.15s",
                        }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem({ id: item._id })}
                        style={{
                          marginLeft: "8px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--muted)",
                          padding: 0,
                          transition: "color 0.15s",
                        }}
                      >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary panel */}
              <div
                style={{
                  background: "var(--surface-card)",
                  borderRadius: 0,
                  padding: "24px",
                  height: "fit-content",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "14px",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginBottom: "20px",
                  }}
                >
                  Order Summary
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--muted)", fontSize: "13px", fontWeight: 300 }}>Subtotal</span>
                    <span style={{ color: "var(--body-strong)", fontSize: "13px", fontWeight: 300 }}>{formatPrice(subtotal)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--muted)", fontSize: "13px", fontWeight: 300 }}>Shipping</span>
                    <span style={{ color: "var(--body-strong)", fontSize: "13px", fontWeight: 300 }}>
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p style={{ color: "var(--muted)", fontSize: "11px", fontWeight: 300 }}>
                      Free shipping on orders over {formatPrice(brand.shipping.freeThreshold)}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    borderTop: "1px solid var(--hairline)",
                    paddingTop: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <span style={{ color: "var(--body-strong)", fontWeight: 700, fontSize: "14px" }}>Total</span>
                  <span style={{ color: "var(--body-strong)", fontWeight: 700, fontSize: "14px" }}>{formatPrice(total)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  style={{
                    width: "100%",
                    height: "48px",
                    borderRadius: 0,
                    border: "none",
                    background: "var(--primary)",
                    color: "var(--on-dark)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "14px",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    cursor: checkingOut ? "not-allowed" : "pointer",
                    opacity: checkingOut ? 0.5 : 1,
                    transition: "opacity 0.15s",
                  }}
                >
                  {checkingOut ? "Redirecting…" : "Checkout"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
