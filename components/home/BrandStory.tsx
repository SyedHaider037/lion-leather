import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { HeroImage } from "./Hero";

export function BrandStory({ image }: { image: HeroImage }) {
  return (
    <Section tone="ink">
      <Reveal>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {image ? (
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={image.url}
                alt={image.altText ?? "Lion Leather craftsmanship"}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="max-w-xl">
            <p className="text-eyebrow uppercase text-cream/60">The House</p>
            <p className="mt-8 font-serif text-title font-light text-cream">
              Leather that outlasts its occasions.
            </p>
            <div className="mt-8 space-y-6 text-body font-light text-cream/70">
              <p>
                Every Lion Leather piece begins with full-grain hides, selected
                by hand and finished without haste. Our craftsmen shape each
                pair with techniques passed quietly between generations.
              </p>
              <p>
                Nothing is rushed, and nothing is loud. What remains is leather
                that does not chase the moment — it outlasts it.
              </p>
            </div>
            <div className="mt-10">
              <ButtonLink
                variant="link"
                href="/about"
                className="text-cream hover:text-tan"
              >
                Discover the House
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
