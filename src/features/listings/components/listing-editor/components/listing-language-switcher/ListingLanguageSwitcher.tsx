"use client";

import { locales, type Locale } from "@/shared/i18n/config";
import { AdaptiveDropdown, GlobeIcon } from "@/shared/ui";

export function ListingLanguageSwitcher({
  closeLabel,
  label,
  onLocaleChange,
  value,
}: {
  closeLabel: string;
  label: string;
  onLocaleChange: (locale: Locale) => void;
  value: Locale;
}) {
  const options = locales.map((locale) => ({
    value: locale,
    label: locale.toUpperCase(),
  }));

  return (
    <AdaptiveDropdown
      aria-label={label}
      closeLabel={closeLabel}
      containerClassName="shrink-0"
      fullWidth={false}
      icon={<GlobeIcon className="size-5" />}
      onValueChange={(nextLocale) => onLocaleChange(nextLocale as Locale)}
      options={options}
      sheetIcon={<GlobeIcon className="size-5" />}
      sheetTitle={label}
      size="sm"
      value={value}
      variant="outline"
    />
  );
}
