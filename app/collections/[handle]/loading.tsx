import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <Section className="pt-14 sm:pt-20">
      <div className="flex flex-col items-center">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-6 h-12 w-72 max-w-full" />
        <Skeleton className="mt-6 h-4 w-96 max-w-full" />
        <div aria-hidden className="mt-10 h-px w-full max-w-xs bg-gold/30" />
      </div>

      <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[4/5] w-full" />
            <Skeleton className="mx-auto mt-6 h-4 w-2/3" />
            <Skeleton className="mx-auto mt-3 h-3 w-1/3" />
          </div>
        ))}
      </div>
    </Section>
  );
}
