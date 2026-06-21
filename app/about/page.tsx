import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { storefrontRequest } from "@/lib/shopify/client";
import {
  COLLECTIONS_QUERY,
  type CollectionsQueryData,
} from "@/lib/shopify/queries/collections";

export const revalidate = 60;

export const metadata = {
  title: "About",
  description:
    "Lion Leather — leather goods made by hand in Lahore, for a lifetime of wear.",
};

export default async function AboutPage() {
  let image: { url: string; altText: string | null } | null = null;
  try {
    const data = await storefrontRequest<CollectionsQueryData>(
      COLLECTIONS_QUERY,
      { first: 5 },
    );
    const c = data.collections.nodes.find((c) => c.handle !== "frontpage");
    image = c?.image ?? c?.products.nodes[0]?.featuredImage ?? null;
  } catch (err) {
    console.error("[About] Storefront error", err);
  }

  return (
    <>
      <Section className="pt-14 sm:pt-20" rhythm="xl">
        <div className="max-w-3xl">
          <Eyebrow>The House</Eyebrow>
          <Heading as="h1" className="mt-6">
            A house built by hand.
          </Heading>
          <div className="mt-8 max-w-[60ch] space-y-6 text-body-lg font-light text-taupe">
            <p>
              Lion Leather is a small house with a single conviction: that a
              well-made thing, looked after, should last a very long time. We
              make footwear and leather goods the slow way — by hand, from
              full-grain hides, in a workshop in Lahore.
            </p>
            <p>
              The craft here is inherited, passed between hands across
              generations. We have kept it deliberately small so that every
              piece is given the time and attention it deserves, and so the
              people who make it are known and valued.
            </p>
            <p className="text-ink">
              We design with restraint — honest materials, quiet lines, details
              you notice over years rather than seconds. Nothing that asks for
              attention; everything that earns it.
            </p>
          </div>
          <div className="mt-10">
            <ButtonLink variant="link" href="/craft">
              Discover the craft
            </ButtonLink>
          </div>
        </div>
      </Section>

      {image ? (
        <Reveal variant="scale">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
            <Image
              src={image.url}
              alt={image.altText ?? "Lion Leather"}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      ) : null}

      <Section tone="surface" rhythm="lg">
        <div className="max-w-3xl">
          <p className="font-serif text-h2 font-light italic text-taupe">
            Leather that ages with you — kept, repaired, and worn for a lifetime.
          </p>
        </div>
      </Section>
    </>
  );
}
