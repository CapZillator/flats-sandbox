import { afterEach, describe, expect, it, vi } from "vitest";
import {
  alternateLanguages,
  buildSeoMetadata,
  localizedUrl,
  seoExcerpt,
  serializeJsonLd,
} from "./seo";

afterEach(() => vi.unstubAllEnvs());

describe("SEO helpers", () => {
  it("points x-default to an indexable translation when English is missing", () => {
    vi.stubEnv("SITE_URL", "https://manden.me");

    expect(alternateLanguages("/listings/home", ["ru"])).toEqual({
      ru: "https://manden.me/ru/listings/home",
      "x-default": "https://manden.me/ru/listings/home",
    });
  });
  it("escapes script termination while preserving the original JSON data", () => {
    const data = { name: '</script><script>alert("x")</script>' };
    const serialized = serializeJsonLd(data);

    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)).toEqual(data);
  });

  it("normalizes multiline descriptions and truncates at a word boundary", () => {
    expect(seoExcerpt("  A home\n\nnear the beach. ")).toBe(
      "A home near the beach.",
    );
    const result = seoExcerpt(
      "A lovely home near the beach with a beautiful garden",
      30,
    );

    expect(result).toBe("A lovely home near the beach…");
    expect(result.length).toBeLessThanOrEqual(30);
  });

  it("supports a local origin without introducing an English prefix", () => {
    vi.stubEnv("SITE_URL", "http://localhost:3001/");

    expect(localizedUrl("en", "/listings/home")).toBe(
      "http://localhost:3001/listings/home",
    );
    expect(localizedUrl("vi", "/")).toBe("http://localhost:3001/vi");
  });

  it("keeps filtered catalog pages out of the index with a clean canonical", () => {
    vi.stubEnv("SITE_URL", "https://manden.me");
    const metadata = buildSeoMetadata({
      title: "Homes",
      description: "Rent a home",
      locale: "en",
      path: "/listings",
      index: false,
    });

    expect(metadata.alternates).toEqual({
      canonical: "https://manden.me/listings",
    });
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });
});
