import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { TrackOrderForm } from "./TrackOrderForm";

export const metadata = {
  title: "Track Order",
  description: "Check the status of your Lion Leather order.",
};

const WHATSAPP_URL = "https://wa.me/923000000000";

export default function TrackOrderPage() {
  return (
    <Section>
      <div className="mx-auto max-w-xl">
        <Eyebrow>Orders</Eyebrow>
        <Heading as="h1" className="mt-6">
          Track your order.
        </Heading>
        <p className="mt-12 text-body font-light text-taupe">
          Enter your order number and we’ll pick it up from there.
        </p>

        <TrackOrderForm />

        <p className="mt-12 border-t border-gold/30 pt-8 text-body font-light text-taupe">
          For real-time updates, contact us on WhatsApp at{" "}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="text-ink underline decoration-gold/50 underline-offset-4 transition-colors duration-500 ease-luxe hover:text-cognac"
          >
            +92 300 0000000 →
          </a>
        </p>
      </div>
    </Section>
  );
}
