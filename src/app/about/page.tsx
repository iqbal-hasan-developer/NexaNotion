import type { Metadata } from "next";
import { Gift, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "About",
  description: "Learn about NexaNotion, a Bangladesh-first fashion, beauty and gift shopping experience.",
  path: "/about",
  keywords: ["about NexaNotion", "Bangladesh fashion store"],
});

const values = [
  [Sparkles, "Style with purpose", "Useful, beautiful products selected for everyday life."],
  [Gift, "Gifting made easier", "Thoughtful presentation without the last-minute stress."],
  [ShieldCheck, "Trust in every order", "Clear communication, careful packing and friendly support."],
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        title="A thoughtful notion, made real."
        description="NexaNotion began with a simple idea: style, beauty and gifting should feel inspiring - not complicated."
      />
      <Section className="bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading title="Why NexaNotion exists" />
              <p className="leading-8 text-brand-muted">
                We bring together fashionable bags, everyday beauty, delicate accessories and gift-ready packages in one considered collection. Our goal is
                to help people find something lovely for themselves - or make someone else feel remembered.
              </p>
              <p className="mt-4 leading-8 text-brand-muted">
                We are building a modern Bangladesh-first shopping experience grounded in approachable pricing, beautiful presentation and human support.
              </p>
            </div>
            <div className="rounded-[2rem] bg-brand-soft p-7 sm:p-10">
              <HeartHandshake className="size-9 text-brand-purple" />
              <h2 className="mt-6 text-3xl font-bold">Our mission</h2>
              <p className="mt-4 leading-7 text-brand-muted">Make thoughtful shopping feel calm, trustworthy and genuinely enjoyable - one well-chosen item at a time.</p>
            </div>
          </div>
        </Container>
      </Section>
      <Section className="bg-brand-soft">
        <Container>
          <SectionHeading title="What we value" align="center" />
          <div className="grid gap-4 md:grid-cols-3">
            {values.map(([Icon, title, copy]) => {
              const I = Icon as typeof Sparkles;
              return (
                <div key={title as string} className="rounded-[1.5rem] bg-white p-7 shadow-[0_14px_40px_rgba(5,10,31,.05)]">
                  <I className="size-6 text-brand-purple" />
                  <h3 className="mt-5 text-xl font-bold">{title as string}</h3>
                  <p className="mt-2 leading-7 text-brand-muted">{copy as string}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Button href="/shop">Explore the shop</Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
