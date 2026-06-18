import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/cart";
import { Doc } from "@/convex/_generated/dataModel";

interface Props {
  product: Doc<"products">;
}

function formatMileage(miles: number) {
  return miles.toLocaleString() + " mi";
}

export function ProductCard({ product }: Props) {
  const image = product.images[0];
  const isVehicle = !!(product.year || product.make);
  const title = isVehicle && product.year && product.make && product.model
    ? `${product.year} ${product.make} ${product.model}`
    : product.name;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block"
      style={{ textDecoration: "none" }}
    >
      {/* Image container */}
      <div
        style={{
          aspectRatio: "16 / 10",
          overflow: "hidden",
          borderRadius: "6px",
          background: "var(--surface-card)",
          marginBottom: "12px",
          position: "relative",
        }}
      >
        {product.condition && (
          <span
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 2,
              background:
                product.condition === "New"
                  ? "var(--accent)"
                  : product.condition === "Certified Pre-Owned"
                  ? "#1a7f4b"
                  : "#495057",
              color: "#fff",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              padding: "3px 8px",
              borderRadius: "3px",
            }}
          >
            {product.condition}
          </span>
        )}
        {image ? (
          <Image
            src={image}
            alt={title}
            width={600}
            height={375}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "6px",
              display: "block",
              transition: "transform 0.35s ease",
            }}
            className="group-hover:scale-[1.03]"
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
            {/* Car silhouette placeholder */}
            <svg width="64" height="40" viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 28h56M8 28v4M56 28v4M14 28l6-10h24l6 10" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="18" cy="30" r="3" />
              <circle cx="46" cy="30" r="3" />
            </svg>
          </div>
        )}
      </div>

      {/* Vehicle info */}
      <div>
        {/* Body type + transmission pill row */}
        {(product.bodyType || product.transmission) && (
          <div style={{ display: "flex", gap: "6px", marginBottom: "6px", flexWrap: "wrap" }}>
            {product.bodyType && (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--muted)",
                  background: "var(--surface-card)",
                  border: "1px solid var(--hairline)",
                  borderRadius: "3px",
                  padding: "2px 7px",
                }}
              >
                {product.bodyType}
              </span>
            )}
            {product.transmission && (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--muted)",
                  background: "var(--surface-card)",
                  border: "1px solid var(--hairline)",
                  borderRadius: "3px",
                  padding: "2px 7px",
                }}
              >
                {product.transmission}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <p
          style={{
            color: "var(--on-dark)",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "15px",
            letterSpacing: "-0.2px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginBottom: "4px",
          }}
        >
          {title}
          {product.trim && (
            <span style={{ fontWeight: 400, color: "var(--muted)", marginLeft: "4px", fontSize: "13px" }}>
              {product.trim}
            </span>
          )}
        </p>

        {/* Mileage + price row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
          {product.mileage != null ? (
            <span style={{ color: "var(--muted)", fontSize: "13px", fontWeight: 400 }}>
              {formatMileage(product.mileage)}
            </span>
          ) : (
            <span />
          )}
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: "15px" }}>
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: "12px", textDecoration: "line-through" }}>
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Availability badge */}
        {!product.inStock && (
          <p style={{ color: "#dc2626", fontSize: "12px", fontWeight: 600, marginTop: "4px" }}>
            Sold
          </p>
        )}
      </div>
    </Link>
  );
}
