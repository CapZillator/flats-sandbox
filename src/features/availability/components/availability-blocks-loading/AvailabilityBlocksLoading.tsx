import { Skeleton } from "@/shared/ui";

export function AvailabilityBlocksLoading({ label }: { label: string }) {
  return (
    <div aria-busy="true" aria-label={label} className="grid gap-3">
      {Array.from({ length: 2 }, (_, index) => (
        <div
          aria-hidden="true"
          className="flex flex-col gap-4 rounded-surface border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
          key={index}
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-[1lh] w-52 max-w-full text-body" />

              <Skeleton className="h-6 w-24" />
            </div>

            <Skeleton className="mt-2 h-[1lh] w-full max-w-64 text-body-sm" />
          </div>

          <Skeleton className="h-9 w-28 shrink-0 self-start rounded-control sm:self-auto" />
        </div>
      ))}
    </div>
  );
}
