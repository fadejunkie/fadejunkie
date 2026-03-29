import Image from "next/image";
import Link from "next/link";
import PublicStatusBadges from "@/components/PublicStatusBadges";
import type { StatusGroup } from "@/components/PublicStatusBadges";

export interface ShopData {
  shopName: string;
  tagline?: string | null;
  address?: string | null;
  phone?: string | null;
  hours?: string | null;
  about?: string | null;
  logoUrl?: string | null;
  barberSlugs?: string[];
}

interface ShopTemplateProps {
  shop: ShopData;
  preview?: boolean;
  statusSummary?: StatusGroup[];
}

export default function ShopTemplate({ shop, preview = false, statusSummary }: ShopTemplateProps) {
  return (
    <div className={`min-h-screen bg-background font-sans ${preview ? "text-[13px]" : ""}`}>
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {shop.logoUrl ? (
            <div className="relative w-8 h-8 rounded overflow-hidden border border-border">
              <Image src={shop.logoUrl} alt={shop.shopName} fill className="object-contain" />
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs font-bold">
              {shop.shopName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-semibold text-foreground text-base">{shop.shopName}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="#about" className="hover:text-foreground transition-colors">About</a>
          <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-16 border-b border-border text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-semibold text-foreground tracking-tight leading-tight">
          {shop.shopName}
        </h1>
        {shop.tagline && (
          <p className="text-lg text-muted-foreground mt-3">{shop.tagline}</p>
        )}
        {statusSummary && statusSummary.length > 0 && (
          <div className="flex justify-center mt-5">
            <PublicStatusBadges summary={statusSummary} />
          </div>
        )}
        {shop.phone && (
          <a
            href={`tel:${shop.phone}`}
            className="inline-block mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Book now
          </a>
        )}
      </section>

      {/* About */}
      {shop.about && (
        <section id="about" className="px-6 py-14 border-b border-border">
          <div className="max-w-2xl mx-auto">
            <p style={{ fontFamily: "var(--font-mono), ui-monospace, monospace", fontSize: "0.625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted-foreground)", fontWeight: 600, marginBottom: "1rem" }}>
              About
            </p>
            <p className="text-base text-foreground/80 leading-relaxed">{shop.about}</p>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="px-6 py-14 border-b border-border">
        <div className="max-w-2xl mx-auto">
          <p style={{ fontFamily: "var(--font-mono), ui-monospace, monospace", fontSize: "0.625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted-foreground)", fontWeight: 600, marginBottom: "1.5rem" }}>
            Contact & Hours
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {shop.address && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Location</p>
                <p className="text-sm text-foreground/80">{shop.address}</p>
              </div>
            )}
            {shop.phone && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Phone</p>
                <a href={`tel:${shop.phone}`} className="text-sm text-foreground/80 hover:underline">{shop.phone}</a>
              </div>
            )}
            {shop.hours && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Hours</p>
                <p className="text-sm text-foreground/80 whitespace-pre-line">{shop.hours}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-xs text-muted-foreground">
        <p>
          Powered by{" "}
          <Link href="/" className="hover:text-foreground transition-colors">fadejunkie</Link>
        </p>
      </footer>
    </div>
  );
}
