"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { CartCount } from "@/components/cart/cart-count";
import { Container } from "@/components/ui/container";

const links = [
  ["Home", "/"],
  ["Shop", "/shop"],
  ["Gift Packages", "/gift-packages"],
  ["Offers", "/offers"],
  ["Track Order", "/track-order"],
  ["Contact", "/contact"],
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-navy/6 bg-white/92 backdrop-blur-xl transition-shadow duration-300">
      <Container className="flex h-[72px] items-center justify-between gap-5 lg:h-20">
        <Link href="/" className="motion-lift flex shrink-0 items-center rounded-xl" aria-label="NexaNotion home">
          <Image src="/images/nexanotion-logo.png" alt="NexaNotion" width={1125} height={620} priority className="h-[46px] w-auto transition-transform duration-300 sm:h-[54px] lg:h-[58px]" />
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {links.map(([label, href]) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link key={label} href={href} aria-current={active ? "page" : undefined} className={`motion-press rounded-full px-3.5 py-2 text-sm font-semibold transition ${active ? "bg-brand-lavender text-brand-purple" : "text-brand-navy/72 hover:bg-brand-soft hover:text-brand-purple"}`}>
                {label}
              </Link>
            );
          })}
        </nav>
        <Link href="/cart" aria-label="View shopping cart" className="motion-press relative grid size-11 shrink-0 place-items-center rounded-full border border-brand-navy/10 text-brand-navy transition hover:border-brand-purple/40 hover:bg-brand-lavender/40 hover:text-brand-purple hover:shadow-[0_12px_28px_rgba(91,33,232,0.12)]">
          <ShoppingBag className="size-5" />
          <CartCount />
        </Link>
      </Container>
    </header>
  );
}
