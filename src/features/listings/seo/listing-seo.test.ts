import { afterEach, describe, expect, it, vi } from "vitest";
import type { Listing } from "@/shared/api/types";
import { buildListingSeo } from "./listing-seo";
import fixture from "./listing-seo.fixture.json";

const listing = fixture as Listing;
afterEach(() => vi.unstubAllEnvs());

describe("listing SEO", () => {
  it("uses the public English route and only translated language alternates", () => {
    vi.stubEnv("SITE_URL", "https://manden.me");
    const { metadata } = buildListingSeo(listing, "ru");

    expect(metadata.alternates).toEqual({
      canonical: "https://manden.me/ru/listings/quiet-house",
      languages: {
        en: "https://manden.me/listings/quiet-house",
        ru: "https://manden.me/ru/listings/quiet-house",
        "x-default": "https://manden.me/listings/quiet-house",
      },
    });
    expect(metadata.openGraph).toMatchObject({
      title: "Тихий дом · Manden",
      locale: "ru_RU",
      images: [{ url: listing.images[0].url, alt: "House exterior" }],
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("keeps fallback content accessible without indexing an untranslated duplicate", () => {
    const { metadata } = buildListingSeo(listing, "vi");

    expect(metadata.title).toBe("Quiet house");
    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.alternates).not.toHaveProperty("languages");
  });

  it("describes a monthly lease and preserves meaningful zero and false values", () => {
    const { jsonLd } = buildListingSeo(listing, "en");

    expect(jsonLd["@graph"][0]).toMatchObject({
      "@type": "RealEstateListing",
      datePosted: listing.publishedAt,
      offers: {
        businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
        priceSpecification: {
          price: "1200",
          priceCurrency: "USD",
          unitCode: "MON",
        },
      },
    });
    expect(jsonLd["@graph"][1]).toMatchObject({
      "@type": ["House", "Product"],
      floorLevel: "0",
      petsAllowed: false,
      leaseLength: { minValue: 3, unitCode: "MON" },
      floorSize: { value: 72, unitCode: "MTK" },
    });
    expect(JSON.stringify(jsonLd)).not.toContain('"availability"');
  });

  it("omits invalid coordinates and missing optional details", () => {
    const { jsonLd } = buildListingSeo(
      {
        ...listing,
        latitude: "",
        longitude: 200,
        floorAreaSqm: null,
        floor: null,
        images: [],
        publishedAt: null,
      },
      "en",
    );

    expect(jsonLd["@graph"][1]).not.toHaveProperty("geo");
    expect(jsonLd["@graph"][1]).not.toHaveProperty("floorSize");
    expect(jsonLd["@graph"][1]).not.toHaveProperty("image");
    expect(jsonLd["@graph"][0]).not.toHaveProperty("datePosted");
  });

  it("accepts valid zero coordinates", () => {
    const { jsonLd } = buildListingSeo(
      { ...listing, latitude: 0, longitude: 0 },
      "en",
    );

    expect(jsonLd["@graph"][1]).toHaveProperty("geo", {
      "@type": "GeoCoordinates",
      latitude: 0,
      longitude: 0,
    });
  });
});
