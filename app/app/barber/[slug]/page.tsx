import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/ui/Avatar";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BarberProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const barber = await fetchQuery(api.barbers.getBarberBySlug, { slug });
  if (!barber) notFound();

  const gallery = await fetchQuery(api.gallery.getGalleryForBarber, { barberId: barber._id });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-5 h-14 flex items-center justify-between">
        <Link href="/" className="font-serif text-lg font-semibold text-foreground">fadejunkie</Link>
        <Button variant="outline" size="sm" asChild>
          <Link href="/signin?mode=signup">Join</Link>
        </Button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="flex items-start gap-5 mb-8">
          <Avatar src={barber.avatarUrl} name={barber.name} size={80} />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-foreground">{barber.name}</h1>
            <p className="text-sm text-muted-foreground font-mono">@{barber.slug}</p>
            {barber.shopName && <p className="text-sm text-muted-foreground mt-0.5">{barber.shopName}</p>}
            {barber.location && <p className="text-sm text-muted-foreground/60 mt-0.5">{barber.location}</p>}
          </div>
        </div>

        {barber.bio && (
          <p className="text-base text-foreground/80 leading-relaxed mb-6">{barber.bio}</p>
        )}

        {barber.services.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Services</h2>
            <div className="flex flex-wrap gap-1.5">
              {barber.services.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-8">
          {barber.bookingUrl && (
            <Button asChild>
              <a href={barber.bookingUrl} target="_blank" rel="noopener noreferrer">Book appointment</a>
            </Button>
          )}
          {barber.phone && (
            <Button variant="outline" asChild>
              <a href={`tel:${barber.phone}`}>{barber.phone}</a>
            </Button>
          )}
          {barber.instagram && (
            <Button variant="outline" asChild>
              <a href={`https://instagram.com/${barber.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </Button>
          )}
        </div>

        {gallery.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Gallery</h2>
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((photo) => (
                <div key={photo._id} className="aspect-square relative rounded overflow-hidden bg-muted">
                  <Image
                    src={photo.url}
                    alt={photo.caption ?? "Gallery photo"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 200px"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
