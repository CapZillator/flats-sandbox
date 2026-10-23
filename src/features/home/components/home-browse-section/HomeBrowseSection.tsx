import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "@/shared/ui";

export function HomeBrowseSection({
  title,
  description,
  items,
  fallback,
  failed,
  icon,
}: {
  title: string;
  description: string;
  items: Array<{ id: string; label: string; href: string; icon?: ReactNode }>;
  fallback: string;
  failed: boolean;
  icon?: ReactNode;
}) {
  return (
    <section className="grid gap-5">
      <div className="grid gap-2 md:max-w-2xl">
        <h2 className="text-h2 text-foreground">{title}</h2>

        <p className="text-body text-muted">{description}</p>
      </div>

      {items.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex min-w-0 items-center gap-3 rounded-surface border border-border bg-surface p-5 transition-colors hover:border-foreground"
            >
              <span aria-hidden="true" className="shrink-0 text-foreground">
                {item.icon ?? icon}
              </span>

              <span className="min-w-0 flex-1 text-body font-semibold text-foreground">
                {item.label}
              </span>

              <ArrowRightIcon className="size-5 shrink-0 text-foreground" />
            </Link>
          ))}
        </div>
      ) : (
        <p
          role={failed ? "status" : undefined}
          className="rounded-surface border border-border bg-surface p-5 text-body-sm text-muted"
        >
          {fallback}
        </p>
      )}
    </section>
  );
}
