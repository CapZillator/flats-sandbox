import { afterEach, describe, expect, it, vi } from "vitest";
import { api } from "@/shared/api/endpoints";
import fixture from "@/features/listings/seo/listing-seo.fixture.json";
import sitemap from "./sitemap";

vi.mock("@/shared/api/endpoints", () => ({ api: { listings: vi.fn() } }));
afterEach(() => {
  vi.resetAllMocks();
  vi.unstubAllEnvs();
});

describe("sitemap", () => {
  it("includes every API page, translated URLs, real modification dates and photos", async () => {
    vi.stubEnv("SITE_URL", "https://manden.me");
    vi.mocked(api.listings).mockResolvedValueOnce({
      items: [fixture],
      meta: { page: 1, limit: 100, total: 101, pages: 2 },
    } as Awaited<ReturnType<typeof api.listings>>);
    vi.mocked(api.listings).mockResolvedValueOnce({
      items: [{ ...fixture, slug: "second-home" }],
      meta: { page: 2, limit: 100, total: 101, pages: 2 },
    } as Awaited<ReturnType<typeof api.listings>>);
    const entries = await sitemap();

    expect(api.listings).toHaveBeenNthCalledWith(2, { page: 2, limit: 100 });
    expect(entries).toHaveLength(10);
    expect(entries).toContainEqual(
      expect.objectContaining({
        url: "https://manden.me/ru/listings/second-home",
        lastModified: fixture.updatedAt,
        images: [fixture.images[0].url],
      }),
    );
    expect(
      entries.some(
        ({ url }) =>
          url.includes("/en/") || url.includes("/vi/listings/quiet-house"),
      ),
    ).toBe(false);
  });

  it("fails instead of publishing an incomplete sitemap when the API fails", async () => {
    vi.mocked(api.listings).mockRejectedValue(new Error("API unavailable"));

    await expect(sitemap()).rejects.toThrow("API unavailable");
  });
});
