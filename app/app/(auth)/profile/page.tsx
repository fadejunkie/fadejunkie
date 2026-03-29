"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/Input";
import GalleryGrid from "@/components/GalleryGrid";
import LivePageCard from "@/components/LivePageCard";
import PathSelector from "@/components/PathSelector";
import ActiveStatusBadges from "@/components/ActiveStatusBadges";
import { cn } from "@/lib/utils";
import { Pencil, LogOut, ExternalLink } from "lucide-react";
import Link from "next/link";

// ── Nav configuration ─────────────────────────────────────────────────────────

const SCROLL_SECTIONS = [
  { id: "my-profile", label: "My Profile" },
  { id: "paths", label: "Paths" },
  { id: "gallery", label: "Gallery" },
] as const;

const EXTERNAL_LINKS = [
  { href: "/status", label: "Status" },
  { href: "/discover", label: "Discover" },
] as const;

type SectionId = (typeof SCROLL_SECTIONS)[number]["id"];

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
        "flex items-center gap-1.5 border rounded-full px-4 py-1.5 text-xs transition-colors duration-150 shrink-0",
        editing
          ? "border-foreground/30 bg-foreground text-background hover:bg-foreground/85"
          : "border-border text-muted-foreground hover:border-foreground/35 hover:text-foreground"
      )}
      style={{ fontFamily: "var(--font-mono), monospace" }}
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
      <Card className="rounded-xl p-6">
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
  const { signOut } = useAuthActions();

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
  const [activeSection, setActiveSection] = useState<SectionId>("my-profile");

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

  // ── Scroll to section ──
  function scrollToSection(id: SectionId) {
    setActiveSection(id);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ── Nav link shared styles ──
  const navLinkBase =
    "font-sans w-full text-left text-sm px-4 py-2 rounded-full transition-colors duration-150 whitespace-nowrap";
  const navActive = "bg-muted text-foreground font-normal";
  const navInactive =
    "text-muted-foreground hover:text-foreground hover:bg-muted/50 font-normal";

  return (
    <div className="flex -mx-6 -my-8 min-h-full">
      {/* ── LEFT NAV (desktop) ──────────────────────────────── */}
      <nav
        className="hidden md:flex flex-col w-[200px] shrink-0 border-r border-border sticky top-0 self-start"
        style={{ height: "calc(100vh - 56px)" }}
      >
        {/* Scrollable nav items */}
        <div className="flex-1 pt-8 px-4 space-y-5 overflow-y-auto">
          {/* Settings group */}
          <div className="space-y-2">
            <p
              className="text-[9px] text-muted-foreground/40 uppercase tracking-[0.14em] px-4 pb-2"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              settings
            </p>
            {SCROLL_SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className={cn(
                  navLinkBase,
                  activeSection === id ? navActive : navInactive
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Navigate group */}
          <div className="space-y-2">
            <p
              className="text-[9px] text-muted-foreground/40 uppercase tracking-[0.14em] px-4 pb-2"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              navigate
            </p>
            {EXTERNAL_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  navLinkBase,
                  navInactive,
                  "flex items-center justify-between"
                )}
              >
                {label}
                <ExternalLink
                  size={10}
                  className="text-muted-foreground/35 shrink-0"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Log out — pinned to bottom */}
        <div className="px-4 pb-7 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => signOut()}
            className={cn(navLinkBase, navInactive, "flex items-center gap-2")}
          >
            <LogOut size={13} className="shrink-0" />
            Log out
          </button>
        </div>
      </nav>

      {/* ── MOBILE TAB BAR ─────────────────────────────────── */}
      <div className="md:hidden absolute left-0 right-0 top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-1 overflow-x-auto px-3 py-2.5">
          {SCROLL_SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToSection(id)}
              className={cn(
                "font-sans shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors duration-150 whitespace-nowrap",
                activeSection === id
                  ? "bg-foreground text-background"
                  : "bg-muted/70 text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
          {EXTERNAL_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-sans shrink-0 flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-muted/70 text-muted-foreground whitespace-nowrap"
            >
              {label}
              <ExternalLink size={9} />
            </Link>
          ))}
        </div>
      </div>

      {/* ── RIGHT CONTENT ──────────────────────────────────── */}
      <div className="flex-1 min-w-0 px-5 md:px-8 pt-14 md:pt-8 pb-16 space-y-8">
        {/* ── MY PROFILE CARD ── */}
        <SectionCard
          id="my-profile"
          title="My Profile"
          editToggle={
            <EditToggle
              editing={editingProfile}
              onEdit={() => setEditingProfile(true)}
              onCancel={cancelEdit}
            />
          }
        >
          {/* Active status badges — below card title, above fields */}
          <div className="mb-5 -mt-1">
            <ActiveStatusBadges />
          </div>

          {/* Loading */}
          {barber === undefined && (
            <div className="flex items-center justify-center h-32">
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

          {/* ── VIEW MODE ── */}
          {barber != null && !editingProfile && (
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              {/* Name */}
              <div>
                <FieldLabel>Name</FieldLabel>
                <FieldValue bold empty={!barber.name}>
                  {barber.name}
                </FieldValue>
              </div>

              {/* Slug */}
              <div>
                <FieldLabel>Slug</FieldLabel>
                <FieldValue empty={!barber.slug}>
                  {barber.slug ? `@${barber.slug}` : undefined}
                </FieldValue>
              </div>

              {/* Phone */}
              <div>
                <FieldLabel>Phone</FieldLabel>
                <FieldValue empty={!barber.phone}>{barber.phone}</FieldValue>
              </div>

              {/* Instagram */}
              <div>
                <FieldLabel>Instagram</FieldLabel>
                <FieldValue empty={!barber.instagram}>
                  {barber.instagram}
                </FieldValue>
              </div>

              {/* Booking URL */}
              <div>
                <FieldLabel>Booking URL</FieldLabel>
                <FieldValue empty={!barber.bookingUrl}>
                  {barber.bookingUrl}
                </FieldValue>
              </div>

              {/* Shop Name */}
              <div>
                <FieldLabel>Shop Name</FieldLabel>
                <FieldValue empty={!barber.shopName}>
                  {barber.shopName}
                </FieldValue>
              </div>

              {/* Location */}
              <div>
                <FieldLabel>Location</FieldLabel>
                <FieldValue empty={!barber.location}>
                  {barber.location}
                </FieldValue>
              </div>

              {/* Bio — full width */}
              <div className="col-span-2">
                <FieldLabel>Bio</FieldLabel>
                <FieldValue empty={!barber.bio}>{barber.bio}</FieldValue>
              </div>

              {/* Services — full width */}
              <div className="col-span-2">
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

              {/* Avatar */}
              <div className="col-span-2">
                <FieldLabel>Avatar</FieldLabel>
                <div className="mt-2 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted border border-border overflow-hidden flex items-center justify-center shrink-0">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className="text-[9px] text-muted-foreground/40 text-center leading-tight"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        none
                      </span>
                    )}
                  </div>
                  {saved && (
                    <span
                      className="text-xs text-muted-foreground"
                      style={{
                        fontFamily:
                          "var(--font-body), 'Courier Prime', monospace",
                      }}
                    >
                      Saved.
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── EDIT MODE ── */}
          {barber !== undefined && (editingProfile || barber === null) && (
            <form onSubmit={handleSave} className="space-y-5">
              {/* Avatar */}
              <div>
                <label
                  className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-2"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  Headshot
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className="text-[9px] text-muted-foreground/40"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        none
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
                      setForm((f) => ({ ...f, bookingUrl: e.target.value }))
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
                            setServices((prev) => prev.filter((x) => x !== s))
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
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  Cancel
                </button>
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
          )}
        </SectionCard>

        {/* ── PATHS CARD ── */}
        <section id="paths" className="scroll-mt-6">
          <PathSelector />
        </section>

        {/* ── GALLERY CARD ── */}
        {barber && (
          <SectionCard id="gallery" title="Gallery">
            <GalleryGrid barberId={barber._id} editable />
          </SectionCard>
        )}

        {/* ── LIVE PAGE CARD ── */}
        {barber?.slug && (
          <div className="pb-4">
            <LivePageCard
              url={`https://${barber.slug}.fadejunkie.com`}
              label="Your barber page is live"
            />
          </div>
        )}
      </div>
    </div>
  );
}
