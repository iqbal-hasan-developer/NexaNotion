import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { TrackingForm } from "@/components/tracking/tracking-form";
import { Container } from "@/components/ui/container";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Track Order",
  description: "Track your NexaNotion order status using your order number and phone number.",
  path: "/track-order",
  image: "/images/track-banner.webp",
  noIndex: true,
});
export default function TrackOrderPage() {
  return (
    <main className="bg-[linear-gradient(180deg,#f8faff_0%,#ffffff_42%,#ffffff_100%)]">
      <section className="overflow-hidden pt-6 sm:pt-8 lg:pt-10">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-7 lg:px-10">
          <div className="soft-enter relative isolate min-h-[360px] overflow-hidden rounded-[2rem] bg-brand-navy shadow-[0_28px_90px_rgba(37,99,235,0.16)] sm:min-h-[340px] lg:min-h-[370px]">
            <Image
              src="/images/track-banner.webp"
              alt="NexaNotion order tracking with delivery package and phone"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1400px"
              className="object-cover object-[63%_center] sm:object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,31,0.9),rgba(5,10,31,0.62),rgba(91,33,232,0.14),transparent)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,31,0.08),transparent_46%,rgba(5,10,31,0.12))]" />

            <div className="relative z-10 flex min-h-[360px] items-center px-6 py-8 text-white sm:min-h-[340px] sm:px-10 sm:py-10 lg:min-h-[370px] lg:px-14">
              <div className="reveal-up max-w-2xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/72">Track Your Order</p>
                <h1 className="text-balance mt-3 max-w-xl text-3xl font-extrabold leading-[1.04] sm:mt-4 sm:text-5xl lg:text-6xl">Know where your order is.</h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-white/82 sm:mt-5 sm:text-lg">
                  Enter your order number and phone number to check the latest status of your NexaNotion delivery.
                </p>
                <div className="mt-5 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center sm:mt-7">
                  <Link
                    href="#track-order-form"
                    className="motion-press inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-extrabold text-brand-navy shadow-[0_16px_40px_rgba(255,255,255,0.2)] transition hover:-translate-y-0.5 hover:bg-brand-soft"
                  >
                    Track Order
                  </Link>
                  <Link
                    href="/contact"
                    className="motion-press inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 text-sm font-extrabold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/18"
                  >
                    Need help? Contact us
                  </Link>
                </div>
                <p className="mt-4 text-sm font-semibold leading-5 text-white/76 sm:mt-5">Safe Shopping / Easy Tracking / Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="track-order-form" className="pb-14 pt-8 sm:pt-10 lg:pb-20 lg:pt-11">
        <Container className="max-w-[1400px]">
          <Suspense fallback={<div className="mx-auto h-72 max-w-4xl animate-pulse rounded-[2rem] bg-brand-soft" />}>
            <TrackingForm />
          </Suspense>
        </Container>
      </section>
    </main>
  );
}
