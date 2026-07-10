import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Heart, MessageCircle, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { createSeoMetadata } from "@/lib/seo";
import { getCatalogWithFallback } from "@/lib/supabase/catalog";
import type { Product } from "@/types";

const bannerImage = "/images/gift-package-banner.webp";

export const metadata: Metadata = createSeoMetadata({
  title: "Gift Packages",
  description: "Thoughtful couple packages, birthday gifts, beauty gift sets and premium surprise boxes from NexaNotion in Bangladesh.",
  path: "/gift-packages",
  image: bannerImage,
  keywords: ["gift packages Bangladesh", "couple gift box", "birthday gift Bangladesh"],
});

export const dynamic = "force-dynamic";

export default async function GiftPackagesPage() {
  const catalog = await getCatalogWithFallback();
  const couples = catalog.products.filter((product) => product.categorySlug === "couple-packages");
  const boxes = catalog.products.filter((product) => product.categorySlug === "gift-packages");
  const beauty = catalog.products.filter((product) => product.categorySlug === "cosmetics");
  const hasGiftProducts = couples.length || boxes.length || beauty.length;

  return (
    <main>
      <GiftPackagesBanner />
      {hasGiftProducts ? (
        <>
          <GiftSection
            id="gift-packages"
            eyebrow="Curated Gifts"
            title="Gift Packages for Every Moment"
            description="From couple surprises to beauty gift sets, choose a package that feels personal."
            products={couples}
            className="bg-white pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-12"
          />
          <GiftSection title="Ready-to-give boxes" description="Premium presentation for birthdays, congratulations and every just-because moment." products={boxes} soft />
          <GiftSection title="Beauty gift sets" description="Self-care and beauty favorites for someone who deserves a little time for themselves." products={beauty} />
        </>
      ) : (
        <Section id="gift-packages" className="bg-white pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-12">
          <Container>
            <div className="soft-enter rounded-[2rem] bg-brand-soft px-6 py-16 text-center shadow-inner">
              <Sparkles className="mx-auto size-8 text-brand-purple" />
              <h2 className="mt-5 text-2xl font-bold text-brand-navy">Gift products are being prepared.</h2>
              <p className="mx-auto mt-2 max-w-xl leading-7 text-brand-muted">Message us for custom gift recommendations while the live catalog is being updated.</p>
              <Button href={siteConfig.whatsappHref} className="mt-6">
                <MessageCircle className="size-4" />
                Ask on WhatsApp
              </Button>
            </div>
          </Container>
        </Section>
      )}

      <Section className="bg-white pt-0">
        <Container>
          <div className="motion-card grid overflow-hidden rounded-[2rem] bg-brand-navy text-white lg:grid-cols-2">
            <div className="motion-image-group relative min-h-[320px]">
              <Image src={bannerImage} alt="Custom NexaNotion gift package" fill loading="eager" sizes="(max-width: 1024px) 100vw, 50vw" className="motion-image object-cover" />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <Sparkles className="size-7 text-brand-lavender" />
              <h2 className="mt-5 text-3xl font-bold sm:text-4xl">Build a gift around their moment.</h2>
              <p className="mt-4 leading-7 text-white/68">
                Tell us the occasion, your budget and a little about them. We will help shape a package that feels considered from the first look to the final ribbon.
              </p>
              <Button href={siteConfig.whatsappHref} className="mt-7 self-start">
                <Heart className="size-4" />
                Customize on WhatsApp
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

function GiftPackagesBanner() {
  return (
    <section className="bg-brand-soft px-5 pb-0 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pt-12">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="soft-enter relative min-h-[400px] overflow-hidden rounded-[1.75rem] bg-brand-navy text-white shadow-[0_28px_80px_rgba(5,10,31,0.2)] sm:min-h-[380px] sm:rounded-[2.25rem] lg:min-h-[360px]">
          <Image
            src={bannerImage}
            alt="Premium NexaNotion gift packages arranged for special moments"
            fill
            priority
            loading="eager"
            sizes="(max-width: 768px) 100vw, 1400px"
            className="object-cover object-[64%_center] sm:object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,31,0.88)_0%,rgba(5,10,31,0.72)_54%,rgba(91,33,232,0.18)_100%)] sm:bg-[linear-gradient(90deg,rgba(5,10,31,0.9)_0%,rgba(5,10,31,0.62)_43%,rgba(91,33,232,0.14)_73%,rgba(5,10,31,0)_100%)]" />
          <div className="relative flex min-h-[400px] items-end p-5 sm:min-h-[380px] sm:items-center sm:p-9 lg:min-h-[360px] lg:p-12">
            <div className="reveal-up max-w-[610px] pb-2 sm:pb-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-white/68">Gift Packages</p>
              <h1 className="mt-4 text-balance text-[2.05rem] font-extrabold leading-[1.05] text-white sm:text-5xl sm:leading-[1.03] lg:text-6xl">
                Thoughtful gifts, beautifully packed.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/82 sm:text-lg sm:leading-7">
                Explore couple packages, birthday gifts, beauty sets and premium surprise boxes made for special moments.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row">
                <Link
                  href="#gift-packages"
                  className="motion-press inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(91,33,232,0.32)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(91,33,232,0.42)] sm:min-h-12"
                >
                  Explore Gifts
                  <ArrowDown className="size-4" />
                </Link>
                <Link
                  href={siteConfig.whatsappHref}
                  className="motion-press inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/12 px-6 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(5,10,31,0.16)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/20 sm:min-h-12"
                >
                  <MessageCircle className="size-4" />
                  Customize on WhatsApp
                </Link>
              </div>
              <p className="mt-6 hidden text-sm font-semibold text-white/68 sm:block">Couple Gifts &bull; Beauty Sets &bull; Custom Packages</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GiftSection({
  id,
  eyebrow,
  title,
  description,
  products,
  soft = false,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description: string;
  products: Product[];
  soft?: boolean;
  className?: string;
}) {
  return (
    products.length ? (
    <section id={id} className={`reveal-up ${className ?? `${soft ? "bg-brand-soft" : "bg-white"} py-16 sm:py-20 lg:py-24`}`}>
      <Container>
        {eyebrow ? <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-brand-purple">{eyebrow}</p> : null}
        <SectionHeading title={title} description={description} />
        <div className="stagger-children grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Container>
    </section>
    ) : null
  );
}
