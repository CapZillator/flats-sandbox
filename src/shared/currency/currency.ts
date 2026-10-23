import type { Currency } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";
import { formatMoney } from "@/shared/lib/format";

export const currencies = ["USD", "VND", "RUB"] as const;
export const currencySymbols: Record<Currency, string> = {
  USD: "$",
  VND: "₫",
  RUB: "₽",
};
export const currencyCookie = "nestly.currency";
export type ExchangeRatesSnapshot = {
  baseCurrency: "USD";
  rates: Record<Currency, string>;
  updatedAt: string;
  asOf: string;
};

export function isCurrency(value: unknown): value is Currency {
  return currencies.some((currency) => currency === value);
}

export function defaultCurrency(locale: Locale): Currency {
  return { en: "USD", ru: "RUB", vi: "VND" }[locale] as Currency;
}

/** Converts an amount using USD-based rates, falling back when rates are invalid. */
export function formatConvertedMoney(
  amount: string | number,
  from: Currency,
  to: Currency,
  locale: Locale,
  snapshot?: ExchangeRatesSnapshot | null,
): string {
  if (from === to || !snapshot) {
    return formatMoney(amount, from, locale);
  }

  const fromRate = Number(snapshot.rates[from]);
  const toRate = Number(snapshot.rates[to]);

  if (!Number.isFinite(toRate) || toRate <= 0) {
    return formatMoney(amount, from, locale);
  }

  return formatMoney((Number(amount) / fromRate) * toRate, to, locale);
}
