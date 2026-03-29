"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

const tools = [
  {
    id: "sanitation",
    label: "Sanitation Checklist",
    category: "Daily Operations",
    description: "OSHA-compliant sanitation checklist for opening and closing procedures.",
  },
  {
    id: "client-forms",
    label: "Client Intake Forms",
    category: "Daily Operations",
    description: "Printable consultation cards for new clients — allergy history, service preferences, contact info.",
  },
];

export default function ToolsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-[22px] font-bold text-foreground">Tools</h1>
        <p className="text-[13.5px] text-muted-foreground mt-1">Daily operations resources and more.</p>
      </div>

      {/* Website Builder — primary tool card */}
      <Link href="/website">
        <Card className="p-6 hover:border-foreground/20 hover:shadow-sm transition-all cursor-pointer group">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: "var(--link)" }}>Shop</p>
              <p className="text-[15px] font-bold text-foreground">Website Builder</p>
              <p className="text-[13px] text-muted-foreground mt-1.5 leading-[1.6]">
                Build your shop&apos;s public website — name, tagline, hours, contact info, and a live preview. Free and instant.
              </p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground shrink-0 mt-1 group-hover:text-foreground transition-colors" />
          </div>
        </Card>
      </Link>

      <div className="grid gap-4">
        {tools.map((tool) => (
          <Card key={tool.id} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: "var(--link)" }}>{tool.category}</p>
                <p className="text-[15px] font-bold text-foreground">{tool.label}</p>
                <p className="text-[13px] text-muted-foreground mt-1.5 leading-[1.6]">{tool.description}</p>
              </div>
              <span className="text-[11px] text-muted-foreground border border-border rounded-full px-2.5 py-1 shrink-0 mt-0.5">Soon</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-secondary">
        <p className="text-[13.5px] font-semibold text-foreground mb-1">Have a tool idea?</p>
        <p className="text-[13px] text-muted-foreground leading-[1.6]">
          Post in the community feed and tag it{" "}
          <span className="font-mono text-foreground">#tools</span> — we read every suggestion.
        </p>
      </Card>
    </div>
  );
}
