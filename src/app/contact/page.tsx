import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock3, Mail, MapPin, MessageCircle, Phone, ShieldCheck, Truck } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { SocialLinks } from "@/components/social-links";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Contact",
  description: "Contact NexaNotion for product help, gift recommendations, delivery support and order questions in Bangladesh.",
  path: "/contact",
  image: "/images/contact-banner.webp",
  keywords: ["NexaNotion contact", "Bangladesh order support", "gift help Bangladesh"],
});

const contacts = [
  [MessageCircle, "WhatsApp", siteConfig.whatsappDisplay, siteConfig.whatsappHref],
  [Phone, "Phone", siteConfig.whatsappDisplay, `tel:${siteConfig.whatsappDisplay}`],
  [Mail, "Email", siteConfig.email, `mailto:${siteConfig.email}`],
  [MapPin, "Location", siteConfig.location, "#delivery-support"],
];

export default function ContactPage() {
  return (
    <main className="bg-[linear-gradient(180deg,#f8faff_0%,#ffffff_42%,#ffffff_100%)]">
      <section className="overflow-hidden pt-6 sm:pt-8 lg:pt-10">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-7 lg:px-10">
          <div className="soft-enter relative isolate min-h-[380px] overflow-hidden rounded-[2rem] bg-brand-navy shadow-[0_28px_90px_rgba(37,99,235,0.16)] sm:min-h-[340px] lg:min-h-[370px]">
            <Image
              src="/images/contact-banner.webp"
              alt="NexaNotion customer support chat for products, gifts and delivery"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1400px"
              className="object-cover object-[63%_center] sm:object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,31,0.9),rgba(5,10,31,0.62),rgba(91,33,232,0.14),transparent)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,31,0.08),transparent_46%,rgba(5,10,31,0.12))]" />

            <div className="relative z-10 flex min-h-[380px] items-center px-6 py-8 text-white sm:min-h-[340px] sm:px-10 sm:py-10 lg:min-h-[370px] lg:px-14">
              <div className="reveal-up max-w-2xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/72">Contact NexaNotion</p>
                <h1 className="text-balance mt-3 max-w-xl text-4xl font-extrabold leading-[1.03] sm:mt-4 sm:text-5xl lg:text-6xl">We&apos;re here to help.</h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-white/82 sm:mt-5 sm:text-lg">
                  Have a question about products, gifts, delivery or your order? Reach out to NexaNotion anytime.
                </p>
                <div className="mt-5 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center sm:mt-7">
                  <Link
                    href={siteConfig.whatsappHref}
                    className="motion-press inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-extrabold text-brand-navy shadow-[0_16px_40px_rgba(255,255,255,0.2)] transition hover:-translate-y-0.5 hover:bg-brand-soft"
                  >
                    <MessageCircle className="size-4" />Message on WhatsApp
                  </Link>
                  <Link
                    href="#contact-form"
                    className="motion-press inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 text-sm font-extrabold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/18"
                  >
                    Send a Message
                  </Link>
                </div>
                <p className="mt-4 text-sm font-semibold leading-5 text-white/76 sm:mt-5">WhatsApp Order / Product Help / Delivery Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact-form" className="pb-14 pt-8 sm:pt-10 lg:pb-20 lg:pt-11">
        <Container className="max-w-[1400px]">
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
            <div className="space-y-5">
              <a href={siteConfig.whatsappHref} className="motion-card flex items-center gap-4 rounded-[1.5rem] bg-brand-gradient p-5 text-white shadow-[0_18px_50px_rgba(91,33,232,0.18)]">
                <span className="grid size-12 place-items-center rounded-2xl bg-white/16"><MessageCircle className="size-5" /></span>
                <span><span className="block text-base font-bold">Chat on WhatsApp</span><span className="mt-1 block text-sm text-white/75">For quick orders and delivery questions, message us on WhatsApp.</span></span>
              </a>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {contacts.map(([Icon, title, value, href]) => {
                  const I = Icon as typeof Phone;
                  return <a key={title as string} href={href as string} className="motion-card flex items-center gap-4 rounded-[1.25rem] border border-brand-navy/8 p-5 transition hover:border-brand-purple/30 hover:bg-brand-soft"><span className="grid size-11 place-items-center rounded-2xl bg-brand-lavender text-brand-purple"><I className="size-5" /></span><span><span className="block text-sm font-semibold text-brand-navy">{title as string}</span><span className="mt-1 block text-sm text-brand-muted">{value as string}</span></span></a>;
                })}
              </div>
              <div className="soft-enter rounded-[1.5rem] border border-brand-navy/8 bg-white p-6 text-center shadow-[0_16px_48px_rgba(5,10,31,0.055)] lg:text-left">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-purple">Follow NexaNotion</p>
                <h2 className="mt-3 text-2xl font-extrabold text-brand-navy">Stay connected.</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted lg:mx-0">Stay connected for new arrivals, gift ideas and latest offers.</p>
                <div className="mt-5">
                  <SocialLinks variant="contact" />
                </div>
              </div>
              <div id="delivery-support" className="grid gap-3">
                <InfoCard icon={Truck} title="Delivery support" copy={`Serving customers across ${siteConfig.location}. Delivery timing and charge are confirmed before order processing.`} />
                <InfoCard icon={Clock3} title="Support hours" copy={siteConfig.supportHours} />
                <InfoCard icon={ShieldCheck} title="Order help" copy="Need size, color or gift advice? Share your budget and occasion, and we will help you choose." />
              </div>
            </div>
            <div className="soft-enter rounded-[2rem] border border-brand-navy/8 bg-white p-5 shadow-[0_22px_70px_rgba(5,10,31,.09)] ring-1 ring-brand-navy/5 sm:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-purple">Support Message</p>
              <h2 className="mt-3 text-3xl font-bold">Send a message</h2>
              <p className="mb-7 mt-2 leading-7 text-brand-muted">Share your product, gift or order question and we&apos;ll get back to you. We usually reply as soon as possible.</p>
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function InfoCard({ icon: Icon, title, copy }: { icon: typeof Truck; title: string; copy: string }) {
  return <div className="motion-card rounded-[1.25rem] bg-brand-navy p-5 text-white"><Icon className="size-5 text-brand-lavender" /><h2 className="mt-4 font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-white/68">{copy}</p></div>;
}
