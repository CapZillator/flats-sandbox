import Link from "next/link";
import { getHomeCopy } from "@/features/home/home.copy";
import type { Location } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { getLocalizedText } from "@/shared/i18n/localized-text";
import { getLandlordTypeCopy } from "@/shared/i18n/landlord-type";
import { localizedPath } from "@/shared/i18n/routing";
import {
  AdaptiveDropdown,
  ArrowRightIcon,
  Button,
  Checkbox,
  DatePicker,
  Field,
  MapIcon,
} from "@/shared/ui";

export function HomeSearch({
  locale,
  locations,
}: {
  locale: Locale;
  locations: Location[] | null;
}) {
  const d = getDictionary(locale);
  const copy = getHomeCopy(locale);

  return (
    <form
      action={localizedPath(locale, "/listings")}
      method="get"
      aria-labelledby="home-search-title"
      className="grid min-w-0 gap-5 rounded-surface border border-border bg-surface p-5 md:p-7"
    >
      <div className="grid gap-2">
        <h2 id="home-search-title" className="text-h3 text-foreground">
          {copy.searchTitle}
        </h2>

        <p className="text-body-sm text-muted">{copy.searchHint}</p>
      </div>

      <Field
        htmlFor="home-location"
        label={d.home.location}
        hint={locations === null ? copy.locationsError : undefined}
      >
        <AdaptiveDropdown
          id="home-location"
          name="locationId"
          defaultValue=""
          sheetTitle={d.home.location}
          closeLabel={d.common.close}
          aria-describedby={
            locations === null ? "home-location-hint" : undefined
          }
          options={[
            { value: "", label: d.catalog.allVietnam },
            ...(locations ?? []).map((item) => ({
              value: item.id,
              label: getLocalizedText(item.name, locale),
            })),
          ]}
        />
      </Field>

      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <Field htmlFor="home-type" label={d.catalog.homeType}>
          <AdaptiveDropdown
            id="home-type"
            name="propertyType"
            defaultValue=""
            sheetTitle={d.catalog.homeType}
            closeLabel={d.common.close}
            options={[
              { value: "", label: d.catalog.anyHome },
              ...Object.entries(d.catalog.propertyTypes).map(
                ([value, label]) => ({ value, label }),
              ),
            ]}
          />
        </Field>

        <Field htmlFor="home-date" label={d.home.date}>
          <DatePicker
            id="home-date"
            name="availableBy"
            locale={locale}
            clearLabel={d.common.clear}
            closeLabel={d.common.close}
            dialogLabel={d.common.chooseDate}
            placeholder={d.common.datePlaceholder}
            todayLabel={d.common.today}
          />
        </Field>
      </div>

      <Checkbox
        name="landlordType"
        value="OWNER"
        label={getLandlordTypeCopy(locale).ownersOnly}
      />

      <Button type="submit" fullWidth>
        {d.home.search}

        <ArrowRightIcon className="size-5" />
      </Button>

      <Link
        href={localizedPath(locale, "/listings?view=map")}
        className="inline-flex items-center justify-center gap-2 rounded-control text-body-sm font-medium text-foreground hover:text-muted"
      >
        <MapIcon className="size-5" />

        {copy.map}
      </Link>
    </form>
  );
}
