import { Skeleton } from "@/shared/ui";

import { OwnerListingCardSkeleton } from "../owner-listing-card-skeleton/OwnerListingCardSkeleton";

export function OwnerListingsLoading() {
  return (
    <div aria-busy="true" className="grid gap-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full min-w-0 sm:max-w-xl">
          <Skeleton className="h-[1lh] w-64 max-w-full text-h2" />

          <Skeleton className="mt-1 h-[1lh] w-full max-w-md text-body-sm" />
        </div>

        <Skeleton className="h-11 w-44 max-w-full shrink-0 rounded-control" />
      </div>

      <div className="grid gap-4">
        {Array.from({ length: 3 }, (_, index) => (
          <OwnerListingCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
