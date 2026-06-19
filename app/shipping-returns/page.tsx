import Link from "next/link";

import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Shipping & Returns",
  description: "Delivery and returns for Lion Leather orders.",
};

const SECTIONS: { label: string; body: React.ReactNode }[] = [
  {
    label: "Delivery",
    body: "Orders are prepared and dispatched from Lahore within two working days. Within Pakistan, delivery typically arrives in three to five working days. International orders are sent by tracked courier and usually arrive within seven to fourteen working days.",
  },
  {
    label: "Tracking",
    body: "Once your order is on its way, we send a confirmation with tracking details so you can follow each step of its journey to you.",
  },
  {
    label: "Returns",
    body: "If a piece is not quite right, it may be returned within fourteen days of delivery — unworn, in its original condition and packaging. Once received, we process your refund to the original payment method.",
  },
  {
    label: "Exchanges",
    body: "To exchange for a different size or style, return your original piece and place a new order, or write to us and we will arrange it with you directly.",
  },
];

export default function ShippingReturnsPage() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <Eyebrow>Policy</Eyebrow>
        <Heading as="h1" className="mt-6">
          Shipping &amp; returns.
        </Heading>

        <p className="mt-12 text-body font-light text-stone">
          Every order is wrapped by hand and sent with care. Should anything
          need attention once it reaches you, we are here to make it right.
        </p>

        <dl className="mt-14 border-t border-gold/30">
          {SECTIONS.map((section) => (
            <div
              key={section.label}
              className="grid gap-2 border-b border-gold/30 py-6 sm:grid-cols-[10rem_1fr] sm:gap-8"
            >
              <dt className="text-eyebrow uppercase text-ink">
                {section.label}
              </dt>
              <dd className="text-body font-light text-stone">
                {section.body}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 text-body font-light text-stone">
          Questions about an order?{" "}
          <Link
            href="/contact"
            className="text-ink underline decoration-gold/50 underline-offset-4 transition-colors duration-500 ease-luxe hover:text-tan"
          >
            Write to us
          </Link>
          .
        </p>

        <Divider className="mt-16" />
      </div>
    </Section>
  );
}
