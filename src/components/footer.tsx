import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { SocialLinks } from "@/components/social-links";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

const shopLinks = [["Shop", "/shop"], ["Gift Packages", "/gift-packages"], ["Offers", "/offers"], ["Track Order", "/track-order"], ["Contact", "/contact"]];
const policyLinks = [["Shipping & Delivery", "/shipping-delivery"], ["Returns & Refunds", "/returns-refunds"], ["Privacy Policy", "/privacy-policy"], ["Terms & Conditions", "/terms-conditions"]];

export function Footer() {
  return (
    <footer className="relative scroll-mt-24 overflow-hidden bg-brand-navy pb-32 pt-14 text-white md:pb-10 lg:pt-16">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-purple to-transparent" />
      <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-brand-purple/18 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-10 size-80 rounded-full bg-brand-blue/12 blur-3xl" />
      <Container className="relative">
        <div className="grid gap-10 border-b border-white/12 pb-10 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-[1.35fr_1fr_1fr_1.15fr] lg:gap-12">
          <div className="flex flex-col items-center sm:items-start">
            <Link href="/" className="motion-lift inline-flex rounded-2xl border border-white/10 bg-white/5 px-3 py-2 shadow-[0_16px_40px_rgba(5,10,31,0.24)] backdrop-blur-md" aria-label="NexaNotion home">
              <Image src="/images/NexaNotion-footer-logo-transparent.png" alt="NexaNotion" width={1125} height={620} className="h-[62px] w-auto drop-shadow-[0_8px_18px_rgba(91,33,232,0.25)]" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/68">{siteConfig.tagline}</p>
            <div className="mt-5">
              <SocialLinks />
            </div>
          </div>
          <FooterLinks title="Shop" links={shopLinks} />
          <FooterLinks title="Help" links={policyLinks} />
          <div className="flex flex-col items-center sm:items-start">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/45">Contact</p>
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-white/72 sm:justify-start">
              <MapPin className="size-4 text-brand-lavender" />
              {siteConfig.location}
            </p>
            <a href={`mailto:${siteConfig.email}`} className="motion-lift mt-3 inline-flex items-center gap-2 text-sm text-white/72 transition hover:text-white">
              <Mail className="size-4 text-brand-lavender" />
              {siteConfig.email}
            </a>
            <a href={siteConfig.whatsappHref} className="motion-lift mt-3 inline-flex items-center gap-2 text-sm text-white/72 transition hover:text-white">
              <MessageCircle className="size-4 text-brand-lavender" />
              {siteConfig.whatsappDisplay}
            </a>
            <p className="mt-4 max-w-xs text-xs leading-5 text-white/48">Cash on Delivery and manual bKash/Nagad options are available. Final delivery details are confirmed before processing.</p>
          </div>
        </div>
        <p className="pt-6 text-center text-xs text-white/45 sm:text-left">© 2026 NexaNotion. All rights reserved.</p>
      </Container>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/45">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="inline-flex text-sm font-medium text-white/72 transition hover:translate-x-0.5 hover:text-brand-lavender">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
