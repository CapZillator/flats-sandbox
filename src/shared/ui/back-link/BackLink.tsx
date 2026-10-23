import type { ComponentProps } from "react";
import Link from "next/link";
import classNames from "classnames";

import { ArrowRightIcon } from "@/shared/ui/icon";

export function BackLink({
  children,
  className,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={classNames(
        "inline-flex w-fit items-center gap-3 rounded-control text-body-sm font-semibold text-foreground transition-colors hover:text-muted",
        className,
      )}
    >
      <ArrowRightIcon className="size-5 shrink-0 rotate-180" />

      <span>{children}</span>
    </Link>
  );
}
