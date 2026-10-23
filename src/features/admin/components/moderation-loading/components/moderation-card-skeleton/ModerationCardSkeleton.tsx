import { Skeleton } from "@/shared/ui";

export function ModerationCardSkeleton() {
  return (
    <div className="grid gap-4 rounded-surface border border-border bg-surface p-5 sm:grid-cols-[minmax(0,1fr)_auto]">
      <div className="grid min-w-0 justify-items-start gap-2">
        <Skeleton className="h-6 w-28 max-w-full" />

        <Skeleton className="h-[1lh] w-full max-w-md text-h3" />

        <Skeleton className="h-[1lh] w-full max-w-64 text-body-sm" />

        <Skeleton className="h-[1lh] w-full max-w-80 text-caption" />
      </div>

      <Skeleton className="h-11 w-full self-end rounded-control sm:w-36" />
    </div>
  );
}
