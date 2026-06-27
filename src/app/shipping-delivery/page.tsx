import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container, Section } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Shipping & Delivery | NexaNotion", description: "NexaNotion shipping and delivery information for Bangladesh." };

export default function ShippingDeliveryPage() {
  return (
    <main>
      <PageHero title="Shipping & delivery." description={`We serve customers across ${siteConfig.serviceArea}. Delivery timing and charge are confirmed before an order is processed.`} />
      <Section className="bg-white">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Delivery charge", `Current standard delivery estimate: Tk ${siteConfig.deliveryCharge}. Final charge is confirmed before processing.`],
              ["Order confirmation", "We confirm product availability, address, payment preference and delivery details before dispatch."],
              ["Support", `Need help? Contact us on WhatsApp or email ${siteConfig.email}.`],
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
