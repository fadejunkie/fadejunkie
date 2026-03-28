"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { X } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home",      label: "Home" },
  { href: "/profile",   label: "My Profile" },
  { href: "/status",    label: "Status" },
  { href: "/website",   label: "Website" },
  { href: "/tools",     label: "Tools" },
  { href: "/resources", label: "Resources" },
  { href: "/directory", label: "Directory" },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { signOut } = useAuthActions();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => { onClose(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-64 bg-card shadow-xl flex flex-col">

        <div className="h-12 flex items-center justify-between px-5 border-b border-border">
          <span className="text-sm font-semibold text-foreground">FadeJunkie</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-4 space-y-0.5">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "block px-2 py-2 rounded-md text-[14px] transition-colors",
                  isActive
                    ? "font-bold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-5 border-t border-border">
          <button
            onClick={() => signOut()}
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
