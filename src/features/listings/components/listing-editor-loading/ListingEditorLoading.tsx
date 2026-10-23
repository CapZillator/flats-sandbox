import { Skeleton } from "@/shared/ui";

import { CheckboxSkeleton } from "./components/checkbox-skeleton/CheckboxSkeleton";
import { FieldSkeleton } from "./components/field-skeleton/FieldSkeleton";
import { SectionSkeleton } from "./components/section-skeleton/SectionSkeleton";

export function ListingEditorLoading() {
  return (
    <div aria-busy="true" className="grid gap-6">
      <div className="max-w-3xl">
        <Skeleton className="h-[1lh] w-full max-w-md text-h2" />

        <Skeleton className="mt-3 h-[1lh] w-full max-w-xl text-body" />
      </div>

      <div aria-hidden="true" className="grid gap-5 pb-20">
        <SectionSkeleton>
          <div className="mb-3 flex justify-end">
            <Skeleton className="h-11 w-40 rounded-control" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FieldSkeleton className="md:col-span-2" hint />

            <FieldSkeleton className="md:col-span-2" multiline hint />

            {Array.from({ length: 6 }, (_, index) => (
              <FieldSkeleton key={index} />
            ))}

            <div className="md:col-span-2">
              <CheckboxSkeleton />
            </div>
          </div>
        </SectionSkeleton>

        <SectionSkeleton>
          <div className="grid gap-4 md:grid-cols-2">
            <FieldSkeleton className="md:col-span-2" />

            <FieldSkeleton className="md:col-span-2" />

            <div className="grid gap-1.5 md:col-span-2">
              <Skeleton className="h-[1lh] w-36 text-body-sm" />

              <Skeleton className="h-[1lh] w-4/5 text-caption" />

              <Skeleton className="h-80 w-full rounded-surface md:h-[26rem]" />
            </div>

            {Array.from({ length: 5 }, (_, index) => (
              <FieldSkeleton key={index} />
            ))}
          </div>
        </SectionSkeleton>

        <SectionSkeleton>
          <div className="grid gap-5 lg:grid-cols-[minmax(15rem,0.8fr)_minmax(0,2fr)]">
            <div>
              <div className="grid h-48 content-center justify-items-center gap-3 rounded-surface border-2 border-dashed border-border bg-surface-muted p-5">
                <Skeleton className="size-10" />

                <Skeleton className="h-[1lh] w-3/4 text-body-sm" />

                <Skeleton className="h-[1lh] w-full text-caption" />
              </div>

              <Skeleton className="mt-2 h-[1lh] w-12 text-caption" />
            </div>

            <div className="grid h-48 content-center justify-items-center gap-2 self-start rounded-surface border border-border-light bg-surface p-6">
              <Skeleton className="size-9" />

              <Skeleton className="h-[1lh] w-3/4 text-body-sm" />
            </div>
          </div>
        </SectionSkeleton>

        <SectionSkeleton>
          <div className="grid gap-6">
            {[12, 6].map((count, groupIndex) => (
              <div
                className={
                  groupIndex === 0
                    ? "grid gap-2"
                    : "grid gap-2 border-t border-border-light pt-5"
                }
                key={count}
              >
                <Skeleton className="h-[1lh] w-32 text-body-sm" />

                <div className="grid gap-x-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: count }, (_, index) => (
                    <CheckboxSkeleton key={index} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionSkeleton>

        <div className="sticky bottom-3 z-30 flex flex-col gap-3 rounded-surface border border-border bg-surface p-3 shadow-[4px_4px_0_rgb(24_28_28_/_0.14)] sm:flex-row sm:items-center sm:justify-between md:p-4">
          <Skeleton className="h-[1lh] w-full max-w-sm text-caption" />

          <Skeleton className="h-11 w-full shrink-0 rounded-control sm:w-40" />
        </div>
      </div>
    </div>
  );
}
