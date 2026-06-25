'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/products', label: 'Products', exact: false },
  { href: '/admin/collections', label: 'Collections', exact: false },
  { href: '/admin/orders', label: 'Orders', exact: false },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, width: 220,
      background: '#000', borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', flexDirection: 'column', padding: '32px 0',
    }}>
      <div style={{ padding: '0 24px 32px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/admin" style={{ display: 'block' }}>
          <p style={{ fontSize: 11, textTransform: 'uppercase', color: '#C9A84C', fontWeight: 700 }}>
            BRASHAE'S
          </p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Admin</p>
        </Link>
      </div>

      <nav style={{ flex: 1, padding: '24px 0' }}>
        {links.map(({ href, label, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="nav-link"
              style={{
                display: 'block', padding: '10px 24px',
                fontSize: 13, fontWeight: active ? 600 : 400,
                color: active ? 'var(--on-dark)' : 'var(--muted)',
                borderLeft: active ? '2px solid var(--gold)' : '2px solid transparent',
                background: active ? 'rgba(201,168,76,0.06)' : 'transparent',
                transition: 'color 0.15s ease, background 0.15s ease',
              }}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '0 24px', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 24 }}>
        <Link
          href="/shop"
          target="_blank"
          className="nav-link"
          style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 12, transition: 'color 0.15s ease' }}
        >
          ↗ View Store
        </Link>
        <button
          onClick={handleLogout}
          className="nav-link"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, color: 'var(--muted)', padding: 0,
            transition: 'color 0.15s ease',
          }}
        >
          Log out
        </button>
      </div>
    </aside>
  )
}
