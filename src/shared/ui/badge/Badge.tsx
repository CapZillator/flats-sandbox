import type { HTMLAttributes } from "react";
import classNames from "classnames";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-border bg-surface text-foreground",
  accent: "border-accent-hover bg-accent text-accent-content",
  success: "border-success bg-success/10 text-success",
  warning: "border-warning bg-warning/10 text-warning",
  danger: "border-danger bg-danger/10 text-danger",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      {...props}
      className={classNames(
        "inline-flex min-h-6 w-fit items-center rounded-compact border px-2 py-0.5 text-caption font-semibold",
        toneClasses[tone],
        className,
      )}
    />
  );
}
