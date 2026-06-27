"use client";

import { useState } from "react";
import { MessageCircle, Minus, Plus } from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { siteConfig } from "@/config/site";
import type { Product } from "@/types";

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const message = encodeURIComponent(`Hi NexaNotion, I would like to order ${quantity} x ${product.name}.`);

  return (
    <div className="soft-enter mt-8 border-t border-brand-navy/8 pt-7">
      <p className="mb-3 text-sm font-semibold text-brand-navy">Quantity</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex h-12 w-fit items-center rounded-full border border-brand-navy/10 bg-white">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="motion-press grid size-11 place-items-center text-brand-muted hover:text-brand-purple"><Minus className="size-4" /></button>
          <span className="w-8 text-center text-sm font-bold">{quantity}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(99, value + 1))} className="motion-press grid size-11 place-items-center text-brand-muted hover:text-brand-purple"><Plus className="size-4" /></button>
        </div>
        <AddToCartButton slug={product.slug} product={product} quantity={quantity} className="w-full sm:flex-1" />
      </div>
      <a href={`${siteConfig.whatsappHref}?text=${message}`} className="motion-press mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-brand-blue/25 bg-white px-6 text-sm font-semibold text-brand-navy transition hover:bg-brand-lavender"><MessageCircle className="size-4 text-brand-purple" />Order on WhatsApp</a>
    </div>
  );
}
