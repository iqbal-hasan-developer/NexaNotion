"use client";
import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { trackMetaEvent } from "@/lib/meta-pixel-client";
import type { Product } from "@/types";

export function AddToCartButton({ slug, product, quantity = 1, compact = false, className = "" }: { slug: string; product?: Product; quantity?: number; compact?: boolean; className?: string }) {
  const { addItem } = useCart(); const [added, setAdded] = useState(false);
  function handleAdd() {
    addItem(slug, quantity, product);
    trackMetaEvent("AddToCart", {
      content_ids: [slug],
      content_name: product?.name,
      content_type: "product",
      currency: "BDT",
      value: product ? (product.salePrice ?? product.price) * quantity : undefined,
      contents: [{ id: slug, quantity }],
      num_items: quantity,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }
  if (compact) return <button type="button" onClick={handleAdd} aria-label={added ? "Added to cart" : "Add to cart"} className={`motion-press inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-brand-purple/15 bg-white px-0 text-brand-navy shadow-[0_8px_22px_rgba(5,10,31,0.06)] transition hover:border-brand-purple/35 hover:bg-brand-lavender/70 hover:text-brand-purple sm:px-4 ${className}`}>{added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}<span className="hidden text-xs font-bold sm:inline">{added ? "Added" : "Add"}</span></button>;
  return <button type="button" onClick={handleAdd} className={`motion-press inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(91,33,232,0.22)] transition hover:-translate-y-0.5 ${className}`}>{added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}{added ? "Added to Cart" : "Add to Cart"}</button>;
}
