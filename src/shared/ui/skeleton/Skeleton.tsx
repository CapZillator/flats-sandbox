import type { HTMLAttributes } from "react";
import classNames from "classnames";

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={classNames(
        "animate-pulse rounded-compact bg-border-light motion-reduce:animate-none",
        className,
      )}
    />
  );
}
