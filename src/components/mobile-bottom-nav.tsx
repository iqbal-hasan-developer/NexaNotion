"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgePercent, Home, MapPin, ShoppingBag, Store } from "lucide-react";
import { CartCount } from "@/components/cart/cart-count";

const items = [{ label: "Home", href: "/", icon: Home }, { label: "Shop", href: "/shop", icon: Store }, { label: "Offers", href: "/offers", icon: BadgePercent }, { label: "Cart", href: "/cart", icon: ShoppingBag }, { label: "Track", href: "/track-order", icon: MapPin }];
export function MobileBottomNav() { const pathname = usePathname(); return <nav aria-label="Mobile navigation" className="soft-enter fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-brand-navy/10 bg-white/95 px-2 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_15px_50px_rgba(5,10,31,0.18)] backdrop-blur-xl md:hidden"><div className="grid grid-cols-5">{items.map(({ label, href, icon: Icon }) => { const active = href === "/" ? pathname === "/" : pathname.startsWith(href); return <Link key={label} href={href} aria-current={active ? "page" : undefined} className={`motion-press group relative flex min-h-[3.25rem] flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold transition ${active ? "bg-brand-lavender text-brand-purple" : "text-brand-navy/65 hover:bg-brand-soft hover:text-brand-purple"}`}><span className="relative transition-transform duration-200 group-hover:-translate-y-0.5"><Icon className="size-[19px]" strokeWidth={active ? 2.4 : 1.8} />{label === "Cart" ? <CartCount /> : null}</span><span>{label}</span></Link>; })}</div></nav>; }
