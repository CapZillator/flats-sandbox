import type { ReactNode } from "react";
import { Skeleton } from "@/shared/ui";

export function SectionSkeleton({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-6 rounded-surface border border-border bg-surface p-4 md:p-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10">
      <div className="self-start lg:sticky lg:top-24">
        <Skeleton className="h-6 w-9" />

        <Skeleton className="mt-3 h-[1lh] w-3/4 text-h3" />

        <div className="mt-2 grid gap-1.5">
          <Skeleton className="h-[1lh] w-full text-body-sm" />

          <Skeleton className="h-[1lh] w-4/5 text-body-sm" />
        </div>
      </div>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
