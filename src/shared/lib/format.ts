import type { Currency } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";

const localeTags: Record<Locale, string> = {
  en: "en-US",
  ru: "ru-RU",
  vi: "vi-VN",
};
export function formatMoney(
  value: string | number,
  currency: Currency,
  locale: Locale,
): string {
  return new Intl.NumberFormat(localeTags[locale], {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value));
}
export function formatDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeTags[locale], {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
