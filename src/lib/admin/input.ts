import type { CategoryFormInput, ProductFormInput } from "@/types";

export function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function readNumber(value: unknown, fallback = 0) {
  const number = typeof value === "number" ? value : Number(readText(value));
  return Number.isFinite(number) ? number : fallback;
}

export function readBoolean(value: unknown) {
  return value === true || value === "true" || value === "on";
}

export function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function parseTags(value: unknown) {
  return readText(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function parseGallery(value: unknown) {
  return readText(value)
    .split(/\r?\n|,/)
    .map((url) => url.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export function parseProductInput(value: unknown): ProductFormInput {
  const input = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const name = readText(input.name);
  const slug = normalizeSlug(readText(input.slug));
  const categoryId = readText(input.categoryId);
  const price = readNumber(input.price, -1);
  const compareAtPriceText = readText(input.compareAtPrice);
  const compareAtPrice = compareAtPriceText ? readNumber(compareAtPriceText, -1) : undefined;
  const stock = Math.trunc(readNumber(input.stock, 0));
  const lowStockThreshold = Math.trunc(readNumber(input.lowStockThreshold, 5));
  const sortOrder = Math.trunc(readNumber(input.sortOrder, 0));

  if (!name) throw new Error("Product name is required.");
  if (!slug) throw new Error("Product slug is required.");
  if (!categoryId) throw new Error("Category is required.");
  if (price < 0) throw new Error("Price must be 0 or higher.");
  if (compareAtPrice !== undefined && compareAtPrice < 0) throw new Error("Compare-at price must be 0 or higher.");
  if (stock < 0) throw new Error("Stock must be 0 or higher.");
  if (lowStockThreshold < 0) throw new Error("Low-stock threshold must be 0 or higher.");
  if (sortOrder < 0) throw new Error("Sort order must be 0 or higher.");

  return {
    name,
    slug,
    sku: readText(input.sku) || undefined,
    categoryId,
    shortDescription: readText(input.shortDescription) || undefined,
    description: readText(input.description) || undefined,
    price,
    compareAtPrice,
    imageUrl: readText(input.imageUrl) || undefined,
    galleryUrls: Array.isArray(input.galleryUrls) ? input.galleryUrls.filter((url): url is string => typeof url === "string" && Boolean(url.trim())) : parseGallery(input.galleryUrls),
    stock,
    lowStockThreshold,
    sortOrder,
    tags: Array.isArray(input.tags) ? input.tags.filter((tag): tag is string => typeof tag === "string" && Boolean(tag.trim())) : parseTags(input.tags),
    isActive: readBoolean(input.isActive),
    isBestSeller: readBoolean(input.isBestSeller),
    isNew: readBoolean(input.isNew),
    isOffer: readBoolean(input.isOffer),
    isFeatured: readBoolean(input.isFeatured),
    inventoryTracking: readBoolean(input.inventoryTracking),
  };
}

export function parseCategoryInput(value: unknown): CategoryFormInput {
  const input = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const name = readText(input.name);
  const slug = normalizeSlug(readText(input.slug));
  const sortOrder = Math.trunc(readNumber(input.sortOrder, 0));

  if (!name) throw new Error("Category name is required.");
  if (!slug) throw new Error("Category slug is required.");
  if (sortOrder < 0) throw new Error("Sort order must be 0 or higher.");

  return {
    name,
    slug,
    description: readText(input.description) || undefined,
    imageUrl: readText(input.imageUrl) || undefined,
    sortOrder,
    isActive: readBoolean(input.isActive),
  };
}
