import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export type HeroImage = { url: string; altText: string | null } | null;

/**
 * Full-viewport editorial hero. The headline animates in line-by-line and the
 * image carries a slow Ken Burns settle — both pure CSS, both disabled for
 * prefers-reduced-motion. A real campaign image can replace `image` later.
 */
export function Hero({ image }: { image: HeroImage }) {
  return (
    <section className="relative -mt-18 w-full overflow-hidden bg-paper">
      <div className="grid min-h-svh lg:grid-cols-[11fr_9fr]">
        {/* Editorial text panel */}
        <div className="flex items-center px-6 pb-16 pt-32 md:px-[clamp(2.5rem,6vw,6rem)] lg:py-24">
          <div className="max-w-3xl">
            <Eyebrow className="animate-hero-fade [animation-delay:900ms] motion-reduce:animate-none">
              Lion Leather
            </Eyebrow>

            <h1 className="mt-10 font-serif text-display font-medium leading-[1.04] text-ink lg:mt-12 lg:text-[clamp(5rem,8vw,9rem)]">
              <span className="block overflow-hidden">
                <span className="block animate-hero-line [animation-delay:150ms] motion-reduce:animate-none">
                  Crafted for
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="block animate-hero-line [animation-delay:300ms] motion-reduce:animate-none">
                  Effortless
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="block animate-hero-line [animation-delay:450ms] motion-reduce:animate-none">
                  Elegance
                </span>
              </span>
            </h1>

            <p className="mt-10 max-w-md animate-hero-fade text-body font-light text-taupe [animation-delay:1100ms] motion-reduce:animate-none">
              Footwear and leather goods designed to elevate your everyday
              presence.
            </p>

            <div className="mt-14 animate-hero-fade [animation-delay:1300ms] motion-reduce:animate-none">
              <ButtonLink href="/collections/footwear" variant="solid">
                Explore Collection
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* Campaign image — fills its column edge to edge, full hero height */}
        {image ? (
          <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:aspect-auto lg:h-full">
            <Image
              src={image.url}
              alt={image.altText ?? "Lion Leather craftsmanship"}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="animate-kenburns object-cover motion-reduce:animate-none"
            />
          </div>
        ) : (
          <div className="hidden border-l border-gold/30 lg:block" />
        )}
      </div>
    </section>
  );
}
