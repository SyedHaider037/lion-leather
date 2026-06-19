import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { FaqAccordion } from "./FaqAccordion";

export const metadata = {
  title: "FAQ",
  description:
    "Answers on ordering, delivery, returns, and payment at Lion Leather.",
};

export default function FaqPage() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <Eyebrow>Help</Eyebrow>
        <Heading as="h1" className="mt-6">
          Frequently asked.
        </Heading>
        <p className="mt-12 text-body font-light text-stone">
          Everything you might want to know before, during, and after your
          order.
        </p>

        <FaqAccordion />

        <Divider className="mt-16" />
      </div>
    </Section>
  );
}
