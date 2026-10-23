import type { MetadataRoute } from "next";
import { api } from "@/shared/api/endpoints";
import { locales } from "@/shared/i18n/config";
import {
  absoluteUrl,
  alternateLanguages,
  localizedUrl,
} from "@/shared/lib/seo";
import {
  listingPath,
  listingSeoLocales,
} from "@/features/listings/seo/listing-seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = ["/", "/listings"].flatMap((path) =>
    locales.map((locale) => ({
      url: localizedUrl(locale, path),
      alternates: { languages: alternateLanguages(path) },
    })),
  );
  const first = await api.listings({ page: 1, limit: 100 });

  // Fail visibly if the API is down; never publish a truncated successful sitemap.
  for (let page = 1; page <= Math.max(1, first.meta.pages); page += 1) {
    const result =
      page === 1 ? first : await api.listings({ page, limit: 100 });

    for (const listing of result.items) {
      const path = listingPath(listing.slug);
      const availableLocales = listingSeoLocales(listing);

      for (const locale of availableLocales) {
        entries.push({
          url: localizedUrl(locale, path),
          ...(listing.updatedAt ? { lastModified: listing.updatedAt } : {}),
          ...(listing.images.length
            ? { images: listing.images.map((image) => absoluteUrl(image.url)) }
            : {}),
          alternates: { languages: alternateLanguages(path, availableLocales) },
        });
      }
    }
  }

  if (entries.length > 50_000) {
    throw new Error(
      "Sitemap exceeds 50,000 URLs; split it with generateSitemaps.",
    );
  }

  return entries;
}
