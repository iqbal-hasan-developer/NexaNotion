import type { ReactNode } from "react";
import { Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Container, Section } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

const lastUpdated = "July 12, 2026";

export function PolicyPage({ title, introduction, children }: { title: string; introduction: string; children: ReactNode }) {
  return (
    <main className="bg-[linear-gradient(180deg,#f8faff_0%,#ffffff_34%)]">
      <PageHero title={title} description={introduction}>
        <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 backdrop-blur-sm">
          Last updated: {lastUpdated}
        </p>
      </PageHero>
      <Section className="bg-transparent pt-8 sm:pt-10 lg:pt-12">
        <Container>
          <article className="mx-auto max-w-4xl overflow-hidden rounded-[1.5rem] border border-brand-navy/8 bg-white px-5 shadow-[0_20px_65px_rgba(5,10,31,.07)] sm:rounded-[2rem] sm:px-9 lg:px-12">
            {children}
            <section className="py-8 sm:py-10" aria-labelledby="policy-contact">
              <h2 id="policy-contact" className="text-2xl font-extrabold tracking-tight text-brand-navy">Contact us</h2>
              <p className="mt-3 max-w-3xl leading-7 text-brand-muted">
                If you have a question about this policy or an order, contact NexaNotion using the details below.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href={`tel:${siteConfig.whatsappDisplay}`} className="motion-press inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-soft px-4 text-sm font-bold text-brand-navy transition hover:bg-brand-lavender">
                  <Phone className="size-4 text-brand-purple" aria-hidden="true" />
                  {siteConfig.whatsappDisplay}
                </a>
                <a href={`mailto:${siteConfig.email}`} className="motion-press inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-soft px-4 text-sm font-bold text-brand-navy transition hover:bg-brand-lavender">
                  <Mail className="size-4 text-brand-purple" aria-hidden="true" />
                  {siteConfig.email}
                </a>
              </div>
            </section>
          </article>
        </Container>
      </Section>
    </main>
  );
}

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  const id = `policy-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

  return (
    <section className="border-b border-brand-navy/8 py-8 sm:py-10" aria-labelledby={id}>
      <h2 id={id} className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-[1.7rem]">{title}</h2>
      <div className="mt-4 space-y-4 leading-7 text-brand-muted">{children}</div>
    </section>
  );
}

export function PolicyList({ children }: { children: ReactNode }) {
  return <ul className="ml-5 list-disc space-y-2.5 marker:text-brand-purple">{children}</ul>;
}
