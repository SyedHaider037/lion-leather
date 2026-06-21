import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { storefrontRequest } from "@/lib/shopify/client";
import {
  COLLECTIONS_QUERY,
  type CollectionsQueryData,
  type CollectionListItem,
} from "@/lib/shopify/queries/collections";
import { cn } from "@/lib/utils/cn";

export const revalidate = 60;

export const metadata = {
  title: "The Craft",
  description:
    "Full-grain leather, cut and stitched by hand in Lahore — the making behind Lion Leather.",
};

type StoryImage = { url: string; altText: string | null } | null;

const imageOf = (c: CollectionListItem | undefined): StoryImage =>
  c?.image ?? c?.products.nodes[0]?.featuredImage ?? null;

function Story({
  eyebrow,
  title,
  image,
  tone,
  flip,
  children,
}: {
  eyebrow: string;
  title: string;
  image: StoryImage;
  tone: "paper" | "surface";
  flip?: boolean;
  children: React.ReactNode;
}) {
  const frame = tone === "surface" ? "bg-paper" : "bg-surface";
  return (
    <Section tone={tone} rhythm="xl">
      <Reveal>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div
            className={cn(
              "relative aspect-[4/5] overflow-hidden rounded-[5px]",
              frame,
              flip && "lg:order-2",
            )}
          >
            {image ? (
              <Image
                src={image.url}
                alt={image.altText ?? title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="max-w-md">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mt-5 font-serif text-h2 font-medium text-ink">
              {title}
            </h2>
            <div className="mt-6 space-y-5 text-body-lg font-light text-taupe">
              {children}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

export default async function CraftPage() {
  let collections: CollectionListItem[] = [];
  try {
    const data = await storefrontRequest<CollectionsQueryData>(COLLECTIONS_QUERY, {
      first: 20,
    });
    collections = data.collections.nodes.filter((c) => c.handle !== "frontpage");
  } catch (err) {
    console.error("[Craft] Storefront error", err);
  }

  const lead = imageOf(collections[0]);
  const leather = imageOf(collections[1]) ?? lead;
  const making = imageOf(collections[0]);
  const workshop = imageOf(collections[2]) ?? imageOf(collections[1]) ?? lead;

  return (
    <>
      {/* Opening */}
      <Section rhythm="xl" className="pt-14 sm:pt-20">
        <div className="max-w-3xl">
          <Eyebrow>The Craft</Eyebrow>
          <Heading as="h1" className="mt-6">
            Made by hand, meant to last.
          </Heading>
          <p className="mt-8 max-w-[60ch] text-body-lg font-light text-taupe">
            Lion Leather is shaped slowly, the old way — by hands that have
            worked hide for a lifetime. What follows is how a single pair comes
            to be, and why it is built to outlive the season it was made for.
          </p>
        </div>
      </Section>

      {/* Full-bleed image moment */}
      {lead ? (
        <Reveal variant="scale">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
            <Image
              src={lead.url}
              alt={lead.altText ?? "Lion Leather craftsmanship"}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      ) : null}

      <Story eyebrow="The Leather" title="Full-grain, nothing less." image={leather} tone="surface">
        <p>
          We work only in full-grain leather — the top layer of the hide, with
          its character intact. It is chosen by hand, a few skins at a time, for
          grain, temper, and how it will wear.
        </p>
        <p>
          Nothing is corrected or coated away. The marks the animal carried
          remain, and the leather is left to deepen with use.
        </p>
      </Story>

      <Story eyebrow="The Making" title="Cut, stitched, finished." image={making} tone="paper" flip>
        <p>
          Each piece is cut to pattern, skived, and stitched — not glued — so it
          can be resoled and repaired rather than replaced. Edges are burnished
          by hand until they sit smooth.
        </p>
        <p>
          A single pair passes through many hands over several days. The pace is
          deliberate; it is what the material asks for.
        </p>
      </Story>

      <Story eyebrow="The Workshop" title="A workshop in Lahore." image={workshop} tone="surface">
        <p>
          Our pieces are made in a small workshop in Lahore, where the craft has
          been kept alive across generations. The makers are named, known, and
          paid for their skill.
        </p>
        <p>
          It is a quiet kind of luxury — one you can feel in the weight of the
          leather and the evenness of the stitch.
        </p>
      </Story>

      {/* Closing CTA */}
      <Section rhythm="lg" className="pb-24 lg:pb-40">
        <Reveal className="mx-auto max-w-2xl">
          <div className="border border-gold/30 px-8 py-16 text-center lg:px-16">
            <Divider className="mx-auto max-w-[12rem]" />
            <p className="mt-10 font-serif text-h2 font-medium text-ink">
              Own a piece of the craft.
            </p>
            <div className="mt-10">
              <ButtonLink variant="solid" href="/collections/footwear">
                Explore the Collection
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
