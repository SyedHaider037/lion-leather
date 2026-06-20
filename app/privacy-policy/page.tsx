import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Lion Leather collects, uses, and protects your personal information.",
};

const SECTIONS: { label: string; body: string }[] = [
  {
    label: "Information We Collect",
    body: "When you place an order or contact us, we collect your name, email, phone number, shipping address, and order details. We collect only what we need to serve you.",
  },
  {
    label: "Payments",
    body: "Payments are processed securely by Shopify. Your card details are never stored on, or seen by, Lion Leather.",
  },
  {
    label: "Cookies",
    body: "We use cookies to keep your cart, remember preferences, and understand how the store is used. You may disable cookies in your browser, though some features may not work as intended.",
  },
  {
    label: "How We Use Your Data",
    body: "To process and deliver orders, respond to your enquiries, and improve our products and service. We never sell your information.",
  },
  {
    label: "Sharing",
    body: "We share details only with the couriers and payment processor needed to fulfil your order — nothing more.",
  },
  {
    label: "Your Rights",
    body: "You may request access to, correction of, or deletion of your personal data at any time by writing to hello@example.com.",
  },
  {
    label: "Retention & Security",
    body: "We keep your information only as long as necessary and protect it with reasonable safeguards.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <Eyebrow>Policy</Eyebrow>
        <Heading as="h1" className="mt-6">
          Privacy policy.
        </Heading>
        <p className="mt-4 text-caption font-light text-stone">
          Last updated June 2026.
        </p>

        <p className="mt-12 text-body font-light text-stone">
          Your trust matters to us. This policy explains what we collect, why,
          and the control you have over it.
        </p>

        <dl className="mt-14 border-t border-gold/30">
          {SECTIONS.map((section) => (
            <div
              key={section.label}
              className="grid gap-2 border-b border-gold/30 py-6 sm:grid-cols-[12rem_1fr] sm:gap-8"
            >
              <dt className="text-eyebrow uppercase text-cream">
                {section.label}
              </dt>
              <dd className="text-body font-light text-stone">
                {section.body}
              </dd>
            </div>
          ))}
        </dl>

        <Divider className="mt-16" />
      </div>
    </Section>
  );
}
