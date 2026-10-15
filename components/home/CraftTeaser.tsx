import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { HeroImage } from "./Hero";

/** Editorial craft teaser — image left, text right, link to The Craft. */
export function CraftTeaser({ image }: { image: HeroImage }) {
  return (
    <Section tone="surface" rhythm="xl">
      <Reveal>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <PhotoFrame
            image={image}
            alt={image?.altText ?? "Lion Leather craftsmanship"}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />

          <div className="max-w-md">
            <Eyebrow>The Craft</Eyebrow>
            <h2 className="mt-6 font-serif text-h2 font-medium text-ink">
              Made by hand in Lahore.
            </h2>
            <div className="mt-6 space-y-6 text-body-lg font-light text-taupe">
              <p>
                Every piece begins with full-grain hides, chosen by hand and
                finished without haste by craftsmen who have shaped leather for
                decades.
              </p>
              <p>
                Nothing is rushed. What remains is leather that softens,
                deepens, and outlives the season it was made for.
              </p>
            </div>
            <div className="mt-8">
              <ButtonLink
                variant="link"
                className="py-3.5! after:bottom-3.5!"
                href="/craft"
              >
                Read the story
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
