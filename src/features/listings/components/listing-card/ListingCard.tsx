import Image from "next/image";
import Link from "next/link";

import type { ListingCardData } from "@/shared/api/types";
import { Money } from "@/shared/ui/money/Money";
import type { ExchangeRatesSnapshot } from "@/shared/currency/currency";
import type { Locale } from "@/shared/i18n/config";
import type { Dictionary } from "@/shared/i18n/dictionaries";
import { getLocalizedText } from "@/shared/i18n/localized-text";
import { localizedPath } from "@/shared/i18n/routing";
import {
  AreaIcon,
  Badge,
  BathroomIcon,
  BedIcon,
  LocationIcon,
  SofaIcon,
} from "@/shared/ui";

import { FavoriteButton } from "@/features/favorites/components/favorite-button/FavoriteButton";
import { LandlordTypeBadge } from "../landlord-type-badge/LandlordTypeBadge";

export function ListingCard({
  dictionary,
  listing,
  locale,
  initiallySaved = false,
  snapshot,
}: {
  dictionary: Dictionary;
  listing: ListingCardData;
  locale: Locale;
  initiallySaved?: boolean;
  snapshot?: ExchangeRatesSnapshot;
}) {
  const image = listing.images[0];
  const title = getLocalizedText(listing.title, locale);
  const location = getLocalizedText(listing.location.name, locale);
  const href = localizedPath(locale, `/listings/${listing.slug}`);

  return (
    <article className="group flex min-w-0 flex-col rounded-surface border border-border-light bg-surface">
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden rounded-t-surface bg-surface-muted">
        <Link href={href} aria-label={title} className="block size-full">
          {image ? (
            <Image
              src={image.url}
              alt={getLocalizedText(image.alt, locale) || title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              sizes="(max-width: 719px) 100vw, (max-width: 1023px) 50vw, 33vw"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex size-full items-center justify-center text-muted"
            >
              <SofaIcon className="size-14" />
            </span>
          )}
        </Link>

        <div className="absolute top-3 right-3">
          <FavoriteButton
            compact
            initiallySaved={initiallySaved}
            listingId={listing.id}
            locale={locale}
            labels={{
              favorite: dictionary.listing.favorite,
              saved: dictionary.listing.saved,
              signIn: dictionary.nav.signIn,
              added: dictionary.listing.favoriteAdded,
              removed: dictionary.listing.favoriteRemoved,
              error: dictionary.listing.favoriteError,
            }}
          />
        </div>

        {listing.isFeatured ? (
          <Badge className="absolute top-3 left-3" tone="accent">
            {dictionary.listing.featured}
          </Badge>
        ) : null}
      </div>

      <Link
        href={href}
        className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-b-surface p-4"
      >
        <div className="flex min-w-0 items-center justify-between gap-3">
          <p className="flex min-w-0 items-center gap-1.5 text-body-sm font-medium text-muted">
            <LocationIcon className="size-4 shrink-0" />

            <span className="truncate">{location}</span>
          </p>

          {listing.owner?.landlordType ? (
            <span className="shrink-0">
              <LandlordTypeBadge
                type={listing.owner.landlordType}
                locale={locale}
              />
            </span>
          ) : null}
        </div>

        <h2 className="line-clamp-2 min-w-0 max-w-full text-h3 wrap-break-word text-foreground transition-colors group-hover:text-foreground-soft">
          {title}
        </h2>

        <p className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm text-muted">
          {listing.propertyType === "STUDIO" ? (
            <span>{dictionary.catalog.propertyTypes.STUDIO}</span>
          ) : (
            <span
              className="inline-flex items-center gap-1.5"
              title={`${dictionary.listingForm.fields.bedrooms}: ${listing.bedrooms}`}
            >
              <BedIcon className="size-5 shrink-0" />

              <span className="sr-only">
                {dictionary.listingForm.fields.bedrooms}:{" "}
              </span>

              {listing.bedrooms}
            </span>
          )}

          <span
            className="inline-flex items-center gap-1.5"
            title={`${dictionary.listingForm.fields.bathrooms}: ${listing.bathrooms}`}
          >
            <BathroomIcon className="size-5 shrink-0" />

            <span className="sr-only">
              {dictionary.listingForm.fields.bathrooms}:{" "}
            </span>

            {listing.bathrooms}
          </span>

          {listing.floorAreaSqm ? (
            <span
              className="inline-flex items-center gap-1.5"
              title={`${dictionary.listingForm.fields.floorArea}: ${Number(listing.floorAreaSqm)}`}
            >
              <AreaIcon className="size-5 shrink-0" />

              <span className="sr-only">
                {dictionary.listingForm.fields.floorArea}:{" "}
                {Number(listing.floorAreaSqm)}
              </span>

              <span aria-hidden="true">{Number(listing.floorAreaSqm)} m²</span>
            </span>
          ) : null}
        </p>

        <p className="mt-1 text-body-sm text-muted">
          <strong className="text-body font-semibold text-foreground">
            <Money
              amount={listing.monthlyPrice}
              currency={listing.currency}
              locale={locale}
              snapshot={snapshot}
            />
          </strong>{" "}
          {dictionary.listing.perMonth}
        </p>
      </Link>
    </article>
  );
}
