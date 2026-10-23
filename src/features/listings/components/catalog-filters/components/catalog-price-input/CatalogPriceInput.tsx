"use client";

import { useState } from "react";

import { NumericInput } from "@/shared/ui";

export function CatalogPriceInput({
  defaultValue,
  id,
  name,
}: {
  defaultValue: string;
  id: string;
  name: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <>
      <NumericInput
        id={id}
        maxFractionDigits={2}
        onChange={setValue}
        value={value}
      />

      <input type="hidden" name={name} value={value} />
    </>
  );
}
