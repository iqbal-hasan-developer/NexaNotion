"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, MessageCircle, Minus, PackageCheck, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

const cartBannerImage = "/images/cart-banner.webp";

export function CartPageBanner() {
  const { itemCount, hydrated } = useCart();
  const canCheckout = hydrated && itemCount > 0;

  return (
    <div className="soft-enter relative isolate flex min-h-[340px] items-center overflow-hidden rounded-[1.75rem] bg-brand-navy px-5 py-7 text-white shadow-[0_28px_90px_rgba(37,99,235,0.18)] sm:min-h-[340px] sm:rounded-[2rem] sm:px-10 sm:py-9 lg:min-h-[340px] lg:px-14">
      <Image
        src={cartBannerImage}
        alt="NexaNotion shopping bag with fashion, beauty, gifts and Panjabi items"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 1400px"
        className="object-cover object-[75%_center] sm:object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,31,0.92),rgba(5,10,31,0.66),rgba(91,33,232,0.16),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,31,0.08),transparent_42%,rgba(5,10,31,0.12))]" />

      <div className="relative z-10 max-w-2xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/72">Your shopping bag</p>
        <h1 className="text-balance mt-3 max-w-xl text-3xl font-extrabold leading-[1.03] sm:mt-4 sm:text-5xl lg:text-6xl">Review your picks.</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/84 sm:mt-4 sm:text-lg sm:leading-7">
          Update quantities, remove items, and continue to checkout when everything looks right.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row">
          <Link href="/shop" className="motion-press inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 text-sm font-extrabold text-white shadow-[0_16px_38px_rgba(91,33,232,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(91,33,232,0.38)] sm:min-h-12">
            Continue Shopping <ArrowRight className="size-4" />
          </Link>
          {canCheckout ? (
            <Link href="/checkout" className="motion-press inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-extrabold text-brand-navy shadow-[0_16px_40px_rgba(255,255,255,0.18)] transition hover:-translate-y-0.5 hover:bg-brand-soft sm:min-h-12">
              Proceed to Checkout <ArrowRight className="size-4" />
            </Link>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-white/24 bg-white/10 px-6 text-sm font-extrabold text-white/55 sm:min-h-12"
            >
              Proceed to Checkout <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function CartPageClient() {
  const { items, itemCount, subtotal, hydrated, updateQuantity, removeItem, clearCart } = useCart();
  const delivery = items.length ? siteConfig.deliveryCharge : 0;
  const total = subtotal + delivery;

  if (!hydrated) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(360px,0.9fr)]">
        <div className="space-y-4">
          <div className="h-36 animate-pulse rounded-[1.75rem] bg-brand-soft" />
          <div className="h-36 animate-pulse rounded-[1.75rem] bg-brand-soft" />
        </div>
        <div className="h-80 animate-pulse rounded-[1.75rem] bg-brand-soft" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-brand-navy/8 bg-white px-6 py-14 text-center shadow-[0_22px_70px_rgba(5,10,31,0.06)] sm:px-10 sm:py-16">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand-lavender text-brand-purple">
          <ShoppingBag className="size-8" />
        </div>
        <h2 className="mx-auto mt-6 max-w-xl text-3xl font-extrabold leading-tight text-brand-navy sm:text-4xl">Your cart is empty.</h2>
        <p className="mx-auto mt-3 max-w-lg leading-7 text-brand-muted">
          Browse NexaNotion collections and add your favorite items.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/shop" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(91,33,232,0.24)] transition hover:-translate-y-0.5">
            Continue Shopping <ArrowRight className="size-4" />
          </Link>
          <Link href="/gift-packages" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-brand-blue/20 bg-white px-6 text-sm font-extrabold text-brand-navy transition hover:border-brand-purple/40 hover:bg-brand-lavender/40">
            Explore Gift Packages <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-0">
      <div className="mb-4 flex items-end justify-between gap-3 sm:mb-6">
        <div>
          <Link href="/shop" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(91,33,232,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(91,33,232,0.3)] sm:min-h-12 sm:px-6">
            <ArrowLeft className="size-4" /> Continue Shopping
          </Link>
          <p className="mt-3 text-sm font-semibold text-brand-muted">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your shopping bag
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-brand-navy/10 px-4 text-sm font-bold text-brand-muted transition hover:border-brand-purple/30 hover:bg-brand-lavender/40 hover:text-brand-purple sm:min-h-11 sm:px-5"
        >
          Clear cart
        </button>
      </div>

      <div className="grid gap-16 lg:grid-cols-[minmax(0,2fr)_minmax(360px,0.9fr)] lg:gap-7 xl:gap-9">
        <div className="stagger-children space-y-4">
          <h2 className="sr-only">Cart items</h2>
          {items.map(({ product, quantity }, index) => (
            <CartLineItem
              key={product.slug}
              product={product}
              quantity={quantity}
              priority={index === 0}
              onIncrease={() => updateQuantity(product.slug, quantity + 1)}
              onDecrease={() => updateQuantity(product.slug, quantity - 1)}
              onRemove={() => removeItem(product.slug)}
            />
          ))}
        </div>
        <OrderTotals subtotal={subtotal} delivery={delivery} total={total} />
      </div>
    </div>
  );
}

function CartLineItem({
  product,
  quantity,
  priority,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  product: Product;
  quantity: number;
  priority: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) {
  const unitPrice = product.salePrice ?? product.price;
  const lineTotal = unitPrice * quantity;
  const decreaseDisabled = quantity <= 1;
  const increaseDisabled = quantity >= 99;

  return (
    <article className="motion-card group rounded-[1.65rem] border border-brand-navy/8 bg-white p-4 shadow-[0_14px_40px_rgba(5,10,31,0.045)] hover:border-brand-purple/18 hover:shadow-[0_20px_56px_rgba(5,10,31,0.075)] sm:p-5 md:rounded-[1.75rem]">
      <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 md:grid-cols-[8.25rem_minmax(0,1fr)_minmax(13rem,auto)] md:items-center md:gap-5">
        <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden rounded-2xl bg-brand-soft">
          <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 104px, 132px" priority={priority} className="object-cover transition duration-500 group-hover:scale-105" />
        </Link>

        <div className="min-w-0 self-center">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-purple/70">{product.category}</p>
          <h2 className="mt-2 text-base font-extrabold leading-6 text-brand-navy sm:text-lg">
            <Link href={`/products/${product.slug}`} className="line-clamp-2 transition hover:text-brand-purple">
              {product.name}
            </Link>
          </h2>
          <p className="mt-2 text-sm font-semibold text-brand-muted">Unit price: Tk {formatPrice(unitPrice)}</p>
        </div>

        <div className="col-span-2 flex flex-wrap items-center justify-between gap-4 border-t border-brand-navy/8 pt-4 md:col-span-1 md:flex-col md:items-end md:border-t-0 md:pt-0">
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${product.name} from cart`}
            className="motion-press order-3 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-bold text-brand-muted transition hover:bg-brand-lavender hover:text-brand-purple md:order-none md:-mr-2"
          >
            <Trash2 className="size-4" />
            <span className="md:sr-only">Remove</span>
          </button>

          <div className="flex h-12 items-center rounded-full border border-brand-navy/10 bg-brand-soft p-1">
            <button
              type="button"
              aria-label={`Decrease quantity for ${product.name}`}
              onClick={onDecrease}
              disabled={decreaseDisabled}
              className="motion-press grid size-10 place-items-center rounded-full text-brand-muted transition hover:bg-white hover:text-brand-purple disabled:cursor-not-allowed disabled:opacity-35"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-10 text-center text-sm font-extrabold text-brand-navy" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              aria-label={`Increase quantity for ${product.name}`}
              onClick={onIncrease}
              disabled={increaseDisabled}
              className="motion-press grid size-10 place-items-center rounded-full text-brand-muted transition hover:bg-white hover:text-brand-purple disabled:cursor-not-allowed disabled:opacity-35"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-muted">Line total</p>
            <p className="mt-1 text-xl font-extrabold text-brand-navy">Tk {formatPrice(lineTotal)}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function OrderTotals({ subtotal, delivery, total }: { subtotal: number; delivery: number; total: number }) {
  const trustPoints = [
    { label: "Cash on Delivery available", icon: PackageCheck },
    { label: "Manual bKash/Nagad payment", icon: CreditCard },
    { label: "WhatsApp support", icon: MessageCircle },
  ];

  return (
    <aside className="soft-enter h-fit rounded-[1.75rem] bg-brand-navy p-6 text-white shadow-[0_22px_64px_rgba(5,10,31,0.18)] sm:p-7 lg:sticky lg:top-28">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/48">Secure checkout</p>
          <h2 className="mt-2 text-2xl font-extrabold">Order Summary</h2>
        </div>
        <div className="grid size-11 place-items-center rounded-2xl bg-white/10 text-white">
          <ShoppingBag className="size-5" />
        </div>
      </div>

      <dl className="mt-7 space-y-4 text-sm">
        <div className="flex justify-between gap-4 text-white/72">
          <dt>Subtotal</dt>
          <dd className="font-bold text-white">Tk {formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4 text-white/72">
          <dt>Delivery charge</dt>
          <dd className="font-bold text-white">Tk {formatPrice(delivery)}</dd>
        </div>
        <div className="flex items-end justify-between gap-4 border-t border-white/12 pt-5">
          <dt className="text-base font-bold text-white/82">Total</dt>
          <dd className="text-3xl font-extrabold tracking-normal text-white">Tk {formatPrice(total)}</dd>
        </div>
      </dl>

      <Link href="/checkout" className="motion-press mt-7 inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-extrabold text-brand-navy shadow-[0_16px_36px_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5 hover:bg-brand-lavender">
        Continue to Checkout <ArrowRight className="size-4" />
      </Link>
      <p className="mt-3 text-center text-xs leading-5 text-white/58">Delivery charge will be confirmed before processing.</p>

      <div className="mt-6 space-y-3 border-t border-white/12 pt-5">
        {trustPoints.map(({ label, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 text-sm font-semibold text-white/76">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-white">
              <Icon className="size-4" />
            </span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <a href={siteConfig.whatsappHref} className="motion-press mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/14 px-4 py-3 text-sm font-bold text-white/78 transition hover:border-white/28 hover:bg-white/8 hover:text-white">
        <CheckCircle2 className="size-4" /> Need help? Message us on WhatsApp
      </a>
    </aside>
  );
}
