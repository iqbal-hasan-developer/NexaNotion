import { createClient } from "@supabase/supabase-js";
import { categories as fallbackCategories, allProducts as fallbackProducts } from "@/data/store";
import { getSafeImageUrl, getSafeImageUrlOrDefault } from "@/lib/image-fallbacks";
import { isSupabasePublicConfigured, getPublicSupabaseEnv } from "@/lib/supabase/env";
import type { Database, SupabaseProductRow } from "@/lib/supabase/database";
import type { Category, Product } from "@/types";

type ProductWithCategory = SupabaseProductRow & { categories: { name: string; slug: string; is_active: boolean | null } | null };

function filterCategoriesWithProducts(categories: Category[], products: Product[]) {
  const productCategorySlugs = new Set(products.map((product) => product.categorySlug));
  return categories.filter((category) => productCategorySlugs.has(category.slug));
}

export async function getCatalogWithFallback(): Promise<{ categories: Category[]; products: Product[]; source: "supabase" | "fallback" }> {
  if (!isSupabasePublicConfigured()) {
    return { categories: filterCategoriesWithProducts(fallbackCategories, fallbackProducts), products: fallbackProducts, source: "fallback" };
  }

  try {
    const { url, anonKey } = getPublicSupabaseEnv();
    const supabase = createClient<Database>(url, anonKey);
    const [categoriesResult, productsResult] = await Promise.all([
      supabase.from("categories").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
      supabase.from("products").select("*, categories(name, slug, is_active)").eq("is_active", true).order("sort_order", { ascending: true }),
    ]);

    if (categoriesResult.error || productsResult.error) {
      console.error("[catalog] Supabase catalog query failed.", {
        categories: categoriesResult.error
          ? { code: categoriesResult.error.code, message: categoriesResult.error.message }
          : null,
        products: productsResult.error
          ? { code: productsResult.error.code, message: productsResult.error.message }
          : null,
      });
      return { categories: fallbackCategories, products: fallbackProducts, source: "fallback" };
    }

    const categories = categoriesResult.data.map((category) => ({
      slug: category.slug as Category["slug"],
      name: category.name,
      description: category.description ?? "",
      image: getSafeImageUrl(category.image_url),
      href: `/shop?category=${category.slug}`,
    }));

    const activeCategorySlugs = new Set(categories.map((category) => category.slug));
    const products = (productsResult.data as unknown as ProductWithCategory[]).filter((product) => product.categories?.slug && activeCategorySlugs.has(product.categories.slug)).map((product) => {
      const categorySlug = (product.categories?.slug ?? "gift-packages") as Product["categorySlug"];
      const image = getSafeImageUrlOrDefault(product.image_url);
      return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        category: product.categories?.name ?? "NexaNotion",
        categorySlug,
        price: product.compare_at_price ?? product.price,
        salePrice: product.compare_at_price ? product.price : undefined,
        image,
        images: product.gallery_urls?.map((url) => getSafeImageUrl(url)).filter(Boolean).length ? product.gallery_urls.map((url) => getSafeImageUrl(url)).filter(Boolean) : [image],
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

    return { categories: filterCategoriesWithProducts(categories, products), products, source: "supabase" };
  } catch (error) {
    console.error("[catalog] Unexpected catalog load failure.", error instanceof Error ? error.message : "Unknown error");
    // Keep safe category navigation available without showing production-facing fake products.
    return { categories: filterCategoriesWithProducts(fallbackCategories, fallbackProducts), products: fallbackProducts, source: "fallback" };
  }
}
