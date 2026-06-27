"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Category, Product } from "@/types";

const sortValues = ["featured", "newest", "price-asc", "price-desc"] as const;
type SortValue = (typeof sortValues)[number];
function isSortValue(value: string | null): value is SortValue { return sortValues.includes(value as SortValue); }
export function ShopClient({ products, categories }: { products: Product[]; categories: Category[] }) {
  const searchParams = useSearchParams(); const router = useRouter();
  const initialCategory = searchParams.get("category") ?? "all";
  const initialSort = searchParams.get("sort");
  const [category, setCategory] = useState(categories.some((item) => item.slug === initialCategory) ? initialCategory : "all");
  const [query, setQuery] = useState(""); const [sort, setSort] = useState<SortValue>(isSortValue(initialSort) ? initialSort : "featured");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = products.filter((product) => (category === "all" || product.categorySlug === category) && (!normalized || `${product.name} ${product.category} ${product.tags.join(" ")}`.toLowerCase().includes(normalized)));
    return [...result].sort((a, b) => {
      const aPrice = a.salePrice ?? a.price; const bPrice = b.salePrice ?? b.price;
      if (sort === "newest") return Number(b.isNew) - Number(a.isNew);
      if (sort === "price-asc") return aPrice - bPrice;
      if (sort === "price-desc") return bPrice - aPrice;
      return Number(b.isBestSeller) - Number(a.isBestSeller);
    });
  }, [products, category, query, sort]);

  function chooseCategory(value: string) { setCategory(value); router.replace(value === "all" ? "/shop" : `/shop?category=${value}`, { scroll: false }); }

  return <div><div className="soft-enter rounded-[1.65rem] border border-white/80 bg-white/94 p-4 shadow-[0_18px_55px_rgba(5,10,31,.10)] ring-1 ring-brand-navy/5 backdrop-blur sm:p-5 lg:p-6"><div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]"><label className="relative block"><span className="sr-only">Search products</span><Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-brand-purple" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bags, beauty, gifts..." className="min-h-13 w-full rounded-full border border-brand-navy/12 bg-white pl-12 pr-5 text-sm font-medium text-brand-navy shadow-inner outline-none transition placeholder:text-brand-muted/74 focus:border-brand-purple/55 focus:ring-4 focus:ring-brand-lavender" /></label><label className="relative block"><span className="sr-only">Sort products</span><SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-purple" /><select value={sort} onChange={(event) => setSort(event.target.value as SortValue)} className="min-h-13 w-full appearance-none rounded-full border border-brand-navy/12 bg-white pl-11 pr-10 text-sm font-bold text-brand-navy shadow-inner outline-none transition focus:border-brand-purple/55 focus:ring-4 focus:ring-brand-lavender"><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-asc">Price low to high</option><option value="price-desc">Price high to low</option></select></label></div><div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1.5 pt-0.5" aria-label="Product categories">{[{ slug: "all", name: "All products" }, ...categories].map((item) => <button key={item.slug} type="button" onClick={() => chooseCategory(item.slug)} className={`motion-press shrink-0 rounded-full border px-4 py-2.5 text-sm font-extrabold transition ${category === item.slug ? "border-transparent bg-brand-gradient text-white shadow-[0_12px_28px_rgba(91,33,232,0.22)]" : "border-brand-navy/8 bg-brand-soft text-brand-navy/72 hover:border-brand-purple/20 hover:bg-brand-lavender/70 hover:text-brand-purple"}`}>{item.name}</button>)}</div></div>
    <div id="shop-products" className="mb-5 mt-7 flex items-center justify-between sm:mb-6 sm:mt-8"><p className="text-sm font-medium text-brand-muted"><span className="font-extrabold text-brand-navy">{filtered.length}</span> products</p></div>
    {filtered.length ? <div className="stagger-children grid grid-cols-2 gap-3 max-[359px]:grid-cols-1 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((product, index) => <ProductCard key={product.slug} product={product} priority={index === 0} />)}</div> : <div className="soft-enter rounded-[2rem] border border-dashed border-brand-navy/15 bg-brand-soft px-6 py-20 text-center shadow-inner"><h2 className="text-2xl font-bold text-brand-navy">{products.length ? "No products found" : "Products are being added"}</h2><p className="mx-auto mt-2 max-w-xl text-brand-muted">{products.length ? "Try another search or category." : "The NexaNotion catalog is being prepared. Please check back soon or message us for current availability."}</p>{products.length ? <button type="button" onClick={() => { setQuery(""); chooseCategory("all"); }} className="motion-press mt-6 rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-purple">Clear filters</button> : null}</div>}
  </div>;
}
