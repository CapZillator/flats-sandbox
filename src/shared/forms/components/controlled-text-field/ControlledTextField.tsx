"use client";

import { useId, type ReactNode } from "react";
import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import { Field, TextInput, type TextInputProps } from "@/shared/ui";

import { makeFieldId, mergeDescriptionIds } from "@/shared/forms/helpers";

type ControlledTextFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string | undefined>,
> = Omit<
  TextInputProps,
  "defaultValue" | "name" | "onBlur" | "onChange" | "ref" | "value"
> & {
  control: Control<TFieldValues>;
  name: TName;
  label?: ReactNode;
  hint?: ReactNode;
  containerClassName?: string;
};

export function ControlledTextField<
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
}: ControlledTextFieldProps<TFieldValues, TName>) {
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
            <TextInput
              {...inputProps}
              {...field}
              id={inputId}
              required={required}
              value={field.value ?? ""}
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
