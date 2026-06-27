import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Container } from "@/components/ui/container";
import { createSeoMetadata } from "@/lib/seo";

const checkoutBannerImage = "/images/checkout-banner.webp";

export const metadata: Metadata = createSeoMetadata({
  title: "Checkout",
  description: "Complete your NexaNotion order with Cash on Delivery, manual bKash or manual Nagad payment options.",
  path: "/checkout",
  image: checkoutBannerImage,
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <main className="bg-[linear-gradient(180deg,#f8faff_0%,#ffffff_42%,#ffffff_100%)]">
      <section className="overflow-hidden pt-6 sm:pt-8 lg:pt-10">
        <Container className="max-w-[1400px]">
          <div className="soft-enter relative isolate flex min-h-[320px] items-center overflow-hidden rounded-[1.75rem] bg-brand-navy px-5 py-7 text-white shadow-[0_28px_90px_rgba(37,99,235,0.18)] sm:min-h-[340px] sm:rounded-[2rem] sm:px-10 sm:py-9 lg:min-h-[350px] lg:px-14">
            <Image
              src={checkoutBannerImage}
              alt="NexaNotion secure checkout with package, fashion, beauty and payment confirmation"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1400px"
              className="object-cover object-[76%_center] sm:object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,31,0.92),rgba(5,10,31,0.66),rgba(91,33,232,0.16),transparent)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,31,0.08),transparent_42%,rgba(5,10,31,0.12))]" />

            <div className="reveal-up relative z-10 max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/72">Secure checkout</p>
              <h1 className="text-balance mt-3 max-w-xl text-3xl font-extrabold leading-[1.03] sm:mt-4 sm:text-5xl lg:text-6xl">Checkout, made simple.</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/84 sm:mt-4 sm:text-lg sm:leading-7">
                Confirm your delivery details, choose your payment preference, and place your NexaNotion order with confidence.
              </p>

              <div className="mt-4 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:gap-3">
                <Link href="/cart" className="motion-press inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 text-sm font-extrabold text-white shadow-[0_16px_38px_rgba(91,33,232,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(91,33,232,0.38)] sm:min-h-12">
                  <ArrowLeft className="size-4" /> Review Cart
                </Link>
                <Link href="#checkout-form" className="motion-press inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-extrabold text-brand-navy shadow-[0_16px_40px_rgba(255,255,255,0.18)] transition hover:-translate-y-0.5 hover:bg-brand-soft sm:min-h-12">
                  Complete Details <ArrowDown className="size-4" />
                </Link>
              </div>

              <div className="mt-5 hidden flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/72 sm:flex">
                <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1.5">COD Available</span>
                <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1.5">Manual bKash/Nagad</span>
                <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1.5">WhatsApp Support</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="checkout-form" className="relative z-10 scroll-mt-16 pb-14 pt-5 sm:pt-10 lg:pb-20 lg:pt-12">
        <Container className="max-w-[1400px]">
          <CheckoutForm />
        </Container>
      </section>
    </main>
  );
}
