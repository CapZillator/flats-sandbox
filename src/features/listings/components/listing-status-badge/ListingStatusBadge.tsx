import type { ListingStatus } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { Badge, type BadgeTone } from "@/shared/ui";

const statusTones: Record<ListingStatus, BadgeTone> = {
  DRAFT: "neutral",
  PENDING_REVIEW: "warning",
  PUBLISHED: "success",
  REJECTED: "danger",
  ARCHIVED: "neutral",
};

export function ListingStatusBadge({
  locale,
  status,
}: {
  locale: Locale;
  status: ListingStatus;
}) {
  return (
    <Badge tone={statusTones[status]}>
      {getDictionary(locale).listingManagement.statuses[status]}
    </Badge>
  );
}
