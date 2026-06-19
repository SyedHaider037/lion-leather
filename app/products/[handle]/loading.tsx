import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <Section className="pt-14 sm:pt-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <Skeleton className="aspect-[4/5] w-full" />
          <div className="mt-4 grid grid-cols-5 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        </div>

        <div className="lg:pt-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-6 h-10 w-3/4" />
          <Skeleton className="mt-6 h-4 w-32" />
          <Skeleton className="mt-8 h-4 w-full max-w-xl" />
          <Skeleton className="mt-3 h-4 w-2/3 max-w-xl" />
          <Skeleton className="mt-12 h-[3.25rem] w-full" />
        </div>
      </div>
    </Section>
  );
}
