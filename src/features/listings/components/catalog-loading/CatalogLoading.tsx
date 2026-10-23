import { ListingCardSkeleton, Skeleton } from "@/shared/ui";

import { CatalogFiltersSkeleton } from "../catalog-filters-skeleton/CatalogFiltersSkeleton";

export function CatalogLoading() {
  return (
    <div
      aria-busy="true"
      className="content-container page-gutters grid gap-7 py-8 lg:gap-9 lg:py-12"
    >
      <div className="grid max-w-3xl gap-3">
        <Skeleton className="h-[1em] w-full max-w-lg text-h1" />

        <Skeleton className="h-[1lh] w-full max-w-sm text-body-lg" />
      </div>

      <CatalogFiltersSkeleton />

      <div className="grid gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <Skeleton className="h-[1lh] w-24 text-body-sm" />

          <div className="flex gap-1 rounded-control border border-border bg-surface p-1">
            <Skeleton className="h-9 w-20 rounded-control" />

            <Skeleton className="h-9 w-20 rounded-control" />
          </div>
        </div>

        <div className="grid min-h-[calc(max(30rem,70dvh)+2px)] content-start gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <ListingCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
