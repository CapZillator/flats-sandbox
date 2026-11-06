import { Money } from "@/shared/ui/money/Money";
import { AvailabilityCalendar } from "@/features/availability/components/availability-calendar/AvailabilityCalendar";
import { ContactPanel } from "@/features/contacts/components/contact-panel/ContactPanel";
import { FavoriteButton } from "@/features/favorites/components/favorite-button/FavoriteButton";
import type { Listing } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { getLocalizedText } from "@/shared/i18n/localized-text";
import { localizedPath } from "@/shared/i18n/routing";
import { formatDate } from "@/shared/lib/format";
import {
  AreaIcon,
  BackLink,
  Badge,
  BathroomIcon,
  BedIcon,
  CalendarDaysIcon,
  CouchIcon,
  LocationIcon,
  PetFriendlyIcon,
  StairsIcon,
  VaultIcon,
} from "@/shared/ui";
import { ListingGallery } from "../listing-gallery/ListingGallery";
import { LandlordTypeBadge } from "../landlord-type-badge/LandlordTypeBadge";
import { getListingDetailCopy } from "./listing-detail.copy";
import { AmenityIcon } from "../amenity-icon/AmenityIcon";
import { EnvironmentFeatureIcon } from "../environment-feature-icon/EnvironmentFeatureIcon";
import { ListingLocationMap } from "../listing-location-map/ListingLocationMap";
import { ListingCurrencyConverter } from "../listing-currency-converter/ListingCurrencyConverter";

export function ListingDetail({
  listing,
  locale,
  signedIn,
  blocks,
  calendarStart,
  calendarEnd,
}: {
  listing: Listing;
  locale: Locale;
  signedIn: boolean;
  blocks: Array<{ startsOn: string; endsOn: string }> | null;
  calendarStart: string;
  calendarEnd: string;
}) {
  const d = getDictionary(locale);
  const copy = getListingDetailCopy(locale);
  const fields = d.listingForm.fields;
  const title = getLocalizedText(listing.title, locale);
  const furnishing = {
    UNFURNISHED: d.listingForm.options.furnishing.unfurnished,
    PARTLY_FURNISHED: d.listingForm.options.furnishing.partly,
    FULLY_FURNISHED: d.listingForm.options.furnishing.fully,
  };
  const facts = [
    { label: fields.bedrooms, value: String(listing.bedrooms), icon: BedIcon },
    {
      label: fields.bathrooms,
      value: String(listing.bathrooms),
      icon: BathroomIcon,
    },
    ...(listing.floorAreaSqm
      ? [
          {
            label: fields.floorArea,
            value: new Intl.NumberFormat(locale).format(
              Number(listing.floorAreaSqm),
            ),
            icon: AreaIcon,
          },
        ]
      : []),
    ...(listing.floor !== null
      ? [
          {
            label: fields.floor,
            value: String(listing.floor),
            icon: StairsIcon,
          },
        ]
      : []),
  ];
  const terms = [
    {
      label: copy.minimumLease,
      value: `${listing.minimumLeaseMonths} ${copy.months}`,
      icon: CalendarDaysIcon,
    },
    ...(listing.securityDeposit !== null
      ? [
          {
            label: fields.securityDeposit,
            value: (
              <Money
                amount={listing.securityDeposit}
                currency={listing.currency}
                locale={locale}
              />
            ),
            icon: VaultIcon,
          },
        ]
      : []),
    {
      label: fields.petsAllowed,
      value: listing.petsAllowed ? copy.yes : copy.no,
      icon: PetFriendlyIcon,
    },
    ...(listing.furnishing
      ? [
          {
            label: fields.furnishing,
            value: furnishing[listing.furnishing],
            icon: CouchIcon,
          },
        ]
      : []),
  ];
  const ownerName =
    getLocalizedText(listing.owner?.displayName, locale) || listing.owner?.name;
  const ownerBio = getLocalizedText(listing.owner?.bio, locale);
  const panel =
    "grid gap-4 rounded-surface border border-border bg-surface p-5 sm:p-6";
  const latitude = Number(listing.latitude);
  const longitude = Number(listing.longitude);
  const hasCoordinates =
    listing.latitude !== null &&
    listing.longitude !== null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180;

  return (
    <div className="content-container page-gutters grid gap-6 py-6 md:gap-8 md:py-10">
      <BackLink href={localizedPath(locale, "/listings")}>
        {d.listing.back}
      </BackLink>

      <header className="grid gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{d.catalog.propertyTypes[listing.propertyType]}</Badge>

          <LandlordTypeBadge
            type={listing.owner?.landlordType}
            locale={locale}
          />

          {listing.isFeatured ? (
            <Badge tone="accent">{d.listing.featured}</Badge>
          ) : null}
        </div>

        <h1 className="text-h1 text-foreground">{title}</h1>

        <p className="flex items-start gap-1.5 text-body-sm font-medium text-foreground">
          <LocationIcon className="mt-0.5 size-4 shrink-0" />

          <span className="min-w-0 break-words">
            {getLocalizedText(listing.location.name, locale)}

            {listing.addressLine ? `, ${listing.addressLine}` : null}
          </span>
        </p>
      </header>

      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8">
        <ListingGallery images={listing.images} title={title} locale={locale} />

        <article className="@container order-last grid min-w-0 gap-6 lg:order-none lg:col-start-1 lg:row-start-2">
          <dl className="grid grid-cols-2 gap-4 rounded-surface border border-border bg-surface p-5 sm:grid-cols-4 sm:p-6">
            {facts.map(({ label, value, icon: Icon }) => (
              <div key={label} className="min-w-0">
                <dt className="text-caption text-muted">{label}</dt>

                <dd className="mt-1 flex items-center gap-3 text-h3 text-foreground">
                  <Icon className="size-6 shrink-0" />

                  <span>{value}</span>
                </dd>
              </div>
            ))}
          </dl>

          <section className={panel}>
            <h2 className="text-h3 text-foreground">{d.listing.about}</h2>

            <p className="whitespace-pre-wrap break-words text-body text-foreground">
              {getLocalizedText(listing.description, locale)}
            </p>
          </section>

          <section className={panel}>
            <h2 className="text-h3 text-foreground">{copy.terms}</h2>

            <dl className="grid gap-4 sm:grid-cols-2">
              {terms.map(({ label, value, icon: Icon }) => (
                <div key={label}>
                  <dt className="text-body-sm text-muted">{label}</dt>

                  <dd className="mt-1 flex items-center gap-3 text-body-sm font-semibold text-foreground">
                    <Icon className="size-6 shrink-0" />

                    <span>{value}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {listing.amenities?.length ? (
            <section className={panel}>
              <h2 className="text-h3 text-foreground">{d.listing.amenities}</h2>

              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {listing.amenities.map(({ amenity }) => (
                  <li
                    className="flex items-center gap-3 text-body-sm text-foreground"
                    key={amenity.id}
                  >
                    <AmenityIcon
                      slug={amenity.slug}
                      className="size-6 shrink-0"
                    />

                    {getLocalizedText(amenity.name, locale)}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {listing.environmentFeatures?.length ? (
            <section className={panel}>
              <h2 className="text-h3 text-foreground">{copy.nearby}</h2>

              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {listing.environmentFeatures.map(
                  ({ feature, distanceMeters }) => (
                    <li
                      className="flex items-center gap-3 text-body-sm text-foreground"
                      key={feature.id}
                    >
                      <EnvironmentFeatureIcon
                        slug={feature.slug}
                        className="size-6 shrink-0"
                      />

                      <span>
                        {getLocalizedText(feature.name, locale)}

                        {distanceMeters !== null ? (
                          <span className="text-muted">
                            {" "}
                            ·{" "}
                            {new Intl.NumberFormat(locale).format(
                              distanceMeters,
                            )}{" "}
                            {copy.meters}
                          </span>
                        ) : null}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </section>
          ) : null}

          <div
            className={`grid min-w-0 gap-6 ${hasCoordinates ? "@min-[52rem]:grid-cols-2" : ""}`}
          >
            <section className={`${panel} min-w-0 content-start`}>
              <h2 className="text-h3 text-foreground">
                {d.listing.availability}
              </h2>

              {listing.availableFrom ? (
                <p className="text-body-sm text-foreground">
                  {fields.availableFrom}:{" "}
                  {formatDate(listing.availableFrom, locale)}
                </p>
              ) : null}

              {blocks ? (
                <>
                  <AvailabilityCalendar
                    locale={locale}
                    blocks={blocks}
                    start={calendarStart}
                    end={calendarEnd}
                    availableFrom={listing.availableFrom}
                  />

                  <p className="text-caption text-muted">{copy.calendarHint}</p>
                </>
              ) : (
                <p role="alert" className="text-body-sm text-danger">
                  {copy.calendarError}
                </p>
              )}
            </section>

            {hasCoordinates ? (
              <section className="flex min-w-0 flex-col gap-4 rounded-surface border border-border bg-surface p-5 sm:p-6">
                <h2 className="text-h3 text-foreground">
                  {d.listing.location}
                </h2>

                <p className="text-body-sm text-muted">
                  {getLocalizedText(listing.location.name, locale)}

                  {listing.addressLine ? `, ${listing.addressLine}` : null}
                </p>

                <ListingLocationMap
                  latitude={latitude}
                  longitude={longitude}
                  label={`${d.catalog.map}: ${title}`}
                  locale={locale}
                />
              </section>
            ) : null}
          </div>
        </article>

        <aside className="grid min-w-0 gap-5 lg:sticky lg:top-[calc(4rem+1px+1.5rem)] lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <section className={panel}>
            <div>
              <p className="text-h2 text-foreground">
                <Money
                  amount={listing.monthlyPrice}
                  currency={listing.currency}
                  locale={locale}
                />
              </p>

              <p className="text-body-sm text-muted">{d.listing.perMonth}</p>

              <div className="mt-3">
                <ListingCurrencyConverter
                  amount={listing.monthlyPrice}
                  currency={listing.currency}
                  locale={locale}
                />
              </div>
            </div>

            <FavoriteButton
              listingId={listing.id}
              locale={locale}
              labels={{
                favorite: d.listing.favorite,
                saved: d.listing.saved,
                signIn: d.nav.signIn,
                added: d.listing.favoriteAdded,
                removed: d.listing.favoriteRemoved,
                error: d.listing.favoriteError,
              }}
            />

            <div className="grid gap-3 border-t border-border-light pt-5">
              <h2 className="text-h3 text-foreground">{d.listing.contacts}</h2>

              <ContactPanel
                listingId={listing.id}
                locale={locale}
                dictionary={d}
                signedIn={signedIn}
                callbackPath={localizedPath(
                  locale,
                  `/listings/${listing.slug}`,
                )}
              />
            </div>
          </section>

          {ownerName || ownerBio ? (
            <section className={panel}>
              <h2 className="text-h3 text-foreground">{copy.owner}</h2>

              {ownerName ? (
                <p className="text-body font-semibold text-foreground">
                  {ownerName}
                </p>
              ) : null}

              {ownerBio ? (
                <p className="whitespace-pre-wrap break-words text-body-sm text-muted">
                  {ownerBio}
                </p>
              ) : null}
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
