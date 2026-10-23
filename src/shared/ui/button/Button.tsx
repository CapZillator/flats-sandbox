import type { ComponentPropsWithRef, ReactNode } from "react";
import classNames from "classnames";

import {
  getButtonClassName,
  type ButtonSize,
  type ButtonVariant,
} from "./button.styles";

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  loadingLabel?: ReactNode;
};

export function Button({
  children,
  className,
  disabled,
  fullWidth,
  loading = false,
  loadingLabel,
  size,
  type = "button",
  variant,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={getButtonClassName({
        variant,
        size,
        fullWidth,
        className,
      })}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className={classNames(
            "size-4 animate-spin rounded-full border-2 border-current border-r-transparent",
            "motion-reduce:animate-none",
          )}
        />
      ) : null}

      {loading && loadingLabel ? loadingLabel : children}
    </button>
  );
}
