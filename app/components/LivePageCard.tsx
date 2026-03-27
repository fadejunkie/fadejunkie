"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";

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
          <span className="w-2 h-2 rounded-full bg-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">{url}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyLink}
          >
            {copied ? "Copied!" : "Copy link"}
          </Button>
          <Button size="sm" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              View live ↗
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}
