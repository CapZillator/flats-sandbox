import { getAdminCopy } from "@/features/admin/admin.copy";
import { ListingGallery } from "@/features/listings/components/listing-gallery/ListingGallery";
import type { ModerationListing } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { getLocalizedText } from "@/shared/i18n/localized-text";
import { formatDate, formatMoney } from "@/shared/lib/format";
import { Badge } from "@/shared/ui";

export function ModerationDetail({
  listing,
  locale,
}: {
  listing: ModerationListing;
  locale: Locale;
}) {
  const copy = getAdminCopy(locale);
  const d = getDictionary(locale);
  const f = d.listingForm.fields;
  const furnishing = {
    UNFURNISHED: d.listingForm.options.furnishing.unfurnished,
    PARTLY_FURNISHED: d.listingForm.options.furnishing.partly,
    FULLY_FURNISHED: d.listingForm.options.furnishing.fully,
  };
  const facts = [
    [f.propertyType, d.catalog.propertyTypes[listing.propertyType]],
    [f.location, getLocalizedText(listing.location.name, locale)],
    [f.address, listing.addressLine ?? "—"],
    [copy.coordinates, `${listing.latitude}, ${listing.longitude}`],
    [f.bedrooms, listing.bedrooms],
    [f.bathrooms, listing.bathrooms],
    [f.floorArea, listing.floorAreaSqm ?? "—"],
    [f.floor, listing.floor ?? "—"],
    [f.furnishing, listing.furnishing ? furnishing[listing.furnishing] : "—"],
    [
      f.monthlyPrice,
      formatMoney(listing.monthlyPrice, listing.currency, locale),
    ],
    [
      f.securityDeposit,
      listing.securityDeposit === null
        ? "—"
        : formatMoney(listing.securityDeposit, listing.currency, locale),
    ],
    [f.minimumLease, listing.minimumLeaseMonths],
    [
      f.availableFrom,
      listing.availableFrom ? formatDate(listing.availableFrom, locale) : "—",
    ],
    [f.petsAllowed, listing.petsAllowed ? copy.yes : copy.no],
    [d.listing.featured, listing.isFeatured ? copy.yes : copy.no],
  ];
  const panel =
    "grid min-w-0 gap-4 rounded-surface border border-border bg-surface p-5";
  const translations = Array.from(
    new Set([
      ...Object.keys(listing.title),
      ...Object.keys(listing.description),
    ]),
  );

  return (
    <div className="grid min-w-0 gap-6">
      {listing.images.length ? (
        <ListingGallery
          images={listing.images}
          title={getLocalizedText(listing.title, locale)}
          locale={locale}
        />
      ) : (
        <p className={panel}>{copy.noPhotos}</p>
      )}

      <section className={panel}>
        <h2 className="text-h3">{copy.translations}</h2>

        {translations.map((language) => (
          <div
            key={language}
            className="grid gap-2 border-t border-border-light pt-4"
          >
            <Badge className="w-fit">{language.toUpperCase()}</Badge>

            <h3 className="break-words text-body font-semibold" lang={language}>
              {listing.title[language] || "—"}
            </h3>

            <p
              className="whitespace-pre-wrap break-words text-body-sm"
              lang={language}
            >
              {listing.description[language] || "—"}
            </p>
          </div>
        ))}
      </section>

      <section className={panel}>
        <h2 className="text-h3">{copy.facts}</h2>

        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="text-body-sm text-muted">{label}</dt>

              <dd className="mt-1 break-words text-body-sm font-semibold">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={panel}>
        <h2 className="text-h3">{d.listing.amenities}</h2>

        <ul className="grid gap-2">
          {listing.amenities?.length ? (
            listing.amenities.map(({ amenity }) => (
              <li key={amenity.id}>{getLocalizedText(amenity.name, locale)}</li>
            ))
          ) : (
            <li>—</li>
          )}
        </ul>

        <h2 className="text-h3">{f.nearbyNature}</h2>

        <ul className="grid gap-2">
          {listing.environmentFeatures?.length ? (
            listing.environmentFeatures.map(
              ({ feature, distanceMeters, source, verifiedAt }) => (
                <li key={feature.id} className="text-body-sm">
                  {getLocalizedText(feature.name, locale)} ·{" "}
                  {distanceMeters ?? "—"} m · {source} ·{" "}
                  {verifiedAt ? formatDate(verifiedAt, locale) : "—"}
                </li>
              ),
            )
          ) : (
            <li>—</li>
          )}
        </ul>
      </section>

      <section className={panel}>
        <h2 className="text-h3">{copy.author}</h2>

        <p className="break-all text-body-sm">{listing.owner.email}</p>

        <p className="text-body-sm">
          {listing.owner.name || "—"} · {copy.authorStatus}:{" "}
          {listing.owner.status}
        </p>

        {Object.entries(listing.owner.displayName ?? {}).map(
          ([language, value]) => (
            <p
              key={`name-${language}`}
              lang={language}
              className="break-words text-body-sm"
            >
              {language.toUpperCase()}: {value}
            </p>
          ),
        )}

        {Object.entries(listing.owner.bio ?? {}).map(([language, value]) => (
          <p
            key={`bio-${language}`}
            lang={language}
            className="whitespace-pre-wrap break-words text-body-sm text-muted"
          >
            {language.toUpperCase()}: {value}
          </p>
        ))}

        <h3 className="text-body font-semibold">{copy.contacts}</h3>

        <ul className="grid gap-2">
          {listing.owner.contacts.length ? (
            listing.owner.contacts.map((contact) => (
              <li
                key={contact.id}
                className="flex flex-wrap gap-2 break-all text-body-sm"
              >
                <span>
                  {contact.type}: {contact.value}
                </span>

                {contact.isPrimary ? <Badge>{copy.primary}</Badge> : null}
              </li>
            ))
          ) : (
            <li className="text-body-sm text-muted">{copy.noContacts}</li>
          )}
        </ul>
      </section>

      <section className={panel}>
        <h2 className="text-h3">{copy.blocks}</h2>

        <ul className="grid gap-3">
          {listing.availabilityBlocks.length ? (
            listing.availabilityBlocks.map((block) => (
              <li
                key={block.id}
                className="grid gap-1 border-t border-border-light pt-3 text-body-sm"
              >
                <strong>
                  {formatDate(block.startsOn, locale)} —{" "}
                  {formatDate(block.endsOn, locale)}
                </strong>

                <span>{d.availabilityManager.types[block.type]}</span>

                {block.note ? (
                  <p className="whitespace-pre-wrap break-words text-muted">
                    {block.note}
                  </p>
                ) : null}
              </li>
            ))
          ) : (
            <li className="text-body-sm text-muted">{copy.noBlocks}</li>
          )}
        </ul>
      </section>
    </div>
  );
}
