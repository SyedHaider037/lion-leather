import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <Section className="pt-14 sm:pt-20">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-6 h-10 w-96 max-w-full" />
      <Skeleton className="mt-12 h-12 w-full max-w-xl" />
    </Section>
  );
}
