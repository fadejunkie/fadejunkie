import StatusPanel from "@/components/StatusPanel";
import StatusHistory from "@/components/StatusHistory";
import ConnectionsInbox from "@/components/ConnectionsInbox";

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
          className="font-display text-2xl font-semibold text-foreground"
        >
          your status
        </h1>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          Signal what you&apos;re looking for. Toggles expire automatically so
          your status stays fresh.
        </p>
      </div>

      {/* ── Status toggles ── */}
      <div id="status-toggles">
        <StatusPanel />
      </div>

      {/* ── History ── */}
      <div className="mt-12" id="status-history">
        <StatusHistory />
      </div>

      {/* ── Connections inbox ── */}
      <div className="mt-12" id="connections">
        <ConnectionsInbox />
      </div>
    </div>
  );
}
