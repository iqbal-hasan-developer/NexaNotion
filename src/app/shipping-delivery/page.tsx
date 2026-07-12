import type { Metadata } from "next";
import { PolicyList, PolicyPage, PolicySection } from "@/components/policy-page";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Shipping & Delivery",
  description: "Delivery charges, estimated delivery times and shipping information for NexaNotion orders across Bangladesh.",
  path: "/shipping-delivery",
  keywords: ["NexaNotion delivery", "Dhaka delivery charge", "Bangladesh shipping policy"],
  type: "article",
});

export default function ShippingDeliveryPage() {
  return (
    <PolicyPage
      title="Shipping & Delivery"
      introduction="Clear delivery charges and practical estimates for NexaNotion orders across Bangladesh."
    >
      <PolicySection title="Delivery areas, charges and estimates">
        <div className="overflow-x-auto rounded-2xl border border-brand-navy/8">
          <table className="w-full min-w-[32rem] text-left text-sm sm:text-base">
            <thead className="bg-brand-soft text-brand-navy">
              <tr><th className="px-4 py-3 font-bold sm:px-5">Delivery area</th><th className="px-4 py-3 font-bold sm:px-5">Charge</th><th className="px-4 py-3 font-bold sm:px-5">Estimated time</th></tr>
            </thead>
            <tbody>
              <tr className="border-t border-brand-navy/8"><td className="px-4 py-3 sm:px-5">Inside Dhaka</td><td className="px-4 py-3 font-semibold text-brand-navy sm:px-5">৳70</td><td className="px-4 py-3 sm:px-5">1–3 business days</td></tr>
              <tr className="border-t border-brand-navy/8"><td className="px-4 py-3 sm:px-5">Outside Dhaka</td><td className="px-4 py-3 font-semibold text-brand-navy sm:px-5">৳120</td><td className="px-4 py-3 sm:px-5">2–5 business days</td></tr>
            </tbody>
          </table>
        </div>
        <p>These are the standard delivery charges. NexaNotion will not add an unsupported or unconfirmed exceptional-area charge.</p>
      </PolicySection>

      <PolicySection title="Delivery estimates">
        <p>Delivery times begin after an order has been confirmed and are estimates, not guarantees. Delivery may take longer because of courier delays, public holidays, severe weather, incorrect or incomplete address details, or other circumstances outside NexaNotion&apos;s reasonable control.</p>
      </PolicySection>

      <PolicySection title="Order confirmation and dispatch">
        <p>We may contact you to confirm product availability, your phone number, delivery address and order details before dispatch. Cash on Delivery is available. An order may be cancelled only before it has been dispatched; after dispatch, the Returns &amp; Refunds Policy applies.</p>
      </PolicySection>

      <PolicySection title="Your delivery details">
        <p>You are responsible for providing a complete and accurate delivery address and a phone number where you can be reached. Please check apartment, road, area, district and other relevant details before placing your order.</p>
        <p>If a courier cannot complete delivery because the contact or address information is incorrect or incomplete, contact us so we can review the available next step.</p>
      </PolicySection>

      <PolicySection title="Receiving your order">
        <PolicyList>
          <li>Keep your phone available so the courier can contact you.</li>
          <li>Check that the parcel is intended for you before accepting it.</li>
          <li>If the delivered product is damaged, defective or different from the confirmed order, report it within 3 days and follow our Returns &amp; Refunds Policy.</li>
        </PolicyList>
      </PolicySection>
    </PolicyPage>
  );
}
