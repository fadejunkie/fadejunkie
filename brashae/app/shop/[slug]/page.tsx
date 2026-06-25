'use client'
import { useQuery } from 'convex/react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/convex/_generated/api'

const label: React.CSSProperties = {
  fontSize: 11,
  textTransform: 'uppercase' as const,
  color: 'var(--gold)',
  fontWeight: 700,
}

export default function ProductPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : ''
  const product = useQuery(api.products.getBySlug, { slug })

  if (product === undefined) {
    return (
      <main style={{ paddingTop: 56, minHeight: '100vh' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ aspectRatio: '1/1', background: 'var(--surface-soft)' }} />
          <div style={{ padding: '80px 48px' }}>
            <div style={{ width: 80, height: 11, background: 'var(--surface-card)', marginBottom: 16 }} />
            <div style={{ width: '60%', height: 40, background: 'var(--surface-card)', marginBottom: 12 }} />
            <div style={{ width: 100, height: 28, background: 'var(--surface-card)' }} />
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main style={{ paddingTop: 56, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ ...label, marginBottom: 16 }}>NOT FOUND</p>
          <Link href="/shop" style={{ fontSize: 13, color: 'var(--gold)' }}>← Back to Shop</Link>
        </div>
      </main>
    )
  }

  const brand = product.tags?.[0]?.toUpperCase() ?? ''
  const displayPrice = `$${(product.price / 100).toFixed(2)}`
  const displayCompare = product.compareAtPrice ? `$${(product.compareAtPrice / 100).toFixed(2)}` : null
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price
  const imageUrl = product.images?.[0]

  return (
    <main style={{ paddingTop: 56, minHeight: '100vh' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: 'calc(100vh - 56px)',
      }}>
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '1/1', background: 'var(--surface-soft)' }}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="50vw"
              priority
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)' }}>
                {brand || product.name}
              </span>
            </div>
          )}
          {onSale && (
            <div style={{
              position: 'absolute', top: 24, left: 24,
              background: 'var(--gold)', color: '#000',
              fontSize: 10, fontWeight: 700,
              padding: '5px 10px', textTransform: 'uppercase',
              borderRadius: 4,
            }}>
              SALE
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{
          padding: 'clamp(48px, 6vw, 80px) clamp(32px, 5vw, 72px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <Link href="/shop" style={{
            fontSize: 11, textTransform: 'uppercase',
            color: 'var(--muted)', marginBottom: 40, display: 'inline-block',
          }}>
            ← Back to Shop
          </Link>

          {brand && <p style={{ ...label, marginBottom: 12 }}>{brand}</p>}

          <h1 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800,
            lineHeight: 1.05, marginBottom: 24, textWrap: 'balance',
          }}>
            {product.name}
          </h1>

          {/* Price — always gold per DESIGN.md */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <span style={{
              fontSize: '1.25rem', fontWeight: 700, color: 'var(--gold)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {displayPrice}
            </span>
            {onSale && displayCompare && (
              <span style={{
                fontSize: 18, color: 'var(--muted)', textDecoration: 'line-through',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {displayCompare}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <button
            disabled={!product.inStock}
            className={product.inStock ? 'btn-gold' : ''}
            style={{
              width: '100%', padding: 18,
              background: product.inStock ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
              color: product.inStock ? '#000' : 'var(--muted)',
              border: 'none', cursor: product.inStock ? 'pointer' : 'not-allowed',
              fontSize: 13, fontWeight: 700,
              textTransform: 'uppercase',
              fontFamily: 'inherit',
              borderRadius: 6,
              transition: 'background 0.2s ease, transform 0.15s ease',
            }}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>

          {/* Description */}
          {product.description && (
            <p style={{
              fontSize: 15, color: 'var(--body)',
              lineHeight: 1.7, marginTop: 32, textWrap: 'pretty',
            }}>
              {product.description}
            </p>
          )}

          {/* Variants */}
          {product.variants?.map((v) => (
            <div key={v.name} style={{ marginTop: 24 }}>
              <p style={{ ...label, color: 'var(--muted)', marginBottom: 12 }}>{v.name.toUpperCase()}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {v.options.map((opt) => (
                  <button key={opt} className="variant-btn" style={{
                    padding: '8px 16px',
                    border: '1px solid var(--hairline)',
                    background: 'transparent', color: 'var(--on-dark)',
                    fontSize: 13, cursor: 'pointer',
                    fontFamily: 'inherit',
                    borderRadius: 6,
                    transition: 'border-color 0.2s ease, color 0.2s ease',
                  }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
