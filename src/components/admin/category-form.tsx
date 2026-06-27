"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { normalizeSlug } from "@/lib/admin/input";
import type { AdminCategory } from "@/types";

export function CategoryForm({ category }: { category?: AdminCategory }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [imageUrl, setImageUrl] = useState(category?.imageUrl ?? "");

  function updateName(value: string) {
    setName(value);
    if (!category && !slug) setSlug(normalizeSlug(value));
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name,
      slug,
      description: String(formData.get("description") ?? ""),
      imageUrl,
      sortOrder: String(formData.get("sortOrder") ?? "0"),
      isActive: formData.get("isActive") === "on",
    };

    try {
      const response = await fetch(category ? `/api/admin/categories/${category.id}` : "/api/admin/categories", {
        method: category ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { ok?: true; slug?: string; error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save category.");
        return;
      }
      setMessage("Category saved.");
      router.replace(`/admin/categories/${data.slug ?? slug}/edit`);
      router.refresh();
    } catch {
      setError("Could not save category.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-4 rounded-2xl border border-brand-navy/8 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black">Category details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-bold">Name<input value={name} onChange={(event) => updateName(event.target.value)} required className="mt-2 min-h-11 w-full rounded-xl border border-brand-navy/10 bg-brand-soft px-3 font-normal outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender" /></label>
            <label className="block text-sm font-bold">Slug<input value={slug} onChange={(event) => setSlug(normalizeSlug(event.target.value))} required className="mt-2 min-h-11 w-full rounded-xl border border-brand-navy/10 bg-brand-soft px-3 font-normal outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender" /></label>
            <label className="block text-sm font-bold">Sort order<input name="sortOrder" type="number" min="0" step="1" defaultValue={String(category?.sortOrder ?? 0)} className="mt-2 min-h-11 w-full rounded-xl border border-brand-navy/10 bg-brand-soft px-3 font-normal outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender" /></label>
          </div>
          <label className="block text-sm font-bold">
            Description
            <textarea name="description" defaultValue={category?.description ?? ""} rows={5} className="mt-2 w-full rounded-xl border border-brand-navy/10 bg-brand-soft px-3 py-3 font-normal outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender" />
          </label>
        </section>
        <aside className="space-y-4">
          <section className="rounded-2xl border border-brand-navy/8 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-black">Image</h2>
            <ImageUploadField scope="categories" slug={slug} label="Category image URL" value={imageUrl} onChange={setImageUrl} />
          </section>
          <section className="rounded-2xl border border-brand-navy/8 bg-white p-5 shadow-sm">
            <label className="flex items-center justify-between gap-4 rounded-xl bg-brand-soft px-3 py-2 text-sm font-bold">
              <span>Active</span>
              <input name="isActive" type="checkbox" defaultChecked={category?.isActive ?? true} className="size-5 accent-brand-purple" />
            </label>
          </section>
        </aside>
      </div>
      {message ? <p className="rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p> : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-5 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70">
          <Save className="size-4" />{saving ? "Saving..." : "Save category"}
        </button>
        <Link href="/admin/categories" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-brand-navy/10 px-5 text-sm font-black text-brand-navy">Cancel</Link>
      </div>
    </form>
  );
}
