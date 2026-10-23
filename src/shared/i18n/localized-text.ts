import type { Locale } from "./config";

export type LocalizedText = Record<string, string>;

export function getLocalizedText(
  value: LocalizedText | null | undefined,
  locale: Locale,
  fallbackLocale: Locale = "en",
): string {
  if (!value) {
    return "";
  }

  return (
    value[locale]?.trim() ||
    value[fallbackLocale]?.trim() ||
    Object.values(value)
      .find((item) => item.trim())
      ?.trim() ||
    ""
  );
}
