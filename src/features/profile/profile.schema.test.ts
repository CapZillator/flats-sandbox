import { describe, expect, it } from "vitest";

import { getProfileCopy } from "./profile.copy";
import {
  createContactsSchema,
  createProfileSchema,
  toProfileInput,
} from "./profile.schema";

const copy = getProfileCopy("en");
const schema = createContactsSchema(copy);

describe("profile validation", () => {
  it("omits blank translations and clears optional empty fields", () => {
    expect(
      toProfileInput({
        landlordType: "",
        name: " ",
        displayName: { en: " ", ru: " Анна " },
        bio: { en: "" },
        preferredLocale: "ru",
      }),
    ).toEqual({
      landlordType: null,
      name: null,
      displayName: { ru: "Анна" },
      bio: null,
      preferredLocale: "ru",
    });
  });

  it("validates translations even in inactive locales", () => {
    expect(
      createProfileSchema(copy).safeParse({
        landlordType: "",
        name: "Anna",
        displayName: { vi: "a".repeat(121) },
        bio: {},
        preferredLocale: "en",
      }).success,
    ).toBe(false);
  });
});

describe("contact validation", () => {
  it.each([
    ["PHONE", "+84 912 345 678"],
    ["WHATSAPP", "+84 912 345 678"],
    ["ZALO", "0912345678"],
    ["EMAIL", "anna@example.com"],
    ["TELEGRAM", "@anna_home"],
  ])("accepts a valid %s contact", (type, value) => {
    expect(
      schema.safeParse({ contacts: [{ type, value, isPrimary: false }] })
        .success,
    ).toBe(true);
  });

  it.each([
    ["PHONE", "letters"],
    ["EMAIL", "not-email"],
    ["TELEGRAM", "https://t.me/anna"],
  ])("rejects invalid %s contacts", (type, value) => {
    expect(
      schema.safeParse({ contacts: [{ type, value, isPrimary: false }] })
        .success,
    ).toBe(false);
  });

  it("rejects case-insensitive duplicates and multiple primary contacts", () => {
    expect(
      schema.safeParse({
        contacts: [
          { type: "EMAIL", value: "ANNA@example.com", isPrimary: false },
          { type: "EMAIL", value: "anna@example.com", isPrimary: false },
        ],
      }).success,
    ).toBe(false);
    expect(
      schema.safeParse({
        contacts: [
          { type: "PHONE", value: "1234567", isPrimary: true },
          { type: "EMAIL", value: "anna@example.com", isPrimary: true },
        ],
      }).success,
    ).toBe(false);
  });

  it("allows removing all contacts and enforces the maximum", () => {
    expect(schema.safeParse({ contacts: [] }).success).toBe(true);
    expect(
      schema.safeParse({
        contacts: Array.from({ length: 13 }, (_, index) => ({
          type: "EMAIL",
          value: `anna${index}@example.com`,
          isPrimary: false,
        })),
      }).success,
    ).toBe(false);
  });
});
