'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const COLLECTIONS = [
  { slug: '',          label: 'All'       },
  { slug: 'clippers',  label: 'Clippers'  },
  { slug: 'trimmers',  label: 'Trimmers'  },
  { slug: 'hair-care', label: 'Hair Care' },
  { slug: 'styling',   label: 'Styling'   },
  { slug: 'color',     label: 'Color'     },
  { slug: 'specials',  label: 'Specials'  },
  { slug: 'bundles',   label: 'Bundles'   },
]

export default function CategorySubNav() {
  const searchParams = useSearchParams()
  const active = searchParams.get('collection') ?? ''

  return (
    <>
      <style>{`
        .cat-subnav-pill {
          flex-shrink: 0;
          display: inline-block;
          padding: 6px 16px;
          height: 36px;
          line-height: 1;
          font-size: 13px;
          font-weight: 500;
          font-family: Inter, sans-serif;
          border-radius: 20px;
          white-space: nowrap;
          text-decoration: none;
          cursor: pointer;
          transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
          display: flex;
          align-items: center;
        }
        .cat-subnav-pill--inactive {
          background: transparent;
          border: 1px solid rgba(201,168,76,0.25);
          color: #999999;
        }
        .cat-subnav-pill--inactive:hover {
          border-color: rgba(201,168,76,0.5);
          color: #555555;
        }
        .cat-subnav-pill--active {
          background: #C9A84C;
          border: 1px solid #C9A84C;
          color: #000000;
        }
      `}</style>

      <nav
        aria-label="Product categories"
        className="scroll-hide"
        style={{
          position: 'sticky',
          top: 64,
          zIndex: 90,
          background: '#FAF7F2',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          overflowX: 'auto',
          gap: 8,
          padding: '8px clamp(16px, 4vw, 48px)',
          height: 52,
        }}
      >
        {COLLECTIONS.map(c => {
          const isActive = c.slug === active
          const href = c.slug ? `/shop?collection=${c.slug}` : '/shop'
          return (
            <Link
              key={c.slug || 'all'}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={`cat-subnav-pill ${isActive ? 'cat-subnav-pill--active' : 'cat-subnav-pill--inactive'}`}
            >
              {c.label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
