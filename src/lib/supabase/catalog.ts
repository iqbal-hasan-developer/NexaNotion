import { createClient } from "@supabase/supabase-js";
import { categories as fallbackCategories, allProducts as fallbackProducts } from "@/data/store";
import { isSupabasePublicConfigured, getPublicSupabaseEnv } from "@/lib/supabase/env";
import type { Database, SupabaseProductRow } from "@/lib/supabase/database";
import type { Category, Product } from "@/types";

type ProductWithCategory = SupabaseProductRow & { categories: { name: string; slug: string; is_active: boolean | null } | null };

export async function getCatalogWithFallback(): Promise<{ categories: Category[]; products: Product[]; source: "supabase" | "fallback" }> {
  if (!isSupabasePublicConfigured()) {
    return { categories: fallbackCategories, products: fallbackProducts, source: "fallback" };
  }

  try {
    const { url, anonKey } = getPublicSupabaseEnv();
    const supabase = createClient<Database>(url, anonKey);
    const [categoriesResult, productsResult] = await Promise.all([
      supabase.from("categories").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
      supabase.from("products").select("*, categories(name, slug, is_active)").eq("is_active", true).order("sort_order", { ascending: true }),
    ]);

    if (categoriesResult.error || productsResult.error) {
      return { categories: fallbackCategories, products: fallbackProducts, source: "fallback" };
    }

    const categories = categoriesResult.data.map((category) => ({
      slug: category.slug as Category["slug"],
      name: category.name,
      description: category.description ?? "",
      image: category.image_url ?? "/images/nexanotion-hero.png",
      href: `/shop?category=${category.slug}`,
    }));

    const activeCategorySlugs = new Set(categories.map((category) => category.slug));
    const products = (productsResult.data as unknown as ProductWithCategory[]).filter((product) => product.categories?.slug && activeCategorySlugs.has(product.categories.slug)).map((product) => {
      const categorySlug = (product.categories?.slug ?? "gift-packages") as Product["categorySlug"];
      const image = product.image_url ?? "/images/nexanotion-hero.png";
      return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        category: product.categories?.name ?? "NexaNotion",
        categorySlug,
        price: product.compare_at_price ?? product.price,
        salePrice: product.compare_at_price ? product.price : undefined,
        image,
        images: product.gallery_urls?.length ? product.gallery_urls : [image],
        shortDescription: product.short_description ?? "",
        description: product.description ?? "",
        tags: product.tags ?? [],
        isBestSeller: product.is_best_seller ?? false,
        isNew: product.is_new ?? false,
        isOffer: product.is_offer ?? false,
        isFeatured: product.is_featured ?? false,
        stock: product.stock ?? 0,
        inventoryTracking: product.inventory_tracking ?? true,
      };
    });

    return { categories, products, source: "supabase" };
  } catch {
    // Keep safe category navigation available without showing production-facing fake products.
    return { categories: fallbackCategories, products: fallbackProducts, source: "fallback" };
  }
}
