import Link from "next/link";
import { getHomeCopy } from "@/features/home/home.copy";
import { ListingCard } from "@/features/listings/components/listing-card/ListingCard";
import { EnvironmentFeatureIcon } from "@/features/listings/components/environment-feature-icon/EnvironmentFeatureIcon";
import type { EnvironmentFeature, Listing, Location } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { getLocalizedText } from "@/shared/i18n/localized-text";
import { localizedPath } from "@/shared/i18n/routing";
import {
  ArrowRightIcon,
  CrownIcon,
  EmptyState,
  getButtonClassName,
  LocationIcon,
  MessageIcon,
  SofaIcon,
  WarningIcon,
} from "@/shared/ui";
import { HomeSearch } from "../home-search/HomeSearch";
import { HomeBrowseSection } from "../home-browse-section/HomeBrowseSection";

const benefitIcons = [LocationIcon, CrownIcon, MessageIcon];

export function HomePageView({
  locale,
  locations,
  features,
  listings,
  authenticated = false,
}: {
  locale: Locale;
  locations: Location[] | null;
  features: EnvironmentFeature[] | null;
  listings: Listing[] | null;
  authenticated?: boolean;
}) {
  const d = getDictionary(locale);
  const copy = getHomeCopy(locale);
  const catalogHref = localizedPath(locale, "/listings");
  const newListingHref = localizedPath(locale, "/account/listings/new");
  const hostHref = authenticated
    ? newListingHref
    : `${localizedPath(locale, "/login")}?callbackUrl=${encodeURIComponent(newListingHref)}`;

  return (
    <div className="content-container page-gutters grid gap-12 py-8 md:gap-16 md:py-12">
      <section className="grid items-center gap-8 border-b border-border pb-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16 lg:pb-16">
        <div className="relative isolate grid min-w-0 content-center gap-6 self-stretch py-8 before:pointer-events-none before:absolute before:-inset-x-4 before:inset-y-0 before:-z-10 before:bg-[url('/cave-home.webp')] before:bg-cover before:bg-center before:bg-no-repeat before:opacity-[0.15] before:mix-blend-multiply before:mask-[radial-gradient(ellipse_at_center,black_45%,transparent_75%)] md:before:inset-x-0 md:max-lg:before:bg-right lg:py-12">
          <h1 className="max-w-3xl text-h1 whitespace-pre-line text-foreground">
            {d.home.title}
          </h1>

          <div className="grid gap-1">
            <p className="max-w-xl text-body-lg font-normal text-foreground">
              {d.home.subtitle}
            </p>

            <Link
              href={catalogHref}
              className="inline-flex w-fit items-center gap-2 rounded-control text-body-lg font-normal text-foreground hover:text-muted"
            >
              {copy.allHomes}

              <ArrowRightIcon className="size-5" />
            </Link>
          </div>
        </div>

        <HomeSearch locale={locale} locations={locations} />
      </section>

      <HomeBrowseSection
        title={copy.citiesTitle}
        description={copy.citiesCopy}
        icon={<LocationIcon className="size-5" />}
        failed={locations === null}
        fallback={locations === null ? copy.locationsError : copy.citiesEmpty}
        items={(locations ?? []).map((item) => ({
          id: item.id,
          label: getLocalizedText(item.name, locale),
          href: `${catalogHref}?${new URLSearchParams({ locationId: item.id })}`,
        }))}
      />

      <HomeBrowseSection
        title={d.home.natureTitle}
        description={d.home.natureCopy}
        failed={features === null}
        fallback={features === null ? copy.natureError : copy.natureEmpty}
        items={(features ?? []).map((item) => ({
          id: item.id,
          icon: <EnvironmentFeatureIcon slug={item.slug} className="size-5" />,
          label: getLocalizedText(item.name, locale),
          href: `${catalogHref}?${new URLSearchParams({ environmentSlugs: item.slug })}`,
        }))}
      />

      <section className="grid gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="grid gap-2">
            <h2 className="text-h2 text-foreground">{copy.recentTitle}</h2>

            <p className="text-body text-muted">{copy.recentCopy}</p>
          </div>

          <Link
            href={catalogHref}
            className={getButtonClassName({ variant: "outline" })}
          >
            {copy.allHomes}

            <ArrowRightIcon className="size-5" />
          </Link>
        </header>

        {listings?.length ? (
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                locale={locale}
                dictionary={d}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={
              listings === null ? copy.recentErrorTitle : copy.recentEmptyTitle
            }
            description={
              listings === null ? copy.recentErrorCopy : copy.recentEmptyCopy
            }
            icon={
              listings === null ? (
                <WarningIcon className="size-5" />
              ) : (
                <SofaIcon className="size-5" />
              )
            }
            role={listings === null ? "status" : undefined}
            action={
              <Link
                href={catalogHref}
                className={getButtonClassName({ variant: "outline" })}
              >
                {copy.allHomes}
              </Link>
            }
          />
        )}
      </section>

      <section className="grid gap-7 border-y border-border py-10">
        <h2 className="text-h2 text-foreground">{d.home.trustTitle}</h2>

        <div className="grid gap-7 md:grid-cols-3">
          {copy.benefits.map((item, index) => {
            const Icon = benefitIcons[index];

            return (
              <div key={item.title} className="grid content-start gap-3">
                <span className="grid size-9 place-items-center rounded-compact bg-accent text-accent-content">
                  <Icon className="size-5" />
                </span>

                <h3 className="text-h3 text-foreground">{item.title}</h3>

                <p className="text-body-sm text-muted">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid items-center gap-6 rounded-surface border border-border bg-surface p-6 md:grid-cols-[minmax(0,1fr)_auto] md:p-8">
        <div className="grid max-w-2xl gap-3">
          <h2 className="text-h2 text-foreground">{copy.hostTitle}</h2>

          <p className="text-body text-muted">{copy.hostCopy}</p>
        </div>

        <Link
          href={hostHref}
          className={getButtonClassName({ className: "justify-self-start" })}
        >
          {copy.hostAction}

          <ArrowRightIcon className="size-5" />
        </Link>
      </section>
    </div>
  );
}
