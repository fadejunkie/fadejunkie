"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatPrice } from "@/lib/cart";
import { useState } from "react";
import { Id, Doc } from "@/convex/_generated/dataModel";

export default function AdminProducts() {
  const products = useQuery(api.products.listAll, {});
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const removeProduct = useMutation(api.products.remove);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"products"> | null>(null);
  const [form, setForm] = useState(defaultForm());

  function defaultForm() {
    return {
      name: "",
      slug: "",
      description: "",
      price: "",
      compareAtPrice: "",
      images: "",
      inStock: true,
      featured: false,
    };
  }

  function openCreate() {
    setEditingId(null);
    setForm(defaultForm());
    setShowForm(true);
  }

  function openEdit(p: Doc<"products">) {
    setEditingId(p._id);
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: String(p.price / 100),
      compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice / 100) : "",
      images: p.images.join("\n"),
      inStock: p.inStock,
      featured: p.featured ?? false,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      price: Math.round(parseFloat(form.price) * 100),
      compareAtPrice: form.compareAtPrice
        ? Math.round(parseFloat(form.compareAtPrice) * 100)
        : undefined,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      inStock: form.inStock,
      featured: form.featured,
    };

    if (editingId) {
      await updateProduct({ id: editingId, ...payload });
    } else {
      await createProduct(payload);
    }
    setShowForm(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Products</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-black text-white text-sm rounded hover:opacity-80 transition-opacity"
        >
          + New Product
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
            <h2 className="font-bold mb-4">{editingId ? "Edit Product" : "New Product"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              {(["name", "slug", "description"] as const).map((field) => (
                <label key={field} className="block">
                  <span className="text-xs text-gray-500 capitalize">{field}</span>
                  {field === "description" ? (
                    <textarea
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="mt-1 w-full border border-gray-200 rounded px-3 py-2 text-sm h-20 resize-none"
                      required
                    />
                  ) : (
                    <input
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="mt-1 w-full border border-gray-200 rounded px-3 py-2 text-sm"
                      required
                    />
                  )}
                </label>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-gray-500">Price ($)</span>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="mt-1 w-full border border-gray-200 rounded px-3 py-2 text-sm"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-500">Compare At ($)</span>
                  <input
                    type="number"
                    step="0.01"
                    value={form.compareAtPrice}
                    onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
                    className="mt-1 w-full border border-gray-200 rounded px-3 py-2 text-sm"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-xs text-gray-500">Image URLs (one per line)</span>
                <textarea
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  className="mt-1 w-full border border-gray-200 rounded px-3 py-2 text-sm h-20 resize-none"
                />
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                  />
                  In Stock
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                  Featured
                </label>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-black text-white rounded text-sm hover:opacity-80"
                >
                  {editingId ? "Save Changes" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-200 rounded text-sm hover:border-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!products ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : products.length === 0 ? (
        <p className="text-gray-400 text-sm">No products yet. Create one above.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-gray-400 border-b border-gray-200">
            <tr>
              <th className="py-2 text-left font-medium">Name</th>
              <th className="py-2 text-left font-medium">Price</th>
              <th className="py-2 text-left font-medium">Stock</th>
              <th className="py-2 text-left font-medium">Featured</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-gray-100 hover:bg-white transition-colors">
                <td className="py-2.5 font-medium">{p.name}</td>
                <td className="py-2.5 text-gray-600">{formatPrice(p.price)}</td>
                <td className="py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {p.inStock ? "In Stock" : "Out"}
                  </span>
                </td>
                <td className="py-2.5 text-gray-400">{p.featured ? "✓" : "—"}</td>
                <td className="py-2.5">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-xs text-gray-400 hover:text-black underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeProduct({ id: p._id })}
                      className="text-xs text-red-300 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
