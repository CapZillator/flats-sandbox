import { describe, expect, it } from "vitest";

import { localePathname, localizedPath } from "./routing";

describe("localizedPath", () => {
  it("keeps English routes unprefixed", () => {
    expect(localizedPath("en")).toBe("/");
    expect(localizedPath("en", "/listings")).toBe("/listings");
    expect(localizedPath("en", "account")).toBe("/account");
  });

  it("prefixes non-default locales", () => {
    expect(localizedPath("ru")).toBe("/ru");
    expect(localizedPath("vi", "/listings?view=map")).toBe(
      "/vi/listings?view=map",
    );
  });
});

describe("localePathname", () => {
  it("adds and removes locale prefixes without changing the page", () => {
    expect(localePathname("/login", "ru")).toBe("/ru/login");
    expect(localePathname("/ru/login", "en")).toBe("/login");
    expect(localePathname("/vi", "en")).toBe("/");
  });

  it("canonicalizes the legacy English prefix", () => {
    expect(localePathname("/en/listings", "en")).toBe("/listings");
  });
});
