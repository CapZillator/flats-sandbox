import type { LandlordType } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";
import { getLandlordTypeCopy } from "@/shared/i18n/landlord-type";
import { Badge } from "@/shared/ui";

export function LandlordTypeBadge({
  type,
  locale,
}: {
  type: LandlordType | null | undefined;
  locale: Locale;
}) {
  if (!type) {
    return null;
  }

  return <Badge>{getLandlordTypeCopy(locale)[type]}</Badge>;
}
