import type { Metadata } from "next";
import { PolicyList, PolicyPage, PolicySection } from "@/components/policy-page";
import { siteConfig } from "@/config/site";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Returns & Refunds",
  description: "Learn how to request an eligible return, exchange or refund for a NexaNotion order.",
  path: "/returns-refunds",
  keywords: ["NexaNotion returns", "NexaNotion refund policy", "Bangladesh product exchange"],
  type: "article",
});

export default function ReturnsRefundsPage() {
  return (
    <PolicyPage
      title="Returns & Refunds"
      introduction="If there is a problem with your order, contact us promptly so we can review it fairly and guide you through the next steps."
    >
      <PolicySection title="Report a return or exchange within 3 days">
        <p>You must report an eligible return or exchange within 3 days of receiving the order. Before sending anything, contact NexaNotion through <a href={siteConfig.facebookHref} className="font-semibold text-brand-purple underline decoration-brand-purple/30 underline-offset-4 hover:decoration-brand-purple">Facebook Messenger</a> and wait for return instructions.</p>
        <p>Do not send a product without approval or to an address found elsewhere. We do not publish a physical return address on this page.</p>
      </PolicySection>

      <PolicySection title="Return condition">
        <p>To be considered for a return or exchange, the product must be unused, unwashed, undamaged and returned with its original packaging, tags, accessories and all other included items.</p>
        <p>We may refuse a return if inspection shows signs of use, washing, damage, alteration, misuse, or missing packaging, tags, accessories or included items. Any product-specific hygiene or safety restrictions will apply where relevant.</p>
      </PolicySection>

      <PolicySection title="Damaged, defective or incorrect products">
        <p>If the delivered product is damaged, defective or different from your confirmed order, send us your order reference and clear photos or video through Facebook Messenger within the 3-day reporting period.</p>
        <p>When the issue is confirmed, NexaNotion will cover the reasonable delivery cost for the approved return or replacement.</p>
      </PolicySection>

      <PolicySection title="Change of mind or wrong selection">
        <p>For an eligible return caused by a change of mind, a wrong selection or personal preference, you are responsible for the return delivery cost. Approval remains subject to the reporting deadline and return-condition requirements above.</p>
      </PolicySection>

      <PolicySection title="Inspection, exchange and refund">
        <PolicyList>
          <li>Refunds or exchanges are processed only after the returned product has been received and inspected.</li>
          <li>We will contact you after inspection to explain whether the return is approved and which available resolution applies.</li>
          <li>Original delivery charges are non-refundable unless the return resulted from NexaNotion sending a damaged, defective or incorrect product.</li>
          <li>Any approved refund timing and method will be communicated based on the order and available payment arrangements.</li>
        </PolicyList>
      </PolicySection>

      <PolicySection title="Order cancellation">
        <p>You may request cancellation before the order is dispatched. Once it has been dispatched, it cannot be cancelled and the normal return rules on this page apply.</p>
      </PolicySection>
    </PolicyPage>
  );
}
