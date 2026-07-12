import type { Metadata } from "next";
import { PolicyList, PolicyPage, PolicySection } from "@/components/policy-page";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Terms & Conditions",
  description: "Terms that apply when browsing NexaNotion or placing an order for delivery in Bangladesh.",
  path: "/terms-conditions",
  keywords: ["NexaNotion terms", "online order terms Bangladesh", "Cash on Delivery terms"],
  type: "article",
});

export default function TermsConditionsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      introduction="These terms set clear, reasonable expectations for using the NexaNotion website and placing an order with us."
    >
      <PolicySection title="Acceptance and eligibility">
        <p>By using this website or placing an order, you agree to these Terms &amp; Conditions and the policies linked from the website. If you do not agree, please do not use the website or submit an order.</p>
        <p>You must be able to provide accurate order information and enter into a purchase under applicable rules. If you are under the age needed to do so independently, a parent or guardian should place or approve the order.</p>
      </PolicySection>

      <PolicySection title="Products and descriptions">
        <p>We aim to present product descriptions, sizes, images and other details accurately. Small differences may occur, and product colours or appearance may vary slightly because of lighting, photography and screen settings.</p>
        <p>Products are subject to availability. We may correct an honest description, image or listing error and will contact you if a correction materially affects an unfulfilled order.</p>
      </PolicySection>

      <PolicySection title="Pricing and availability">
        <p>Prices and offers shown on the website may change before an order is confirmed. Applicable delivery charges are shown in our Shipping &amp; Delivery Policy. We will not add unsupported charges.</p>
        <p>If stock is unavailable or a displayed price is clearly incorrect, we may decline or cancel the affected order and explain the issue using the contact details provided.</p>
      </PolicySection>

      <PolicySection title="Orders and confirmation">
        <p>Submitting an order is a request to purchase. An on-screen or automated acknowledgement means we received the request; it does not by itself guarantee acceptance, stock or dispatch. We may contact you to confirm your identity, phone number, address, products and delivery details.</p>
        <p>NexaNotion may reject or cancel an order for a legitimate reason, including unavailable stock, incorrect pricing, suspected fraud or misuse, incomplete information, or inability to confirm the customer. If payment has already been received for an order we cancel, we will arrange an appropriate refund.</p>
      </PolicySection>

      <PolicySection title="Cancellation">
        <p>You may request cancellation only before dispatch. Once an order has been dispatched, it cannot be cancelled and the Returns &amp; Refunds Policy applies.</p>
      </PolicySection>

      <PolicySection title="Payment and Cash on Delivery">
        <p>Cash on Delivery is available. Any other payment option shown at checkout is subject to the instructions and confirmation presented for that option. You are responsible for providing accurate payment references where requested and should not send payment to details that have not been confirmed through an official NexaNotion channel.</p>
      </PolicySection>

      <PolicySection title="Delivery, returns and refunds">
        <p>Delivery areas, charges, estimates and customer address responsibilities are described in our Shipping &amp; Delivery Policy. Delivery estimates are not guaranteed.</p>
        <p>Eligible returns, exchanges, refunds and return delivery costs are governed by our Returns &amp; Refunds Policy, including the requirement to contact NexaNotion through Facebook Messenger within 3 days of receiving the order and obtain instructions before returning anything.</p>
      </PolicySection>

      <PolicySection title="Intellectual property">
        <p>The NexaNotion name, branding, website design, original text, graphics and product photography are owned by or licensed to NexaNotion unless stated otherwise. You may browse and use the site for personal shopping, but you may not copy, republish, sell or commercially exploit protected material without permission.</p>
      </PolicySection>

      <PolicySection title="Prohibited use">
        <p>You must not:</p>
        <PolicyList>
          <li>use the website for unlawful, fraudulent or deceptive activity;</li>
          <li>submit false contact, delivery or order information;</li>
          <li>attempt to interfere with the website, its security or another user&apos;s access;</li>
          <li>introduce malicious code, scrape the site in a harmful way or misuse its content; or</li>
          <li>impersonate another person or misuse NexaNotion&apos;s name or channels.</li>
        </PolicyList>
      </PolicySection>

      <PolicySection title="Third-party services and links">
        <p>Courier, payment, social-media, analytics and other third-party services may support the website or an order. Their services may be governed by separate terms and policies. NexaNotion is not responsible for a third-party website or service beyond the parts we reasonably control, but we remain responsible for our own obligations to you.</p>
      </PolicySection>

      <PolicySection title="Reasonable disclaimers and liability">
        <p>We work to keep the website accurate and available, but it may occasionally contain errors or be interrupted for maintenance or circumstances outside our reasonable control. Nothing in these terms excludes a responsibility or customer protection that cannot lawfully be excluded.</p>
        <p>To the extent permitted by applicable rules, NexaNotion is not responsible for indirect or unforeseeable loss arising from website use or an order. Any responsibility will be assessed fairly in light of the order, the loss reasonably caused and the circumstances.</p>
      </PolicySection>

      <PolicySection title="Your responsibility for misuse">
        <p>You are responsible for losses reasonably caused by your unlawful misuse of the website, deliberate false information or material breach of these terms. This does not make you responsible for losses caused by NexaNotion or for matters outside your reasonable control.</p>
      </PolicySection>

      <PolicySection title="Changes, severability and governing jurisdiction">
        <p>We may update these terms when the website, services or business practices change. Updated terms apply from the date posted and will not unfairly rewrite an already confirmed order.</p>
        <p>If one part of these terms is found invalid or unenforceable, the remaining parts continue to apply as far as possible. These terms and orders with NexaNotion are governed by the applicable laws and jurisdiction of Bangladesh.</p>
      </PolicySection>
    </PolicyPage>
  );
}
