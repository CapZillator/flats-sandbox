import Image from "next/image";
import Link from "next/link";

import type { Listing } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { getLocalizedText } from "@/shared/i18n/localized-text";
import { localizedPath } from "@/shared/i18n/routing";
import { formatMoney } from "@/shared/lib/format";
import {
  CalendarIcon,
  EditIcon,
  EyeIcon,
  LocationIcon,
  PhotoIcon,
  getButtonClassName,
} from "@/shared/ui";

import { ListingStatusBadge } from "../listing-status-badge/ListingStatusBadge";
import { ListingUnpublish } from "../listing-unpublish/ListingUnpublish";
import { ListingDelete } from "../listing-delete/ListingDelete";

const textActionClassName =
  "inline-flex min-h-9 items-center gap-2 rounded-control text-body-sm font-semibold text-foreground underline-offset-4 transition-colors hover:text-muted hover:underline";

export function OwnerListingCard({
  listing,
  locale,
}: {
  listing: Listing;
  locale: Locale;
}) {
  const dictionary = getDictionary(locale);
  const copy = dictionary.ownerListings;
  const title = getLocalizedText(listing.title, locale);
  const image = listing.images[0];
  const manageHref = localizedPath(locale, `/account/listings/${listing.id}`);
  const editable =
    listing.status !== "PENDING_REVIEW" && listing.status !== "ARCHIVED";

  return (
    <article className="grid min-w-0 gap-4 rounded-surface border border-border bg-surface p-4 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-5 sm:p-5 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <Link
        aria-label={title}
        className="relative block aspect-[4/3] w-full self-start overflow-hidden rounded-control bg-surface-muted"
        href={manageHref}
      >
        {image ? (
          <Image
            alt={getLocalizedText(image.alt, locale) || title}
            className="object-cover"
            fill
            sizes="(max-width: 639px) calc(100vw - 4rem), (max-width: 1023px) 224px, 256px"
            src={image.url}
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid size-full place-items-center text-muted"
          >
            <PhotoIcon className="size-10" />
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-col justify-between gap-4">
        <div className="grid justify-items-start gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
            <Link
              className="min-w-0 max-w-full rounded-compact"
              href={manageHref}
            >
              <h2 className="break-words text-h3 text-foreground">{title}</h2>
            </Link>

            <ListingStatusBadge locale={locale} status={listing.status} />
          </div>

          <p className="flex items-center gap-1.5 text-body-sm text-muted">
            <LocationIcon className="size-4 shrink-0" />

            {getLocalizedText(listing.location.name, locale)}
          </p>

          <p className="text-body-sm text-muted">
            <strong className="text-body font-semibold text-foreground">
              {formatMoney(listing.monthlyPrice, listing.currency, locale)}
            </strong>{" "}
            {dictionary.listing.perMonth}
          </p>
        </div>

        {listing.status === "REJECTED" && listing.rejectionReason ? (
          <p className="rounded-compact border border-danger/30 bg-danger/5 p-3 text-body-sm text-foreground">
            <span className="font-semibold">
              {dictionary.listingManagement.rejectionTitle}:{" "}
            </span>

            {listing.rejectionReason}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border-light pt-3">
          <Link
            className={getButtonClassName({ size: "sm", variant: "outline" })}
            href={manageHref}
          >
            {editable ? (
              <EditIcon className="size-4 shrink-0" />
            ) : (
              <EyeIcon className="size-4 shrink-0" />
            )}

            {editable ? copy.edit : copy.details}
          </Link>

          {listing.status === "PUBLISHED" ? (
            <ListingUnpublish id={listing.id} locale={locale} />
          ) : null}

          <ListingDelete id={listing.id} locale={locale} />

          {listing.status !== "ARCHIVED" ? (
            <Link
              className={textActionClassName}
              href={`${manageHref}/availability`}
            >
              <CalendarIcon className="size-4 shrink-0" />

              {dictionary.listingManagement.calendar}
            </Link>
          ) : null}

          {listing.status === "PUBLISHED" ? (
            <Link
              className={textActionClassName}
              href={localizedPath(locale, `/listings/${listing.slug}`)}
            >
              {copy.openPublic} →
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
