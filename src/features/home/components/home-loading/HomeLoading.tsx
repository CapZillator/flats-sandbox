import { ListingCardSkeleton, Skeleton } from "@/shared/ui";

import { BrowseSectionSkeleton } from "./components/browse-section-skeleton/BrowseSectionSkeleton";
import { SearchSkeleton } from "./components/search-skeleton/SearchSkeleton";

export function HomeLoading() {
  return (
    <div
      aria-busy="true"
      className="content-container page-gutters grid gap-12 py-8 md:gap-16 md:py-12"
    >
      <div
        aria-hidden="true"
        className="grid items-center gap-8 border-b border-border pb-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16 lg:pb-16"
      >
        <div className="grid min-w-0 content-center gap-6 self-stretch py-8 lg:py-12">
          <div className="grid max-w-3xl gap-2">
            <Skeleton className="h-[1em] w-full text-h1" />

            <Skeleton className="h-[1em] w-3/4 text-h1" />
          </div>

          <div className="grid max-w-xl gap-1.5">
            <Skeleton className="h-[1lh] w-full text-body-lg" />

            <Skeleton className="h-[1lh] w-2/3 text-body-lg" />
          </div>

          <Skeleton className="h-5 w-40" />
        </div>

        <SearchSkeleton />
      </div>

      <div aria-hidden="true">
        <BrowseSectionSkeleton />
      </div>

      <div aria-hidden="true">
        <BrowseSectionSkeleton />
      </div>

      <div aria-hidden="true" className="grid gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="grid w-full min-w-0 gap-2 sm:max-w-xl">
            <Skeleton className="h-[1lh] w-2/3 text-h2" />

            <Skeleton className="h-[1lh] w-full text-body" />
          </div>

          <Skeleton className="h-11 w-40 shrink-0 rounded-control" />
        </div>

        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <ListingCardSkeleton key={index} />
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="grid gap-7 border-y border-border py-10"
      >
        <Skeleton className="h-[1lh] w-full max-w-lg text-h2" />

        <div className="grid gap-7 md:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div className="grid content-start gap-3" key={index}>
              <Skeleton className="size-9" />

              <Skeleton className="h-[1lh] w-3/4 text-h3" />

              <div className="grid gap-1.5">
                <Skeleton className="h-[1lh] w-full text-body-sm" />

                <Skeleton className="h-[1lh] w-4/5 text-body-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="grid items-center gap-6 rounded-surface border border-border bg-surface p-6 md:grid-cols-[minmax(0,1fr)_auto] md:p-8"
      >
        <div className="grid max-w-2xl gap-3">
          <Skeleton className="h-[1lh] w-3/4 text-h2" />

          <Skeleton className="h-[1lh] w-full text-body" />
        </div>

        <Skeleton className="h-11 w-44 max-w-full justify-self-start rounded-control" />
      </div>
    </div>
  );
}
