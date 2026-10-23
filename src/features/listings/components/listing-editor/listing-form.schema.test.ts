import { describe, expect, it } from "vitest";

import { getDictionary } from "@/shared/i18n/dictionaries";

import { createListingFormSchema } from "./listing-form.schema";

const validValues = {
  title: { en: "Coastal apartment", ru: "", vi: "" },
  description: {
    en: "A bright apartment close to the beach and local cafes.",
    ru: "",
    vi: "",
  },
  propertyType: "APARTMENT" as const,
  furnishing: "FULLY_FURNISHED" as const,
  bedrooms: "2",
  bathrooms: "1",
  floorAreaSqm: "72.5",
  floor: "8",
  petsAllowed: true,
  locationId: "11111111-1111-4111-8111-111111111111",
  addressLine: "12 Beach Road",
  latitude: "16.0544",
  longitude: "108.2022",
  monthlyPrice: "18000000",
  currency: "VND" as const,
  securityDeposit: "18000000",
  minimumLeaseMonths: "3",
  availableFrom: "2026-10-15",
  amenityIds: [],
  featureIds: [],
};

describe("listing form schema", () => {
  it("accepts values that map to the backend listing contract", () => {
    const dictionary = getDictionary("en");
    const schema = createListingFormSchema(dictionary.listingForm.errors);

    expect(schema.safeParse(validValues).success).toBe(true);
  });

  it("validates every populated locale and numeric boundaries", () => {
    const dictionary = getDictionary("ru");
    const schema = createListingFormSchema(dictionary.listingForm.errors);
    const result = schema.safeParse({
      ...validValues,
      title: { ...validValues.title, ru: "Дом" },
      description: { ...validValues.description, ru: "Коротко" },
      bathrooms: "0",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.issues.map((issue) => issue.path.join("."))).toEqual(
      expect.arrayContaining(["description.ru", "bathrooms"]),
    );
  });

  it("accepts content in any one locale", () => {
    const dictionary = getDictionary("ru");
    const schema = createListingFormSchema(dictionary.listingForm.errors);

    expect(schema.safeParse(validValues).success).toBe(true);
  });

  it("requires at least one locale for each localized field", () => {
    const dictionary = getDictionary("en");
    const schema = createListingFormSchema(dictionary.listingForm.errors);
    const result = schema.safeParse({
      ...validValues,
      title: { en: "", ru: "", vi: "" },
      description: { en: "", ru: "", vi: "" },
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.issues.map((issue) => issue.path.join("."))).toEqual(
      expect.arrayContaining(["title.en", "title.ru", "description.vi"]),
    );
  });
});
