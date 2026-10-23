import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import classNames from "classnames";

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: ReactNode;
  invalid?: boolean;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { className, disabled, invalid = false, label, ...props },
    ref,
  ) {
    return (
      <label
        className={classNames(
          "inline-flex min-h-11 items-start gap-2.5 py-2 text-body-sm text-foreground",
          disabled ? "cursor-not-allowed text-muted" : "cursor-pointer",
          className,
        )}
      >
        <input
          {...props}
          ref={ref}
          type="checkbox"
          disabled={disabled}
          aria-invalid={invalid || props["aria-invalid"] || undefined}
          className="peer sr-only"
        />

        <span
          aria-hidden="true"
          className={classNames(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-compact border-2 border-foreground text-sm font-bold leading-none text-transparent",
            "transition-colors duration-150 peer-checked:bg-accent peer-checked:text-accent-content",
            "peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
            "peer-disabled:border-disabled peer-disabled:bg-disabled peer-disabled:text-transparent",
            invalid && "border-danger",
          )}
        >
          ✓
        </span>

        <span className="pt-px">{label}</span>
      </label>
    );
  },
);
