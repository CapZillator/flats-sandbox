"use client";

import { useParams } from "next/navigation";

import { isLocale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { Button, EmptyState, WarningIcon } from "@/shared/ui";

export function OwnerListingsError({ retry }: { retry: () => void }) {
  const params = useParams();
  const locale =
    typeof params.locale === "string" && isLocale(params.locale)
      ? params.locale
      : "en";
  const dictionary = getDictionary(locale);

  return (
    <EmptyState
      action={
        <Button onClick={retry} variant="outline">
          {dictionary.common.retry}
        </Button>
      }
      description={dictionary.ownerListings.errorCopy}
      icon={<WarningIcon className="size-5" />}
      role="alert"
      title={dictionary.ownerListings.errorTitle}
    />
  );
}
