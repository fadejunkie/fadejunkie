"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import { Pencil } from "lucide-react";

type SectionId = "my-profile" | "paths";

// ── Field display helpers ─────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] text-muted-foreground uppercase tracking-[0.1em]"
      style={{ fontFamily: "var(--font-mono), monospace" }}
    >
      {children}
    </p>
  );
}

function FieldValue({
  children,
  empty,
  bold,
}: {
  children?: React.ReactNode;
  empty?: boolean;
  bold?: boolean;
}) {
  if (empty || !children) {
    return (
      <p
        className="text-sm text-muted-foreground/40 mt-1"
        style={{ fontFamily: "var(--font-body), 'Courier Prime', monospace" }}
      >
        —
      </p>
    );
  }
  return (
    <p
      className={cn("text-sm text-foreground mt-1", bold && "font-semibold")}
      style={{ fontFamily: "var(--font-body), 'Courier Prime', monospace" }}
    >
      {children}
    </p>
  );
}

// ── Edit button ───────────────────────────────────────────────────────────────

function EditToggle({
  editing,
  onEdit,
  onCancel,
}: {
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
}) {
  return (
    <button
      type="button"
      onClick={editing ? onCancel : onEdit}
      className={cn(
        "font-sans flex items-center gap-1.5 border rounded-full px-5 py-1.5 text-xs transition-colors duration-150 shrink-0",
        editing
          ? "border-foreground/30 bg-foreground text-background hover:bg-foreground/85"
          : "border-border text-muted-foreground hover:border-foreground/35 hover:text-foreground"
      )}
    >
      <Pencil size={11} strokeWidth={2} />
      {editing ? "cancel" : "edit"}
    </button>
  );
}

// ── Section card wrapper ──────────────────────────────────────────────────────

function SectionCard({
  id,
  title,
  editToggle,
  children,
}: {
  id: string;
  title: string;
  editToggle?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6">
      <Card className="rounded-xl p-8" style={{ borderRadius: "0.75rem" }}>
        <div className="flex items-start justify-between gap-4 mb-5">
          <p
            className="text-lg font-semibold text-foreground"
            style={{
              fontFamily: "var(--font-display), 'League Spartan', sans-serif",
              letterSpacing: "-0.03em",
              textTransform: "lowercase",
            }}
          >
            {title}
          </p>
          {editToggle}
        </div>
        {children}
      </Card>
    </section>
  );
}

// ── ProfilePage ───────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const barber = useQuery(api.barbers.getMyBarberProfile);
  const upsertBarber = useMutation(api.barbers.upsertBarberProfile);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [form, setForm] = useState({
    slug: "",
    name: "",
    bio: "",
    phone: "",
    instagram: "",
    bookingUrl: "",
    shopName: "",
    location: "",
  });
  const [services, setServices] = useState<string[]>([]);
  const [serviceInput, setServiceInput] = useState("");
  const [avatarStorageId, setAvatarStorageId] = useState<string | undefined>();
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [slugStatus, setSlugStatus] = useState<
    "idle" | "checking" | "ok" | "taken"
  >("idle");
  const [editingProfile, setEditingProfile] = useState(false);
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeSection: SectionId =
    tabParam === "paths" ? tabParam : "my-profile";

  const avatarRef = useRef<HTMLInputElement>(null);
  const slugCheckTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  // ── Sync barber data into form ──
  useEffect(() => {
    if (barber) {
      setForm({
        slug: barber.slug ?? "",
        name: barber.name ?? "",
        bio: barber.bio ?? "",
        phone: barber.phone ?? "",
        instagram: barber.instagram ?? "",
        bookingUrl: barber.bookingUrl ?? "",
        shopName: barber.shopName ?? "",
        location: barber.location ?? "",
      });
      setServices(barber.services ?? []);
      if (barber.avatarUrl) setAvatarPreview(barber.avatarUrl);
    }
  }, [barber]);

  // ── Slug availability check ──
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
      setSlugStatus(
        slugAvailable === true
          ? "ok"
          : slugAvailable === false
            ? "taken"
            : "checking"
      );
    }
  }, [slugAvailable, form.slug]);

  // ── Avatar upload ──
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = await res.json();
      setAvatarStorageId(storageId);
    } catch (err) {
      console.error(err);
    }
  }

  // ── Services ──
  function addService() {
    const s = serviceInput.trim();
    if (s && !services.includes(s)) setServices((prev) => [...prev, s]);
    setServiceInput("");
  }

  // ── Save ──
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.slug) return;
    setSaving(true);
    setError("");
    try {
      await upsertBarber({
        ...form,
        bio: form.bio || undefined,
        phone: form.phone || undefined,
        instagram: form.instagram || undefined,
        bookingUrl: form.bookingUrl || undefined,
        shopName: form.shopName || undefined,
        location: form.location || undefined,
        services,
        avatarStorageId: avatarStorageId as never,
      });
      setSaved(true);
      setEditingProfile(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  // ── Cancel edit — reset form to saved barber data ──
  function cancelEdit() {
    if (barber) {
      setForm({
        slug: barber.slug ?? "",
        name: barber.name ?? "",
        bio: barber.bio ?? "",
        phone: barber.phone ?? "",
        instagram: barber.instagram ?? "",
        bookingUrl: barber.bookingUrl ?? "",
        shopName: barber.shopName ?? "",
        location: barber.location ?? "",
      });
      setServices(barber.services ?? []);
      if (barber.avatarUrl) setAvatarPreview(barber.avatarUrl);
    }
    setEditingProfile(false);
    setError("");
  }

  // ── Helpers ──
  const isNewUser = barber !== undefined && barber === null;
  const showEditForm = editingProfile || isNewUser;

  return (
    <div className="min-h-full">
        {/* Loading state */}
        {barber === undefined && (
          <div className="flex items-center justify-center h-48">
            <span
              className="text-sm text-muted-foreground"
              style={{
                fontFamily: "var(--font-body), 'Courier Prime', monospace",
              }}
            >
              Loading...
            </span>
          </div>
        )}

        {/* ── MY PROFILE (tab) ── */}
        {activeSection === "my-profile" && barber !== undefined && (
          <div className="space-y-6">
            {/* View mode — profile card + field cards */}
            {barber != null && !showEditForm && (
              <>
                {/* Profile card — avatar centered */}
                <Card
                  className="rounded-xl p-8"
                  style={{ borderRadius: "0.75rem" }}
                >
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <p
                      className="text-lg font-semibold text-foreground"
                      style={{
                        fontFamily:
                          "var(--font-display), 'League Spartan', sans-serif",
                        letterSpacing: "-0.03em",
                        textTransform: "lowercase",
                      }}
                    >
                      my profile
                    </p>
                    <EditToggle
                      editing={false}
                      onEdit={() => setEditingProfile(true)}
                      onCancel={cancelEdit}
                    />
                  </div>

                  <div className="flex flex-col items-center gap-3 mb-6">
                    <div className="w-20 h-20 rounded-full bg-muted border-2 border-border overflow-hidden flex items-center justify-center">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span
                          className="text-[10px] text-muted-foreground/40"
                          style={{ fontFamily: "var(--font-mono), monospace" }}
                        >
                          no photo
                        </span>
                      )}
                    </div>
                    <div className="text-center">
                      <p
                        className="text-base font-semibold text-foreground"
                        style={{
                          fontFamily:
                            "var(--font-body), 'Courier Prime', monospace",
                        }}
                      >
                        {barber.name || "—"}
                      </p>
                      {barber.slug && (
                        <p
                          className="text-xs text-muted-foreground mt-0.5"
                          style={{ fontFamily: "var(--font-mono), monospace" }}
                        >
                          @{barber.slug}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-2">
                    <ActiveStatusBadges />
                  </div>

                  {saved && (
                    <p
                      className="text-center text-xs text-muted-foreground"
                      style={{
                        fontFamily:
                          "var(--font-body), 'Courier Prime', monospace",
                      }}
                    >
                      Saved.
                    </p>
                  )}
                </Card>

                {/* Contact card */}
                <SectionCard id="contact" title="contact">
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                    <div>
                      <FieldLabel>Phone</FieldLabel>
                      <FieldValue empty={!barber.phone}>
                        {barber.phone}
                      </FieldValue>
                    </div>
                    <div>
                      <FieldLabel>Instagram</FieldLabel>
                      <FieldValue empty={!barber.instagram}>
                        {barber.instagram}
                      </FieldValue>
                    </div>
                  </div>
                </SectionCard>

                {/* Business card */}
                <SectionCard id="business" title="business">
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                    <div>
                      <FieldLabel>Booking URL</FieldLabel>
                      <FieldValue empty={!barber.bookingUrl}>
                        {barber.bookingUrl}
                      </FieldValue>
                    </div>
                    <div>
                      <FieldLabel>Shop Name</FieldLabel>
                      <FieldValue empty={!barber.shopName}>
                        {barber.shopName}
                      </FieldValue>
                    </div>
                    <div className="col-span-2">
                      <FieldLabel>Location</FieldLabel>
                      <FieldValue empty={!barber.location}>
                        {barber.location}
                      </FieldValue>
                    </div>
                  </div>
                </SectionCard>

                {/* About card */}
                <SectionCard id="about" title="about">
                  <div className="space-y-6">
                    <div>
                      <FieldLabel>Bio</FieldLabel>
                      <FieldValue empty={!barber.bio}>
                        {barber.bio}
                      </FieldValue>
                    </div>
                    <div>
                      <FieldLabel>Services</FieldLabel>
                      {(barber.services ?? []).length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {(barber.services ?? []).map((s) => (
                            <span
                              key={s}
                              className="inline-flex items-center border border-border rounded px-2.5 py-1 text-xs text-foreground"
                              style={{
                                fontFamily:
                                  "var(--font-body), 'Courier Prime', monospace",
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <FieldValue empty>—</FieldValue>
                      )}
                    </div>
                  </div>
                </SectionCard>

                {/* Gallery */}
                <SectionCard id="gallery" title="gallery">
                  <GalleryGrid barberId={barber._id} editable />
                </SectionCard>

                {/* Live page */}
                {barber.slug && (
                  <LivePageCard
                    url={`https://${barber.slug}.fadejunkie.com`}
                    label="Your barber page is live"
                  />
                )}
              </>
            )}

            {/* Edit mode — unified form */}
            {showEditForm && (
              <SectionCard
                id="edit-profile"
                title={isNewUser ? "set up your profile" : "edit profile"}
                editToggle={
                  !isNewUser ? (
                    <EditToggle
                      editing
                      onEdit={() => setEditingProfile(true)}
                      onCancel={cancelEdit}
                    />
                  ) : undefined
                }
              >
                <form onSubmit={handleSave} className="space-y-5">
                  {/* Avatar */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span
                          className="text-[10px] text-muted-foreground/40"
                          style={{ fontFamily: "var(--font-mono), monospace" }}
                        >
                          no photo
                        </span>
                      )}
                    </div>
                    <div>
                      <input
                        ref={avatarRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                      <button
                        type="button"
                        onClick={() => avatarRef.current?.click()}
                        className="font-sans text-xs text-foreground underline underline-offset-4 hover:opacity-60 transition-opacity"
                      >
                        Upload photo
                      </button>
                    </div>
                  </div>

                  {/* Name + Slug */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        Name
                      </label>
                      <Input
                        placeholder="Your full name"
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        Slug
                      </label>
                      <Input
                        placeholder="yourhandle"
                        value={form.slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        required
                      />
                      {form.slug.length >= 3 && (
                        <p
                          className={cn("text-[10px] mt-1", {
                            "text-muted-foreground":
                              slugStatus === "ok" ||
                              slugStatus === "checking" ||
                              slugStatus === "idle",
                            "text-destructive": slugStatus === "taken",
                          })}
                          style={{ fontFamily: "var(--font-mono), monospace" }}
                        >
                          {slugStatus === "ok" && `✓ available`}
                          {slugStatus === "taken" && `✗ taken`}
                          {slugStatus === "checking" && "checking..."}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone + Instagram */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        Phone
                      </label>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, phone: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label
                        className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        Instagram
                      </label>
                      <Input
                        placeholder="@yourhandle"
                        value={form.instagram}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, instagram: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  {/* Booking URL + Shop Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        Booking URL
                      </label>
                      <Input
                        type="url"
                        placeholder="https://..."
                        value={form.bookingUrl}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            bookingUrl: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label
                        className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        Shop Name
                      </label>
                      <Input
                        placeholder="The Fade House"
                        value={form.shopName}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, shopName: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label
                      className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      Location
                    </label>
                    <Input
                      placeholder="City, State"
                      value={form.location}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, location: e.target.value }))
                      }
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label
                      className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      Bio
                    </label>
                    <Textarea
                      placeholder="Tell the community about yourself..."
                      value={form.bio}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, bio: e.target.value }))
                      }
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  {/* Services */}
                  <div>
                    <label
                      className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1.5"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      Services
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g. Fades, Lineups, Braids"
                        value={serviceInput}
                        onChange={(e) => setServiceInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addService();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addService}
                        className="shrink-0"
                      >
                        Add
                      </Button>
                    </div>
                    {services.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {services.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 bg-muted border border-border rounded px-2.5 py-1 text-xs text-foreground"
                          >
                            {s}
                            <button
                              type="button"
                              onClick={() =>
                                setServices((prev) =>
                                  prev.filter((x) => x !== s)
                                )
                              }
                              className="font-sans text-muted-foreground hover:text-foreground ml-0.5 leading-none"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                      {error}
                    </p>
                  )}

                  {/* Save / Cancel footer */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <Button type="submit" loading={saving}>
                      Save profile
                    </Button>
                    {!isNewUser && (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                      >
                        Cancel
                      </button>
                    )}
                    {saved && (
                      <span
                        className="text-xs text-muted-foreground ml-auto"
                        style={{
                          fontFamily:
                            "var(--font-body), 'Courier Prime', monospace",
                        }}
                      >
                        Saved.
                      </span>
                    )}
                  </div>
                </form>
              </SectionCard>
            )}
          </div>
        )}

        {/* ── PATHS ── */}
        {activeSection === "paths" && <PathSelector />}

    </div>
  );
}
