"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/Input";
import GalleryGrid from "@/components/GalleryGrid";
import LivePageCard from "@/components/LivePageCard";
import PathSelector from "@/components/PathSelector";
import ActiveStatusBadges from "@/components/ActiveStatusBadges";
import { cn } from "@/lib/utils";


export default function ProfilePage() {
  const barber = useQuery(api.barbers.getMyBarberProfile);
  const upsertBarber = useMutation(api.barbers.upsertBarberProfile);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [form, setForm] = useState({
    slug: "", name: "", bio: "", phone: "",
    instagram: "", bookingUrl: "", shopName: "", location: "",
  });
  const [services, setServices] = useState<string[]>([]);
  const [serviceInput, setServiceInput] = useState("");
  const [avatarStorageId, setAvatarStorageId] = useState<string | undefined>();
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "ok" | "taken">("idle");

  const avatarRef = useRef<HTMLInputElement>(null);
  const slugCheckTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (barber) {
      setForm({
        slug: barber.slug ?? "", name: barber.name ?? "", bio: barber.bio ?? "",
        phone: barber.phone ?? "", instagram: barber.instagram ?? "",
        bookingUrl: barber.bookingUrl ?? "", shopName: barber.shopName ?? "",
        location: barber.location ?? "",
      });
      setServices(barber.services ?? []);
      if (barber.avatarUrl) setAvatarPreview(barber.avatarUrl);
    }
  }, [barber]);

  function handleSlugChange(val: string) {
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setForm((f) => ({ ...f, slug: clean }));
    setSlugStatus("checking");
    clearTimeout(slugCheckTimeout.current);
    slugCheckTimeout.current = setTimeout(() => setSlugStatus("idle"), 400);
  }

  const slugAvailable = useQuery(
    api.barbers.checkSlugAvailable,
    form.slug.length >= 3 ? { slug: form.slug } : "skip"
  );

  useEffect(() => {
    if (form.slug.length >= 3) {
      setSlugStatus(slugAvailable === true ? "ok" : slugAvailable === false ? "taken" : "checking");
    }
  }, [slugAvailable, form.slug]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": file.type }, body: file });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = await res.json();
      setAvatarStorageId(storageId);
    } catch (err) { console.error(err); }
  }

  function addService() {
    const s = serviceInput.trim();
    if (s && !services.includes(s)) setServices((prev) => [...prev, s]);
    setServiceInput("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.slug) return;
    setSaving(true); setError("");
    try {
      await upsertBarber({
        ...form,
        bio: form.bio || undefined, phone: form.phone || undefined,
        instagram: form.instagram || undefined, bookingUrl: form.bookingUrl || undefined,
        shopName: form.shopName || undefined, location: form.location || undefined,
        services, avatarStorageId: avatarStorageId as never,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-6">
      {/* ── Your Paths ── */}
      <PathSelector />

      {/* Profile card */}
      <Card className="rounded-xl shadow-sm p-6 sm:p-8">
        <div className="mb-6 space-y-3">
          <p className="text-lg font-bold text-foreground">Your Profile</p>
          <ActiveStatusBadges />
        </div>

        {barber === undefined ? (
          <div className="flex items-center justify-center h-40">
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        ) : null}

        {barber !== undefined && (

        <form onSubmit={handleSave} className="space-y-6">
          {/* ── Identity ──────────────────────────────────── */}
          <div className="space-y-5">
          {/* Headshot */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">Headshot</label>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-muted-foreground text-center leading-tight">No<br />photo</span>
                )}
              </div>
              <div className="pt-1">
                <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <button
                  type="button"
                  onClick={() => avatarRef.current?.click()}
                  className="font-sans text-sm text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  Upload photo
                </button>
              </div>
            </div>
          </div>

          {/* Handle */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">Handle (URL slug)</label>
            <Input
              placeholder="yourhandle"
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              required
            />
            {form.slug.length >= 3 && (
              <p className={cn("text-xs mt-1", {
                "text-muted-foreground": slugStatus === "ok" || slugStatus === "checking" || slugStatus === "idle",
                "text-destructive": slugStatus === "taken",
              })}>
                {slugStatus === "ok" && `✓ @${form.slug} is available`}
                {slugStatus === "taken" && `✗ @${form.slug} is already taken`}
                {(slugStatus === "checking") && "Checking..."}
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">Name</label>
            <Input
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">Bio</label>
            <Textarea
              placeholder="Tell the community about yourself..."
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              rows={3}
              className="resize-none"
            />
          </div>

          </div>{/* /Identity */}

          {/* ── Services ──────────────────────────────────── */}
          <div className="pt-5 border-t border-border space-y-5">
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">Services</label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Fades, Lineups, Braids"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addService(); } }}
              />
              <Button type="button" variant="outline" onClick={addService} className="shrink-0">Add</Button>
            </div>
            {services.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {services.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 bg-muted border border-border rounded px-2.5 py-1 text-xs text-foreground">
                    {s}
                    <button type="button" onClick={() => setServices((prev) => prev.filter((x) => x !== s))}
                      className="font-sans text-muted-foreground hover:text-foreground ml-0.5">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          </div>{/* /Services */}

          {/* ── Contact & Social ──────────────────────────── */}
          <div className="pt-5 border-t border-border space-y-5">
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">Booking link</label>
            <Input
              type="url"
              placeholder="https://..."
              value={form.bookingUrl}
              onChange={(e) => setForm((f) => ({ ...f, bookingUrl: e.target.value }))}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">Phone</label>
            <Input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">Instagram</label>
            <Input
              placeholder="@yourhandle"
              value={form.instagram}
              onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))}
            />
          </div>

          {/* Shop name */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">Shop name</label>
            <Input
              placeholder="The Fade House"
              value={form.shopName}
              onChange={(e) => setForm((f) => ({ ...f, shopName: e.target.value }))}
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">Location</label>
            <Input
              placeholder="City, State"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
          </div>

          </div>{/* /Contact & Social */}

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">{error}</p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" loading={saving}>Save profile</Button>
            {saved && <span className="text-sm text-foreground">Saved!</span>}
          </div>
        </form>
        )}
      </Card>

      {/* Gallery card */}
      {barber && (
        <Card className="rounded-xl shadow-sm p-6 sm:p-8">
          <p className="text-lg font-bold text-foreground mb-4">Gallery</p>
          <GalleryGrid barberId={barber._id} editable />
        </Card>
      )}

      {barber?.slug && (
        <LivePageCard
          url={`https://${barber.slug}.fadejunkie.com`}
          label="Your barber page is live"
        />
      )}
    </div>
  );
}
