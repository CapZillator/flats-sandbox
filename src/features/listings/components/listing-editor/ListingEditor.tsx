"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";

import { ApiError, browserApi } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import type {
  Amenity,
  EnvironmentFeature,
  Listing,
  Location,
  PropertyType,
} from "@/shared/api/types";
import {
  ControlledAdaptiveDropdown,
  ControlledCheckboxField,
  ControlledDatePicker,
  ControlledLocalizedTextField,
  ControlledLocalizedTextareaField,
  ControlledNumericField,
  ControlledTextField,
} from "@/shared/forms";
import { locales, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import {
  getLocalizedText,
  type LocalizedText,
} from "@/shared/i18n/localized-text";
import { localizedPath } from "@/shared/i18n/routing";
import { Button, Checkbox } from "@/shared/ui";
import { AmenityIcon } from "../amenity-icon/AmenityIcon";
import { EnvironmentFeatureIcon } from "../environment-feature-icon/EnvironmentFeatureIcon";

import { ListingFormSection } from "./components/listing-form-section/ListingFormSection";
import { ListingImageUploader } from "./components/listing-image-uploader/ListingImageUploader";
import type { ListingUpload } from "./components/listing-image-uploader/listing-image-uploader.types";
import { ListingLanguageSwitcher } from "./components/listing-language-switcher/ListingLanguageSwitcher";
import { usePropertyTypeBedrooms } from "./hooks/use-property-type-bedrooms";
import {
  LocationPickerMap,
  type MapCoordinates,
} from "./components/location-picker-map/LocationPickerMap";
import {
  createListingFormSchema,
  type ListingFormValues,
} from "./listing-form.schema";

const propertyTypes: PropertyType[] = [
  "APARTMENT",
  "SERVICED_APARTMENT",
  "STUDIO",
  "HOUSE",
  "VILLA",
];

function localizedDefaults(value?: LocalizedText) {
  return {
    en: value?.en ?? "",
    ru: value?.ru ?? "",
    vi: value?.vi ?? "",
  };
}

function compactLocalizedText(value: ListingFormValues["title"]) {
  return Object.fromEntries(
    Object.entries(value)
      .map(([key, text]) => [key, text.trim()])
      .filter(([, text]) => text.length > 0),
  );
}

function optionalNumber(value: string) {
  return value === "" ? null : Number(value);
}

function mapCoordinates(
  latitude: string | undefined,
  longitude: string | undefined,
): MapCoordinates | undefined {
  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);

  if (
    !latitude ||
    !longitude ||
    !Number.isFinite(parsedLatitude) ||
    !Number.isFinite(parsedLongitude)
  ) {
    return undefined;
  }

  return { latitude: parsedLatitude, longitude: parsedLongitude };
}

export function ListingEditor({
  locale,
  locations,
  amenities,
  features,
  initial,
}: {
  locale: Locale;
  locations: Location[];
  amenities: Amenity[];
  features: EnvironmentFeature[];
  initial?: Listing;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const dictionary = getDictionary(locale);
  const copy = dictionary.listingForm;
  const schema = createListingFormSchema(copy.errors);
  const [contentLocale, setContentLocale] = useState(locale);
  const [uploads, setUploads] = useState<ListingUpload[]>(
    initial?.images.map((image) => ({
      id: image.assetId ?? image.id,
      url: image.url,
      alt: image.alt,
      isNew: false,
    })) ?? [],
  );
  const [isImageBusy, setIsImageBusy] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setError,
    setValue,
  } = useForm<ListingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: localizedDefaults(initial?.title),
      description: localizedDefaults(initial?.description),
      propertyType: initial?.propertyType ?? "APARTMENT",
      furnishing: initial?.furnishing ?? "",
      bedrooms: String(initial?.bedrooms ?? 1),
      bathrooms: String(initial?.bathrooms ?? 1),
      floorAreaSqm: initial?.floorAreaSqm ?? "",
      floor: initial?.floor === null ? "" : String(initial?.floor ?? ""),
      petsAllowed: initial?.petsAllowed ?? false,
      locationId: initial?.location.id ?? "",
      addressLine: initial?.addressLine ?? "",
      latitude: initial ? String(initial.latitude) : "",
      longitude: initial ? String(initial.longitude) : "",
      monthlyPrice: initial?.monthlyPrice ?? "",
      currency: initial?.currency ?? "VND",
      securityDeposit: initial?.securityDeposit ?? "",
      minimumLeaseMonths: String(initial?.minimumLeaseMonths ?? 3),
      availableFrom: initial?.availableFrom?.slice(0, 10) ?? "",
      amenityIds: initial?.amenities?.map((item) => item.amenity.id) ?? [],
      featureIds:
        initial?.environmentFeatures?.map((item) => item.feature.id) ?? [],
    },
  });
  const isStudio = usePropertyTypeBedrooms({ control, setValue });
  const [latitude, longitude, locationId, currency] = useWatch({
    control,
    name: ["latitude", "longitude", "locationId", "currency"],
  });
  const previousLocationId = useRef(locationId);
  const selectedLocation = locations.find((item) => item.id === locationId);
  const coordinates = mapCoordinates(latitude, longitude);
  const suggestedCenter = mapCoordinates(
    selectedLocation?.latitude ?? undefined,
    selectedLocation?.longitude ?? undefined,
  );

  useEffect(() => {
    if (previousLocationId.current === locationId) {
      return;
    }

    previousLocationId.current = locationId;
    setValue("latitude", "", { shouldDirty: true, shouldValidate: true });
    setValue("longitude", "", { shouldDirty: true, shouldValidate: true });
  }, [locationId, setValue]);

  const saveMutation = useMutation({
    mutationFn: (values: ListingFormValues) => {
      const body = {
        title: compactLocalizedText(values.title),
        description: compactLocalizedText(values.description),
        propertyType: values.propertyType,
        furnishing: values.furnishing || null,
        bedrooms: Number(values.bedrooms),
        bathrooms: Number(values.bathrooms),
        floorAreaSqm: optionalNumber(values.floorAreaSqm),
        floor: optionalNumber(values.floor),
        petsAllowed: values.petsAllowed,
        locationId: values.locationId,
        addressLine: values.addressLine.trim() || null,
        latitude: Number(values.latitude),
        longitude: Number(values.longitude),
        monthlyPrice: Number(values.monthlyPrice),
        currency: values.currency,
        securityDeposit: optionalNumber(values.securityDeposit),
        minimumLeaseMonths: Number(values.minimumLeaseMonths),
        availableFrom: values.availableFrom || null,
        images: uploads.map((item) => ({
          uploadId: item.id,
          alt: item.alt,
        })),
        amenityIds: values.amenityIds,
        environmentFeatures: values.featureIds.map((featureId) => ({
          featureId,
          distanceMeters: null,
        })),
      };

      return initial
        ? browserApi<Listing>(`/listings/${initial.id}`, {
            method: "PATCH",
            body: JSON.stringify(body),
          })
        : browserApi<Listing>("/listings", {
            method: "POST",
            body: JSON.stringify(body),
          });
    },
    onSuccess: (result) => {
      queryClient.setQueryData(queryKeys.listing(result.id), result);
      void queryClient.invalidateQueries({ queryKey: queryKeys.myListings });
      router.push(localizedPath(locale, `/account/listings/${result.id}`));
      router.refresh();
    },
    onError: (cause) => {
      setError("root.server", {
        message: cause instanceof ApiError ? cause.message : copy.errors.save,
      });
    },
  });

  const handleInvalidSubmit = (formErrors: FieldErrors<ListingFormValues>) => {
    const hasLocalizedError = (candidate: Locale) =>
      Boolean(
        formErrors.title?.[candidate] || formErrors.description?.[candidate],
      );

    if (hasLocalizedError(contentLocale)) {
      return;
    }

    const errorLocale = locales.find(hasLocalizedError);

    if (errorLocale) {
      setContentLocale(errorLocale);
    }
  };

  return (
    <form
      className="grid gap-5 pb-20"
      noValidate
      onSubmit={handleSubmit(
        (values) => saveMutation.mutate(values),
        handleInvalidSubmit,
      )}
    >
      <ListingFormSection
        number={copy.sections.basics.number}
        title={copy.sections.basics.title}
        description={copy.sections.basics.description}
      >
        <div className="mb-3 flex justify-end">
          <ListingLanguageSwitcher
            closeLabel={dictionary.common.close}
            label={copy.localization.language}
            onLocaleChange={setContentLocale}
            value={contentLocale}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ControlledLocalizedTextField
            containerClassName="md:col-span-2"
            control={control}
            name="title"
            locale={contentLocale}
            label={copy.fields.title}
            hint={copy.fields.titleHint}
            localeLabel={null}
            required
          />

          <ControlledLocalizedTextareaField
            containerClassName="md:col-span-2"
            control={control}
            name="description"
            locale={contentLocale}
            label={copy.fields.description}
            hint={copy.fields.descriptionHint}
            localeLabel={null}
            rows={7}
            required
          />

          <ControlledAdaptiveDropdown
            control={control}
            name="propertyType"
            label={copy.fields.propertyType}
            closeLabel={dictionary.common.close}
            sheetTitle={copy.fields.propertyType}
            options={propertyTypes.map((type) => ({
              value: type,
              label: dictionary.catalog.propertyTypes[type],
            }))}
            required
          />

          <ControlledAdaptiveDropdown
            control={control}
            name="furnishing"
            label={copy.fields.furnishing}
            closeLabel={dictionary.common.close}
            sheetTitle={copy.fields.furnishing}
            options={[
              { value: "", label: copy.options.furnishing.none },
              {
                value: "UNFURNISHED",
                label: copy.options.furnishing.unfurnished,
              },
              {
                value: "PARTLY_FURNISHED",
                label: copy.options.furnishing.partly,
              },
              {
                value: "FULLY_FURNISHED",
                label: copy.options.furnishing.fully,
              },
            ]}
          />

          <ControlledNumericField
            control={control}
            name="bedrooms"
            label={copy.fields.bedrooms}
            disabled={isStudio}
            required
          />

          <ControlledNumericField
            control={control}
            name="bathrooms"
            label={copy.fields.bathrooms}
            required
          />

          <ControlledNumericField
            control={control}
            name="floorAreaSqm"
            label={copy.fields.floorArea}
            maxFractionDigits={2}
            suffix="m²"
          />

          <ControlledNumericField
            allowNegative
            control={control}
            name="floor"
            label={copy.fields.floor}
          />

          <ControlledCheckboxField
            containerClassName="md:col-span-2"
            control={control}
            name="petsAllowed"
            label={copy.fields.petsAllowed}
          />
        </div>
      </ListingFormSection>

      <ListingFormSection
        number={copy.sections.rental.number}
        title={copy.sections.rental.title}
        description={copy.sections.rental.description}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <ControlledAdaptiveDropdown
            containerClassName="md:col-span-2"
            control={control}
            name="locationId"
            label={copy.fields.location}
            closeLabel={dictionary.common.close}
            sheetTitle={copy.fields.location}
            options={[
              { value: "", label: copy.options.chooseLocation },
              ...locations.map((location) => ({
                value: location.id,
                label: getLocalizedText(location.name, locale),
              })),
            ]}
            required
          />

          <ControlledTextField
            containerClassName="md:col-span-2"
            control={control}
            name="addressLine"
            label={copy.fields.address}
          />

          <div className="md:col-span-2">
            <input type="hidden" {...register("latitude")} />

            <input type="hidden" {...register("longitude")} />

            <LocationPickerMap
              coordinates={coordinates}
              error={errors.latitude?.message ?? errors.longitude?.message}
              hint={copy.locationPicker.hint}
              label={copy.locationPicker.label}
              mapLabel={copy.locationPicker.mapLabel}
              mapMessages={copy.locationPicker.mapMessages}
              markerLabel={copy.locationPicker.markerLabel}
              onChange={(nextCoordinates) => {
                setValue("latitude", String(nextCoordinates.latitude), {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
                setValue("longitude", String(nextCoordinates.longitude), {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
              suggestedCenter={suggestedCenter}
              useCenterLabel={copy.locationPicker.useCenter}
            />
          </div>

          <ControlledNumericField
            control={control}
            name="monthlyPrice"
            label={copy.fields.monthlyPrice}
            maxFractionDigits={2}
            required
            suffix={currency}
          />

          <ControlledAdaptiveDropdown
            control={control}
            name="currency"
            label={copy.fields.currency}
            closeLabel={dictionary.common.close}
            sheetTitle={copy.fields.currency}
            options={[
              { value: "VND", label: "VND" },
              { value: "USD", label: "USD" },
              { value: "RUB", label: "RUB" },
            ]}
            required
          />

          <ControlledNumericField
            control={control}
            name="securityDeposit"
            label={copy.fields.securityDeposit}
            maxFractionDigits={2}
            suffix={currency}
          />

          <ControlledNumericField
            control={control}
            name="minimumLeaseMonths"
            label={copy.fields.minimumLease}
            required
          />

          <ControlledDatePicker
            control={control}
            name="availableFrom"
            label={copy.fields.availableFrom}
            locale={locale}
            clearLabel={dictionary.common.clear}
            closeLabel={dictionary.common.close}
            dialogLabel={dictionary.common.chooseDate}
            placeholder={dictionary.common.datePlaceholder}
            todayLabel={dictionary.common.today}
            popoverAlign="right"
          />
        </div>
      </ListingFormSection>

      <ListingFormSection
        number={copy.sections.photos.number}
        title={copy.sections.photos.title}
        description={copy.sections.photos.description}
      >
        <ListingImageUploader
          copy={copy.photos}
          disabled={saveMutation.isPending}
          images={uploads}
          locale={locale}
          onBusyChange={setIsImageBusy}
          onImagesChange={setUploads}
        />
      </ListingFormSection>

      <ListingFormSection
        number={copy.sections.features.number}
        title={copy.sections.features.title}
        description={copy.sections.features.description}
      >
        <div className="grid gap-6">
          <fieldset className="grid gap-2">
            <legend className="mb-1 text-body-sm font-semibold text-foreground">
              {copy.fields.amenities}
            </legend>

            <div className="grid gap-x-6 sm:grid-cols-2 xl:grid-cols-3">
              {amenities.map((amenity) => (
                <Checkbox
                  {...register("amenityIds")}
                  key={amenity.id}
                  value={amenity.id}
                  label={
                    <span className="flex items-center gap-3">
                      <AmenityIcon
                        slug={amenity.slug}
                        className="size-6 shrink-0"
                      />

                      <span>{getLocalizedText(amenity.name, locale)}</span>
                    </span>
                  }
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="grid gap-2 border-t border-border-light pt-5">
            <legend className="text-body-sm font-semibold text-foreground">
              {copy.fields.nearbyNature}
            </legend>

            <div className="grid gap-x-6 sm:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => (
                <Checkbox
                  {...register("featureIds")}
                  key={feature.id}
                  value={feature.id}
                  label={
                    <span className="flex items-center gap-3">
                      <EnvironmentFeatureIcon
                        slug={feature.slug}
                        className="size-6 shrink-0"
                      />

                      <span>{getLocalizedText(feature.name, locale)}</span>
                    </span>
                  }
                />
              ))}
            </div>
          </fieldset>
        </div>
      </ListingFormSection>

      {errors.root?.server?.message ? (
        <p
          className="rounded-control border border-danger bg-surface p-3 text-body-sm font-medium text-danger"
          role="alert"
        >
          {errors.root.server.message}
        </p>
      ) : null}

      <div className="sticky bottom-3 z-30 flex flex-col gap-3 rounded-surface border border-border bg-surface p-3 shadow-[4px_4px_0_rgb(24_28_28_/_0.14)] sm:flex-row sm:items-center sm:justify-between md:p-4">
        <p className="text-caption text-muted">{copy.actions.draftHint}</p>

        <Button
          className="w-full sm:w-auto sm:min-w-40"
          disabled={isImageBusy}
          loading={saveMutation.isPending}
          loadingLabel={copy.actions.saving}
          type="submit"
        >
          {copy.actions.save}
        </Button>
      </div>
    </form>
  );
}
