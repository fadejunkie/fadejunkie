import DiscoveryFeed from "@/components/DiscoveryFeed";

export const metadata = {
  title: "Discover — FadeJunkie",
  description:
    "Browse active statuses from barbers, students, shops, and everyone in the ecosystem.",
};

export default function DiscoverPage() {
  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="space-y-1">
        <h1
          className="text-2xl font-semibold text-foreground font-heading"
          style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
        >
          discover
        </h1>
        <p
          className="text-sm text-muted-foreground leading-relaxed"
          style={{
            fontFamily: "var(--font-body), 'Courier Prime', monospace",
          }}
        >
          see who&apos;s active in the ecosystem
        </p>
      </div>

      {/* ── Discovery feed ── */}
      <DiscoveryFeed />
    </div>
  );
}
