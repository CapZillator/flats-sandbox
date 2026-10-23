"use client";

import { usePathname, useRouter } from "next/navigation";

import type { Locale } from "@/shared/i18n/config";
import { localePathname } from "@/shared/i18n/routing";
import { AdaptiveDropdown } from "@/shared/ui";
import { GlobeIcon } from "@/shared/ui/icon";

export function LocaleSwitcher({
  locale,
  label,
  closeLabel,
}: {
  locale: Locale;
  label: string;
  closeLabel?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <AdaptiveDropdown
      aria-label={label}
      closeLabel={closeLabel}
      containerClassName="shrink-0"
      className="font-semibold uppercase"
      fullWidth={false}
      icon={<GlobeIcon className="size-4" />}
      options={[
        { value: "en", label: "EN" },
        { value: "ru", label: "RU" },
        { value: "vi", label: "VI" },
      ]}
      popoverAlign="right"
      sheetIcon={<GlobeIcon className="size-5" />}
      sheetTitle={label}
      size="sm"
      value={locale}
      variant="ghost"
      onValueChange={(value) => {
        router.push(localePathname(pathname, value as Locale));
      }}
    />
  );
}
