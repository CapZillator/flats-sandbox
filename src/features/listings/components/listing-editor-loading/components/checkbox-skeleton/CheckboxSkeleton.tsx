import { Skeleton } from "@/shared/ui";

export function CheckboxSkeleton() {
  return (
    <div className="flex min-h-11 items-start gap-2.5 py-2">
      <Skeleton className="mt-0.5 size-5 shrink-0" />

      <Skeleton className="mt-px h-[1lh] w-28 max-w-full text-body-sm" />
    </div>
  );
}
