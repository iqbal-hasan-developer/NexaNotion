import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container, Section } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Privacy Policy | NexaNotion", description: "NexaNotion privacy policy overview." };

export default function PrivacyPolicyPage() {
  return (
    <main>
      <PageHero title="Privacy policy." description="Your shopping information should be handled clearly and carefully. This page outlines the customer data needed for order support." />
      <Section className="bg-white">
        <Container>
          <div className="mx-auto max-w-3xl rounded-[1.5rem] border border-brand-navy/8 bg-brand-soft p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-brand-navy">Information we use</h2>
            <p className="mt-4 leading-8 text-brand-muted">For customer support and order handling, NexaNotion may use your name, phone number, delivery address, order details and support messages. Payment instructions for manual methods are confirmed directly with the customer.</p>
            <p className="mt-4 leading-8 text-brand-muted">For privacy questions, contact us at {siteConfig.email}.</p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
