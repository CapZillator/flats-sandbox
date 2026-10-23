// @vitest-environment node

import {
  getRewrittenUrl,
  isRewrite,
  unstable_doesMiddlewareMatch,
} from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { config, proxy } from "./proxy";

describe("locale proxy", () => {
  it("internally maps unprefixed English routes to the locale tree", () => {
    const response = proxy(
      new NextRequest("https://nestly.test/listings?view=map"),
    );

    expect(isRewrite(response)).toBe(true);
    expect(getRewrittenUrl(response)).toBe(
      "https://nestly.test/en/listings?view=map",
    );
  });

  it("does not expose English-prefixed URLs", () => {
    const response = proxy(
      new NextRequest("https://nestly.test/en/listings?view=map"),
    );

    expect(isRewrite(response)).toBe(true);
    expect(getRewrittenUrl(response)).toBe(
      "https://nestly.test/_not-found?view=map",
    );
  });

  it("keeps non-default locale routes public", () => {
    const response = proxy(new NextRequest("https://nestly.test/ru/listings"));

    expect(isRewrite(response)).toBe(false);
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("does not rewrite static files or metadata routes", () => {
    expect(
      unstable_doesMiddlewareMatch({ config, url: "/manifest.webmanifest" }),
    ).toBe(false);
    expect(
      unstable_doesMiddlewareMatch({ config, url: "/icons/icon.svg" }),
    ).toBe(false);
    expect(
      unstable_doesMiddlewareMatch({ config, url: "/auth/callback" }),
    ).toBe(false);
  });
});
