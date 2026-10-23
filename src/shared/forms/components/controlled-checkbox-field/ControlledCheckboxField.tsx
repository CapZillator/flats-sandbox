"use client";

import { useId, type ReactNode } from "react";
import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import { Checkbox, Field, type CheckboxProps } from "@/shared/ui";

import { makeFieldId, mergeDescriptionIds } from "@/shared/forms/helpers";

type ControlledCheckboxFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, boolean | undefined>,
> = Omit<
  CheckboxProps,
  "checked" | "defaultChecked" | "name" | "onBlur" | "onChange" | "ref"
> & {
  control: Control<TFieldValues>;
  name: TName;
  hint?: ReactNode;
  containerClassName?: string;
};

export function ControlledCheckboxField<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, boolean | undefined>,
>({
  "aria-describedby": describedBy,
  containerClassName,
  control,
  hint,
  id,
  label,
  name,
  ...checkboxProps
}: ControlledCheckboxFieldProps<TFieldValues, TName>) {
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
          >
            <Checkbox
              {...checkboxProps}
              ref={field.ref}
              id={inputId}
              name={field.name}
              checked={field.value ?? false}
              onBlur={field.onBlur}
              onChange={field.onChange}
              label={label}
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
