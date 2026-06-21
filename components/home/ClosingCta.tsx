import { ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function ClosingCta() {
  return (
    <Section className="pb-24 lg:pb-40">
      <Reveal className="mx-auto max-w-2xl">
        <div className="border border-gold/30 px-8 py-16 text-center lg:px-16">
          <Divider className="mx-auto max-w-[12rem]" />
          <p className="mt-10 font-serif text-title font-medium text-ink">
            Begin with a single pair.
          </p>
          <div className="mt-10">
            <ButtonLink variant="solid" href="/collections/footwear">
              Explore Collection
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
