'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ActiveFilters {
  brand: string[]
  priceMax: number | null
  inStockOnly: boolean
  collection: string
}

export interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
  activeFilters: ActiveFilters
  onFilterChange: (filters: ActiveFilters) => void
}

// ─── Constants ───────────────────────────────────────────────────────────────

const BRANDS = [
  'Andis', 'Wahl', 'BaByliss PRO', 'JRL', 'Gamma+',
  'Oster', 'Cocco', 'Immortal', 'CHI', 'Mizani', 'Level3',
]

const PRICE_OPTIONS: { label: string; value: number | null }[] = [
  { label: 'Under $25', value: 25 },
  { label: 'Under $50', value: 50 },
  { label: 'Under $100', value: 100 },
  { label: 'Any Price', value: null },
]

// ─── Color tokens (light ecomm theme) ────────────────────────────────────────
const C = {
  canvas:   '#FAF7F2',
  card:     '#FFFDF9',
  text:     '#111111',
  body:     '#555555',
  muted:    '#999999',
  border:   'rgba(0,0,0,0.08)',
  borderBrand: 'rgba(201,168,76,0.25)',
  gold:     '#C9A84C',
  goldHover:'#E8C96A',
  brown:    '#5B3E00',
  checkBorder: 'rgba(0,0,0,0.2)',
  trackOff: 'rgba(0,0,0,0.12)',
} as const

// ─── Sub-components ───────────────────────────────────────────────────────────

interface CustomCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  id: string
}

function CustomCheckbox({ checked, onChange, label, id }: CustomCheckboxProps) {
  return (
    <label
      htmlFor={id}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        userSelect: 'none',
        padding: '3px 0',
      }}
    >
      <span
        role="checkbox"
        aria-checked={checked}
        style={{
          flexShrink: 0,
          width: 16,
          height: 16,
          borderRadius: 3,
          border: checked ? `1px solid ${C.gold}` : `1px solid ${C.checkBorder}`,
          background: checked ? C.gold : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.15s ease, border-color 0.15s ease',
        }}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
      />
      <span
        style={{
          fontSize: 13,
          fontWeight: checked ? 500 : 400,
          color: checked ? C.text : C.body,
          transition: 'color 0.15s ease, font-weight 0.15s ease',
        }}
      >
        {label}
      </span>
    </label>
  )
}

interface CustomRadioProps {
  selected: boolean
  onChange: () => void
  label: string
  id: string
}

function CustomRadio({ selected, onChange, label, id }: CustomRadioProps) {
  return (
    <label
      htmlFor={id}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        userSelect: 'none',
        padding: '3px 0',
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: selected ? `1px solid ${C.gold}` : `1px solid ${C.checkBorder}`,
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.15s ease',
        }}
      >
        {selected && (
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: C.gold,
            }}
          />
        )}
      </span>
      <input
        type="radio"
        id={id}
        checked={selected}
        onChange={onChange}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
      />
      <span
        style={{
          fontSize: 13,
          fontWeight: selected ? 500 : 400,
          color: selected ? C.text : C.body,
          transition: 'color 0.15s ease',
        }}
      >
        {label}
      </span>
    </label>
  )
}

interface ToggleSwitchProps {
  on: boolean
  onChange: (on: boolean) => void
  label: string
}

function ToggleSwitch({ on, onChange, label }: ToggleSwitchProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 0',
      }}
    >
      <span style={{ fontSize: 13, fontWeight: on ? 500 : 400, color: on ? C.text : C.body }}>
        {label}
      </span>
      <button
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        style={{
          flexShrink: 0,
          width: 36,
          height: 20,
          borderRadius: 10,
          border: 'none',
          background: on ? C.gold : C.trackOff,
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.2s ease',
          padding: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: on ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#FFFFFF',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </button>
    </div>
  )
}

// ─── Divider ─────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div
      style={{
        height: 1,
        background: C.border,
        margin: '16px 0',
      }}
    />
  )
}

// ─── Filter group label ───────────────────────────────────────────────────────

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 11,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: C.muted,
        letterSpacing: '0.06em',
        marginBottom: 10,
      }}
    >
      {children}
    </p>
  )
}

// ─── Filter content (shared between desktop + mobile) ────────────────────────

interface FilterContentProps {
  filters: ActiveFilters
  onChange: (filters: ActiveFilters) => void
  showAllBrands: boolean
  onToggleShowAll: () => void
}

function FilterContent({ filters, onChange, showAllBrands, onToggleShowAll }: FilterContentProps) {
  const visibleBrands = showAllBrands ? BRANDS : BRANDS.slice(0, 6)

  function toggleBrand(brand: string) {
    const next = filters.brand.includes(brand)
      ? filters.brand.filter((b) => b !== brand)
      : [...filters.brand, brand]
    onChange({ ...filters, brand: next })
  }

  function setPriceMax(val: number | null) {
    onChange({ ...filters, priceMax: val })
  }

  function toggleStock(val: boolean) {
    onChange({ ...filters, inStockOnly: val })
  }

  return (
    <div>
      {/* Brand filter */}
      <GroupLabel>Brand</GroupLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {visibleBrands.map((brand) => (
          <CustomCheckbox
            key={brand}
            id={`brand-${brand.replace(/\s+/g, '-').toLowerCase()}`}
            label={brand}
            checked={filters.brand.includes(brand)}
            onChange={() => toggleBrand(brand)}
          />
        ))}
      </div>
      {BRANDS.length > 6 && (
        <button
          onClick={onToggleShowAll}
          style={{
            marginTop: 8,
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: 12,
            fontWeight: 500,
            color: C.gold,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = C.goldHover }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = C.gold }}
        >
          {showAllBrands ? 'Show less' : `Show all ${BRANDS.length} brands`}
        </button>
      )}

      <Divider />

      {/* Price filter */}
      <GroupLabel>Price</GroupLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {PRICE_OPTIONS.map((opt) => (
          <CustomRadio
            key={opt.label}
            id={`price-${opt.value ?? 'any'}`}
            label={opt.label}
            selected={filters.priceMax === opt.value}
            onChange={() => setPriceMax(opt.value)}
          />
        ))}
      </div>

      <Divider />

      {/* In stock toggle */}
      <ToggleSwitch
        on={filters.inStockOnly}
        onChange={toggleStock}
        label="In Stock Only"
      />
    </div>
  )
}

// ─── URL sync hook ────────────────────────────────────────────────────────────

function useFilterSync(
  activeFilters: ActiveFilters,
  onFilterChange: (f: ActiveFilters) => void,
) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Read filters from URL on mount
  useEffect(() => {
    const brandParam = searchParams.get('brand')
    const priceParam = searchParams.get('priceMax')
    const inStockParam = searchParams.get('inStock')
    const collectionParam = searchParams.get('collection')

    const fromUrl: ActiveFilters = {
      brand: brandParam ? brandParam.split(',').filter(Boolean) : [],
      priceMax: priceParam ? Number(priceParam) : null,
      inStockOnly: inStockParam === '1',
      collection: collectionParam ?? '',
    }

    onFilterChange(fromUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Push filters to URL
  const pushToUrl = useCallback(
    (filters: ActiveFilters) => {
      const params = new URLSearchParams(searchParams.toString())

      if (filters.brand.length > 0) {
        params.set('brand', filters.brand.map((b) => b.toLowerCase().replace(/\s+/g, '-')).join(','))
      } else {
        params.delete('brand')
      }

      if (filters.priceMax !== null) {
        params.set('priceMax', String(filters.priceMax))
      } else {
        params.delete('priceMax')
      }

      if (filters.inStockOnly) {
        params.set('inStock', '1')
      } else {
        params.delete('inStock')
      }

      if (filters.collection) {
        params.set('collection', filters.collection)
      } else {
        params.delete('collection')
      }

      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  return pushToUrl
}

// ─── hasActiveFilters helper ──────────────────────────────────────────────────

export function hasActiveFilters(f: ActiveFilters): boolean {
  return f.brand.length > 0 || f.priceMax !== null || f.inStockOnly
}

export function countActiveFilters(f: ActiveFilters): number {
  let count = 0
  if (f.brand.length > 0) count++
  if (f.priceMax !== null) count++
  if (f.inStockOnly) count++
  return count
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FilterSidebar({
  isOpen,
  onClose,
  activeFilters,
  onFilterChange,
}: FilterSidebarProps) {
  const [showAllBrands, setShowAllBrands] = useState(false)

  // Mobile: local draft state, applied on button press
  const [mobileDraft, setMobileDraft] = useState<ActiveFilters>(activeFilters)

  // Sync draft when sheet opens
  useEffect(() => {
    if (isOpen) setMobileDraft(activeFilters)
  }, [isOpen, activeFilters])

  const pushToUrl = useFilterSync(activeFilters, onFilterChange)

  // Desktop: apply immediately
  function handleDesktopChange(filters: ActiveFilters) {
    onFilterChange(filters)
    pushToUrl(filters)
  }

  // Mobile: apply on button press
  function handleMobileApply() {
    onFilterChange(mobileDraft)
    pushToUrl(mobileDraft)
    onClose()
  }

  function clearAll() {
    const empty: ActiveFilters = {
      brand: [],
      priceMax: null,
      inStockOnly: false,
      collection: activeFilters.collection,
    }
    onFilterChange(empty)
    pushToUrl(empty)
  }

  const isActive = hasActiveFilters(activeFilters)

  return (
    <>
      {/* Responsive style block */}
      <style>{`
        @media (min-width: 1024px) {
          .filter-sidebar-desktop { display: block !important; }
          .filter-sidebar-mobile  { display: none !important; }
        }
        @media (max-width: 1023px) {
          .filter-sidebar-desktop { display: none !important; }
        }

        .filter-clear-btn:hover { color: #E8C96A !important; }

        .filter-apply-btn {
          background: #C9A84C;
          transition: background 0.2s ease;
        }
        .filter-apply-btn:hover {
          background: #E8C96A;
        }
        .filter-apply-btn:active {
          transform: scale(0.97);
        }
      `}</style>

      {/* ── Desktop Sidebar ────────────────────────────────────────────────── */}
      <aside
        className="filter-sidebar-desktop"
        style={{
          width: 240,
          flexShrink: 0,
          position: 'sticky',
          top: 116,
          height: 'calc(100vh - 116px)',
          overflowY: 'auto',
          background: 'transparent',
          borderRight: `1px solid ${C.border}`,
          padding: '24px 16px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: C.text,
            }}
          >
            Filters
          </span>
          {isActive && (
            <button
              className="filter-clear-btn"
              onClick={clearAll}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: 12,
                fontWeight: 500,
                color: C.gold,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'color 0.15s ease',
              }}
            >
              Clear All
            </button>
          )}
        </div>

        <Divider />

        <FilterContent
          filters={activeFilters}
          onChange={handleDesktopChange}
          showAllBrands={showAllBrands}
          onToggleShowAll={() => setShowAllBrands((v) => !v)}
        />
      </aside>

      {/* ── Mobile Bottom Sheet ────────────────────────────────────────────── */}
      <div className="filter-sidebar-mobile">
        {/* Backdrop */}
        {isOpen && (
          <div
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 199,
              animation: 'none',
            }}
          />
        )}

        {/* Sheet */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter Products"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 200,
            background: C.card,
            borderRadius: '16px 16px 0 0',
            maxHeight: '80vh',
            overflowY: 'auto',
            transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Drag handle */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: 12,
              paddingBottom: 4,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 32,
                height: 4,
                borderRadius: 2,
                background: 'rgba(0,0,0,0.12)',
              }}
            />
          </div>

          {/* Sheet header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 20px 12px',
              flexShrink: 0,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: C.text,
                margin: 0,
              }}
            >
              Filter Products
            </h2>
            <button
              onClick={onClose}
              aria-label="Close filter panel"
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 6px',
                fontSize: 20,
                lineHeight: 1,
                color: C.muted,
                cursor: 'pointer',
                fontFamily: 'inherit',
                borderRadius: 4,
              }}
            >
              ×
            </button>
          </div>

          {/* Scrollable filter content */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 20px 0',
            }}
          >
            <FilterContent
              filters={mobileDraft}
              onChange={setMobileDraft}
              showAllBrands={showAllBrands}
              onToggleShowAll={() => setShowAllBrands((v) => !v)}
            />
          </div>

          {/* Apply button — sticky at bottom of sheet */}
          <div
            style={{
              padding: '16px 20px',
              flexShrink: 0,
              borderTop: `1px solid ${C.border}`,
              background: C.card,
            }}
          >
            {hasActiveFilters(mobileDraft) && (
              <button
                onClick={() => {
                  const empty: ActiveFilters = {
                    brand: [],
                    priceMax: null,
                    inStockOnly: false,
                    collection: mobileDraft.collection,
                  }
                  setMobileDraft(empty)
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  marginBottom: 8,
                  background: 'none',
                  border: 'none',
                  padding: '8px',
                  fontSize: 13,
                  fontWeight: 500,
                  color: C.gold,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'center',
                }}
              >
                Clear All
              </button>
            )}
            <button
              className="filter-apply-btn"
              onClick={handleMobileApply}
              style={{
                display: 'block',
                width: '100%',
                padding: '14px 24px',
                fontSize: 14,
                fontWeight: 700,
                color: '#000000',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
