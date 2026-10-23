import classNames from "classnames";
import Link from "next/link";

import type { Locale } from "@/shared/i18n/config";
import { localizedPath } from "@/shared/i18n/routing";

export function Logo({
  locale,
  label,
  inverse = false,
}: {
  locale: Locale;
  label: string;
  inverse?: boolean;
}) {
  return (
    <Link
      className={classNames(
        "inline-flex w-fit items-center gap-2.5",
        "transition-opacity duration-150 hover:opacity-70",
        inverse ? "text-surface" : "text-foreground",
      )}
      href={localizedPath(locale)}
      aria-label={label}
    >
      <svg
        aria-hidden="true"
        viewBox="20 40 320 200"
        fill="currentColor"
        className="h-[18px] w-auto shrink-0"
      >
        <path d="M34 219L66 151L108 117L136 68L184 50L222 79L244 113L282 129L327 219Q331 228 319 228H223Q214 228 214 219L217 178L204 148L182 135L163 151L151 180L148 220Q148 228 139 228H42Q29 228 34 219Z" />
      </svg>

      <span className="text-xl font-semibold tracking-[-0.03em]">manden</span>
    </Link>
  );
}
