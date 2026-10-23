import classNames from "classnames";
import { Skeleton } from "@/shared/ui";

export function FieldSkeleton({
  className,
  multiline = false,
  hint = false,
}: {
  className?: string;
  multiline?: boolean;
  hint?: boolean;
}) {
  return (
    <div className={classNames("grid min-w-0 gap-1.5", className)}>
      <Skeleton className="h-[1lh] w-1/3 max-w-40 text-body-sm" />

      <Skeleton
        className={classNames(
          "w-full rounded-control",
          multiline ? "h-[calc(7lh+1.25rem+2px)] text-body" : "h-11",
        )}
      />

      {hint ? <Skeleton className="h-[1lh] w-3/4 text-caption" /> : null}
    </div>
  );
}
