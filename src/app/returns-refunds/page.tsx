import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container, Section } from "@/components/ui/container";

export const metadata: Metadata = { title: "Returns & Refunds | NexaNotion", description: "NexaNotion returns and refunds information." };

export default function ReturnsRefundsPage() {
  return (
    <main>
      <PageHero title="Returns & refunds." description="We keep support simple and human. Please contact us quickly if an item arrives damaged, incorrect or different from what was confirmed." />
      <Section className="bg-white">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Check on arrival", "Review your parcel when it arrives and contact support as soon as possible if anything looks wrong."],
              ["Keep packaging", "Please keep the product, invoice and original packaging while the support team reviews your request."],
              ["Resolution", "Eligible return, exchange or refund options are confirmed after reviewing the order details."],
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
