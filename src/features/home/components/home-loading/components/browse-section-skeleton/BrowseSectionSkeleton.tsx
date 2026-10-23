import { Skeleton } from "@/shared/ui";

export function BrowseSectionSkeleton() {
  return (
    <div className="grid gap-5">
      <div className="grid gap-2 md:max-w-2xl">
        <Skeleton className="h-[1lh] w-2/3 text-h2" />

        <Skeleton className="h-[1lh] w-full text-body" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            className="flex min-w-0 items-center gap-3 rounded-surface border border-border bg-surface p-5"
            key={index}
          >
            <Skeleton className="size-5 shrink-0" />

            <Skeleton className="h-[1lh] w-1/2 text-body" />

            <Skeleton className="ml-auto size-5 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
