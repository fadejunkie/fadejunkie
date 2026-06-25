'use client'
import { useQuery } from 'convex/react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { api } from '@/convex/_generated/api'
import ProductCard from '@/components/ProductCard'

const label: React.CSSProperties = {
  fontSize: 11,
  textTransform: 'uppercase' as const,
  color: 'var(--gold)',
  fontWeight: 700,
}

const collections = [
  { slug: '', label: 'All' },
  { slug: 'clippers', label: 'Clippers' },
  { slug: 'trimmers', label: 'Trimmers' },
  { slug: 'hair-care', label: 'Hair Care' },
  { slug: 'styling', label: 'Styling' },
  { slug: 'color', label: 'Color' },
  { slug: 'specials', label: 'Specials' },
  { slug: 'bundles', label: 'Bundles' },
]

function ShopContent() {
  const searchParams = useSearchParams()
  const activeCollection = searchParams.get('collection') ?? ''

  const products = useQuery(api.products.list, {})

  const filtered = products?.filter((p) => {
    if (!activeCollection) return true
    return p.tags?.some((t) => t.toLowerCase().replace(/\s+/g, '-') === activeCollection)
  })

  return (
    <main style={{ paddingTop: 64, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: 'clamp(40px, 6vw, 72px) clamp(24px, 5vw, 80px) 0' }}>
        <p style={{ ...label, marginBottom: 12 }}>ALL PRODUCTS</p>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.0,
          textWrap: 'balance',
        }}>Shop</h1>
      </div>

      {/* Filter bar */}
      <div
        className="scroll-hide"
        style={{
          display: 'flex', overflowX: 'auto', gap: 8,
          padding: '32px clamp(24px, 5vw, 80px)',
          borderBottom: '1px solid var(--hairline)',
        }}
      >
        {collections.map((c) => {
          const active = c.slug === activeCollection
          return (
            <a
              key={c.slug}
              href={c.slug ? `/shop?collection=${c.slug}` : '/shop'}
              style={{
                flexShrink: 0,
                padding: '6px 16px',
                fontSize: 11,
                textTransform: 'uppercase',
                fontWeight: 700,
                borderRadius: 20,
                border: `1px solid ${active ? 'var(--gold)' : 'var(--hairline)'}`,
                color: active ? '#000000' : 'var(--body)',
                background: active ? 'var(--gold)' : 'transparent',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              {c.label}
            </a>
          )
        })}
      </div>

      {/* Grid */}
      <div style={{ padding: '16px clamp(24px, 5vw, 80px) clamp(80px, 10vw, 120px)' }}>
        {products === undefined ? (
          /* Skeleton */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
            marginTop: 16,
          }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                aspectRatio: '3/4',
                background: 'var(--surface-soft)',
                border: '1px solid var(--hairline)',
                borderRadius: 8,
              }} />
            ))}
          </div>
        ) : filtered && filtered.length === 0 ? (
          <div style={{ paddingTop: 80, textAlign: 'center', color: 'var(--muted)', fontSize: 15 }}>
            No products found
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
            marginTop: 16,
          }}>
            {(filtered ?? []).map((p) => (
              <ProductCard
                key={p._id}
                name={p.name}
                price={p.price}
                compareAtPrice={p.compareAtPrice}
                imageUrl={p.images?.[0]}
                tags={p.tags}
                slug={p.slug}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <main style={{ paddingTop: 64, minHeight: '100vh' }}>
        <div style={{ padding: 'clamp(40px, 6vw, 72px) clamp(24px, 5vw, 80px)' }}>
          <div style={{ width: 80, height: 11, background: 'var(--surface-card)', marginBottom: 12 }} />
          <div style={{ width: 200, height: 48, background: 'var(--surface-card)' }} />
        </div>
      </main>
    }>
      <ShopContent />
    </Suspense>
  )
}
