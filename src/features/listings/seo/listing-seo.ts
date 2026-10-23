import type { Listing, PropertyType } from "@/shared/api/types";
import { locales, type Locale } from "@/shared/i18n/config";
import { getLocalizedText } from "@/shared/i18n/localized-text";
import { absoluteUrl, buildSeoMetadata, localizedUrl } from "@/shared/lib/seo";

const propertyTypes: Record<PropertyType, string> = {
  APARTMENT: "Apartment",
  SERVICED_APARTMENT: "Apartment",
  STUDIO: "Apartment",
  HOUSE: "House",
  VILLA: "House",
};

export function listingSeoLocales(listing: Listing): Locale[] {
  return locales.filter(
    (locale) =>
      listing.title[locale]?.trim() && listing.description[locale]?.trim(),
  );
}

export function listingPath(slug: string): string {
  return `/listings/${encodeURIComponent(slug)}`;
}

export function buildListingSeo(listing: Listing, locale: Locale) {
  const title = getLocalizedText(listing.title, locale);
  const description = getLocalizedText(listing.description, locale);
  const path = listingPath(listing.slug);
  const url = localizedUrl(locale, path);
  const images = listing.images.map((image) => ({
    url: absoluteUrl(image.url),
    alt: getLocalizedText(image.alt, locale) || title,
  }));
  const latitude = Number(listing.latitude);
  const longitude = Number(listing.longitude);
  const hasCoordinates =
    listing.latitude != null &&
    listing.longitude != null &&
    String(listing.latitude).trim() !== "" &&
    String(listing.longitude).trim() !== "" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180;
  const area = Number(listing.floorAreaSqm);
  const propertyId = `${url}#property`;

  return {
    metadata: buildSeoMetadata({
      title,
      description,
      locale,
      path,
      images: images.slice(0, 1),
      availableLocales: listingSeoLocales(listing),
      index: listingSeoLocales(listing).includes(locale),
    }),
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "RealEstateListing",
          "@id": `${url}#listing`,
          url,
          name: title,
          description,
          inLanguage: locale,
          ...(images.length ? { image: images.map((image) => image.url) } : {}),
          ...(listing.publishedAt ? { datePosted: listing.publishedAt } : {}),
          ...(listing.updatedAt ? { dateModified: listing.updatedAt } : {}),
          mainEntity: { "@id": propertyId },
          offers: {
            "@type": "Offer",
            url,
            businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
            itemOffered: { "@id": propertyId },
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: listing.monthlyPrice,
              priceCurrency: listing.currency,
              unitCode: "MON",
              referenceQuantity: {
                "@type": "QuantitativeValue",
                value: 1,
                unitCode: "MON",
              },
            },
          },
        },
        {
          "@type": [propertyTypes[listing.propertyType], "Product"],
          "@id": propertyId,
          name: title,
          description,
          url,
          ...(images.length ? { image: images.map((image) => image.url) } : {}),
          address: {
            "@type": "PostalAddress",
            addressCountry: listing.location.countryCode || "VN",
            ...(listing.addressLine
              ? { streetAddress: listing.addressLine }
              : {}),
            ...(listing.location.kind === "CITY"
              ? {
                  addressLocality: getLocalizedText(
                    listing.location.name,
                    locale,
                  ),
                }
              : {}),
          },
          containedInPlace: {
            "@type": "Place",
            name: getLocalizedText(listing.location.name, locale),
          },
          ...(hasCoordinates
            ? { geo: { "@type": "GeoCoordinates", latitude, longitude } }
            : {}),
          numberOfBedrooms: listing.bedrooms,
          numberOfBathroomsTotal: listing.bathrooms,
          ...(Number.isFinite(area) && area > 0
            ? {
                floorSize: {
                  "@type": "QuantitativeValue",
                  value: area,
                  unitCode: "MTK",
                },
              }
            : {}),
          ...(listing.floor !== null
            ? { floorLevel: String(listing.floor) }
            : {}),
          petsAllowed: listing.petsAllowed,
          leaseLength: {
            "@type": "QuantitativeValue",
            minValue: listing.minimumLeaseMonths,
            unitCode: "MON",
          },
          ...(listing.amenities?.length
            ? {
                amenityFeature: listing.amenities.map(({ amenity }) => ({
                  "@type": "LocationFeatureSpecification",
                  name: getLocalizedText(amenity.name, locale),
                  value: true,
                })),
              }
            : {}),
        },
      ],
    },
  };
}
