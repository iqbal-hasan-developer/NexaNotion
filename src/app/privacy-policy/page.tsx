import type { Metadata } from "next";
import { PolicyList, PolicyPage, PolicySection } from "@/components/policy-page";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Privacy Policy",
  description: "How NexaNotion collects, uses, shares and protects customer and website information.",
  path: "/privacy-policy",
  keywords: ["NexaNotion privacy", "customer data policy", "Bangladesh online shop privacy"],
  type: "article",
});

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      introduction="This policy explains in plain language what information NexaNotion may handle when you browse, contact us or place an order."
    >
      <PolicySection title="Information we may collect">
        <PolicyList>
          <li><strong className="text-brand-navy">Contact and delivery information:</strong> name, phone number, email address and delivery address.</li>
          <li><strong className="text-brand-navy">Order information:</strong> products, quantities, prices, delivery preferences, order status and related support details.</li>
          <li><strong className="text-brand-navy">Communications:</strong> messages, questions, feedback and information you send through our website or social and communication channels.</li>
          <li><strong className="text-brand-navy">Technical and usage information:</strong> device and browser information, IP address, cookie data, pages viewed, interactions and website performance information.</li>
        </PolicyList>
        <p>The website does not directly process payment cards, so we do not claim to collect or store your full payment-card details. If a separate payment provider is offered, that provider handles information under its own terms and privacy practices.</p>
      </PolicySection>

      <PolicySection title="How we use information">
        <p>We may use information to:</p>
        <PolicyList>
          <li>receive, confirm, process, deliver and support orders;</li>
          <li>respond to questions, return requests and customer-service messages;</li>
          <li>verify information, protect the website and help prevent fraud or misuse;</li>
          <li>operate, troubleshoot and improve the website and customer experience;</li>
          <li>measure website and campaign performance; and</li>
          <li>send or show marketing where permitted and manage advertising audiences or campaign measurement.</li>
        </PolicyList>
      </PolicySection>

      <PolicySection title="Cookies and similar technologies">
        <p>Cookies, pixels and similar technologies may remember information or record how the website is used. They may support essential website functions, analytics and performance measurement, and advertising.</p>
        <p>The site uses or may use Meta Pixel and related Meta technologies, as well as Google Analytics when configured. These services may receive information about your browser, device, IP address and website interactions according to their own privacy terms. Browser settings and the controls offered by those providers may let you limit some cookie or advertising activity, although disabling essential technologies can affect site functions.</p>
      </PolicySection>

      <PolicySection title="How information may be shared">
        <p>We do not sell customer order information as a product. We may share only the information reasonably needed with service providers that help operate the business, such as hosting, database, courier, analytics, advertising and communication providers.</p>
        <p>Information may also be shared when reasonably necessary to protect customers, NexaNotion or others; investigate fraud or misuse; comply with a valid legal requirement; or support a business reorganisation. Service providers may process information under their own applicable terms and responsibilities.</p>
      </PolicySection>

      <PolicySection title="Retention and security">
        <p>We keep information only for as long as reasonably needed for the purposes described here, including order support, fraud prevention, record keeping, dispute handling and applicable business or legal requirements. Different records may be kept for different periods.</p>
        <p>We use reasonable administrative and technical measures intended to protect information. No website, storage system or transmission method is completely secure, so absolute security cannot be guaranteed.</p>
      </PolicySection>

      <PolicySection title="Your choices">
        <p>You may ask us to review or correct the contact and order information you provided, stop direct marketing messages, or consider a request about your information. We will assess requests using the information available to us and any applicable requirements. You can also manage cookies through your browser and available provider controls.</p>
      </PolicySection>

      <PolicySection title="Children's privacy">
        <p>Our website is intended for general shopping and is not directed to young children. If you believe a child has provided personal information without appropriate involvement from a parent or guardian, contact us so we can review the situation.</p>
      </PolicySection>

      <PolicySection title="Third-party links">
        <p>The website may link to courier, payment, social-media or other third-party services. NexaNotion does not control their websites or privacy practices. Review the relevant third party&apos;s privacy information before providing data to them.</p>
      </PolicySection>

      <PolicySection title="Changes to this policy">
        <p>We may update this policy when our practices, services or requirements change. The revised version will be posted on this page with an updated date. Material changes may also be highlighted through the website or another reasonable channel.</p>
      </PolicySection>
    </PolicyPage>
  );
}
