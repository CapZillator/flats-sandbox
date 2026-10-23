import { Skeleton } from "@/shared/ui";

export function SearchSkeleton() {
  return (
    <div className="grid min-w-0 gap-5 rounded-surface border border-border bg-surface p-5 md:p-7">
      <div className="grid gap-2">
        <Skeleton className="h-[1lh] w-2/3 text-h3" />

        <Skeleton className="h-[1lh] w-full text-body-sm" />
      </div>

      {[1, 2].map((count) => (
        <div
          className={
            count === 1
              ? "grid min-w-0 gap-4"
              : "grid min-w-0 gap-4 sm:grid-cols-2"
          }
          key={count}
        >
          {Array.from({ length: count }, (_, index) => (
            <div className="grid min-w-0 gap-1.5" key={index}>
              <Skeleton className="h-[1lh] w-28 max-w-full text-body-sm" />

              <Skeleton className="h-11 w-full rounded-control" />
            </div>
          ))}
        </div>
      ))}

      <div className="flex min-h-11 items-start gap-2.5 py-2">
        <Skeleton className="mt-0.5 size-5 shrink-0" />

        <Skeleton className="mt-px h-[1lh] w-32 text-body-sm" />
      </div>

      <Skeleton className="h-11 w-full rounded-control" />

      <Skeleton className="h-[1lh] w-36 justify-self-center text-body-sm" />
    </div>
  );
}
