import type { MapListing } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { getLandlordTypeCopy } from "@/shared/i18n/landlord-type";
import { getLocalizedText } from "@/shared/i18n/localized-text";
import { localizedPath } from "@/shared/i18n/routing";
import { BedIcon } from "@/shared/ui/icon";
import { PropertyTypeIcon } from "../../../property-type-icon/PropertyTypeIcon";

export function MapPopupDetails({
  item,
  locale,
  price,
}: {
  item: MapListing;
  locale: Locale;
  price: string;
}) {
  const dictionary = getDictionary(locale);
  const bedroomsLabel = `${dictionary.listingForm.fields.bedrooms}: ${item.bedrooms}`;

  return (
    <a
      className="grid min-w-48 gap-1 text-foreground"
      href={localizedPath(locale, `/listings/${encodeURIComponent(item.slug)}`)}
    >
      <span className="flex min-h-6 items-center gap-1.5 pr-7 text-caption font-medium">
        <PropertyTypeIcon
          type={item.propertyType}
          className="size-5 shrink-0"
        />

        <span>{dictionary.catalog.propertyTypes[item.propertyType]}</span>
      </span>

      <strong className="text-body-sm font-semibold">
        {getLocalizedText(item.title, locale)}
      </strong>

      {item.owner?.landlordType ? (
        <span className="text-caption font-semibold">
          {getLandlordTypeCopy(locale)[item.owner.landlordType]}
        </span>
      ) : null}

      <span className="flex flex-wrap items-center gap-1.5 text-caption font-semibold text-foreground">
        {item.propertyType !== "STUDIO" ? (
          <>
            <span
              className="inline-flex items-center gap-1.5"
              title={bedroomsLabel}
            >
              <BedIcon className="size-5 shrink-0" />

              <span className="sr-only">
                {dictionary.listingForm.fields.bedrooms}:{" "}
              </span>

              {item.bedrooms}
            </span>

            <span aria-hidden="true">·</span>
          </>
        ) : null}

        <span>{price}</span>
      </span>
    </a>
  );
}
