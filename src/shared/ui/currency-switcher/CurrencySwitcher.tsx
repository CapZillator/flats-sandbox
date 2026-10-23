"use client";

import type { Locale } from "@/shared/i18n/config";
import { AdaptiveDropdown } from "@/shared/ui";
import {
  currencies,
  currencySymbols,
  isCurrency,
} from "@/shared/currency/currency";
import { useCurrency } from "@/shared/currency/components/currency-provider/CurrencyProvider";

export function CurrencySwitcher({
  locale,
  closeLabel,
}: {
  locale: Locale;
  closeLabel: string;
}) {
  const context = useCurrency();
  const label = { en: "Currency", ru: "Валюта", vi: "Tiền tệ" }[locale];

  if (!context) {
    return null;
  }

  return (
    <AdaptiveDropdown
      aria-label={label}
      closeLabel={closeLabel}
      className="font-semibold uppercase"
      containerClassName="shrink-0"
      fullWidth={false}
      options={currencies.map((currency) => ({
        value: currency,
        label: `${currencySymbols[currency]} ${currency}`,
      }))}
      popoverAlign="right"
      popoverClassName="min-w-max"
      sheetTitle={label}
      size="sm"
      value={context.currency}
      variant="ghost"
      onValueChange={(value) => {
        if (isCurrency(value)) {
          context.setCurrency(value);
        }
      }}
    />
  );
}
