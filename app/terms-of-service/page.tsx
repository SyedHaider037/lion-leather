import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Terms of Service",
  description: "The terms on which Lion Leather sells to you.",
};

const SECTIONS: { label: string; body: string }[] = [
  {
    label: "Pricing",
    body: "All prices are listed in Pakistani Rupees (PKR). Prices and availability may change without notice; the price shown at checkout is the price you pay.",
  },
  {
    label: "Orders",
    body: "Placing an order is an offer to purchase. We may decline or cancel an order — for example, if an item is unavailable — and will refund any payment in full.",
  },
  {
    label: "Delivery",
    body: "Estimated timeframes are given on our Shipping & Returns page. Risk in the goods passes to you on delivery.",
  },
  {
    label: "Returns",
    body: "Unworn pieces may be returned within fourteen days of delivery, in their original condition and packaging, as set out in Shipping & Returns.",
  },
  {
    label: "Product Description",
    body: "Leather is a natural material; grain, colour, and markings vary from piece to piece. These variations are a mark of genuine leather, not a defect.",
  },
  {
    label: "Liability",
    body: "Our liability for any order is limited to the value of that order. Nothing in these terms excludes liability that cannot be excluded under law.",
  },
  {
    label: "Governing Law",
    body: "These terms are governed by the laws of Pakistan.",
  },
];

export default function TermsOfServicePage() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <Eyebrow>Policy</Eyebrow>
        <Heading as="h1" className="mt-6">
          Terms of service.
        </Heading>
        <p className="mt-4 text-caption font-light text-taupe">
          Last updated June 2026.
        </p>

        <p className="mt-12 text-body font-light text-taupe">
          These terms set out the basis on which we sell to you. By placing an
          order, you agree to them.
        </p>

        <dl className="mt-14 border-t border-gold/30">
          {SECTIONS.map((section) => (
            <div
              key={section.label}
              className="grid gap-2 border-b border-gold/30 py-6 sm:grid-cols-[12rem_1fr] sm:gap-8"
            >
              <dt className="text-eyebrow uppercase text-ink">
                {section.label}
              </dt>
              <dd className="text-body font-light text-taupe">
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
