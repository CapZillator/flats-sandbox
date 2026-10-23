"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { ListingCard } from "@/features/listings/components/listing-card/ListingCard";
import { getFavoritesCopy } from "@/features/favorites/favorites.copy";
import { FAVORITES_PAGE_SIZE } from "@/features/favorites/favorites.config";
import { ApiError, browserApi } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import type { FavoriteListing, Paginated } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { localizedPath } from "@/shared/i18n/routing";
import { Button, EmptyState, HeartIcon, WarningIcon } from "@/shared/ui";
import { getButtonClassName } from "@/shared/ui/button/button.styles";
import { FavoritesLoading } from "../favorites-loading/FavoritesLoading";

export function FavoritesList({
  initialData,
  initialDataUpdatedAt,
  locale,
}: {
  initialData: Paginated<FavoriteListing>;
  initialDataUpdatedAt: number;
  locale: Locale;
}) {
  const [page, setPage] = useState(1);
  const dictionary = getDictionary(locale);
  const copy = getFavoritesCopy(locale);
  const query = useQuery({
    queryKey: queryKeys.favorites.page(page, FAVORITES_PAGE_SIZE),
    queryFn: ({ signal }) =>
      browserApi<Paginated<FavoriteListing>>(
        `/favorites?page=${page}&limit=${FAVORITES_PAGE_SIZE}`,
        { signal },
      ),
    initialData: page === 1 ? initialData : undefined,
    initialDataUpdatedAt,
  });
  const result = query.data;
  const lastPage = Math.max(1, result?.meta.pages ?? page);

  if (query.isSuccess && page > lastPage) {
    setPage(lastPage);
  }

  const sessionExpired =
    query.error instanceof ApiError && query.error.status === 401;

  return (
    <section className="grid gap-6">
      <header className="grid gap-2">
        <h2 className="text-h3 text-foreground">
          {dictionary.account.favorites}
        </h2>

        <p className="text-body-sm text-muted">{copy.description}</p>

        <p className="text-caption text-muted" role="status">
          {query.isFetching
            ? copy.updating
            : `${copy.total}: ${result?.meta.total ?? "—"}`}
        </p>
      </header>

      {query.isError ? (
        <EmptyState
          title={copy.errorTitle}
          description={sessionExpired ? copy.signIn : copy.error}
          icon={<WarningIcon className="size-5" />}
          role="alert"
          action={
            sessionExpired ? (
              <Link
                className={getButtonClassName({ variant: "primary" })}
                href={`${localizedPath(locale, "/login")}?callbackUrl=${encodeURIComponent(localizedPath(locale, "/account/favorites"))}`}
              >
                {dictionary.nav.signIn}
              </Link>
            ) : (
              <Button
                variant="outline"
                onClick={() => void query.refetch()}
                loading={query.isFetching}
              >
                {dictionary.common.retry}
              </Button>
            )
          }
        />
      ) : null}

      {query.isPending || (page > lastPage && !query.isError) ? (
        <FavoritesLoading showHeader={false} />
      ) : null}

      {!sessionExpired && result?.items.length ? (
        <div
          className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
          aria-busy={query.isFetching}
        >
          {result.items.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              locale={locale}
              dictionary={dictionary}
              initiallySaved
            />
          ))}
        </div>
      ) : null}

      {query.isSuccess && result?.meta.total === 0 ? (
        <EmptyState
          title={dictionary.account.emptyFavorites}
          description={copy.empty}
          icon={<HeartIcon className="size-5" />}
          action={
            <Link
              className={getButtonClassName({ variant: "primary" })}
              href={localizedPath(locale, "/listings")}
            >
              {copy.browse}
            </Link>
          }
        />
      ) : null}

      {!sessionExpired && (page > 1 || lastPage > 1) ? (
        <nav
          className="flex flex-wrap items-center justify-center gap-3 border-t border-border-light pt-6"
          aria-label={copy.pagination}
        >
          <Button
            variant="outline"
            disabled={page === 1 || query.isFetching}
            onClick={() => setPage((current) => current - 1)}
          >
            {copy.previous}
          </Button>

          <span className="text-body-sm text-muted">
            {copy.page} {page} {copy.of} {lastPage}
          </span>

          <Button
            variant="outline"
            disabled={page >= lastPage || query.isFetching || query.isError}
            onClick={() => setPage((current) => current + 1)}
          >
            {copy.next}
          </Button>
        </nav>
      ) : null}
    </section>
  );
}
