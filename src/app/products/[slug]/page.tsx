import type { Metadata } from "next";
import Link from "next/link";
import { Banknote, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductMetaEvents } from "@/components/product/product-meta-events";
import { ProductActions } from "@/components/product/product-actions";
import { ProductCard } from "@/components/product-card";
import { Container, Section } from "@/components/ui/container";
import { allProducts, productBySlug } from "@/data/store";
import { createSeoMetadata } from "@/lib/seo";
import { getCatalogWithFallback } from "@/lib/supabase/catalog";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return allProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await getCatalogWithFallback();
  const product = catalog.products.find((item) => item.slug === slug) ?? productBySlug.get(slug);
  return product
    ? createSeoMetadata({
        title: product.name,
        description: product.shortDescription || product.description || "Shop this NexaNotion product with delivery support in Bangladesh.",
        path: `/products/${product.slug}`,
        image: product.image,
        keywords: [product.category, ...product.tags],
      })
    : createSeoMetadata({
        title: "Product Not Found",
        description: "This NexaNotion product may no longer be available. Browse the latest collection for bags, beauty, gifts and Panjabi.",
        path: `/products/${slug}`,
        noIndex: true,
      });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const catalog = await getCatalogWithFallback();
  const product = catalog.products.find((item) => item.slug === slug) ?? productBySlug.get(slug);
  if (!product) notFound();

  const related = catalog.products.filter((item) => item.categorySlug === product.categorySlug && item.slug !== product.slug).slice(0, 4);

  return (
    <main className="bg-white">
      <ProductMetaEvents slug={product.slug} name={product.name} price={product.salePrice ?? product.price} />
      <Section className="bg-brand-soft py-10 sm:py-14">
        <Container className="max-w-[1360px]">
          <div className="mb-6 text-sm text-brand-muted">
            <Link href="/shop" className="transition-colors hover:text-brand-purple">Shop</Link>
            <span className="mx-2">/</span>
            <Link href={`/shop?category=${product.categorySlug}`} className="transition-colors hover:text-brand-purple">{product.category}</Link>
          </div>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] lg:gap-12 xl:gap-14">
            <ProductGallery mainImageUrl={product.image} galleryUrls={product.images} productName={product.name} />
            <div className="soft-enter self-start rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_rgba(5,10,31,.07)] sm:p-8">
              <p className="text-sm font-semibold text-brand-purple">{product.category}</p>
              <h1 className="mt-2 text-4xl font-extrabold leading-tight text-brand-navy sm:text-[2.75rem]">{product.name}</h1>
              <p className="mt-4 leading-7 text-brand-muted">{product.shortDescription}</p>
              <div className="mt-6 flex flex-wrap items-end gap-3">
                {product.salePrice ? <span className="pb-1 text-base text-brand-muted line-through">Tk {formatPrice(product.price)}</span> : null}
                <span className="text-3xl font-extrabold text-brand-navy">Tk {formatPrice(product.salePrice ?? product.price)}</span>
                {product.isOffer ? <span className="mb-1 rounded-full bg-brand-lavender px-3 py-1 text-xs font-bold text-brand-purple">Special offer</span> : null}
              </div>
              <ProductActions product={product} />
            </div>
          </div>
        </Container>
      </Section>

      <Section className="reveal-up bg-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <h2 className="text-3xl font-bold text-brand-navy">Made for real moments.</h2>
              <p className="mt-4 max-w-2xl leading-8 text-brand-muted">{product.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag) => <span key={tag} className="rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand-navy/65">{tag}</span>)}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                [Truck, "Fast delivery", "Delivery charge shown at checkout."],
                [Banknote, "Flexible payment", "COD, bKash and Nagad options."],
                [PackageCheck, "Beautiful packaging", "Prepared with care for gifting."],
                [ShieldCheck, "Friendly support", "WhatsApp help when you need it."],
              ].map(([Icon, title, copy]) => {
                const I = Icon as typeof Truck;
                return (
                  <div key={title as string} className="motion-card rounded-[1.25rem] border border-brand-navy/8 p-5 hover:border-brand-purple/20 hover:shadow-[0_14px_36px_rgba(5,10,31,0.06)]">
                    <I className="size-5 text-brand-purple" />
                    <h3 className="mt-4 font-semibold text-brand-navy">{title as string}</h3>
                    <p className="mt-1 text-sm leading-6 text-brand-muted">{copy as string}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      {related.length ? (
        <Section className="reveal-up bg-brand-soft">
          <Container>
            <h2 className="mb-8 text-3xl font-bold text-brand-navy">More from {product.category}</h2>
            <div className="stagger-children grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {related.map((item) => <ProductCard key={item.slug} product={item} />)}
            </div>
          </Container>
        </Section>
      ) : null}
    </main>
  );
}
