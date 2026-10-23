import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ListingDetail } from "@/features/listings/components/listing-detail/ListingDetail";
import { buildListingSeo } from "@/features/listings/seo/listing-seo";
import { getPublicListing } from "@/features/listings/seo/get-public-listing";
import { api } from "@/shared/api/endpoints";
import { isLocale } from "@/shared/i18n/config";
import { JsonLd } from "@/shared/ui/json-ld/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/listings/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const listing = await getPublicListing(slug);

  return buildListingSeo(listing, locale).metadata;
}

export default async function ListingPage({
  params,
}: PageProps<"/[locale]/listings/[slug]">) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const listing = await getPublicListing(slug);
  const { jsonLd } = buildListingSeo(listing, locale);
  const start = new Date().toISOString().slice(0, 10);
  const future = new Date(`${start}T00:00:00Z`);
  future.setUTCDate(future.getUTCDate() + 365);
  const end = future.toISOString().slice(0, 10);
  const [user, blocks] = await Promise.all([
    api.session().catch(() => null),
    api.availability(listing.id, start, end).catch(() => null),
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />

      <ListingDetail
        listing={listing}
        locale={locale}
        signedIn={Boolean(user)}
        blocks={blocks}
        calendarStart={start}
        calendarEnd={end}
      />
    </>
  );
}
