import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container, Section } from "@/components/ui/container";

export const metadata: Metadata = { title: "Terms & Conditions | NexaNotion", description: "NexaNotion terms and conditions overview." };

export default function TermsConditionsPage() {
  return (
    <main>
      <PageHero title="Terms & conditions." description="These customer-friendly terms help keep shopping expectations clear before online order processing is connected." />
      <Section className="bg-white">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Product availability", "Items, prices and offers can change before an order is confirmed."],
              ["Manual payments", "bKash and Nagad options are manual. Instructions are confirmed before payment is requested."],
              ["Order processing", "Delivery details, payment preference and final charge are confirmed before dispatch."],
            ].map(([title, copy]) => <InfoCard key={title} title={title} copy={copy} />)}
          </div>
        </Container>
      </Section>
    </main>
  );
}

function InfoCard({ title, copy }: { title: string; copy: string }) {
  return <article className="rounded-[1.5rem] border border-brand-navy/8 bg-brand-soft p-6"><h2 className="text-xl font-bold text-brand-navy">{title}</h2><p className="mt-3 leading-7 text-brand-muted">{copy}</p></article>;
}
