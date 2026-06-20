import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";

const VALUES = [
  {
    title: "Full-Grain Only",
    copy: "The top layer of the hide. Selected by hand. Nothing beneath.",
  },
  {
    title: "Stitched, Not Glued",
    copy: "Built to be resoled and worn for decades, not seasons.",
  },
  {
    title: "Made in Pakistan",
    copy: "Shaped by hands with years of practice in every stitch.",
  },
];

export function Reviews() {
  return (
    <Section>
      <Reveal>
        <SectionTitle
          align="center"
          eyebrow="The Standard"
          title="What every piece holds"
        />
      </Reveal>

      <div className="mx-auto mt-16 grid max-w-5xl gap-14 lg:grid-cols-3">
        {VALUES.map((value, i) => (
          <Reveal key={value.title} delay={i * 150}>
            <div className="text-center">
              <h3 className="font-serif text-2xl font-medium text-ink">
                {value.title}
              </h3>
              <p className="mx-auto mt-4 max-w-xs text-body font-light text-stone">
                {value.copy}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
