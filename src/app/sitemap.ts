import type { MetadataRoute } from "next";
import { allProducts } from "@/data/store";
import { getSitemapBaseUrl } from "@/lib/seo";
import { getCatalogWithFallback } from "@/lib/supabase/catalog";

export const dynamic = "force-dynamic";

const staticRoutes = ["/", "/shop", "/gift-packages", "/offers", "/track-order", "/about", "/contact"];

function sitemapUrl(path: string) {
  const baseUrl = getSitemapBaseUrl().replace(/\/+$/, "");
  return `${baseUrl}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  let products = allProducts;

  try {
    const catalog = await getCatalogWithFallback();
    products = catalog.products.length ? catalog.products : allProducts;
  } catch {
    products = allProducts;
  }

  return [
    ...staticRoutes.map((route) => ({
      url: sitemapUrl(route),
      lastModified: now,
      changeFrequency: route === "/" || route === "/shop" ? ("daily" as const) : ("weekly" as const),
      priority: route === "/" ? 1 : route === "/shop" ? 0.9 : 0.7,
    })),
    ...products.map((product) => ({
      url: sitemapUrl(`/products/${product.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
