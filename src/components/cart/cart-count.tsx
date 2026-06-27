"use client";
import { useCart } from "@/components/cart/cart-provider";
export function CartCount() { const { itemCount, hydrated } = useCart(); if (!hydrated || itemCount === 0) return null; return <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-brand-purple px-1 text-[10px] font-bold leading-5 text-white">{itemCount > 99 ? "99+" : itemCount}</span>; }
