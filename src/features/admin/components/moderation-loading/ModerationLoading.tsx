import { Skeleton } from "@/shared/ui";

import { ModerationCardSkeleton } from "./components/moderation-card-skeleton/ModerationCardSkeleton";

export function ModerationLoading() {
  return (
    <div aria-busy="true" className="grid gap-6">
      <div className="grid gap-3">
        <Skeleton className="h-[1em] w-full max-w-lg text-h1" />

        <Skeleton className="h-[1lh] w-full max-w-2xl text-body" />
      </div>

      <div
        aria-hidden="true"
        className="grid items-end gap-3 rounded-surface border border-border bg-surface p-4 sm:grid-cols-[minmax(0,20rem)_auto]"
      >
        <div className="grid min-w-0 gap-1.5">
          <Skeleton className="h-[1lh] w-20 text-body-sm" />

          <Skeleton className="h-11 w-full rounded-control" />
        </div>

        <Skeleton className="h-11 w-full rounded-control sm:w-24 sm:justify-self-start" />
      </div>

      <Skeleton className="h-[1lh] w-28 text-body-sm" />

      <div aria-hidden="true" className="grid gap-4">
        {Array.from({ length: 3 }, (_, index) => (
          <ModerationCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
