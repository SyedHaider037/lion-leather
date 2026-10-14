import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Contact",
  description:
    "Write to Lion Leather with a question about an order, a size or a piece.",
};

export default function ContactPage() {
  return (
    <Section>
      <div className="mx-auto max-w-xl">
        <Eyebrow>Contact</Eyebrow>
        <Heading as="h1" className="mt-6">
          We’re here to help.
        </Heading>
        <p className="mt-6 text-body font-light text-taupe">
          For sizing, availability, or care, send a note. We’ll respond with
          calm clarity.
        </p>

        <ContactForm />
      </div>
    </Section>
  );
}
