import type { Metadata } from "next";
import { CartPageBanner, CartPageClient } from "@/components/cart/cart-page-client";
import { Container } from "@/components/ui/container";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Cart",
  description: "Review your NexaNotion shopping cart before checkout.",
  path: "/cart",
  image: "/images/cart-banner.webp",
  noIndex: true,
});

export default function CartPage() {
  return (
    <main className="bg-[linear-gradient(180deg,#f8faff_0%,#ffffff_42%,#ffffff_100%)]">
      <section className="overflow-hidden pt-6 sm:pt-8 lg:pt-10">
        <Container className="max-w-[1400px]">
          <CartPageBanner />
        </Container>
      </section>

      <section className="pb-14 pt-6 sm:pt-10 lg:pb-20 lg:pt-12">
        <Container className="max-w-[1400px]">
          <CartPageClient />
        </Container>
      </section>
    </main>
  );
}
