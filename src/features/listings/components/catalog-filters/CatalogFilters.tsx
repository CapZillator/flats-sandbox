import {
  currencies,
  defaultCurrency,
  isCurrency,
} from "@/shared/currency/currency";
import type { Currency } from "@/shared/api/types";
import Link from "next/link";

import type {
  EnvironmentFeature,
  Location,
  PropertyType,
} from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";
import type { Dictionary } from "@/shared/i18n/dictionaries";
import { getLocalizedText } from "@/shared/i18n/localized-text";
import { localizedPath } from "@/shared/i18n/routing";
import { getLandlordTypeCopy } from "@/shared/i18n/landlord-type";
import {
  AdaptiveDropdown,
  Button,
  Checkbox,
  DatePicker,
  Field,
  getButtonClassName,
} from "@/shared/ui";

import { EnvironmentFeatureIcon } from "../environment-feature-icon/EnvironmentFeatureIcon";
import { CatalogPriceInput } from "./components/catalog-price-input/CatalogPriceInput";

const propertyTypes: PropertyType[] = [
  "APARTMENT",
  "SERVICED_APARTMENT",
  "STUDIO",
  "HOUSE",
  "VILLA",
];

type Search = Record<string, string | string[] | undefined>;

export function CatalogFilters({
  dictionary,
  features,
  locale,
  locations,
  search,
  preferredCurrency,
}: {
  dictionary: Dictionary;
  features: EnvironmentFeature[];
  locale: Locale;
  locations: Location[];
  search: Search;
  preferredCurrency?: Currency;
}) {
  const value = (key: string) =>
    Array.isArray(search[key]) ? search[key]?.[0] : search[key];

  const selectedCurrency = value("currency");
  const currency = isCurrency(selectedCurrency)
    ? selectedCurrency
    : (preferredCurrency ?? defaultCurrency(locale));
  const priceLabels = {
    en: ["Monthly price from", "Monthly price to"],
    ru: ["Цена в месяц от", "Цена в месяц до"],
    vi: ["Giá thuê tháng từ", "Giá thuê tháng đến"],
  }[locale];

  return (
    <form
      className="grid gap-5 rounded-surface border border-border bg-surface p-4 md:p-5"
      action={localizedPath(locale, "/listings")}
    >
      <h2 className="text-h3 text-foreground">{dictionary.catalog.filters}</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Field htmlFor="catalog-location" label={dictionary.catalog.location}>
          <AdaptiveDropdown
            id="catalog-location"
            name="locationId"
            defaultValue={value("locationId") ?? ""}
            sheetTitle={dictionary.catalog.location}
            closeLabel={dictionary.common.close}
            options={[
              { value: "", label: dictionary.catalog.allVietnam },
              ...locations.map((item) => ({
                value: item.id,
                label: getLocalizedText(item.name, locale),
              })),
            ]}
          />
        </Field>

        <Field htmlFor="catalog-home-type" label={dictionary.catalog.homeType}>
          <AdaptiveDropdown
            id="catalog-home-type"
            name="propertyType"
            defaultValue={value("propertyType") ?? ""}
            sheetTitle={dictionary.catalog.homeType}
            closeLabel={dictionary.common.close}
            options={[
              { value: "", label: dictionary.catalog.anyHome },
              ...propertyTypes.map((item) => ({
                value: item,
                label: dictionary.catalog.propertyTypes[item],
              })),
            ]}
          />
        </Field>

        <Field htmlFor="catalog-available" label={dictionary.home.date}>
          <DatePicker
            id="catalog-available"
            locale={locale}
            name="availableBy"
            defaultValue={value("availableBy") ?? ""}
            clearLabel={dictionary.common.clear}
            closeLabel={dictionary.common.close}
            dialogLabel={dictionary.common.chooseDate}
            placeholder={dictionary.common.datePlaceholder}
            todayLabel={dictionary.common.today}
          />
        </Field>

        <Field htmlFor="catalog-bedrooms" label={dictionary.catalog.bedrooms}>
          <AdaptiveDropdown
            id="catalog-bedrooms"
            name="minBedrooms"
            defaultValue={value("minBedrooms") ?? ""}
            sheetTitle={dictionary.catalog.bedrooms}
            closeLabel={dictionary.common.close}
            options={[
              { value: "", label: dictionary.catalog.anyBedrooms },
              { value: "1", label: "1+" },
              { value: "2", label: "2+" },
              { value: "3", label: "3+" },
              { value: "4", label: "4+" },
            ]}
          />
        </Field>

        <Field htmlFor="catalog-sort" label={dictionary.catalog.sort}>
          <AdaptiveDropdown
            id="catalog-sort"
            name="sort"
            defaultValue={value("sort") ?? "newest"}
            sheetTitle={dictionary.catalog.sort}
            closeLabel={dictionary.common.close}
            options={[
              { value: "newest", label: dictionary.catalog.newest },
              { value: "price_asc", label: dictionary.catalog.priceLow },
              { value: "price_desc", label: dictionary.catalog.priceHigh },
            ]}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field htmlFor="catalog-min-price" label={priceLabels[0]}>
          <CatalogPriceInput
            key={value("minPrice") ?? ""}
            id="catalog-min-price"
            name="minPrice"
            defaultValue={value("minPrice") ?? ""}
          />
        </Field>

        <Field htmlFor="catalog-max-price" label={priceLabels[1]}>
          <CatalogPriceInput
            key={value("maxPrice") ?? ""}
            id="catalog-max-price"
            name="maxPrice"
            defaultValue={value("maxPrice") ?? ""}
          />
        </Field>

        <Field
          htmlFor="catalog-currency"
          label={dictionary.listingForm.fields.currency}
        >
          <AdaptiveDropdown
            id="catalog-currency"
            name="currency"
            defaultValue={currency}
            sheetTitle={dictionary.listingForm.fields.currency}
            closeLabel={dictionary.common.close}
            options={currencies.map((item) => ({ value: item, label: item }))}
          />
        </Field>
      </div>

      <div className="grid gap-5 lg:grid-cols-3 lg:gap-4">
        {features.length > 0 ? (
          <fieldset className="grid min-w-0 gap-2 lg:col-span-2">
            <legend className="mb-1 text-body-sm font-semibold text-foreground">
              {dictionary.catalog.nearbyNature}
            </legend>

            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {features.map((feature) => (
                <Checkbox
                  key={feature.id}
                  name="environmentSlugs"
                  value={feature.slug}
                  defaultChecked={[search.environmentSlugs]
                    .flat()
                    .includes(feature.slug)}
                  label={
                    <span className="inline-flex items-center gap-2">
                      <EnvironmentFeatureIcon
                        slug={feature.slug}
                        className="size-5 shrink-0"
                      />

                      <span>{getLocalizedText(feature.name, locale)}</span>
                    </span>
                  }
                />
              ))}
            </div>
          </fieldset>
        ) : null}

        <fieldset className="grid min-w-0 content-start gap-2">
          <legend className="mb-1 text-body-sm font-semibold text-foreground">
            {dictionary.catalog.landlordType}
          </legend>

          <Checkbox
            name="landlordType"
            value="OWNER"
            defaultChecked={value("landlordType") === "OWNER"}
            label={getLandlordTypeCopy(locale).ownersOnly}
          />
        </fieldset>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field htmlFor="catalog-lifestyle" label="Образ жизни">
          <AdaptiveDropdown
            id="catalog-lifestyle"
            name="lifestyle"
            defaultValue={value("lifestyle") ?? ""}
            sheetTitle="Образ жизни"
            closeLabel={dictionary.common.close}
            options={[
              { value: "", label: "Любой" },
              { value: "quiet", label: "Тихое место" },
              { value: "nightlife", label: "Ночная жизнь" },
            ]}
          />
        </Field>

        <Checkbox
          name="sharedRental"
          value="true"
          defaultChecked={value("sharedRental") === "true"}
          label={dictionary.catalog.sharedRental}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field htmlFor="catalog-heating" label="Отопление">
          <AdaptiveDropdown
            id="catalog-heating"
            name="heating"
            defaultValue={value("heating") ?? ""}
            sheetTitle="Отопление"
            closeLabel={dictionary.common.close}
            options={[
              { value: "", label: "Любое" },
              { value: "air_conditioner", label: "Кондиционер" },
              { value: "boiler", label: "Котёл" },
              { value: "central", label: "Централизованное" },
              { value: "none", label: "Нет" },
            ]}
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border-light pt-4 sm:flex-row sm:justify-end">
        <Link
          className={getButtonClassName({ variant: "ghost", size: "sm" })}
          href={localizedPath(locale, "/listings")}
        >
          {dictionary.common.clear}
        </Link>

        <Button size="sm" type="submit">
          {dictionary.common.apply}
        </Button>
      </div>
    </form>
  );
}
