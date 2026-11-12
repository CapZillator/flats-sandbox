"use client";

import { useRef, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { ListingCard } from "@/features/listings/components/listing-card/ListingCard";
import { getSearchWizardCopy } from "@/features/search-wizard/search-wizard.copy";
import { browserApi } from "@/shared/api/client";
import type {
  Currency,
  Listing,
  Location,
  Paginated,
  PropertyType,
} from "@/shared/api/types";
import { currencies } from "@/shared/currency/currency";
import type { Locale } from "@/shared/i18n/config";
import type { Dictionary } from "@/shared/i18n/dictionaries";
import { getLocalizedText } from "@/shared/i18n/localized-text";
import {
  AdaptiveDropdown,
  Button,
  EmptyState,
  ErrorIcon,
  Field,
  SofaIcon,
  TextInput,
} from "@/shared/ui";

const propertyTypes: PropertyType[] = [
  "APARTMENT",
  "SERVICED_APARTMENT",
  "STUDIO",
  "HOUSE",
  "VILLA",
];
const searchKey = ["search-wizard-results"] as const;

export function SearchWizard({
  locale,
  dictionary,
  locations,
  locationsFailed,
  preferredCurrency,
}: {
  locale: Locale;
  dictionary: Dictionary;
  locations: Location[];
  locationsFailed: boolean;
  preferredCurrency: Currency;
}) {
  const copy = getSearchWizardCopy(locale);
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<Paginated<Listing>>();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const questions = [
    copy.location,
    copy.propertyType,
    copy.bedrooms,
    copy.maxPrice,
    copy.currency,
  ];

  function changeStep(next: number) {
    if (next > step && !form.current?.reportValidity()) {
      return;
    }

    setStep(next);
    heading.current?.focus();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step < questions.length - 1) {
      changeStep(step + 1);

      return;
    }

    const data = new FormData(event.currentTarget);
    const query = new URLSearchParams({ sort: "newest" });

    data.forEach((value, key) => {
      if (typeof value === "string" && value !== "") {
        query.set(key, value);
      }
    });

    setPending(true);
    setFailed(false);

    try {
      setResults(
        await queryClient.fetchQuery({
          queryKey: searchKey,
          queryFn: ({ signal }) =>
            browserApi<Paginated<Listing>>(`/listings?${query}`, { signal }),
          staleTime: 60_000,
          gcTime: 60_000,
        }),
      );
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  }

  const fields = [
    <AdaptiveDropdown
      key="location"
      id="wizard-locationId"
      name="locationId"
      sheetTitle={copy.location}
      closeLabel={dictionary.common.close}
      options={[
        { value: "", label: dictionary.catalog.allVietnam },
        ...locations.map((location) => ({
          value: location.id,
          label: getLocalizedText(location.name, locale),
        })),
      ]}
    />,
    <AdaptiveDropdown
      key="type"
      id="wizard-propertyType"
      name="propertyType"
      sheetTitle={copy.propertyType}
      closeLabel={dictionary.common.close}
      options={[
        { value: "", label: dictionary.catalog.anyHome },
        ...propertyTypes.map((value) => ({
          value,
          label: dictionary.catalog.propertyTypes[value],
        })),
      ]}
    />,
    <AdaptiveDropdown
      key="bedrooms"
      id="wizard-minBedrooms"
      name="minBedrooms"
      sheetTitle={copy.bedrooms}
      closeLabel={dictionary.common.close}
      options={[
        { value: "", label: dictionary.catalog.anyBedrooms },
        ...[1, 2, 3, 4].map((value) => ({
          value: String(value),
          label: `${value}+`,
        })),
      ]}
    />,
    <TextInput
      key="price"
      id="wizard-maxPrice"
      name="maxPrice"
      type="number"
      min="0"
      step="0.01"
      inputMode="decimal"
      aria-describedby="wizard-price-hint"
    />,
    <AdaptiveDropdown
      key="currency"
      id="wizard-currency"
      name="currency"
      defaultValue={preferredCurrency}
      sheetTitle={copy.currency}
      closeLabel={dictionary.common.close}
      options={currencies.map((value) => ({ value, label: value }))}
    />,
  ];
  const names = [
    "locationId",
    "propertyType",
    "minBedrooms",
    "maxPrice",
    "currency",
  ];

  return (
    <>
      <form
        ref={form}
        onSubmit={submit}
        className="grid gap-6 rounded-surface border border-border bg-surface p-5 md:p-8"
      >
        <p className="text-body-sm text-muted" aria-live="polite">
          {copy.step} {step + 1} {copy.of} {questions.length}
        </p>

        <h2 ref={heading} tabIndex={-1} className="text-h2 text-foreground">
          {questions[step]}
        </h2>

        {questions.map((question, index) => (
          <div
            key={names[index]}
            style={{ display: index === step ? "grid" : "none" }}
            className="max-w-xl gap-3"
          >
            <Field htmlFor={`wizard-${names[index]}`} label={question}>
              {fields[index]}
            </Field>

            {index === 0 && locationsFailed ? (
              <p role="alert" className="text-body-sm text-danger">
                {copy.locationsError}
              </p>
            ) : null}

            {index === 3 ? (
              <p id="wizard-price-hint" className="text-body-sm text-muted">
                {copy.priceHint}
              </p>
            ) : null}

            {index === questions.length - 1 ? (
              <Button
                type="submit"
                loading={pending}
                loadingLabel={copy.searching}
              >
                Submit
              </Button>
            ) : null}
          </div>
        ))}

        <div className="flex gap-3 border-t border-border-light pt-4">
          <Button
            variant="ghost"
            onClick={() => changeStep(step - 1)}
            disabled={step === 0 || pending}
          >
            {copy.back}
          </Button>

          {step < questions.length - 1 ? (
            <Button onClick={() => changeStep(step + 1)}>{copy.next}</Button>
          ) : null}
        </div>
      </form>

      <section className="grid gap-5" aria-live="polite" aria-busy={pending}>
        {failed ? (
          <EmptyState
            role="alert"
            icon={<ErrorIcon className="size-6" />}
            title={dictionary.catalog.error}
          />
        ) : results ? (
          <>
            <p className="text-body-sm text-muted">
              <strong className="text-foreground">{results.meta.total}</strong>{" "}
              {dictionary.catalog.results}
            </p>

            {results.items.length ? (
              <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {results.items.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    dictionary={dictionary}
                    locale={locale}
                    snapshot={results.meta.exchangeRates}
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
          </>
        ) : (
          <p className="text-body text-muted">{copy.initial}</p>
        )}
      </section>
    </>
  );
}
