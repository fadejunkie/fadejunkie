import Link from "next/link";
import { brand } from "@/brand.config";

// Admin is gated by NEXT_PUBLIC_ADMIN_KEY — append ?key=<value> to unlock
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Sidebar — full-width top bar on mobile, narrow left column on desktop */}
      <aside className="w-full md:w-48 bg-gray-900 text-white flex-shrink-0 flex flex-col">
        {/* Brand + label */}
        <div className="px-4 pt-4 pb-2 md:pb-0 md:pt-4 md:mb-8 flex items-center md:block gap-3">
          <p className="text-xs text-gray-500 uppercase tracking-widest hidden md:block mb-1">Admin</p>
          <p className="font-semibold text-sm">{brand.name}</p>
          <span className="text-xs text-gray-500 uppercase tracking-widest md:hidden">Admin</span>
        </div>

        {/* Nav — horizontal on mobile, vertical on desktop */}
        <nav className="flex md:flex-col gap-1 text-sm px-2 md:px-4 pb-2 md:pb-0 overflow-x-auto">
          <Link href="/admin" className="px-3 py-2 rounded hover:bg-gray-800 transition-colors whitespace-nowrap">
            Dashboard
          </Link>
          <Link href="/admin/products" className="px-3 py-2 rounded hover:bg-gray-800 transition-colors whitespace-nowrap">
            Products
          </Link>
          <Link href="/admin/orders" className="px-3 py-2 rounded hover:bg-gray-800 transition-colors whitespace-nowrap">
            Orders
          </Link>
        </nav>

        {/* Back to store — hidden on mobile to save space */}
        <div className="hidden md:block mt-auto pt-4 px-4 border-t border-gray-800">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main — text-gray-900 overrides the global white body color */}
      <main className="flex-1 bg-gray-50 p-6 md:p-8 overflow-auto text-gray-900 min-w-0">
        {children}
      </main>
    </div>
  );
}
