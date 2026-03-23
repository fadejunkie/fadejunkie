"use client";

import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import AppSidebar from "@/components/AppSidebar";
import MobileNav from "@/components/MobileNav";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader onMenuClick={() => setMenuOpen(true)} />
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex flex-1 min-h-0">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto min-w-0">
          <div className="max-w-2xl mx-auto px-5 py-7">{children}</div>
        </main>
      </div>
    </div>
  );
}
