import type { AriaRole, ReactNode } from "react";
import classNames from "classnames";

export function EmptyState({
  action,
  className,
  description,
  icon,
  role,
  title,
}: {
  action?: ReactNode;
  className?: string;
  description?: ReactNode;
  icon: ReactNode;
  role?: AriaRole;
  title: ReactNode;
}) {
  return (
    <section
      className={classNames(
        "grid justify-items-center gap-3 rounded-surface border border-border bg-surface px-5 py-12 text-center",
        className,
      )}
      role={role}
    >
      <span
        aria-hidden="true"
        className="flex size-10 items-center justify-center text-foreground [&>svg]:size-full"
      >
        {icon}
      </span>

      <h2 className="text-h3 text-foreground">{title}</h2>

      {description ? (
        <p className="max-w-md text-body-sm text-muted">{description}</p>
      ) : null}

      {action ? <div className="mt-2">{action}</div> : null}
    </section>
  );
}
