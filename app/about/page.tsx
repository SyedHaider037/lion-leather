import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <Eyebrow>The House</Eyebrow>
        <Heading as="h1" className="mt-6 lg:text-[clamp(3.5rem,6vw,7rem)]">
          Timeless elegance, made to be worn.
        </Heading>

        <div className="mt-12 space-y-6 text-body font-light text-stone">
          <p>
            Lion Leather is crafted for the modern gentleman — pieces that feel
            composed, comfortable, and quietly confident.
          </p>
          <p>
            We design with restraint: refined silhouettes, honest materials,
            and details you notice over time. Every pair is made for long
            evenings, early mornings, and everything in between.
          </p>
          <p className="text-ink">
            Crafted to elevate presence — without asking for attention.
          </p>
        </div>

        <Divider className="mt-16" />
      </div>
    </Section>
  );
}
