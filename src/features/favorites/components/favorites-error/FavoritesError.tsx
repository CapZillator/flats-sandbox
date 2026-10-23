"use client";

import { useParams } from "next/navigation";
import { getFavoritesCopy } from "@/features/favorites/favorites.copy";
import { isLocale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { Button, EmptyState, WarningIcon } from "@/shared/ui";

export function FavoritesError({ retry }: { retry: () => void }) {
  const params = useParams();
  const locale =
    typeof params.locale === "string" && isLocale(params.locale)
      ? params.locale
      : "en";
  const copy = getFavoritesCopy(locale);

  return (
    <EmptyState
      title={copy.errorTitle}
      description={copy.error}
      icon={<WarningIcon className="size-5" />}
      role="alert"
      action={
        <Button variant="outline" onClick={retry}>
          {getDictionary(locale).common.retry}
        </Button>
      }
    />
  );
}
