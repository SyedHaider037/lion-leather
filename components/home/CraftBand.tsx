import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const ITEMS = [
  {
    label: "Premium Leather",
    copy: "Full-grain hides, chosen by hand and burnished to a quiet depth.",
  },
  {
    label: "Considered Comfort",
    copy: "Lasts shaped for long days, lined for ease from the first wearing.",
  },
  {
    label: "Enduring Construction",
    copy: "Stitched, not glued — made to be resoled and kept for years.",
  },
];

export function CraftBand() {
  return (
    <Section tone="surface" rhythm="md">
      <Reveal>
        <div className="grid gap-14 text-center sm:grid-cols-3">
          {ITEMS.map((item) => (
            <div key={item.label}>
              <span aria-hidden className="mx-auto block h-px w-10 bg-gold" />
              <p className="mt-6 text-eyebrow uppercase text-ink">
                {item.label}
              </p>
              <p className="mx-auto mt-4 max-w-xs text-sm font-light text-taupe">
                {item.copy}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
