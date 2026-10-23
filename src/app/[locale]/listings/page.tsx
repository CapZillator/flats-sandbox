import { getPreferredCurrency } from "@/shared/currency/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import classNames from "classnames";

import { CatalogFilters } from "@/features/listings/components/catalog-filters/CatalogFilters";
import { ListingCard } from "@/features/listings/components/listing-card/ListingCard";
import { MapView } from "@/features/listings/components/map-view/MapView";
import { ApiError } from "@/shared/api/client";
import { api } from "@/shared/api/endpoints";
import type { ListingQuery } from "@/shared/api/types";
import { isLocale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { localizedPath } from "@/shared/i18n/routing";
import { buildSeoMetadata } from "@/shared/lib/seo";
import {
  EmptyState,
  ErrorIcon,
  ListIcon,
  MapIcon,
  SofaIcon,
} from "@/shared/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/[locale]/listings">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const raw = await searchParams;

  return buildSeoMetadata({
    title: dictionary.catalog.subtitle,
    description: `${dictionary.catalog.subtitle}. ${dictionary.home.subtitle}`,
    locale,
    path: "/listings",
    index: Object.keys(raw).length === 0,
  });
}

export default async function ListingsPage({
  params,
  searchParams,
}: PageProps<"/[locale]/listings">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const raw = await searchParams;
  const preferredCurrency = await getPreferredCurrency(locale);
  const first = (key: string) =>
    Array.isArray(raw[key]) ? raw[key]?.[0] : raw[key];
  const all = (key: string) =>
    raw[key] === undefined
      ? undefined
      : [raw[key]]
          .flat()
          .filter((item): item is string => typeof item === "string");
  const numeric = (key: string) => {
    const item = first(key);

    return item === undefined || item === "" ? undefined : Number(item);
  };

  const query: ListingQuery = {
    currency: first("currency") as ListingQuery["currency"],
    minPrice: numeric("minPrice"),
    maxPrice: numeric("maxPrice"),
    landlordType: first("landlordType") as ListingQuery["landlordType"],
    locationId: first("locationId"),
    propertyType: first("propertyType") as ListingQuery["propertyType"],
    availableBy: first("availableBy"),
    minBedrooms: numeric("minBedrooms"),
    environmentSlugs: all("environmentSlugs"),
    sort: (first("sort") as ListingQuery["sort"]) ?? "newest",
    page: numeric("page") ?? 1,
  };
  const view = first("view") === "map" ? "map" : "list";
  const viewParams = new URLSearchParams();

  Object.entries(raw).forEach(([key, value]) => {
    if (key === "view") {
      return;
    }

    [value].flat().forEach((item) => {
      if (typeof item === "string") {
        viewParams.append(key, item);
      }
    });
  });

  const [listingsResult, locationsResult, featuresResult] =
    await Promise.allSettled([
      api.listings(query),
      api.locations({ kind: "CITY" }),
      api.environmentFeatures(),
    ]);
  const locations =
    locationsResult.status === "fulfilled" ? locationsResult.value : [];
  const features =
    featuresResult.status === "fulfilled" ? featuresResult.value : [];
  const preservedQuery = viewParams.toString();
  const listHref = localizedPath(
    locale,
    `/listings${preservedQuery ? `?${preservedQuery}` : ""}`,
  );
  const mapHref = localizedPath(
    locale,
    `/listings?${preservedQuery ? `${preservedQuery}&` : ""}view=map`,
  );
  const viewLinkClassName =
    "inline-flex min-h-9 items-center gap-2 rounded-control px-3 text-body-sm font-semibold transition-colors";

  return (
    <div className="content-container page-gutters grid gap-7 py-8 lg:gap-9 lg:py-12">
      <header className="grid max-w-3xl gap-3">
        <h1 className="text-h1 text-foreground">{dictionary.catalog.title}</h1>

        <p className="text-body-lg text-muted">{dictionary.catalog.subtitle}</p>
      </header>

      <CatalogFilters
        locale={locale}
        dictionary={dictionary}
        locations={locations}
        features={features}
        key={`${preferredCurrency}:${JSON.stringify(raw)}`}
        search={raw}
        preferredCurrency={preferredCurrency}
      />

      {listingsResult.status === "rejected" ? (
        <EmptyState
          role="alert"
          icon={<ErrorIcon className="size-6" />}
          title={dictionary.catalog.error}
          description={
            listingsResult.reason instanceof ApiError
              ? listingsResult.reason.message
              : "API unavailable"
          }
        />
      ) : (
        <section className="grid gap-5" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <p className="text-body-sm text-muted">
              <strong className="font-semibold text-foreground">
                {listingsResult.value.meta.total}
              </strong>{" "}
              {dictionary.catalog.results}
            </p>

            <nav
              className="flex rounded-control border border-border bg-surface p-1"
              aria-label={`${dictionary.catalog.list} / ${dictionary.catalog.map}`}
            >
              <Link
                className={classNames(
                  viewLinkClassName,
                  view === "list"
                    ? "bg-foreground text-surface"
                    : "text-muted hover:bg-surface-muted hover:text-foreground",
                )}
                href={listHref}
                aria-current={view === "list" ? "page" : undefined}
              >
                <ListIcon className="size-4" />

                {dictionary.catalog.list}
              </Link>

              <Link
                className={classNames(
                  viewLinkClassName,
                  view === "map"
                    ? "bg-foreground text-surface"
                    : "text-muted hover:bg-surface-muted hover:text-foreground",
                )}
                href={mapHref}
                aria-current={view === "map" ? "page" : undefined}
              >
                <MapIcon className="size-4" />

                {dictionary.catalog.map}
              </Link>
            </nav>
          </div>

          {view === "map" ? (
            <MapView
              errorLabel={dictionary.catalog.mapError}
              locale={locale}
              filters={raw}
              mapLabel={dictionary.catalog.map}
              truncatedLabel={dictionary.catalog.mapNotice}
            />
          ) : listingsResult.value.items.length ? (
            <div className="grid min-h-[calc(max(30rem,70dvh)+2px)] content-start gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {listingsResult.value.items.map((listing) => (
                <ListingCard
                  snapshot={listingsResult.value.meta.exchangeRates}
                  key={listing.id}
                  listing={listing}
                  locale={locale}
                  dictionary={dictionary}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<SofaIcon className="size-6" />}
              title={dictionary.catalog.empty}
              description={dictionary.catalog.emptyCopy}
            />
          )}
        </section>
      )}
    </div>
  );
}
