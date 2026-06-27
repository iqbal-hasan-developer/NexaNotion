import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Banknote, Gift, MessageCircle, PackageCheck, Sparkles, Tags, Truck } from "lucide-react";
import { CompactCategoryCard } from "@/components/home/compact-category-card";
import { HeroSlider } from "@/components/home/hero-slider";
import { ProductCard } from "@/components/product-card";
import { TrustCard } from "@/components/trust-card";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { getCatalogWithFallback } from "@/lib/supabase/catalog";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "NexaNotion",
  description: "Shop NexaNotion fashion, beauty, bags, Panjabi, bracelets and gift packages with COD, manual bKash and Nagad options in Bangladesh.",
  path: "/",
  keywords: ["fashion gifts Bangladesh", "manual bKash shopping", "Nagad shopping Bangladesh"],
});

const trustItems = [
  { icon: Sparkles, title: "Trendy Collection", description: "Handpicked pieces that match the latest trends." },
  { icon: Gift, title: "Beautiful Packaging", description: "Thoughtfully packed to make every unboxing special." },
  { icon: Tags, title: "Affordable Pricing", description: "Premium style selected to fit your budget." },
  { icon: Truck, title: "Fast Delivery", description: "Quick and reliable delivery to your doorstep." },
  { icon: MessageCircle, title: "Easy WhatsApp Order", description: "Order in seconds directly on WhatsApp." },
  { icon: Banknote, title: "Cash on Delivery Available", description: "Pay when you receive and shop with peace of mind." },
];

export default async function HomePage() {
  const catalog = await getCatalogWithFallback();
  const featuredProducts = catalog.products.filter((product) => product.isBestSeller || product.isFeatured).slice(0, 4);
  const newArrivals = catalog.products.filter((product) => product.isNew).slice(0, 4);
  const giftPackages = catalog.products.filter((product) => ["couple-packages", "gift-packages"].includes(product.categorySlug)).slice(0, 2);

  return (
    <main>
      <HeroSlider />

      {catalog.categories.length ? (
        <section id="categories" className="reveal-up bg-white py-6 sm:py-7 lg:py-8">
          <Container>
            <div className="lg:flex lg:items-center lg:gap-8">
              <div className="mx-auto mb-3.5 max-w-2xl text-center sm:mb-4 lg:mx-0 lg:mb-0 lg:max-w-[360px] lg:text-left">
                <h2 className="text-balance text-2xl font-bold text-brand-navy sm:text-3xl lg:text-[1.7rem]">Shop by Category</h2>
                <p className="mt-1.5 text-sm leading-6 text-brand-muted sm:text-base">Explore NexaNotion collections made for style, beauty and thoughtful gifting.</p>
              </div>
              <div className="no-scrollbar stagger-children -mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-x-5 sm:gap-y-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:flex-1">
                {catalog.categories.map((category) => (
                  <CompactCategoryCard key={category.slug} category={category} priority={category.slug === "panjabi"} />
                ))}
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      {featuredProducts.length ? (
        <Section id="best-sellers" className="reveal-up overflow-hidden bg-[linear-gradient(180deg,#F8FAFF_0%,#FFFFFF_48%,#F3E8FF_100%)]">
          <Container className="max-w-[1360px]">
            <div className="mb-8 flex flex-col gap-5 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-brand-purple sm:text-sm">CUSTOMER FAVORITES</p>
                <h2 className="mt-3 text-balance text-3xl font-extrabold text-brand-navy sm:text-4xl lg:text-5xl">Best Selling Products</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-brand-muted sm:text-base sm:leading-7">The pieces our customers keep coming back for.</p>
              </div>
              <Link
                href="/shop"
                className="group inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full border border-brand-blue/15 bg-white/85 px-5 text-sm font-bold text-brand-navy shadow-[0_14px_34px_rgba(5,10,31,0.08)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-brand-purple/35 hover:text-brand-purple hover:shadow-[0_18px_42px_rgba(91,33,232,0.16)]"
              >
                View all products <ArrowRight className="size-4 transition duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="stagger-children grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {giftPackages.length ? (
        <Section id="gifts" className="reveal-up bg-white">
          <Container>
            <div className="motion-card overflow-hidden rounded-[2rem] bg-brand-soft lg:grid lg:grid-cols-2">
              <div className="grid min-h-[340px] grid-cols-2 gap-2 p-3 sm:p-5">
                {giftPackages.map((gift) => (
                  <div key={gift.id} className="motion-image-group relative overflow-hidden rounded-[1.35rem]">
                    <Image src={gift.image} alt={gift.name} fill sizes="(max-width: 1024px) 50vw, 310px" className="motion-image object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
                <PackageCheck className="size-8 text-brand-purple" />
                <h2 className="mt-6 max-w-md text-3xl font-bold text-brand-navy sm:text-4xl">Thoughtful gifts, beautifully put together.</h2>
                <p className="mt-4 max-w-md leading-7 text-brand-muted">Curated with care and wrapped with love. Find the perfect gift for every special moment.</p>
                <Button href="/gift-packages" className="mt-7 self-start">
                  Explore Gift Packages <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      <Section id="why-us" className="reveal-up bg-white pt-4 lg:pt-8">
        <Container>
          <SectionHeading title="Chosen for style. Trusted for every order." align="center" />
          <div className="stagger-children rounded-[2rem] border border-brand-navy/8 px-5 sm:grid sm:grid-cols-2 sm:px-4 lg:grid-cols-3 lg:px-6">
            {trustItems.map((item) => (
              <TrustCard key={item.title} {...item} />
            ))}
          </div>
        </Container>
      </Section>

      {newArrivals.length ? (
        <Section id="new-arrivals" className="reveal-up bg-brand-soft">
          <Container>
            <div className="mb-6 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
              <div className="max-w-2xl">
                <h2 className="text-balance text-3xl font-bold text-brand-navy sm:text-4xl">New arrivals</h2>
                <p className="mt-3 text-base leading-7 text-brand-muted">Fresh styles and new favorites, just landed.</p>
                <Link
                  href="/shop"
                  className="group mt-4 inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-full border border-brand-purple/15 bg-white/85 px-4 text-sm font-bold text-brand-navy shadow-[0_10px_24px_rgba(5,10,31,0.06)] transition hover:-translate-y-0.5 hover:border-brand-purple/35 hover:text-brand-purple sm:hidden"
                >
                  View all <ArrowRight className="size-4 transition duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
              <Link href="/shop" className="hidden items-center gap-1.5 text-sm font-semibold text-brand-blue sm:flex">
                View all <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mb-3 flex items-center justify-between text-xs font-bold text-brand-muted sm:hidden">
              <span>Swipe to see more</span>
              <span aria-hidden="true" className="inline-flex items-center gap-1 text-brand-purple">
                Scroll <ArrowRight className="size-3.5" />
              </span>
            </div>
            <div className="relative">
              <div className="no-scrollbar stagger-children -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto pl-5 pr-16 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 sm:pb-5 lg:grid-cols-4">
                {newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} className="min-w-[230px] snap-start sm:min-w-0" />
                ))}
              </div>
              <div aria-hidden="true" className="pointer-events-none absolute bottom-4 right-0 top-0 w-10 bg-gradient-to-l from-brand-soft via-brand-soft/80 to-transparent sm:hidden" />
            </div>
          </Container>
        </Section>
      ) : null}

      <Section id="track-order" className="reveal-up bg-white">
        <Container>
          <div className="motion-card cta-surface relative overflow-hidden rounded-[2rem] px-6 py-14 text-center text-white sm:px-10 sm:py-16">
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-balance text-3xl font-bold sm:text-5xl">Find something made for your moment.</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/75 sm:text-base">Style essentials, thoughtful gifts, and everyday beauty - all thoughtfully selected.</p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href="/shop" variant="light">
                  Shop the Collection <ArrowRight className="size-4" />
                </Button>
                <Button href={siteConfig.whatsappHref} className="border border-white/30 bg-transparent shadow-none hover:bg-white/10">
                  <MessageCircle className="size-4" />Order on WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
