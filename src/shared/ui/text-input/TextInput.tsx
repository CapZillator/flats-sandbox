import { forwardRef, type InputHTMLAttributes } from "react";
import classNames from "classnames";

import {
  controlHeightClasses,
  type ControlSize,
} from "@/shared/ui/control-size/control-size";

export type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  invalid?: boolean;
  size?: ControlSize;
};

const inputSizeClasses: Record<ControlSize, string> = {
  sm: "px-3 text-body-sm",
  md: "px-3 text-body",
  lg: "px-4 text-body",
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    {
      "aria-invalid": ariaInvalid,
      className,
      invalid = false,
      size = "md",
      ...props
    },
    ref,
  ) {
    return (
      <input
        {...props}
        ref={ref}
        aria-invalid={invalid || ariaInvalid || undefined}
        className={classNames(
          "w-full rounded-control border bg-surface text-foreground",
          "transition-colors duration-150 placeholder:text-muted",
          "hover:border-foreground-soft focus:border-foreground",
          "disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-muted",
          "read-only:bg-surface-muted",
          controlHeightClasses[size],
          inputSizeClasses[size],
          invalid ? "border-danger focus:border-danger" : "border-border",
          className,
        )}
      />
    );
  },
);
