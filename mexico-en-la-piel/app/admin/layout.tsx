"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/brand.config";
import Image from "next/image";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "⬛" },
  { href: "/admin/products", label: "Products", icon: "🏷" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: brand.colors.canvas }}>
      {/* Sidebar */}
      <aside
        className="w-full md:w-52 flex-shrink-0 flex flex-col"
        style={{ background: brand.colors.primary, borderRight: `1px solid ${brand.colors.accent}` }}
      >
        {/* Logo block */}
        <div
          className="px-5 pt-6 pb-5 border-b"
          style={{ borderColor: `${brand.colors.accent}40` }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Image
              src={brand.logo.symbolLight}
              alt={brand.logo.alt}
              width={22}
              height={22}
              className="flex-shrink-0"
            />
            <span
              className="text-sm font-semibold tracking-wide"
              style={{ color: brand.colors.canvas, fontFamily: brand.fonts.body }}
            >
              {brand.name}
            </span>
          </div>
          <p
            className="text-xs uppercase tracking-widest"
            style={{ color: `${brand.colors.accent}`, fontFamily: brand.fonts.body }}
          >
            Admin
          </p>
        </div>

        {/* Nav — horizontal scroll on mobile, vertical on desktop */}
        <nav className="flex md:flex-col gap-1 px-3 py-4 overflow-x-auto md:overflow-visible">
          {NAV.map(({ href, label }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                className="px-4 py-2.5 rounded text-sm transition-all whitespace-nowrap"
                style={{
                  fontFamily: brand.fonts.body,
                  color: active ? brand.colors.primary : brand.colors.canvas,
                  background: active ? brand.colors.canvas : "transparent",
                  fontWeight: active ? 600 : 400,
                  opacity: active ? 1 : 0.85,
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Back to store */}
        <div
          className="hidden md:block mt-auto px-5 py-4 border-t text-xs"
          style={{ borderColor: `${brand.colors.accent}40`, color: `${brand.colors.canvas}80`, fontFamily: brand.fonts.body }}
        >
          <Link href="/" className="hover:opacity-100 transition-opacity">
            ← Store
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main
        className="flex-1 overflow-auto min-w-0 p-8"
        style={{ background: brand.colors.canvas, color: brand.colors.bodyColor }}
      >
        {children}
      </main>
    </div>
  );
}
