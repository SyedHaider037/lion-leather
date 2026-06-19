import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <Section>
      <Skeleton className="h-3 w-16" />
      <Skeleton className="mt-6 h-12 w-80 max-w-full" />
      <Skeleton className="mt-6 h-4 w-72 max-w-full" />

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
        <div className="space-y-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-6 border-b border-gold/30 pb-6">
              <Skeleton className="h-28 w-24 shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="mt-3 h-3 w-1/4" />
                <Skeleton className="mt-6 h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-56 w-full" />
      </div>
    </Section>
  );
}
