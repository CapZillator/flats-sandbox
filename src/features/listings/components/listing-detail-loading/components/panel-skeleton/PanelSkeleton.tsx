import type { ReactNode } from "react";
import { Skeleton } from "@/shared/ui";

export function PanelSkeleton({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-w-0 content-start gap-4 rounded-surface border border-border bg-surface p-5 sm:p-6">
      <Skeleton className="h-[1lh] w-40 max-w-full text-h3" />

      {children}
    </div>
  );
}
