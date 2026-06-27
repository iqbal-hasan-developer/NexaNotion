import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizeSlug, readText } from "@/lib/admin/input";
import type { UploadResponse } from "@/types";

const allowedTypes = new Set(["image/webp", "image/jpeg", "image/png"]);
const maxSize = 5 * 1024 * 1024;

function safeFilename(name: string) {
  const parts = name.toLowerCase().split(".");
  const extension = parts.length > 1 ? parts.pop() : "webp";
  const base = parts.join(".").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "image";
  return `${base}.${extension}`;
}

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return jsonError("Admin access is required.", 401);

  const formData = await request.formData();
  const file = formData.get("file");
  const scope = readText(formData.get("scope"));
  const slug = normalizeSlug(readText(formData.get("slug"))) || "uncategorized";
  const folder = normalizeSlug(readText(formData.get("folder")));

  if (!(file instanceof File)) return jsonError("Please choose an image file.", 400);
  if (!["products", "categories"].includes(scope)) return jsonError("Invalid upload scope.", 400);
  if (folder && (scope !== "products" || folder !== "gallery")) return jsonError("Invalid upload folder.", 400);
  if (!allowedTypes.has(file.type)) return jsonError("Upload a WEBP, JPG, JPEG, or PNG image.", 400);
  if (file.size > maxSize) return jsonError("Image must be 5 MB or smaller.", 400);

  const folderPath = folder ? `${folder}/` : "";
  const objectPath = `${scope}/${slug}/${folderPath}${Date.now()}-${safeFilename(file.name)}`;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.storage.from("products").upload(objectPath, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    return jsonError("Could not upload image. Check that the public products bucket exists.", 500);
  }

  const { data } = supabase.storage.from("products").getPublicUrl(objectPath);
  return NextResponse.json<UploadResponse>({ url: data.publicUrl, path: objectPath });
}
