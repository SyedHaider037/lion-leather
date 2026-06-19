import { ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function ClosingCta() {
  return (
    <Section tone="ink" className="pb-24 lg:pb-40">
      <Reveal className="mx-auto max-w-lg text-center">
        <Divider />
        <p className="mt-10 font-serif text-title font-light text-cream">
          Begin with a single pair.
        </p>
        <div className="mt-10">
          <ButtonLink variant="outline-light" href="/collections/footwear">
            Explore Collection
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}
