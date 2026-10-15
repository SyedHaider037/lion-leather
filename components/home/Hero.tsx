import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PhotoFrame, type PhotoSource } from "@/components/ui/PhotoFrame";

export type HeroImage = PhotoSource | null;

/**
 * Full-viewport editorial hero. The headline animates in line-by-line (pure
 * CSS, disabled for prefers-reduced-motion). The photo is low-resolution, so it
 * is shown as a plate at its own size on a neutral tile instead of being
 * stretched to fill the column. A real campaign image can replace `image`.
 */
export function Hero({ image }: { image: HeroImage }) {
  return (
    <section className="relative -mt-18 w-full overflow-hidden bg-paper">
      <div className="grid min-h-svh lg:grid-cols-[11fr_9fr]">
        {/* Editorial text panel */}
        <div className="flex items-center px-6 pb-16 pt-32 md:px-[clamp(2.5rem,6vw,6rem)] lg:py-24">
          <div className="max-w-3xl">
            <Eyebrow className="animate-hero-fade [animation-delay:0ms] motion-reduce:animate-none">
              Lion Leather
            </Eyebrow>

            <h1 className="mt-10 font-serif text-hero font-medium text-ink lg:mt-12">
              <span className="block overflow-hidden">
                <span className="block animate-hero-line [animation-delay:40ms] motion-reduce:animate-none">
                  Crafted for
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="block animate-hero-line [animation-delay:120ms] motion-reduce:animate-none">
                  Effortless
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="block animate-hero-line [animation-delay:200ms] motion-reduce:animate-none">
                  Elegance
                </span>
              </span>
            </h1>

            <p className="mt-10 max-w-md animate-hero-fade text-body font-light text-taupe [animation-delay:280ms] motion-reduce:animate-none">
              Footwear and leather goods designed to elevate your everyday
              presence.
            </p>

            <div className="mt-14 animate-hero-fade [animation-delay:360ms] motion-reduce:animate-none">
              <ButtonLink href="/collections/footwear" variant="solid">
                Explore Collection
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* Campaign photo — a plate at native size, mounted on the tile */}
        {image ? (
          <div className="flex items-center justify-center bg-tile px-6 py-12 sm:px-10 sm:py-16 lg:px-12 lg:py-24">
            <div
              className="w-full"
              style={{ maxWidth: image.width ?? undefined }}
            >
              <PhotoFrame
                image={image}
                alt={image.altText ?? "Lion Leather craftsmanship"}
                priority
                rounded={false}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="shadow-[0_1px_0_0_rgb(42_35_27/0.06),0_18px_40px_-24px_rgb(42_35_27/0.35)]"
              />
            </div>
          </div>
        ) : (
          <div className="hidden border-l border-gold/30 lg:block" />
        )}
      </div>
    </section>
  );
}
