import { Skeleton } from "@/shared/ui";

const fieldRows = [
  { count: 5, className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-5" },
  { count: 3, className: "grid gap-4 sm:grid-cols-3" },
];

export function CatalogFiltersSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid gap-5 rounded-surface border border-border bg-surface p-4 md:p-5"
    >
      <Skeleton className="h-[1lh] w-24 text-h3" />

      {fieldRows.map((row) => (
        <div className={row.className} key={row.count}>
          {Array.from({ length: row.count }, (_, index) => (
            <div className="grid min-w-0 gap-1.5" key={index}>
              <Skeleton className="h-[1lh] w-2/5 text-body-sm" />

              <Skeleton className="h-11 w-full rounded-control" />
            </div>
          ))}
        </div>
      ))}

      <div className="grid gap-5 lg:grid-cols-3 lg:gap-4">
        {[6, 1].map((count) => (
          <div
            className={count === 6 ? "min-w-0 lg:col-span-2" : "min-w-0"}
            key={count}
          >
            <Skeleton className="mb-3 h-[1lh] w-28 text-body-sm" />

            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {Array.from({ length: count }, (_, index) => (
                <div
                  className="inline-flex min-h-11 items-start gap-2.5 py-2"
                  key={index}
                >
                  <Skeleton className="mt-0.5 size-5 shrink-0" />

                  <Skeleton className="mt-px h-[1lh] w-16 text-body-sm" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border-light pt-4 sm:flex-row sm:justify-end">
        <Skeleton className="h-9 w-full rounded-control sm:w-16" />

        <Skeleton className="h-9 w-full rounded-control sm:w-16" />
      </div>
    </div>
  );
}
