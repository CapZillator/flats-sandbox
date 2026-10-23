import { Skeleton } from "@/shared/ui";

export function OwnerListingCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid min-w-0 gap-4 rounded-surface border border-border bg-surface p-4 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-5 sm:p-5 lg:grid-cols-[16rem_minmax(0,1fr)]"
    >
      <Skeleton className="aspect-[4/3] w-full self-start rounded-control" />

      <div className="flex min-w-0 flex-col justify-between gap-4">
        <div className="grid justify-items-start gap-2">
          <div className="flex w-full min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
            <Skeleton className="h-[1lh] w-2/3 max-w-md text-h3" />

            <Skeleton className="h-6 w-24" />
          </div>

          <Skeleton className="h-[1lh] w-32 max-w-full text-body-sm" />

          <Skeleton className="h-[1lh] w-40 max-w-full text-body" />
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border-light pt-3">
          <Skeleton className="h-9 w-24 rounded-control" />

          <Skeleton className="h-9 w-20 rounded-control" />

          <Skeleton className="h-9 w-28 rounded-control" />

          <Skeleton className="h-9 w-28 rounded-control" />
        </div>
      </div>
    </div>
  );
}
