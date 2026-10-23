import type { ReactNode } from "react";
import classNames from "classnames";

type FieldProps = {
  children: ReactNode;
  className?: string;
  error?: string;
  hint?: ReactNode;
  htmlFor?: string;
  label?: ReactNode;
  labelSuffix?: ReactNode;
  required?: boolean;
};

export function getFieldDescriptionIds({
  error,
  hint,
  inputId,
}: {
  error?: string;
  hint?: ReactNode;
  inputId: string;
}): string | undefined {
  const ids = [
    hint ? `${inputId}-hint` : null,
    error ? `${inputId}-error` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return ids || undefined;
}

export function Field({
  children,
  className,
  error,
  hint,
  htmlFor,
  label,
  labelSuffix,
  required = false,
}: FieldProps) {
  return (
    <div className={classNames("grid min-w-0 gap-1.5", className)}>
      {label ? (
        <div className="flex items-baseline justify-between gap-3">
          <label
            htmlFor={htmlFor}
            className="text-body-sm font-semibold text-foreground"
          >
            {label}

            {required ? (
              <span aria-hidden="true" className="ml-1 text-danger">
                *
              </span>
            ) : null}
          </label>

          {labelSuffix ? (
            <span className="text-caption font-semibold uppercase tracking-[0.08em] text-muted">
              {labelSuffix}
            </span>
          ) : null}
        </div>
      ) : null}

      {children}

      {hint ? (
        <p
          id={htmlFor ? `${htmlFor}-hint` : undefined}
          className="text-caption text-muted"
        >
          {hint}
        </p>
      ) : null}

      {error ? (
        <p
          id={htmlFor ? `${htmlFor}-error` : undefined}
          className="text-caption font-medium text-danger"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
