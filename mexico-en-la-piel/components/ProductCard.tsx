"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/cart";
import { Doc } from "@/convex/_generated/dataModel";

interface Props {
  product: Doc<"products">;
}

export function ProductCard({ product }: Props) {
  const image = product.images[0];
  const secondImage = product.images[1];

  // Auto-cycle with a random stagger offset so cards don't all flip at once
  const [showSecond, setShowSecond] = useState(false);
  useEffect(() => {
    if (!secondImage) return;
    // Random offset 0–5.9s so each card starts its cycle at a different time
    const offset = Math.random() * 6000;
    let id: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      setShowSecond(true);
      id = setInterval(() => setShowSecond((s) => !s), 6000);
    }, offset);
    return () => { clearTimeout(timeout); clearInterval(id); };
  }, [secondImage]);

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block"
      style={{ textDecoration: "none" }}
    >
      {/* Image container */}
      <div
        style={{
          aspectRatio: "1 / 1",
          overflow: "hidden",
          borderRadius: 0,
          background: "var(--surface-card)",
          marginBottom: "12px",
          position: "relative",
        }}
      >
        {image ? (
          <>
            {/* Primary image */}
            <Image
              src={image}
              alt={product.name}
              width={400}
              height={400}
              className={[
                "absolute inset-0 w-full h-full object-cover",
                "transition-[opacity,transform] duration-500 ease-in-out",
                secondImage
                  ? showSecond
                    ? "opacity-0 scale-105"
                    : "opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-105"
                  : "scale-100 group-hover:scale-105",
              ].join(" ")}
            />
            {/* Secondary image */}
            {secondImage && (
              <Image
                src={secondImage}
                alt={`${product.name} — view 2`}
                width={400}
                height={400}
                className={[
                  "absolute inset-0 w-full h-full object-cover",
                  "transition-[opacity,transform] duration-500 ease-in-out",
                  showSecond
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100",
                ].join(" ")}
              />
            )}
          </>
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
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Product name */}
      <p
        style={{
          color: "var(--body-strong)",
          fontFamily: "var(--font-display)",
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
        {product.name}
      </p>

      {/* Price row */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: "var(--body)", fontWeight: 300, fontSize: "14px" }}>
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <span style={{ color: "var(--muted)", fontWeight: 300, fontSize: "12px", textDecoration: "line-through" }}>
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
      </div>
    </Link>
  );
}
