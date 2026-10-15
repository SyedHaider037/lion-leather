import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Leather Care",
  description:
    "How to care for your Lion Leather footwear and goods so they age with grace.",
};

const NOTES: { label: string; copy: string }[] = [
  {
    label: "Everyday",
    copy: "Wipe gently with a soft, dry cloth after each wear to lift dust before it settles into the grain. Let damp leather dry naturally, away from direct heat.",
  },
  {
    label: "Conditioning",
    copy: "Every few months, work a small amount of neutral leather conditioner into the surface with a clean cloth. It feeds the hide, deepens the colour, and keeps the leather supple.",
  },
  {
    label: "Polishing",
    copy: "For footwear, a matching cream polish restores lustre and protects against moisture. Apply sparingly, allow it to rest, then buff to a quiet shine.",
  },
  {
    label: "Storage",
    copy: "Rest shoes on cedar trees to hold their shape and draw out moisture. Keep wallets and small goods in the dust bag provided, out of prolonged sunlight.",
  },
  {
    label: "Caught in the rain",
    copy: "Blot — never rub — with a dry cloth and let the piece dry slowly at room temperature. Condition once fully dry to restore softness.",
  },
];

export default function LeatherCarePage() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl [&_p]:max-w-[68ch]">
        <Eyebrow>Care</Eyebrow>
        <Heading as="h1" className="mt-6">
          Caring for your leather.
        </Heading>

        <p className="mt-12 text-body font-light text-taupe">
          Fine leather is a living material. Treated with a little patience, it
          softens, darkens, and takes on a character entirely its own — a record
          of where it has been worn. A few simple habits are all it asks.
        </p>

        <dl className="mt-14 border-t border-gold/30">
          {NOTES.map((note) => (
            <div
              key={note.label}
              className="grid gap-2 border-b border-gold/30 py-6 sm:grid-cols-[10rem_1fr] sm:gap-8"
            >
              <dt className="text-eyebrow uppercase text-ink">{note.label}</dt>
              <dd className="text-body font-light text-taupe">{note.copy}</dd>
            </div>
          ))}
        </dl>

        <Divider className="mt-16" />
      </div>
    </Section>
  );
}
