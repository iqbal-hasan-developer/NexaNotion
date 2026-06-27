import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product, className = "", priority = false }: { product: Product; className?: string; priority?: boolean }) {
  const currentPrice = product.salePrice ?? product.price;

  return (
    <article className={`motion-card motion-image-group group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.55rem] border border-brand-navy/8 bg-white shadow-[0_18px_45px_rgba(5,10,31,0.055)] hover:border-brand-purple/20 hover:shadow-[0_24px_60px_rgba(5,10,31,0.11)] ${className}`}>
      <Link href={`/products/${product.slug}`} className="relative block bg-[linear-gradient(145deg,#ffffff_0%,#f8faff_55%,#f3e8ff_100%)] p-2.5">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.15rem] bg-white/65 shadow-inner">
          <Image src={product.image} alt={product.name} fill priority={priority} sizes="(max-width: 640px) 46vw, (max-width: 1024px) 33vw, 290px" className="motion-image object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(5,10,31,0.03))]" />
        </div>
        {product.badge ? <span className="absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase text-brand-purple shadow-[0_8px_22px_rgba(5,10,31,0.08)] backdrop-blur">{product.badge}</span> : null}
      </Link>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
        <p className="text-[11px] font-bold uppercase text-brand-blue/80">{product.category}</p>
        <h3 className="mt-2 min-h-[2.55rem] text-sm font-extrabold leading-5 text-brand-navy sm:min-h-[3rem] sm:text-base sm:leading-6">
          <Link href={`/products/${product.slug}`} className="line-clamp-2 transition-colors duration-200 hover:text-brand-purple">{product.name}</Link>
        </h3>
        <p className="mt-2 hidden min-h-[2.5rem] text-sm leading-5 text-brand-muted sm:block"><span className="line-clamp-2">{product.shortDescription}</span></p>

        <div className="mt-auto border-t border-brand-navy/7 pt-3 sm:pt-4">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              {product.salePrice ? <p className="text-xs text-brand-muted line-through">Tk {formatPrice(product.price)}</p> : null}
              <p className="text-lg font-extrabold leading-6 text-brand-navy sm:text-xl">Tk {formatPrice(currentPrice)}</p>
            </div>
            <AddToCartButton slug={product.slug} product={product} compact />
          </div>
        </div>
      </div>
    </article>
  );
}
