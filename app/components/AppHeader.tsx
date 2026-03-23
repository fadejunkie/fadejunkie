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
    <header className="sticky top-0 z-40 h-12 bg-card border-b border-border flex items-center px-5">
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

      <Link href="/home" className="text-sm font-semibold text-foreground tracking-tight mr-auto">
        FadeJunkie
      </Link>

      <div className="flex items-center gap-3">
        {handle && (
          <span className="hidden sm:block text-xs font-mono" style={{ color: "var(--link)" }}>
            {handle}
          </span>
        )}
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Avatar src={barber?.avatarUrl} name={displayName} size={26} />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
