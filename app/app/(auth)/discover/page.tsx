import DiscoverTabs from "@/components/DiscoverTabs";

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
        <h1 className="font-display text-2xl font-semibold text-foreground">
          discover
        </h1>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          see who&apos;s active in the ecosystem
        </p>
      </div>

      {/* ── Tab-switched feed ── */}
      <DiscoverTabs />
    </div>
  );
}
