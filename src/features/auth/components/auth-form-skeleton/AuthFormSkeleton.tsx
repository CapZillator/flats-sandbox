import { Skeleton } from "@/shared/ui";

export function AuthFormSkeleton({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className="grid gap-6 rounded-surface border border-border bg-surface p-5 sm:p-7"
    >
      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <Skeleton className="h-[1lh] w-40 max-w-full text-body-sm" />

          <Skeleton className="h-11 w-full rounded-control" />
        </div>

        <Skeleton className="h-11 w-full rounded-control" />
      </div>

      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-border-light" />

        <Skeleton className="h-[1lh] w-8 text-caption" />

        <span className="h-px flex-1 bg-border-light" />
      </div>

      <Skeleton className="h-11 w-full rounded-control" />
    </div>
  );
}
