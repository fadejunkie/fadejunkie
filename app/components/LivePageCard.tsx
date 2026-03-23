"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

interface LivePageCardProps {
  url: string;
  label?: string;
}

export default function LivePageCard({ url, label = "Your page is live" }: LivePageCardProps) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">{url}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={copyLink}
            className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-accent text-foreground transition-colors"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-full bg-primary hover:bg-primary/85 text-primary-foreground transition-colors"
          >
            View live ↗
          </a>
        </div>
      </div>
    </Card>
  );
}
