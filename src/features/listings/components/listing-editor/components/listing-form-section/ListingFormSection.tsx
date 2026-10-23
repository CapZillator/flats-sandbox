import type { ReactNode } from "react";

export function ListingFormSection({
  children,
  description,
  number,
  title,
}: {
  children: ReactNode;
  description: string;
  number: string;
  title: string;
}) {
  return (
    <section className="grid gap-6 rounded-surface border border-border bg-surface p-4 md:p-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10">
      <header className="self-start lg:sticky lg:top-24">
        <span className="inline-flex min-w-9 items-center justify-center rounded-compact bg-accent px-2 py-1 text-caption font-bold text-accent-content">
          {number}
        </span>

        <h2 className="mt-3 text-h3 text-foreground">{title}</h2>

        <p className="mt-2 text-body-sm text-muted">{description}</p>
      </header>

      <div className="min-w-0">{children}</div>
    </section>
  );
}
