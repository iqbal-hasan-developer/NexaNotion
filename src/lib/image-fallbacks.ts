export const defaultCatalogImage = "/images/hero-slide-1.webp";

const validLocalImagePaths = new Set([
  "/images/cart-banner.webp",
  "/images/checkout-banner.webp",
  "/images/contact-banner.webp",
  "/images/gift-package-banner.webp",
  "/images/hero-slide-1.webp",
  "/images/hero-slide-2.webp",
  "/images/hero-slide-3.webp",
  "/images/NexaNotion-footer-logo-transparent.png",
  "/images/nexanotion-logo.png",
  "/images/offer-banner.webp",
  "/images/shop-banner (2).webp",
  "/images/track-banner.webp",
]);

export function getSafeImageUrl(imageUrl?: string | null) {
  const image = imageUrl?.trim();
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/images/")) return validLocalImagePaths.has(image) ? image : "";
  return image;
}

export function getSafeImageUrlOrDefault(imageUrl?: string | null) {
  return getSafeImageUrl(imageUrl) || defaultCatalogImage;
}
