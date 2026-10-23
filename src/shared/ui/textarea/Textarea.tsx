import { forwardRef, type TextareaHTMLAttributes } from "react";
import classNames from "classnames";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      "aria-invalid": ariaInvalid,
      className,
      invalid = false,
      rows = 5,
      ...props
    },
    ref,
  ) {
    return (
      <textarea
        {...props}
        ref={ref}
        rows={rows}
        aria-invalid={invalid || ariaInvalid || undefined}
        className={classNames(
          "min-h-28 w-full resize-y rounded-control border bg-surface px-3 py-2.5 text-body text-foreground",
          "transition-colors duration-150 placeholder:text-muted",
          "hover:border-foreground-soft focus:border-foreground",
          "disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-muted",
          "read-only:bg-surface-muted",
          invalid ? "border-danger focus:border-danger" : "border-border",
          className,
        )}
      />
    );
  },
);
