import Link from "next/link";
import { getAdminCopy } from "@/features/admin/admin.copy";
import { moderationStatuses } from "@/features/admin/admin.schema";
import { ListingStatusBadge } from "@/features/listings/components/listing-status-badge/ListingStatusBadge";
import type {
  ListingStatus,
  ModerationListing,
  Paginated,
} from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { getLocalizedText } from "@/shared/i18n/localized-text";
import { localizedPath } from "@/shared/i18n/routing";
import { formatMoney, formatDate } from "@/shared/lib/format";
import {
  AdaptiveDropdown,
  Button,
  EmptyState,
  Field,
  getButtonClassName,
  ListIcon,
} from "@/shared/ui";

export function ModerationQueue({
  result,
  status,
  locale,
}: {
  result: Paginated<ModerationListing>;
  status: ListingStatus;
  locale: Locale;
}) {
  const copy = getAdminCopy(locale);
  const d = getDictionary(locale);
  const href = (page: number) =>
    `${localizedPath(locale, "/admin")}?${new URLSearchParams({ status, page: String(page) })}`;

  return (
    <section className="grid gap-6">
      <header className="grid gap-3">
        <h1 className="text-h1 text-foreground">{copy.title}</h1>

        <p className="text-body text-muted">{copy.intro}</p>
      </header>

      <form
        action={localizedPath(locale, "/admin")}
        className="grid items-end gap-3 rounded-surface border border-border bg-surface p-4 sm:grid-cols-[minmax(0,20rem)_auto]"
      >
        <Field htmlFor="moderation-status" label={d.account.status}>
          <AdaptiveDropdown
            id="moderation-status"
            key={status}
            name="status"
            defaultValue={status}
            closeLabel={d.common.close}
            sheetTitle={d.account.status}
            options={moderationStatuses.map((value) => ({
              value,
              label: d.listingManagement.statuses[value],
            }))}
          />
        </Field>

        <Button type="submit" className="sm:justify-self-start">
          {d.common.apply}
        </Button>
      </form>

      <p className="text-body-sm text-muted">
        {copy.total}: {result.meta.total}
      </p>

      {result.items.length ? (
        <div className="grid gap-4">
          {result.items.map((listing) => (
            <article
              key={listing.id}
              className="grid gap-4 rounded-surface border border-border bg-surface p-5 sm:grid-cols-[minmax(0,1fr)_auto]"
            >
              <div className="grid min-w-0 justify-items-start gap-2">
                <ListingStatusBadge locale={locale} status={listing.status} />

                <h2 className="text-h3 text-foreground">
                  {getLocalizedText(listing.title, locale)}
                </h2>

                <p className="text-body-sm text-muted">
                  {getLocalizedText(listing.location.name, locale)} ·{" "}
                  {formatMoney(listing.monthlyPrice, listing.currency, locale)}
                </p>

                <p className="break-all text-caption text-muted">
                  {listing.owner.email} ·{" "}
                  {listing.updatedAt
                    ? formatDate(listing.updatedAt, locale)
                    : "—"}
                </p>
              </div>

              <Link
                className={getButtonClassName({
                  variant: "outline",
                  className: "self-end",
                })}
                href={localizedPath(locale, `/admin/listings/${listing.id}`)}
              >
                {copy.review}
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title={copy.empty}
          description={copy.emptyCopy}
          icon={<ListIcon className="size-5" />}
        />
      )}

      {result.meta.pages > 1 ? (
        <nav
          aria-label={copy.pages}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {result.meta.page > 1 ? (
            <Link
              className={getButtonClassName({ variant: "outline" })}
              href={href(result.meta.page - 1)}
            >
              {copy.previous}
            </Link>
          ) : (
            <Button variant="outline" disabled>
              {copy.previous}
            </Button>
          )}

          <span className="text-body-sm text-muted">
            {copy.page} {result.meta.page} {copy.of} {result.meta.pages}
          </span>

          {result.meta.page < result.meta.pages ? (
            <Link
              className={getButtonClassName({ variant: "outline" })}
              href={href(result.meta.page + 1)}
            >
              {copy.next}
            </Link>
          ) : (
            <Button variant="outline" disabled>
              {copy.next}
            </Button>
          )}
        </nav>
      ) : null}
    </section>
  );
}
