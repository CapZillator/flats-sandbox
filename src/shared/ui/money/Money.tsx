"use client";

import type { Currency } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";
import { formatMoney } from "@/shared/lib/format";
import {
  formatConvertedMoney,
  type ExchangeRatesSnapshot,
} from "@/shared/currency/currency";
import { useCurrency } from "@/shared/currency/components/currency-provider/CurrencyProvider";

export function Money({
  amount,
  currency,
  locale,
  snapshot,
}: {
  amount: string | number;
  currency: Currency;
  locale: Locale;
  snapshot?: ExchangeRatesSnapshot;
}) {
  const context = useCurrency();
  const target = context?.currency ?? currency;
  const original = formatMoney(amount, currency, locale);
  const displayed = formatConvertedMoney(
    amount,
    currency,
    target,
    locale,
    snapshot ?? context?.snapshot,
  );

  return (
    <span title={displayed === original ? undefined : original}>
      {displayed}
    </span>
  );
}
