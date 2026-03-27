"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import ShopTemplate, { ShopData } from "@/components/ShopTemplate";
import LivePageCard from "@/components/LivePageCard";

export default function WebsitePage() {
  const shop = useQuery(api.shops.getMyShop);
  const barber = useQuery(api.barbers.getMyBarberProfile);
  const upsertShop = useMutation(api.shops.upsertShop);

  const [form, setForm] = useState<Omit<ShopData, "logoUrl">>({
    shopName: "", tagline: "", address: "", phone: "", hours: "", about: "", barberSlugs: [],
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    if (shop) {
      setForm({
        shopName: shop.shopName ?? "", tagline: shop.tagline ?? "",
        address: shop.address ?? "", phone: shop.phone ?? "",
        hours: shop.hours ?? "", about: shop.about ?? "",
        barberSlugs: shop.barberSlugs ?? [],
      });
    }
  }, [shop]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      await upsertShop({
        shopName: form.shopName,
        tagline: form.tagline || undefined, address: form.address || undefined,
        phone: form.phone || undefined, hours: form.hours || undefined,
        about: form.about || undefined, barberSlugs: form.barberSlugs ?? [],
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally { setSaving(false); }
  }

  function f(key: keyof typeof form) {
    return {
      value: (form[key] as string) ?? "",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value })),
    };
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Website Builder</h1>
          <p className="text-sm text-muted-foreground mt-1">Build your shop&apos;s public website.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant={view === "edit" ? "default" : "outline"} size="sm" onClick={() => setView("edit")}>Edit</Button>
          <Button variant={view === "preview" ? "default" : "outline"} size="sm" onClick={() => setView("preview")}>Preview</Button>
        </div>
      </div>

      {barber?.slug && shop?.shopName && (
        <LivePageCard
          url={`https://${barber.slug}.fadejunkie.com`}
          label="Your shop page is live"
        />
      )}

      {view === "preview" ? (
        <div className="border border-border rounded-lg overflow-hidden">
          <ShopTemplate shop={{ ...form, logoUrl: shop?.logoUrl }} preview />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <Card className="p-8">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-5">Shop Identity</h2>
            <div className="space-y-5">
              <Input label="Shop name *" placeholder="The Fade House" required {...f("shopName")} />
              <Input label="Tagline" placeholder="A short line describing your shop" {...f("tagline")} />
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-5">About</h2>
            <Textarea label="About your shop" placeholder="Tell visitors what makes your shop special..." rows={4} {...f("about")} />
          </Card>

          <Card className="p-8">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-5">Contact & Hours</h2>
            <div className="space-y-5">
              <Input label="Address" placeholder="123 Main St, City, State 00000" {...f("address")} />
              <Input label="Phone" type="tel" placeholder="+1 (555) 000-0000" {...f("phone")} />
              <Textarea label="Hours" placeholder={"Mon–Fri: 9am – 7pm\nSat: 9am – 5pm\nSun: Closed"} rows={4} {...f("hours")} />
            </div>
          </Card>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">{error}</p>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" loading={saving} size="lg">Save website</Button>
            {saved && <span className="text-sm text-muted-foreground">Saved!</span>}
          </div>
        </form>
      )}
    </div>
  );
}
