"use client";

import { useId, type ReactNode } from "react";
import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import { DatePicker, Field, type DatePickerProps } from "@/shared/ui";

import { makeFieldId, mergeDescriptionIds } from "@/shared/forms/helpers";

type ControlledDatePickerProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string | undefined>,
> = Omit<
  DatePickerProps,
  "defaultValue" | "name" | "onBlur" | "onValueChange" | "value"
> & {
  containerClassName?: string;
  control: Control<TFieldValues>;
  hint?: ReactNode;
  label?: ReactNode;
  name: TName;
};

export function ControlledDatePicker<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string | undefined>,
>({
  "aria-describedby": describedBy,
  containerClassName,
  control,
  hint,
  id,
  label,
  name,
  required,
  ...datePickerProps
}: ControlledDatePickerProps<TFieldValues, TName>) {
  const reactId = useId();
  const inputId = id ?? makeFieldId(reactId);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const error = fieldState.error?.message;

        return (
          <Field
            className={containerClassName}
            error={error}
            hint={hint}
            htmlFor={inputId}
            label={label}
            required={required}
          >
            <DatePicker
              {...datePickerProps}
              ref={field.ref}
              id={inputId}
              name={field.name}
              value={field.value ?? ""}
              required={required}
              invalid={Boolean(error)}
              onBlur={field.onBlur}
              onValueChange={field.onChange}
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
