import StatusPanel from "@/components/StatusPanel";

export const metadata = {
  title: "Status — FadeJunkie",
  description: "Signal what you're looking for. Toggles expire automatically so your status stays fresh.",
};

export default function StatusPage() {
  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="space-y-1">
        <h1
          className="text-2xl font-semibold text-foreground"
          style={{ fontFamily: "var(--font-heading), system-ui, sans-serif" }}
        >
          your status
        </h1>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          Signal what you&apos;re looking for. Toggles expire automatically so
          your status stays fresh.
        </p>
      </div>

      {/* ── Status toggles ── */}
      <StatusPanel />
    </div>
  );
}
