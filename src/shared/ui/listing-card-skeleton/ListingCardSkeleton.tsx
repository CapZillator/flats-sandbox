import { Skeleton } from "../skeleton";

export function ListingCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex min-w-0 flex-col rounded-surface border border-border-light bg-surface"
    >
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden rounded-t-surface">
        <Skeleton className="size-full rounded-none" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-b-surface p-4">
        <Skeleton className="h-[1lh] w-2/5 text-body-sm" />

        <div className="flex min-h-14 flex-wrap content-start items-center gap-x-3 gap-y-1.5">
          <Skeleton className="h-[1lh] w-3/4 text-h3" />

          <Skeleton className="h-6 w-14" />
        </div>

        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1">
          <Skeleton className="h-[1lh] w-14 text-body-sm" />

          <Skeleton className="h-[1lh] w-10 text-body-sm" />

          <Skeleton className="h-[1lh] w-16 text-body-sm" />
        </div>

        <Skeleton className="mt-1 h-[1lh] w-2/5 text-body" />
      </div>
    </div>
  );
}
