"use client";

import { useId, type ReactNode } from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import type { Locale } from "@/shared/i18n/config";
import type { LocalizedText } from "@/shared/i18n/localized-text";
import { Field, Textarea, type TextareaProps } from "@/shared/ui";

import { makeFieldId, mergeDescriptionIds } from "@/shared/forms/helpers";

type ControlledLocalizedTextareaFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, LocalizedText | undefined>,
> = Omit<
  TextareaProps,
  "defaultValue" | "name" | "onBlur" | "onChange" | "ref" | "value"
> & {
  control: Control<TFieldValues>;
  name: TName;
  locale: Locale;
  label?: ReactNode;
  hint?: ReactNode;
  localeLabel?: ReactNode;
  containerClassName?: string;
};

export function ControlledLocalizedTextareaField<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, LocalizedText | undefined>,
>({
  "aria-describedby": describedBy,
  containerClassName,
  control,
  hint,
  id,
  label,
  locale,
  localeLabel = locale.toUpperCase(),
  name,
  required,
  ...textareaProps
}: ControlledLocalizedTextareaFieldProps<TFieldValues, TName>) {
  const reactId = useId();
  const inputId = id ?? makeFieldId(reactId);
  const localizedName = `${name}.${locale}` as FieldPath<TFieldValues>;

  return (
    <Controller
      control={control}
      name={localizedName}
      render={({ field, fieldState }) => {
        const error = fieldState.error?.message;
        const value = typeof field.value === "string" ? field.value : "";

        return (
          <Field
            className={containerClassName}
            error={error}
            hint={hint}
            htmlFor={inputId}
            label={label}
            labelSuffix={localeLabel}
            required={required}
          >
            <Textarea
              {...textareaProps}
              {...field}
              id={inputId}
              required={required}
              value={value}
              invalid={Boolean(error)}
              aria-describedby={mergeDescriptionIds({
                describedBy,
                error,
                hint,
                inputId,
              })}
            />
          </Field>
        );
      }}
    />
  );
}
