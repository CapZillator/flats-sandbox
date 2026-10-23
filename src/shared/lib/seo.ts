import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/shared/i18n/config";
import { localizedPath } from "@/shared/i18n/routing";

export const siteName = "Manden";

export function getSiteUrl(): URL {
  return new URL(process.env.SITE_URL ?? "https://manden.me");
}

export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}

export function localizedUrl(locale: Locale, path = "/"): string {
  return absoluteUrl(localizedPath(locale, path));
}

export function alternateLanguages(
  path: string,
  availableLocales: readonly Locale[] = locales,
): Record<string, string> {
  return {
    ...Object.fromEntries(
      availableLocales.map((locale) => [locale, localizedUrl(locale, path)]),
    ),
    "x-default": localizedUrl(
      availableLocales.includes(defaultLocale)
        ? defaultLocale
        : (availableLocales[0] ?? defaultLocale),
      path,
    ),
  };
}

export function seoExcerpt(text: string, maxLength = 155): string {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const prefix = normalized.slice(0, maxLength - 1);
  const boundary = prefix.lastIndexOf(" ");

  return `${prefix.slice(0, boundary > maxLength / 2 ? boundary : undefined).trimEnd()}…`;
}

const ogLocales: Record<Locale, string> = {
  en: "en_US",
  ru: "ru_RU",
  vi: "vi_VN",
};

export function buildSeoMetadata({
  title,
  description,
  locale,
  path,
  images = [],
  availableLocales = locales,
  index = true,
}: {
  title: string;
  description: string;
  locale: Locale;
  path: string;
  images?: Array<{ url: string; alt: string }>;
  availableLocales?: readonly Locale[];
  index?: boolean;
}): Metadata {
  const url = localizedUrl(locale, path);
  const excerpt = seoExcerpt(description);
  const socialTitle = `${title} · ${siteName}`;

  return {
    title,
    description: excerpt,
    alternates: {
      canonical: url,
      ...(index
        ? { languages: alternateLanguages(path, availableLocales) }
        : {}),
    },
    robots: index
      ? { index: true, follow: true, "max-image-preview": "large" }
      : { index: false, follow: true },
    openGraph: {
      type: "website",
      title: socialTitle,
      description: excerpt,
      siteName,
      url,
      locale: ogLocales[locale],
      alternateLocale: availableLocales
        .filter((value) => value !== locale)
        .map((value) => ogLocales[value]),
      images,
    },
    twitter: {
      card: images.length ? "summary_large_image" : "summary",
      title: socialTitle,
      description: excerpt,
      images: images.map((image) => image.url),
    },
  };
}

export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
