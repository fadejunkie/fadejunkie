'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import FilterSidebar, { ActiveFilters } from './FilterSidebar'

interface ProductGridLayoutProps {
  children: React.ReactNode
  productCount?: number
  activeCollection?: string
}

const DEFAULT_FILTERS: ActiveFilters = {
  brand: [],
  priceMax: null,
  inStockOnly: false,
  collection: '',
}

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured'         },
  { value: 'price-asc',  label: 'Price: Low–High'  },
  { value: 'price-desc', label: 'Price: High–Low'  },
  { value: 'newest',     label: 'Newest'            },
]

export default function ProductGridLayout({ children, productCount, activeCollection }: ProductGridLayoutProps) {
  const searchParams = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)
  const [sort, setSort] = useState('featured')

  // Build active filters from URL params so FilterSidebar stays in sync
  const activeFilters: ActiveFilters = {
    brand:       searchParams.get('brand')?.split(',').filter(Boolean) ?? [],
    priceMax:    searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : null,
    inStockOnly: searchParams.get('inStock') === '1',
    collection:  searchParams.get('collection') ?? '',
  }

  const hasActiveFilters = (
    activeFilters.brand.length > 0 ||
    activeFilters.priceMax !== null ||
    activeFilters.inStockOnly
  )

  const filterCount =
    activeFilters.brand.length +
    (activeFilters.priceMax !== null ? 1 : 0) +
    (activeFilters.inStockOnly ? 1 : 0)

  const headingLabel = activeCollection && activeCollection !== 'All Products'
    ? activeCollection
    : 'All Products'

  return (
    <>
      <style>{`
        .pgl-container {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(24px, 5vw, 80px);
          gap: 0;
        }
        .pgl-sidebar {
          flex: 0 0 240px;
          width: 240px;
          border-right: 1px solid rgba(0,0,0,0.08);
          padding-right: 24px;
          margin-right: 32px;
          position: sticky;
          top: 116px;
          height: calc(100vh - 116px);
          overflow-y: auto;
          display: block;
        }
        .pgl-main {
          flex: 1;
          min-width: 0;
          padding: 24px 0 80px;
        }
        .pgl-filter-btn { display: none; }
        @media (max-width: 1023px) {
          .pgl-sidebar    { display: none !important; }
          .pgl-filter-btn { display: inline-flex !important; }
        }
        .pgl-grid-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          margin-bottom: 20px;
        }
        .pgl-sort-select {
          font-family: Inter, sans-serif;
          font-size: 13px;
          color: #555555;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 6px;
          padding: 6px 12px;
          background: #FFFDF9;
          cursor: pointer;
          outline: none;
        }
        .pgl-sort-select:focus { border-color: #C9A84C; }
        .pgl-filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: Inter, sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #C9A84C;
          border: 1px solid rgba(201,168,76,0.4);
          border-radius: 20px;
          padding: 6px 14px;
          background: transparent;
          cursor: pointer;
          transition: border-color 0.15s ease;
        }
        .pgl-filter-pill:hover { border-color: #C9A84C; }
        .pgl-filter-badge {
          background: #C9A84C;
          color: #000;
          font-size: 10px;
          font-weight: 700;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <div style={{ background: '#FAF7F2', fontFamily: 'Inter, sans-serif' }}>
        <div className="pgl-container">

          {/* Desktop sidebar */}
          <aside className="pgl-sidebar" aria-label="Filter products">
            <FilterSidebar
              isOpen={false}
              onClose={() => {}}
              activeFilters={activeFilters}
              onFilterChange={() => {/* URL-driven via FilterSidebar internals */}}
            />
          </aside>

          {/* Main content */}
          <div className="pgl-main">
            {/* Grid header */}
            <div className="pgl-grid-header">
              <h1
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#111111',
                  margin: 0,
                  textWrap: 'balance',
                } as React.CSSProperties}
              >
                {headingLabel}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {productCount !== undefined && (
                  <span style={{ fontSize: 13, color: '#999999' }}>
                    {productCount} {productCount === 1 ? 'product' : 'products'}
                  </span>
                )}

                {/* Mobile filter pill */}
                <button
                  className="pgl-filter-btn pgl-filter-pill"
                  onClick={() => setFilterOpen(true)}
                  aria-label={`Filter products${filterCount > 0 ? `, ${filterCount} active` : ''}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                    <line x1="11" y1="18" x2="13" y2="18" />
                  </svg>
                  Filter
                  {filterCount > 0 && (
                    <span className="pgl-filter-badge" aria-hidden="true">{filterCount}</span>
                  )}
                </button>

                {/* Sort */}
                <select
                  className="pgl-sort-select"
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product grid (passed as children from page.tsx) */}
            {children}
          </div>
        </div>
      </div>

      {/* Mobile filter bottom sheet */}
      <FilterSidebar
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        activeFilters={activeFilters}
        onFilterChange={() => {}}
        mobileOnly
      />
    </>
  )
}
