"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { formatPrice, getCartSessionId } from "@/lib/cart";
import Image from "next/image";
import { useState, use } from "react";
import { useRouter } from "next/navigation";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = useQuery(api.products.getBySlug, { slug });
  const addItem = useMutation(api.cart.addItem);
  const router = useRouter();

  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const skeletonStyle: React.CSSProperties = {
    background: "var(--surface-card)",
    borderRadius: 0,
    animation: "pulse 1.5s ease-in-out infinite",
  };

  if (product === undefined) {
    return (
      <>
        <Navbar />
        <main style={{ flex: 1, maxWidth: "1152px", margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ display: "flex", gap: "40px" }}>
            <div style={{ flex: 1, aspectRatio: "1 / 1", ...skeletonStyle }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ height: "40px", width: "66%", ...skeletonStyle }} />
              <div style={{ height: "28px", width: "25%", ...skeletonStyle }} />
              <div style={{ height: "80px", ...skeletonStyle }} />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main style={{ flex: 1, maxWidth: "1152px", margin: "0 auto", padding: "48px 24px" }}>
          <p style={{ color: "var(--muted)", fontWeight: 300 }}>Product not found.</p>
        </main>
        <Footer />
      </>
    );
  }

  const variantString = Object.values(selectedVariants).join(" / ") || undefined;
  const allVariantsSelected =
    !product.variants ||
    product.variants.every((v) => selectedVariants[v.name]);

  async function handleAddToCart() {
    if (!allVariantsSelected || !product) return;
    setAdding(true);
    try {
      const sessionId = getCartSessionId();
      await addItem({
        sessionId,
        productId: product._id,
        productName: product.name,
        variant: variantString,
        quantity: 1,
        unitPrice: product.price,
        image: product.images[0],
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setAdding(false);
    }
  }

  return (
    <>
      <Navbar />
      <main style={{ flex: 1, background: "var(--canvas)" }}>
        <div
          style={{
            maxWidth: "1152px",
            margin: "0 auto",
            padding: "48px 24px 96px",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "48px",
            }}
            className="md:grid-cols-2"
          >
            {/* Images */}
            <div>
              {/* Main image */}
              <div
                style={{
                  aspectRatio: "1 / 1",
                  overflow: "hidden",
                  borderRadius: 0,
                  background: "var(--surface-card)",
                  marginBottom: "12px",
                }}
              >
                {product.images[activeImage] ? (
                  <Image
                    src={product.images[activeImage]}
                    alt={product.name}
                    width={600}
                    height={600}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 0, display: "block" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--hairline)",
                    }}
                  >
                    <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {product.images.length > 1 && (
                <div style={{ display: "flex", gap: "8px" }}>
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: 0,
                        overflow: "hidden",
                        border: `2px solid ${activeImage === i ? "var(--primary)" : "var(--hairline)"}`,
                        background: "none",
                        cursor: "pointer",
                        padding: 0,
                        transition: "border-color 0.15s",
                      }}
                    >
                      <Image
                        src={img}
                        alt=""
                        width={64}
                        height={64}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(28px, 4vw, 40px)",
                  textTransform: "uppercase",
                  letterSpacing: "-0.5px",
                  color: "var(--body-strong)",
                  marginBottom: "12px",
                }}
              >
                {product.name}
              </h1>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <span style={{ color: "var(--body-strong)", fontWeight: 300, fontSize: "20px" }}>
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span style={{ color: "var(--muted)", fontWeight: 300, textDecoration: "line-through" }}>
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <p
                style={{
                  color: "var(--body)",
                  fontWeight: 300,
                  lineHeight: 1.7,
                  marginBottom: "32px",
                }}
              >
                {product.description}
              </p>

              {/* Variants */}
              {product.variants?.map((variant) => (
                <div key={variant.name} style={{ marginBottom: "20px" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "14px",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      marginBottom: "10px",
                    }}
                  >
                    {variant.name}
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {variant.options.map((opt) => {
                      const isSelected = selectedVariants[variant.name] === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() =>
                            setSelectedVariants((prev) => ({ ...prev, [variant.name]: opt }))
                          }
                          style={{
                            padding: "8px 16px",
                            borderRadius: 0,
                            border: `1px solid ${isSelected ? "var(--primary)" : "var(--hairline)"}`,
                            background: isSelected ? "var(--primary)" : "transparent",
                            color: isSelected ? "var(--on-dark)" : "var(--body)",
                            fontFamily: "var(--font-display)",
                            fontSize: "13px",
                            fontWeight: 700,
                            letterSpacing: "0.5px",
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Actions */}
              <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
                <button
                  onClick={handleAddToCart}
                  disabled={!allVariantsSelected || adding || !product.inStock}
                  style={{
                    flex: 1,
                    height: "48px",
                    borderRadius: 0,
                    border: `1px solid ${!allVariantsSelected || !product.inStock ? "var(--hairline)" : "var(--primary)"}`,
                    background: "transparent",
                    color: !allVariantsSelected || !product.inStock ? "var(--muted)" : "var(--body-strong)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "14px",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    cursor: !allVariantsSelected || adding || !product.inStock ? "not-allowed" : "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {!product.inStock
                    ? "Out of Stock"
                    : added
                    ? "Added"
                    : adding
                    ? "Adding…"
                    : "Add to Cart"}
                </button>

                <button
                  onClick={() => router.push("/cart")}
                  style={{
                    height: "48px",
                    padding: "0 20px",
                    borderRadius: 0,
                    border: "1px solid var(--hairline)",
                    background: "transparent",
                    color: "var(--body)",
                    fontSize: "13px",
                    fontWeight: 300,
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                  }}
                >
                  View Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
