"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { productBySlug } from "@/data/store";
import type { CartItem, Product } from "@/types";

const STORAGE_KEY = "nexanotion-cart-v1";
type DetailedCartItem = CartItem & { product: Product };
type CartContextValue = { items: DetailedCartItem[]; itemCount: number; subtotal: number; hydrated: boolean; addItem: (slug: string, quantity?: number, product?: Product) => void; updateQuantity: (slug: string, quantity: number) => void; removeItem: (slug: string) => void; clearCart: () => void };
const CartContext = createContext<CartContextValue | null>(null);

function isProductSnapshot(value: unknown): value is Product {
  const item = value && typeof value === "object" ? (value as Partial<Product>) : {};
  return typeof item.slug === "string" && typeof item.name === "string" && typeof item.price === "number" && typeof item.image === "string";
}

function isStoredCart(value: unknown): value is CartItem[] {
  return Array.isArray(value) && value.every((item) => typeof item?.slug === "string" && Number.isInteger(item?.quantity) && item.quantity > 0 && (productBySlug.has(item.slug) || isProductSnapshot(item.product)));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    queueMicrotask(() => {
      try { const stored = localStorage.getItem(STORAGE_KEY); const parsed: unknown = stored ? JSON.parse(stored) : []; if (isStoredCart(parsed)) setCart(parsed); }
      catch { localStorage.removeItem(STORAGE_KEY); }
      finally { setHydrated(true); }
    });
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }, [cart, hydrated]);
  const addItem = useCallback((slug: string, quantity = 1, product?: Product) => {
    const snapshot = product ?? productBySlug.get(slug);
    if (!snapshot || quantity < 1) return;
    setCart((current) => { const existing = current.find((item) => item.slug === slug); return existing ? current.map((item) => item.slug === slug ? { ...item, product: snapshot, quantity: Math.min(99, item.quantity + quantity) } : item) : [...current, { slug, product: snapshot, quantity: Math.min(99, quantity) }]; });
  }, []);
  const updateQuantity = useCallback((slug: string, quantity: number) => { if (quantity > 0) setCart((current) => current.map((item) => item.slug === slug ? { ...item, quantity: Math.min(99, quantity) } : item)); }, []);
  const removeItem = useCallback((slug: string) => setCart((current) => current.filter((item) => item.slug !== slug)), []);
  const clearCart = useCallback(() => setCart([]), []);
  const value = useMemo<CartContextValue>(() => {
    const items = cart.flatMap((item) => { const product = productBySlug.get(item.slug) ?? item.product; return product ? [{ ...item, product }] : []; });
    return { items, itemCount: items.reduce((sum, item) => sum + item.quantity, 0), subtotal: items.reduce((sum, item) => sum + (item.product.salePrice ?? item.product.price) * item.quantity, 0), hydrated, addItem, updateQuantity, removeItem, clearCart };
  }, [cart, hydrated, addItem, updateQuantity, removeItem, clearCart]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { const context = useContext(CartContext); if (!context) throw new Error("useCart must be used within CartProvider"); return context; }
