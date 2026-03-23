import Link from "next/link";
import { Button } from "@/components/ui/button";
import "leaflet/dist/leaflet.css";

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="border-b border-border px-6 h-14 flex items-center justify-between shrink-0">
        <Link href="/" className="font-serif text-xl font-semibold text-foreground">
          fadejunkie
        </Link>
        <Button size="sm" variant="outline" asChild>
          <Link href="/signin">Sign in</Link>
        </Button>
      </nav>
      {children}
    </div>
  );
}
