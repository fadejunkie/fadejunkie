"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "Home" },
  {
    href: "/profile",
    label: "My Profile",
    children: [
      { href: "/profile?tab=paths", label: "Paths" },
      { href: "/status", label: "Status" },
      { href: "/discover", label: "Discover" },
    ],
  },
  { href: "/website", label: "Website" },
  { href: "/tools", label: "Tools" },
  { href: "/resources", label: "Resources" },
  { href: "/directory", label: "Directory" },
];

const linkStyle = {
  fontFamily: "var(--font-sans), system-ui, sans-serif",
  letterSpacing: "-0.01em",
};

const linkBase = cn(
  "relative text-sm py-2.5 px-3 rounded-md transition-colors duration-150",
  "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2",
  "before:h-[60%] before:w-[2px] before:rounded-full before:transition-all before:duration-150"
);

const activeClass =
  "font-normal text-foreground bg-accent/60 before:bg-foreground before:opacity-100";
const inactiveClass =
  "font-normal text-muted-foreground before:opacity-0 hover:text-foreground hover:bg-accent/40";

export default function AppSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hoverOpen, setHoverOpen] = useState(false);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const isProfileActive =
    pathname === "/profile" || pathname.startsWith("/profile/");
  const isStatusActive = pathname === "/status";
  const isDiscoverActive = pathname === "/discover";

  // Keep dropdown open while on a child route
  const dropdownVisible = hoverOpen || isProfileActive || isStatusActive || isDiscoverActive;

  function handleMouseEnter() {
    clearTimeout(leaveTimeout.current);
    setHoverOpen(true);
  }

  function handleMouseLeave() {
    leaveTimeout.current = setTimeout(() => setHoverOpen(false), 200);
  }

  return (
    <nav className="hidden md:flex flex-col w-52 shrink-0 border-r border-border bg-card pt-8 pb-10 pl-6 pr-4 gap-0.5">
      {navItems.map((item) => {
        if (item.children) {
          const parentActive = isProfileActive && !searchParams.get("tab");
          return (
            <div
              key={item.href}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={item.href}
                className={cn(
                  linkBase,
                  parentActive ? activeClass : inactiveClass
                )}
                style={linkStyle}
              >
                {item.label}
              </Link>

              {dropdownVisible && (
                <div className="ml-3 pl-3 border-l border-border/60 mt-0.5 mb-1 space-y-0.5">
                  {item.children.map((child) => {
                    const childTab = new URL(
                      child.href,
                      "http://x"
                    ).searchParams.get("tab");
                    const isChildActive = childTab
                      ? isProfileActive && searchParams.get("tab") === childTab
                      : pathname === child.href;

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block text-[13px] py-1.5 px-3 rounded-md transition-colors duration-150",
                          isChildActive
                            ? "text-foreground bg-accent/50"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                        )}
                        style={linkStyle}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(linkBase, isActive ? activeClass : inactiveClass)}
            style={linkStyle}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
