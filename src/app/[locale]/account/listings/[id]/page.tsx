import Link from "next/link";
import { notFound } from "next/navigation";

import { ListingEditor } from "@/features/listings/components/listing-editor/ListingEditor";
import { ListingSubmit } from "@/features/listings/components/listing-submit/ListingSubmit";
import { ListingUnpublish } from "@/features/listings/components/listing-unpublish/ListingUnpublish";
import { ListingDelete } from "@/features/listings/components/listing-delete/ListingDelete";
import { ListingStatusBadge } from "@/features/listings/components/listing-status-badge/ListingStatusBadge";
import { api } from "@/shared/api/endpoints";
import { isLocale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { getLocalizedText } from "@/shared/i18n/localized-text";
import { localizedPath } from "@/shared/i18n/routing";
import {
  BackLink,
  CalendarIcon,
  EmptyState,
  WarningIcon,
  getButtonClassName,
} from "@/shared/ui";

export const dynamic = "force-dynamic";

export default async function EditListingPage({
  params,
}: PageProps<"/[locale]/account/listings/[id]">) {
  const { locale, id } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const [listing, locations, amenities, features, profile] = await Promise.all([
    api.myListing(id),
    api.locations(),
    api.amenities(),
    api.environmentFeatures(),
    api.profile(),
  ]);
  const dictionary = getDictionary(locale);
  const copy = dictionary.listingManagement;
  const editable =
    listing.status !== "PENDING_REVIEW" && listing.status !== "ARCHIVED";
  const canSubmit = listing.status === "DRAFT" || listing.status === "REJECTED";
  const lockedMessage =
    listing.status === "ARCHIVED" ? copy.lockedArchived : copy.lockedPending;

  return (
    <section className="grid gap-6">
      <BackLink href={localizedPath(locale, "/account/listings")}>
        {copy.back}
      </BackLink>

      <header className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <ListingStatusBadge locale={locale} status={listing.status} />

          <h1 className="mt-3 text-h1 text-foreground">
            {getLocalizedText(listing.title, locale)}
          </h1>
        </div>

        <Link
          className={getButtonClassName({ variant: "outline" })}
          href={localizedPath(locale, `/account/listings/${id}/availability`)}
        >
          <CalendarIcon className="size-4" />

          {copy.calendar}
        </Link>
      </header>

      {listing.status === "REJECTED" && listing.rejectionReason ? (
        <section className="rounded-surface border border-danger bg-danger/5 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <WarningIcon className="mt-0.5 size-5 shrink-0 text-danger" />

            <div>
              <h2 className="text-h3 text-foreground">{copy.rejectionTitle}</h2>

              <p className="mt-2 text-body text-foreground">
                {listing.rejectionReason}
              </p>

              <p className="mt-2 text-body-sm text-muted">
                {copy.rejectionHint}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {listing.status === "PUBLISHED" ? (
        <section className="grid justify-items-start gap-3 rounded-surface border border-warning bg-warning/5 p-4">
          <p className="text-body-sm font-medium text-foreground">
            {copy.publishedHint}
          </p>

          <ListingUnpublish id={id} locale={locale} />
        </section>
      ) : null}

      {canSubmit ? (
        <ListingSubmit
          hasContacts={profile.contacts.length > 0}
          hasImages={listing.images.length > 0}
          id={id}
          locale={locale}
        />
      ) : null}

      {editable ? (
        <ListingEditor
          amenities={amenities}
          features={features}
          initial={listing}
          locale={locale}
          locations={locations.filter((item) => item.kind !== "COUNTRY")}
        />
      ) : (
        <EmptyState
          description={lockedMessage}
          icon={<WarningIcon className="size-5" />}
          title={copy.statuses[listing.status]}
        />
      )}

      <section className="flex justify-start border-t border-border pt-6">
        <ListingDelete id={id} locale={locale} />
      </section>
    </section>
  );
}
