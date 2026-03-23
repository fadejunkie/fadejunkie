"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home",      label: "Home" },
  { href: "/profile",   label: "My Profile" },
  { href: "/website",   label: "Website" },
  { href: "/tools",     label: "Tools" },
  { href: "/resources", label: "Resources" },
  { href: "/directory", label: "Directory" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex flex-col w-48 shrink-0 border-r border-border bg-card pt-6 pb-8 px-4 gap-0.5">
      {navItems.map(({ href, label }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "text-[13.5px] py-1.5 px-2 rounded-md transition-colors",
              isActive
                ? "font-bold text-foreground"
                : "font-normal text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
