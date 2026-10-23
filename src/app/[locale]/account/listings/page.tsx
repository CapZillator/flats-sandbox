import Link from "next/link";
import { notFound } from "next/navigation";

import { OwnerListingCard } from "@/features/listings/components/owner-listing-card/OwnerListingCard";
import { api } from "@/shared/api/endpoints";
import { isLocale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { localizedPath } from "@/shared/i18n/routing";
import {
  EmptyState,
  PhotoIcon,
  PlusIcon,
  getButtonClassName,
} from "@/shared/ui";

export const dynamic = "force-dynamic";

export default async function MyListingsPage({
  params,
}: PageProps<"/[locale]/account/listings">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const listings = await api.myListings();
  const createLink = (
    <Link
      className={getButtonClassName({})}
      href={localizedPath(locale, "/account/listings/new")}
    >
      <PlusIcon className="size-5 shrink-0" />

      {dictionary.account.newListing}
    </Link>
  );

  return (
    <section className="grid gap-6">
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-h2 text-foreground">
            {dictionary.account.listings}
          </h2>

          <p className="mt-1 text-body-sm text-muted">
            {dictionary.ownerListings.subtitle}
          </p>
        </div>

        {listings.length > 0 ? createLink : null}
      </header>

      {listings.length > 0 ? (
        <div className="grid gap-4">
          {listings.map((listing) => (
            <OwnerListingCard
              key={listing.id}
              listing={listing}
              locale={locale}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          action={createLink}
          description={dictionary.account.emptyListings}
          icon={<PhotoIcon className="size-5" />}
          title={dictionary.ownerListings.emptyTitle}
        />
      )}
    </section>
  );
}
