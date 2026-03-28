import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface ResourceCardProps {
  businessName: string;
  category: string;
  audience?: string | null;
  tagline?: string | null;
  description: string;
  logoUrl?: string | null;
  offerUrl: string;
  isInternal?: boolean | null;
  badge?: string | null;
  price?: string | null;
  affiliate?: boolean | null;
}

function CardBody({
  category, businessName, tagline, description, badge, price, isInternal,
}: Pick<ResourceCardProps, "category" | "businessName" | "tagline" | "description" | "badge" | "price" | "isInternal">) {
  return (
    <Card className="p-5 h-full flex flex-col gap-3 hover:border-foreground/20 hover:shadow-sm transition-all">
      {/* UPPERCASE olive category label */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--link)" }}>
        {category}
      </p>

      <div className="flex-1">
        <h3 className="text-[15px] font-bold text-foreground leading-snug mb-1.5" style={{ textTransform: "none" }}>{businessName}</h3>
        {tagline && (
          <p className="text-[12.5px] font-medium text-foreground/70 mb-1">{tagline}</p>
        )}
        <p className="text-[13px] text-muted-foreground leading-[1.6]">{description}</p>
      </div>

      <div className="flex items-center justify-between pt-1 gap-2">
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          {badge && <span>{badge}</span>}
          {price && <span>{badge ? "· " : ""}{price}</span>}
        </div>
        <span className="inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
          {isInternal
            ? <><span>Open</span><ArrowRight size={11} /></>
            : <><span>View</span><ExternalLink size={11} /></>
          }
        </span>
      </div>
    </Card>
  );
}

export default function ResourceCard({ offerUrl, isInternal, ...rest }: ResourceCardProps) {
  const href = isInternal || offerUrl.startsWith("http") ? offerUrl : `https://${offerUrl}`;

  if (isInternal) {
    return (
      <Link href={href} className="block group">
        <CardBody {...rest} isInternal />
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block group">
      <CardBody {...rest} />
    </a>
  );
}
