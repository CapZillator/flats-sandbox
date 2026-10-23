import classNames from "classnames";

import {
  controlHeightClasses,
  type ControlSize,
} from "@/shared/ui/control-size/control-size";

export type ButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "danger";

export type ButtonSize = "xs" | ControlSize;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-foreground bg-accent text-accent-content hover:bg-accent-hover",
  secondary:
    "border-foreground bg-foreground text-surface hover:bg-foreground-soft",
  outline:
    "border-border bg-surface text-foreground hover:border-foreground hover:bg-surface-muted",
  ghost:
    "border-transparent bg-transparent text-foreground hover:border-border hover:bg-surface-muted",
  danger: "border-danger bg-danger text-white hover:brightness-90",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "h-7 px-2 text-caption",
  sm: classNames(controlHeightClasses.sm, "px-3 text-body-sm"),
  md: classNames(controlHeightClasses.md, "px-4 text-body-sm"),
  lg: classNames(controlHeightClasses.lg, "px-5 text-body"),
};

const iconSizeClasses: Record<ButtonSize, string> = {
  xs: "size-7 text-caption",
  sm: classNames(controlHeightClasses.sm, "w-9 text-body-sm"),
  md: classNames(controlHeightClasses.md, "w-11 text-body-sm"),
  lg: classNames(controlHeightClasses.lg, "w-12 text-body"),
};

export function getButtonClassName({
  variant = "primary",
  size = "md",
  fullWidth = false,
  iconOnly = false,
  shape = "control",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconOnly?: boolean;
  shape?: "control" | "circle";
  className?: string;
}): string {
  return classNames(
    "inline-flex shrink-0 items-center justify-center gap-2 border font-semibold",
    "transition-[background-color,border-color,color,filter,transform] duration-150",
    "active:translate-x-px active:translate-y-px",
    "disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-muted disabled:filter-none disabled:active:translate-x-0 disabled:active:translate-y-0",
    shape === "circle" ? "rounded-full" : "rounded-control",
    variantClasses[variant],
    iconOnly ? iconSizeClasses[size] : sizeClasses[size],
    fullWidth && "w-full",
    className,
  );
}
