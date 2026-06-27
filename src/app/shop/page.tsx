import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ShopClient } from "@/components/shop/shop-client";
import { getCatalogWithFallback } from "@/lib/supabase/catalog";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Shop",
  description: "Shop NexaNotion bags, cosmetics, bracelets, Panjabi and gift packages with delivery across Bangladesh.",
  path: "/shop",
  image: "/images/shop-banner (2).webp",
  keywords: ["ladies bags", "gym bags", "cosmetics", "bracelets", "Panjabi"],
});
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const catalog = await getCatalogWithFallback();

  return (
    <main className="bg-[linear-gradient(180deg,#f8faff_0%,#ffffff_44%,#ffffff_100%)]">
      <section className="overflow-hidden pt-6 sm:pt-8 lg:pt-10">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-7 lg:px-10">
          <div className="soft-enter relative isolate min-h-[360px] overflow-hidden rounded-[2rem] bg-brand-navy shadow-[0_28px_90px_rgba(37,99,235,0.18)] sm:min-h-[340px] lg:min-h-[370px]">
            <Image
              src="/images/shop-banner (2).webp"
              alt="NexaNotion bags, cosmetics, bracelets and gift packages"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1400px"
              className="object-cover object-[61%_center] sm:object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,31,0.88),rgba(5,10,31,0.58),rgba(91,33,232,0.12),transparent)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,31,0.1),transparent_42%,rgba(5,10,31,0.1))]" />

            <div className="relative z-10 flex min-h-[360px] items-center px-6 py-10 text-white sm:min-h-[340px] sm:px-10 lg:min-h-[370px] lg:px-14">
              <div className="reveal-up max-w-2xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/72">Shop NexaNotion</p>
                <h1 className="text-balance mt-4 max-w-xl text-4xl font-extrabold leading-[1.03] sm:text-5xl lg:text-6xl">Find your next favorite.</h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-white/82 sm:text-lg">
                  Explore bags, beauty essentials, bracelets and thoughtful gifts selected for every moment.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <Link
                    href="#shop-products"
                    className="motion-press inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-extrabold text-brand-navy shadow-[0_16px_40px_rgba(255,255,255,0.22)] transition hover:-translate-y-0.5 hover:bg-brand-soft"
                  >
                    Shop Collection
                  </Link>
                  <p className="text-sm font-semibold text-white/76">COD Available / Fast Delivery / WhatsApp Order</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 pb-14 pt-6 sm:pt-7 lg:pb-20 lg:pt-9">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-7 lg:px-10">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-[2rem] bg-white shadow-[0_16px_50px_rgba(5,10,31,0.06)]" />}>
            <ShopClient products={catalog.products} categories={catalog.categories} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
