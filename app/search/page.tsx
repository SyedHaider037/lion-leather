import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { SearchClient } from "@/components/search/SearchClient";

export const metadata = {
  title: "Search",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const initialQuery = typeof sp.q === "string" ? sp.q : "";

  return (
    <Section className="pt-14 sm:pt-20">
      <Eyebrow>Search</Eyebrow>
      <Heading as="h1" tone="title" className="mt-6">
        Find your next essential
      </Heading>

      <SearchClient initialQuery={initialQuery} />
    </Section>
  );
}
