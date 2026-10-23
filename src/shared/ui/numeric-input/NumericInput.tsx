import { forwardRef, type ReactNode } from "react";
import classNames from "classnames";

import { TextInput, type TextInputProps } from "@/shared/ui/text-input";

export type NumericInputProps = Omit<
  TextInputProps,
  "defaultValue" | "inputMode" | "onChange" | "type" | "value"
> & {
  allowNegative?: boolean;
  maxFractionDigits?: number;
  onChange: (value: string) => void;
  suffix?: ReactNode;
  value?: string;
};

function normalizeNumericValue(
  value: string,
  allowNegative: boolean,
  maxFractionDigits: number,
) {
  const compactValue = value.replace(/[\s\u00a0\u202f]/g, "").replace(",", ".");
  const signPattern = allowNegative ? "-?" : "";
  const fractionPattern =
    maxFractionDigits > 0 ? `(?:\\.\\d{0,${maxFractionDigits}})?` : "";
  const numericPattern = new RegExp(`^${signPattern}\\d*${fractionPattern}$`);

  if (!numericPattern.test(compactValue)) {
    return null;
  }

  return compactValue;
}

export function formatNumericValue(value: string) {
  if (value === "" || value === "-") {
    return value;
  }

  const sign = value.startsWith("-") ? "-" : "";
  const unsignedValue = sign ? value.slice(1) : value;
  const [integerPart, fractionPart] = unsignedValue.split(".");
  const groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const formattedInteger =
    groupedInteger || (fractionPart !== undefined ? "0" : "");

  if (fractionPart === undefined) {
    return `${sign}${formattedInteger}`;
  }

  return `${sign}${formattedInteger}.${fractionPart}`;
}

export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  function NumericInput(
    {
      allowNegative = false,
      className,
      maxFractionDigits = 0,
      onChange,
      suffix,
      value = "",
      ...props
    },
    ref,
  ) {
    return (
      <div className="relative min-w-0">
        <TextInput
          {...props}
          ref={ref}
          className={classNames(Boolean(suffix) && "pr-16", className)}
          inputMode={
            allowNegative || maxFractionDigits > 0 ? "decimal" : "numeric"
          }
          type="text"
          value={formatNumericValue(value)}
          onChange={(event) => {
            const nextValue = normalizeNumericValue(
              event.target.value,
              allowNegative,
              maxFractionDigits,
            );

            if (nextValue === null) {
              return;
            }

            onChange(nextValue);
          }}
        />

        {suffix ? (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-body-sm font-semibold text-muted">
            {suffix}
          </span>
        ) : null}
      </div>
    );
  },
);
