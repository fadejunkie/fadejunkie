import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
  name: string
  price: number
  compareAtPrice?: number
  imageUrl?: string
  tags?: string[]
  slug: string
}

export default function ProductCard({ name, price, compareAtPrice, imageUrl, tags, slug }: ProductCardProps) {
  const brand = tags?.[0]?.toUpperCase() ?? ''
  const displayPrice = `$${(price / 100).toFixed(2)}`
  const displayCompare = compareAtPrice ? `$${(compareAtPrice / 100).toFixed(2)}` : null
  const onSale = compareAtPrice && compareAtPrice > price

  return (
    <div
      className="card-hover"
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--hairline)',
        borderRadius: 8,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 3px rgba(0,0,0,0.4), 0 0 1px rgba(0,0,0,0.6)',
      }}
    >
      {/* Card link wraps image + info, but NOT the button */}
      <Link href={`/shop/${slug}`} style={{ display: 'block', cursor: 'pointer', flex: 1 }}>
        {/* Image */}
        <div style={{
          aspectRatio: '3/4',
          background: 'var(--surface-elevated)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '8px 8px 0 0',
        }}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 640px) 50vw, 25vw"
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontSize: 11, textTransform: 'uppercase',
                color: 'var(--muted)',
              }}>
                {brand || name}
              </span>
            </div>
          )}
          {onSale && (
            <div style={{
              position: 'absolute', top: 12, left: 12,
              background: 'var(--gold)', color: '#000',
              fontSize: 10, fontWeight: 700,
              padding: '4px 8px', textTransform: 'uppercase',
              borderRadius: 4,
            }}>
              SALE
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '14px 16px 12px' }}>
          {brand && (
            <p style={{
              fontSize: 11, textTransform: 'uppercase',
              color: 'var(--gold)', marginBottom: 4, fontWeight: 700,
            }}>
              {brand}
            </p>
          )}
          <p style={{
            fontSize: 14, fontWeight: 700, lineHeight: 1.3, color: 'var(--on-dark)',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {name}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            {/* Price: always gold per DESIGN.md — no conditional color */}
            <span style={{
              fontSize: '1.25rem', color: 'var(--gold)', fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {displayPrice}
            </span>
            {onSale && displayCompare && (
              <span style={{
                fontSize: 13, color: 'var(--muted)',
                textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums',
              }}>
                {displayCompare}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart — outside the <Link> to prevent nav on click */}
      {/* TODO: wire to cart mutation (convex/cart.ts addItem) once cart session is available */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          // cart add action — to be wired to Convex addItem mutation
        }}
        style={{
          width: '100%',
          background: 'var(--gold)',
          color: '#000000',
          border: 'none',
          borderTop: '1px solid var(--hairline)',
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold-light)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)' }}
      >
        Add to Cart
      </button>
    </div>
  )
}
