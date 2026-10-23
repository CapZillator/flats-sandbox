import { z } from "zod";

import { locales } from "@/shared/i18n/config";
import type { Dictionary } from "@/shared/i18n/dictionaries";

const propertyTypes = [
  "APARTMENT",
  "SERVICED_APARTMENT",
  "STUDIO",
  "HOUSE",
  "VILLA",
] as const;

const furnishingOptions = [
  "",
  "UNFURNISHED",
  "PARTLY_FURNISHED",
  "FULLY_FURNISHED",
] as const;

function numericString({
  integer = false,
  max,
  message,
  min,
  optional = false,
}: {
  integer?: boolean;
  max: number;
  message: string;
  min: number;
  optional?: boolean;
}) {
  return z
    .string()
    .trim()
    .refine((value) => {
      if (optional && value === "") {
        return true;
      }

      const number = Number(value);

      return (
        value !== "" &&
        Number.isFinite(number) &&
        (!integer || Number.isInteger(number)) &&
        number >= min &&
        number <= max
      );
    }, message);
}

function isDateOnly(value: string) {
  if (value === "") {
    return true;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );

  return (
    date.getFullYear() === Number(match[1]) &&
    date.getMonth() === Number(match[2]) - 1 &&
    date.getDate() === Number(match[3])
  );
}

function localizedTextSchema(minLength: number, message: string) {
  return z
    .object({ en: z.string(), ru: z.string(), vi: z.string() })
    .superRefine((value, context) => {
      const populatedLocales = locales.filter(
        (locale) => value[locale].trim().length > 0,
      );

      if (populatedLocales.length === 0) {
        for (const locale of locales) {
          context.addIssue({ code: "custom", message, path: [locale] });
        }

        return;
      }

      for (const locale of populatedLocales) {
        if (value[locale].trim().length >= minLength) {
          continue;
        }

        context.addIssue({ code: "custom", message, path: [locale] });
      }
    });
}

export function createListingFormSchema(
  errors: Dictionary["listingForm"]["errors"],
) {
  const localizedTitle = localizedTextSchema(3, errors.title);
  const localizedDescription = localizedTextSchema(20, errors.description);

  return z.object({
    title: localizedTitle,
    description: localizedDescription,
    propertyType: z.enum(propertyTypes),
    furnishing: z.enum(furnishingOptions),
    bedrooms: numericString({
      integer: true,
      min: 0,
      max: 20,
      message: errors.wholeNumber,
    }),
    bathrooms: numericString({
      integer: true,
      min: 1,
      max: 20,
      message: errors.wholeNumber,
    }),
    floorAreaSqm: numericString({
      min: 0.01,
      max: 100_000,
      message: errors.number,
      optional: true,
    }),
    floor: numericString({
      integer: true,
      min: -10,
      max: 300,
      message: errors.wholeNumber,
      optional: true,
    }),
    petsAllowed: z.boolean(),
    locationId: z.uuid(errors.required),
    addressLine: z.string().trim().max(500, errors.maxLength),
    latitude: numericString({
      min: -90,
      max: 90,
      message: errors.coordinates,
    }),
    longitude: numericString({
      min: -180,
      max: 180,
      message: errors.coordinates,
    }),
    monthlyPrice: numericString({
      min: 0,
      max: 1_000_000_000_000,
      message: errors.number,
    }),
    currency: z.enum(["VND", "USD", "RUB"]),
    securityDeposit: numericString({
      min: 0,
      max: 1_000_000_000_000,
      message: errors.number,
      optional: true,
    }),
    minimumLeaseMonths: numericString({
      integer: true,
      min: 1,
      max: 120,
      message: errors.wholeNumber,
    }),
    availableFrom: z.string().refine(isDateOnly, errors.date),
    amenityIds: z.array(z.string()),
    featureIds: z.array(z.string()),
  });
}

export type ListingFormValues = z.infer<
  ReturnType<typeof createListingFormSchema>
>;
