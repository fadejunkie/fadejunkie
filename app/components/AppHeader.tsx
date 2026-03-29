"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  onMenuClick: () => void;
}

export default function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);
  const barber = useQuery(api.barbers.getMyBarberProfile);

  const displayName = barber?.name ?? (user?.email as string | undefined) ?? "";
  const handle = barber?.slug ? `@${barber.slug}` : null;

  return (
    <header className="sticky top-0 z-40 h-14 bg-card border-b border-border flex items-center justify-between px-8">
      {/* Left: hamburger + logo */}
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className={cn(
            "md:hidden p-1.5 rounded-md text-muted-foreground mr-3",
            "hover:text-foreground hover:bg-accent transition-colors"
          )}
          aria-label="Open menu"
        >
          <Menu size={17} />
        </button>

        <Link
          href="/home"
          style={{
            fontFamily: "var(--font-display), 'League Spartan', sans-serif",
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "var(--foreground)",
            textTransform: "lowercase",
            lineHeight: 1,
          }}
        >
          fadejunkie
        </Link>
      </div>

      {/* Center: slug */}
      {handle && (
        <span
          className="absolute left-1/2 -translate-x-1/2 hidden sm:block text-xs text-muted-foreground font-mono"
        >
          {handle}
        </span>
      )}

      {/* Right: sign out + avatar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => signOut()}
          className="hidden sm:inline font-sans text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          sign out
        </button>
        <Avatar src={barber?.avatarUrl} name={displayName} size={26} />
      </div>
    </header>
  );
}
