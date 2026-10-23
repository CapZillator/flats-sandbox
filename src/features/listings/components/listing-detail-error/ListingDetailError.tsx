"use client";

import { useParams } from "next/navigation";

import { isLocale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { Button, EmptyState, WarningIcon } from "@/shared/ui";
import { getListingDetailCopy } from "../listing-detail/listing-detail.copy";

export function ListingDetailError({ retry }: { retry: () => void }) {
  const params = useParams();
  const locale =
    typeof params.locale === "string" && isLocale(params.locale)
      ? params.locale
      : "en";
  const copy = getListingDetailCopy(locale);

  return (
    <div className="content-container page-gutters py-8">
      <EmptyState
        role="alert"
        icon={<WarningIcon className="size-5" />}
        title={copy.errorTitle}
        description={copy.errorCopy}
        action={
          <Button variant="outline" onClick={retry}>
            {getDictionary(locale).common.retry}
          </Button>
        }
      />
    </div>
  );
}
