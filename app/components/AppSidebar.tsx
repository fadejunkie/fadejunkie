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
    <nav className="hidden md:flex flex-col w-48 shrink-0 border-r border-border bg-card pt-6 pb-8 px-3 gap-0.5">
      {navItems.map(({ href, label }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative text-sm py-1.5 px-3 rounded-md transition-colors duration-150",
              "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2",
              "before:h-[60%] before:w-[2px] before:rounded-full before:transition-all before:duration-150",
              isActive
                ? "font-semibold text-foreground bg-accent/60 before:bg-foreground before:opacity-100"
                : "font-normal text-muted-foreground before:opacity-0 hover:text-foreground hover:bg-accent/40"
            )}
            style={{
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
