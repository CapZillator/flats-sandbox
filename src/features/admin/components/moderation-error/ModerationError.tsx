"use client";
import { useParams } from "next/navigation";
import { getAdminCopy } from "@/features/admin/admin.copy";
import { isLocale } from "@/shared/i18n/config";
import { Button, EmptyState, WarningIcon } from "@/shared/ui";

export function ModerationError({ retry }: { retry: () => void }) {
  const params = useParams();
  const locale =
    typeof params.locale === "string" && isLocale(params.locale)
      ? params.locale
      : "en";
  const copy = getAdminCopy(locale);

  return (
    <EmptyState
      title={copy.loadError}
      icon={<WarningIcon className="size-5" />}
      role="alert"
      action={
        <Button variant="outline" onClick={retry}>
          {copy.retry}
        </Button>
      }
    />
  );
}
