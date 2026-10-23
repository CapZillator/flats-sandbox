import { Skeleton } from "@/shared/ui";

import { PanelSkeleton } from "./components/panel-skeleton/PanelSkeleton";

export function ListingDetailLoading() {
  return (
    <div
      aria-busy="true"
      className="content-container page-gutters grid gap-6 py-6 md:gap-8 md:py-10"
    >
      <Skeleton className="h-5 w-36" />

      <div aria-hidden="true" className="grid gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-6 w-24" />

          <Skeleton className="h-6 w-20" />
        </div>

        <Skeleton className="h-[1em] w-full max-w-3xl text-h1" />

        <Skeleton className="h-[1lh] w-full max-w-sm text-body-sm" />
      </div>

      <div
        aria-hidden="true"
        className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8"
      >
        <div className="grid min-w-0 gap-3">
          <Skeleton className="aspect-[4/3] w-full rounded-surface sm:aspect-[7/5]" />

          <div className="flex gap-2 overflow-hidden py-1">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton
                className="h-16 w-20 shrink-0 rounded-control sm:h-20 sm:w-28"
                key={index}
              />
            ))}
          </div>
        </div>

        <div className="@container order-last grid min-w-0 gap-6 lg:order-none lg:col-start-1 lg:row-start-2">
          <div className="grid grid-cols-2 gap-4 rounded-surface border border-border bg-surface p-5 sm:grid-cols-4 sm:p-6">
            {Array.from({ length: 4 }, (_, index) => (
              <div className="min-w-0" key={index}>
                <Skeleton className="h-[1lh] w-16 max-w-full text-caption" />

                <div className="mt-1 flex items-center gap-3">
                  <Skeleton className="size-6 shrink-0" />

                  <Skeleton className="h-[1lh] w-10 max-w-full text-h3" />
                </div>
              </div>
            ))}
          </div>

          <PanelSkeleton>
            <div className="grid gap-2">
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton
                  className="h-[1lh] w-full text-body last:w-2/3"
                  key={index}
                />
              ))}
            </div>
          </PanelSkeleton>

          <PanelSkeleton>
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <div className="grid gap-1" key={index}>
                  <Skeleton className="h-[1lh] w-28 max-w-full text-body-sm" />

                  <div className="flex items-center gap-3">
                    <Skeleton className="size-6 shrink-0" />

                    <Skeleton className="h-[1lh] w-24 max-w-full text-body-sm" />
                  </div>
                </div>
              ))}
            </div>
          </PanelSkeleton>

          {[6, 3].map((count) => (
            <PanelSkeleton key={count}>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: count }, (_, index) => (
                  <div className="flex min-w-0 items-center gap-3" key={index}>
                    <Skeleton className="size-6 shrink-0" />

                    <Skeleton className="h-[1lh] w-2/3 text-body-sm" />
                  </div>
                ))}
              </div>
            </PanelSkeleton>
          ))}

          <div className="grid min-w-0 gap-6 @min-[52rem]:grid-cols-2">
            <PanelSkeleton>
              <Skeleton className="h-[1lh] w-3/4 text-body-sm" />

              <div className="mx-auto grid w-full max-w-sm gap-3 lg:mx-0">
                <div className="flex h-10 items-center justify-between gap-3">
                  <Skeleton className="h-5 w-32" />

                  <Skeleton className="h-9 w-20" />
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 42 }, (_, index) => (
                    <Skeleton className="h-9 w-full" key={index} />
                  ))}
                </div>

                <Skeleton className="h-[1lh] w-32 justify-self-center text-caption" />
              </div>

              <Skeleton className="h-[1lh] w-full text-caption" />
            </PanelSkeleton>

            <PanelSkeleton>
              <Skeleton className="h-[1lh] w-2/3 text-body-sm" />

              <Skeleton className="min-h-80 w-full rounded-control" />
            </PanelSkeleton>
          </div>
        </div>

        <div className="grid min-w-0 gap-5 lg:sticky lg:top-[calc(4rem+1px+1.5rem)] lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="grid gap-4 rounded-surface border border-border bg-surface p-5 sm:p-6">
            <div>
              <Skeleton className="h-[1lh] w-2/3 text-h2" />

              <Skeleton className="h-[1lh] w-24 text-body-sm" />
            </div>

            <Skeleton className="h-11 w-full rounded-control" />

            <div className="grid gap-3 border-t border-border-light pt-5">
              <Skeleton className="h-[1lh] w-36 text-h3" />

              <Skeleton className="h-[1lh] w-full text-body-sm" />

              <Skeleton className="h-11 w-full rounded-control" />
            </div>
          </div>

          <PanelSkeleton>
            <Skeleton className="h-[1lh] w-2/3 text-body" />

            <div className="grid gap-1.5">
              <Skeleton className="h-[1lh] w-full text-body-sm" />

              <Skeleton className="h-[1lh] w-4/5 text-body-sm" />
            </div>
          </PanelSkeleton>
        </div>
      </div>
    </div>
  );
}
