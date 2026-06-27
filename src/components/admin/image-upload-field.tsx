"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import type { UploadResponse } from "@/types";

export function ImageUploadField({
  scope,
  slug,
  label,
  value,
  onChange,
}: {
  scope: "products" | "categories";
  slug: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File | null) {
    if (!file || uploading) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.set("file", file);
    formData.set("scope", scope);
    formData.set("slug", slug);

    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = (await response.json()) as UploadResponse | { error?: string };
      if (!response.ok || !("url" in data)) {
        setError("error" in data && data.error ? data.error : "Upload failed.");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-bold text-brand-navy">
        {label}
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="https://..." className="mt-2 min-h-11 w-full rounded-xl border border-brand-navy/10 bg-brand-soft px-3 font-normal outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender" />
      </label>
      <label className="mt-2 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-brand-navy/10 px-3 text-sm font-bold text-brand-muted transition hover:border-brand-purple/25 hover:bg-brand-lavender/40 hover:text-brand-purple">
        <Upload className="size-4" />
        {uploading ? "Uploading..." : "Upload image"}
        <input type="file" accept="image/webp,image/jpeg,image/png" className="sr-only" onChange={(event) => upload(event.target.files?.[0] ?? null)} />
      </label>
      {value ? <p className="mt-2 truncate text-xs text-brand-muted">{value}</p> : null}
      {error ? <p className="mt-2 rounded-xl bg-rose-50 p-2 text-sm font-bold text-rose-700">{error}</p> : null}
    </div>
  );
}
