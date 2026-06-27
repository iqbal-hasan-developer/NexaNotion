"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Save, Trash2, Upload } from "lucide-react";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { normalizeSlug } from "@/lib/admin/input";
import type { UploadResponse } from "@/types";
import type { AdminCategory, AdminProductDetail } from "@/types";

function parseGalleryUrls(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((url) => url.trim())
    .filter(Boolean);
}

function serializeGalleryUrls(urls: string[]) {
  return urls.join("\n");
}

export function ProductForm({ product, categories }: { product?: AdminProductDetail; categories: AdminCategory[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [galleryUrls, setGalleryUrls] = useState(serializeGalleryUrls(product?.galleryUrls ?? []));
  const galleryUrlList = useMemo(() => parseGalleryUrls(galleryUrls), [galleryUrls]);
  const activeCategories = useMemo(() => categories.filter((category) => category.isActive || category.id === product?.categoryId), [categories, product?.categoryId]);

  function updateName(value: string) {
    setName(value);
    if (!product && !slug) setSlug(normalizeSlug(value));
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
      sku: String(formData.get("sku") ?? ""),
      categoryId: String(formData.get("categoryId") ?? ""),
      shortDescription: String(formData.get("shortDescription") ?? ""),
      description: String(formData.get("description") ?? ""),
      price: String(formData.get("price") ?? ""),
      compareAtPrice: String(formData.get("compareAtPrice") ?? ""),
      stock: String(formData.get("stock") ?? "0"),
      lowStockThreshold: String(formData.get("lowStockThreshold") ?? "5"),
      sortOrder: String(formData.get("sortOrder") ?? "0"),
      tags: String(formData.get("tags") ?? ""),
      imageUrl,
      galleryUrls,
      isActive: formData.get("isActive") === "on",
      isBestSeller: formData.get("isBestSeller") === "on",
      isNew: formData.get("isNew") === "on",
      isOffer: formData.get("isOffer") === "on",
      isFeatured: formData.get("isFeatured") === "on",
      inventoryTracking: formData.get("inventoryTracking") === "on",
    };

    try {
      const response = await fetch(product ? `/api/admin/products/${product.id}` : "/api/admin/products", {
        method: product ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { ok?: true; slug?: string; error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save product.");
        return;
      }
      setMessage("Product saved.");
      router.replace(`/admin/products/${data.slug ?? slug}/edit`);
      router.refresh();
    } catch {
      setError("Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-4 rounded-2xl border border-brand-navy/8 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black">Product details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Product name" value={name} onChange={(event) => updateName(event.target.value)} required />
            <Field label="Slug" value={slug} onChange={(event) => setSlug(normalizeSlug(event.target.value))} required />
            <Field label="SKU" name="sku" defaultValue={product?.sku ?? ""} />
            <label className="block text-sm font-bold">
              Category
              <select name="categoryId" defaultValue={product?.categoryId ?? ""} required className="mt-2 min-h-11 w-full rounded-xl border border-brand-navy/10 bg-brand-soft px-3 font-normal outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender">
                <option value="">Choose category</option>
                {activeCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>
            <Field label="Price" name="price" type="number" min="0" step="0.01" defaultValue={String(product?.price ?? "")} required />
            <Field label="Compare-at price" name="compareAtPrice" type="number" min="0" step="0.01" defaultValue={product?.compareAtPrice ? String(product.compareAtPrice) : ""} />
            <Field label="Stock" name="stock" type="number" min="0" step="1" defaultValue={String(product?.stock ?? 0)} />
            <Field label="Low-stock threshold" name="lowStockThreshold" type="number" min="0" step="1" defaultValue={String(product?.lowStockThreshold ?? 5)} />
            <Field label="Sort order" name="sortOrder" type="number" min="0" step="1" defaultValue={String(product?.sortOrder ?? 0)} />
            <Field label="Tags" name="tags" defaultValue={(product?.tags ?? []).join(", ")} placeholder="gift, beauty, new" />
          </div>
          <label className="block text-sm font-bold">
            Short description
            <textarea name="shortDescription" defaultValue={product?.shortDescription ?? ""} rows={3} className="mt-2 w-full rounded-xl border border-brand-navy/10 bg-brand-soft px-3 py-3 font-normal outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender" />
          </label>
          <label className="block text-sm font-bold">
            Full description
            <textarea name="description" defaultValue={product?.description ?? ""} rows={6} className="mt-2 w-full rounded-xl border border-brand-navy/10 bg-brand-soft px-3 py-3 font-normal outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender" />
          </label>
        </section>

        <aside className="space-y-4">
          <section className="space-y-4 rounded-2xl border border-brand-navy/8 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black">Images</h2>
            <ImageUploadField scope="products" slug={slug} label="Main image URL" value={imageUrl} onChange={setImageUrl} />
            <label className="block text-sm font-bold">
              Gallery URLs
              <textarea value={galleryUrls} onChange={(event) => setGalleryUrls(event.target.value)} rows={5} className="mt-2 w-full rounded-xl border border-brand-navy/10 bg-brand-soft px-3 py-3 font-normal outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender" />
            </label>
            <GalleryImageManager slug={slug} urls={galleryUrlList} onChange={(urls) => setGalleryUrls(serializeGalleryUrls(urls))} />
          </section>
          <section className="space-y-3 rounded-2xl border border-brand-navy/8 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black">Visibility</h2>
            <Toggle name="isActive" label="Active" defaultChecked={product?.isActive ?? true} />
            <Toggle name="inventoryTracking" label="Track inventory" defaultChecked={product?.inventoryTracking ?? true} />
            <Toggle name="isBestSeller" label="Best seller" defaultChecked={product?.isBestSeller ?? false} />
            <Toggle name="isNew" label="New arrival" defaultChecked={product?.isNew ?? false} />
            <Toggle name="isOffer" label="Offer" defaultChecked={product?.isOffer ?? false} />
            <Toggle name="isFeatured" label="Featured" defaultChecked={product?.isFeatured ?? false} />
          </section>
        </aside>
      </div>

      {message ? <p className="rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p> : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-5 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70">
          <Save className="size-4" />{saving ? "Saving..." : "Save product"}
        </button>
        <Link href="/admin/products" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-brand-navy/10 px-5 text-sm font-black text-brand-navy">Cancel</Link>
      </div>
    </form>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="block text-sm font-bold">{label}<input {...props} name={props.name} className="mt-2 min-h-11 w-full rounded-xl border border-brand-navy/10 bg-brand-soft px-3 font-normal outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender" /></label>;
}

function Toggle({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="flex items-center justify-between gap-4 rounded-xl bg-brand-soft px-3 py-2 text-sm font-bold"><span>{label}</span><input {...props} type="checkbox" className="size-5 accent-brand-purple" /></label>;
}

function GalleryImageManager({ slug, urls, onChange }: { slug: string; urls: string[]; onChange: (urls: string[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(files: FileList | null) {
    const selectedFiles = Array.from(files ?? []);
    if (!selectedFiles.length || uploading) return;

    setUploading(true);
    setError("");

    try {
      const uploadedUrls: string[] = [];
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.set("file", file);
        formData.set("scope", "products");
        formData.set("slug", slug);
        formData.set("folder", "gallery");

        const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = (await response.json()) as UploadResponse | { error?: string };

        if (!response.ok || !("url" in data)) {
          throw new Error("error" in data && data.error ? data.error : "Could not upload gallery image.");
        }

        uploadedUrls.push(data.url);
      }

      onChange([...urls, ...uploadedUrls].filter((url, index, allUrls) => allUrls.indexOf(url) === index));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload gallery images.");
    } finally {
      setUploading(false);
    }
  }

  function removeUrl(url: string) {
    onChange(urls.filter((item) => item !== url));
  }

  return (
    <div className="space-y-3">
      <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-brand-navy/10 px-3 text-sm font-bold text-brand-muted transition hover:border-brand-purple/25 hover:bg-brand-lavender/40 hover:text-brand-purple">
        <Upload className="size-4" />
        {uploading ? "Uploading..." : "Upload gallery images"}
        <input type="file" accept="image/webp,image/jpeg,image/png" multiple className="sr-only" onChange={(event) => upload(event.target.files)} />
      </label>

      {error ? <p className="rounded-xl bg-rose-50 p-2 text-sm font-bold text-rose-700">{error}</p> : null}

      {urls.length ? (
        <div className="grid grid-cols-2 gap-3">
          {urls.map((url) => (
            <div key={url} className="overflow-hidden rounded-xl border border-brand-navy/10 bg-brand-soft">
              <div className="relative aspect-square bg-white">
                <Image src={url} alt="" fill sizes="160px" className="object-cover" />
              </div>
              <button type="button" onClick={() => removeUrl(url)} className="flex min-h-9 w-full items-center justify-center gap-2 text-xs font-black text-rose-700 transition hover:bg-rose-50">
                <Trash2 className="size-3.5" />
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
