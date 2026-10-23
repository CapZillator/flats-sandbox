"use client";

import { useId, type ReactNode } from "react";
import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import { makeFieldId, mergeDescriptionIds } from "@/shared/forms/helpers";
import { Field, NumericInput, type NumericInputProps } from "@/shared/ui";

type ControlledNumericFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string | undefined>,
> = Omit<
  NumericInputProps,
  "defaultValue" | "name" | "onBlur" | "onChange" | "ref" | "value"
> & {
  containerClassName?: string;
  control: Control<TFieldValues>;
  hint?: ReactNode;
  label?: ReactNode;
  name: TName;
};

export function ControlledNumericField<
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
  ...inputProps
}: ControlledNumericFieldProps<TFieldValues, TName>) {
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
            <NumericInput
              {...inputProps}
              id={inputId}
              invalid={Boolean(error)}
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              ref={field.ref}
              required={required}
              value={field.value ?? ""}
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
