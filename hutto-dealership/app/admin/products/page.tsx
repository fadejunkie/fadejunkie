"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatPrice } from "@/lib/cart";
import { useState } from "react";
import { Id, Doc } from "@/convex/_generated/dataModel";

const BODY_TYPES = ["Truck", "SUV", "Sedan", "Coupe", "Minivan", "Convertible", "Wagon", "Hatchback", "Other"];
const CONDITIONS = ["Used", "Certified Pre-Owned", "New"];
const TRANSMISSIONS = ["Automatic", "Manual", "CVT"];

function defaultForm() {
  return {
    // Core
    name: "",
    slug: "",
    description: "",
    price: "",
    compareAtPrice: "",
    images: "",
    inStock: true,
    featured: false,
    // Vehicle
    year: "",
    make: "",
    model: "",
    trim: "",
    mileage: "",
    vin: "",
    bodyType: "",
    transmission: "Automatic",
    exteriorColor: "",
    condition: "Used",
  };
}

type FormState = ReturnType<typeof defaultForm>;

const inputClass = "mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export default function AdminVehicles() {
  const vehicles = useQuery(api.products.listAll, {});
  const createVehicle = useMutation(api.products.create);
  const updateVehicle = useMutation(api.products.update);
  const removeVehicle = useMutation(api.products.remove);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"products"> | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm());

  function set(field: keyof FormState, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function openCreate() {
    setEditingId(null);
    setForm(defaultForm());
    setShowForm(true);
  }

  function openEdit(v: Doc<"products">) {
    setEditingId(v._id);
    setForm({
      name: v.name,
      slug: v.slug,
      description: v.description,
      price: String(v.price / 100),
      compareAtPrice: v.compareAtPrice ? String(v.compareAtPrice / 100) : "",
      images: v.images.join("\n"),
      inStock: v.inStock,
      featured: v.featured ?? false,
      year: v.year ? String(v.year) : "",
      make: v.make ?? "",
      model: v.model ?? "",
      trim: v.trim ?? "",
      mileage: v.mileage != null ? String(v.mileage) : "",
      vin: v.vin ?? "",
      bodyType: v.bodyType ?? "",
      transmission: v.transmission ?? "Automatic",
      exteriorColor: v.exteriorColor ?? "",
      condition: v.condition ?? "Used",
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Auto-generate name if not set manually
    const autoName = form.year && form.make && form.model
      ? `${form.year} ${form.make} ${form.model}${form.trim ? " " + form.trim : ""}`
      : form.name;

    const payload = {
      name: autoName || form.name,
      slug: form.slug || autoName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description: form.description,
      price: Math.round(parseFloat(form.price) * 100),
      compareAtPrice: form.compareAtPrice ? Math.round(parseFloat(form.compareAtPrice) * 100) : undefined,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      inStock: form.inStock,
      featured: form.featured,
      // Vehicle fields
      year: form.year ? parseInt(form.year) : undefined,
      make: form.make || undefined,
      model: form.model || undefined,
      trim: form.trim || undefined,
      mileage: form.mileage ? parseInt(form.mileage) : undefined,
      vin: form.vin || undefined,
      bodyType: form.bodyType || undefined,
      transmission: form.transmission || undefined,
      exteriorColor: form.exteriorColor || undefined,
      condition: form.condition || undefined,
    };

    if (editingId) {
      await updateVehicle({ id: editingId, ...payload });
    } else {
      await createVehicle(payload);
    }
    setShowForm(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Vehicles</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-[#1B3A6B] text-white text-sm rounded-md hover:opacity-90 transition-opacity font-semibold"
        >
          + Add Vehicle
        </button>
      </div>

      {/* Vehicle form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[92vh] overflow-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-lg">{editingId ? "Edit Vehicle" : "Add Vehicle"}</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Vehicle identity */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Vehicle Info</p>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Year">
                    <input
                      type="number"
                      placeholder="2022"
                      value={form.year}
                      onChange={(e) => set("year", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Make">
                    <input
                      placeholder="Toyota"
                      value={form.make}
                      onChange={(e) => set("make", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Model">
                    <input
                      placeholder="Tacoma"
                      value={form.model}
                      onChange={(e) => set("model", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <Field label="Trim">
                    <input
                      placeholder="TRD Off-Road"
                      value={form.trim}
                      onChange={(e) => set("trim", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Exterior Color">
                    <input
                      placeholder="Midnight Black"
                      value={form.exteriorColor}
                      onChange={(e) => set("exteriorColor", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>

              {/* Classification */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Classification</p>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Body Type">
                    <select value={form.bodyType} onChange={(e) => set("bodyType", e.target.value)} className={inputClass}>
                      <option value="">Select…</option>
                      {BODY_TYPES.map((bt) => <option key={bt} value={bt}>{bt}</option>)}
                    </select>
                  </Field>
                  <Field label="Condition">
                    <select value={form.condition} onChange={(e) => set("condition", e.target.value)} className={inputClass}>
                      {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Transmission">
                    <select value={form.transmission} onChange={(e) => set("transmission", e.target.value)} className={inputClass}>
                      {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                </div>
              </div>

              {/* Odometer + VIN */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Odometer & VIN</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Mileage">
                    <input
                      type="number"
                      placeholder="45000"
                      value={form.mileage}
                      onChange={(e) => set("mileage", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="VIN">
                    <input
                      placeholder="1HGBH41JXMN109186"
                      value={form.vin}
                      onChange={(e) => set("vin", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Pricing</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Asking Price ($)">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="24995"
                      value={form.price}
                      onChange={(e) => set("price", e.target.value)}
                      className={inputClass}
                      required
                    />
                  </Field>
                  <Field label="MSRP / Was ($)">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="27500"
                      value={form.compareAtPrice}
                      onChange={(e) => set("compareAtPrice", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Description</p>
                <Field label="Notes / Description">
                  <textarea
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    className={`${inputClass} h-20 resize-none`}
                    placeholder="Clean title, one owner, well maintained…"
                  />
                </Field>
              </div>

              {/* Images */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Photos</p>
                <Field label="Image URLs (one per line)">
                  <textarea
                    value={form.images}
                    onChange={(e) => set("images", e.target.value)}
                    className={`${inputClass} h-20 resize-none`}
                    placeholder="https://..."
                  />
                </Field>
              </div>

              {/* Custom slug (optional) */}
              <Field label="URL Slug (auto-generated if blank)">
                <input
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="2022-toyota-tacoma-trd"
                  className={inputClass}
                />
              </Field>

              {/* Flags */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) => set("inStock", e.target.checked)}
                    className="accent-[#1B3A6B]"
                  />
                  <span className="font-medium">Available</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => set("featured", e.target.checked)}
                    className="accent-[#1B3A6B]"
                  />
                  <span className="font-medium">Featured on homepage</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1B3A6B] text-white rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  {editingId ? "Save Changes" : "Add to Inventory"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-md text-sm hover:border-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vehicle table */}
      {!vehicles ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-400 text-sm mb-3">No vehicles in inventory yet.</p>
          <button onClick={openCreate} className="text-[#1B3A6B] text-sm font-semibold underline">
            Add your first vehicle
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="text-xs uppercase text-gray-400 border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="py-3 px-3 text-left font-semibold">Vehicle</th>
                <th className="py-3 px-3 text-left font-semibold">Price</th>
                <th className="py-3 px-3 text-left font-semibold">Mileage</th>
                <th className="py-3 px-3 text-left font-semibold">Type</th>
                <th className="py-3 px-3 text-left font-semibold">Status</th>
                <th className="py-3 px-3 text-left font-semibold">Featured</th>
                <th className="py-3 px-3" />
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => {
                const title = v.year && v.make && v.model
                  ? `${v.year} ${v.make} ${v.model}`
                  : v.name;
                return (
                  <tr key={v._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-semibold text-gray-900">{title}</p>
                      {v.trim && <p className="text-xs text-gray-400">{v.trim}</p>}
                      {v.vin && <p className="text-xs text-gray-300 font-mono">{v.vin}</p>}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#1B3A6B]">{formatPrice(v.price)}</td>
                    <td className="py-3 px-3 text-gray-500">
                      {v.mileage != null ? v.mileage.toLocaleString() + " mi" : "—"}
                    </td>
                    <td className="py-3 px-3 text-gray-500">{v.bodyType ?? "—"}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v.inStock ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                        {v.inStock ? "Available" : "Sold"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-400 text-center">{v.featured ? "★" : "—"}</td>
                    <td className="py-3 px-3">
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => openEdit(v)}
                          className="text-xs text-gray-400 hover:text-gray-800 font-medium underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeVehicle({ id: v._id })}
                          className="text-xs text-red-300 hover:text-red-600 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
