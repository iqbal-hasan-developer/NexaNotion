import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import { createSeoMetadata } from "@/lib/seo";
import { getCatalogWithFallback } from "@/lib/supabase/catalog";
import type { Product } from "@/types";

type DiscountedProduct = Product & { salePrice: number };

function isDiscountedProduct(product: Product): product is DiscountedProduct {
  return (
    typeof product.salePrice === "number" &&
    Number.isFinite(product.price) &&
    Number.isFinite(product.salePrice) &&
    product.salePrice > 0 &&
    product.salePrice < product.price
  );
}

export const metadata: Metadata = createSeoMetadata({
  title: "Offers",
  description: "Explore NexaNotion offers on bags, cosmetics, bracelets, Panjabi and gift packages in Bangladesh.",
  path: "/offers",
  image: "/images/offer-banner.webp",
  keywords: ["NexaNotion offers", "fashion offers Bangladesh", "gift package deals"],
});
export const dynamic = "force-dynamic";

export default async function OffersPage() {
  const catalog = await getCatalogWithFallback();
  const offerProducts = catalog.products.filter(isDiscountedProduct).map((product) => ({
    ...product,
    badge: `${Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF`,
  }));

  return (
    <main className="bg-[linear-gradient(180deg,#f8faff_0%,#ffffff_42%,#ffffff_100%)]">
      <section className="overflow-hidden pt-6 sm:pt-8 lg:pt-10">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-7 lg:px-10">
          <div className="soft-enter relative isolate min-h-[380px] overflow-hidden rounded-[2rem] bg-brand-navy shadow-[0_28px_90px_rgba(91,33,232,0.18)] sm:min-h-[340px] lg:min-h-[370px]">
            <Image
              src="/images/offer-banner.webp"
              alt="NexaNotion limited offers on bags, cosmetics, bracelets and gift packages"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1400px"
              className="object-cover object-[62%_center] sm:object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,31,0.9),rgba(5,10,31,0.62),rgba(91,33,232,0.14),transparent)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,31,0.08),transparent_46%,rgba(5,10,31,0.12))]" />

            <div className="relative z-10 flex min-h-[380px] items-center px-6 py-10 text-white sm:min-h-[340px] sm:px-10 lg:min-h-[370px] lg:px-14">
              <div className="reveal-up max-w-2xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/72">Special Offers</p>
                <h1 className="text-balance mt-4 max-w-xl text-4xl font-extrabold leading-[1.03] sm:text-5xl lg:text-6xl">Style more, save smarter.</h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-white/82 sm:text-lg">
                  Discover limited-time deals on bags, cosmetics, bracelets and gift packages curated for every moment.
                </p>
                <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center">
                  <Link
                    href="#offers"
                    className="motion-press inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-extrabold text-brand-navy shadow-[0_16px_40px_rgba(255,255,255,0.2)] transition hover:-translate-y-0.5 hover:bg-brand-soft"
                  >
                    View Offers
                  </Link>
                  <Link
                    href="/shop"
                    className="motion-press inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 text-sm font-extrabold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/18"
                  >
                    Shop Collection
                  </Link>
                </div>
                <p className="mt-5 text-sm font-semibold text-white/76">Limited-Time Picks / Combo Deals / Gift Offers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="offers" className="pb-14 pt-8 sm:pt-10 lg:pb-20 lg:pt-11">
        <Container className="max-w-[1400px]">
          <div className="mb-7 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-purple">Curated Deals</p>
              <h2 className="mt-3 text-3xl font-extrabold text-brand-navy sm:text-4xl">Featured Offers</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-brand-muted sm:text-base">
                Handpicked picks and bundle-friendly deals for your next order.
              </p>
            </div>
            <Link href="/shop" className="hidden w-fit items-center gap-2 text-sm font-extrabold text-brand-blue transition hover:text-brand-purple sm:inline-flex">
              Shop all products <ArrowRight className="size-4" />
            </Link>
          </div>

          {offerProducts.length ? <div className="stagger-children grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{offerProducts.map((product) => <ProductCard key={product.slug} product={product} />)}</div> : <div className="soft-enter rounded-[2rem] bg-brand-soft px-6 py-20 text-center"><Sparkles className="mx-auto size-8 text-brand-purple" /><h2 className="mt-5 text-2xl font-bold">Fresh offers are being prepared.</h2><p className="mt-2 text-brand-muted">Message us for today&apos;s package recommendations.</p><Button href={siteConfig.whatsappHref} className="mt-6"><MessageCircle className="size-4" />Ask on WhatsApp</Button></div>}
        </Container>
      </section>
    </main>
  );
}
