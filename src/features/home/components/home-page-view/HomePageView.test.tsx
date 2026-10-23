import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { getHomeCopy } from "@/features/home/home.copy";
import { HomePageView } from "./HomePageView";

vi.mock("@/features/listings/components/listing-card/ListingCard", () => ({
  ListingCard: ({ listing }: { listing: { id: string } }) => (
    <article>{listing.id}</article>
  ),
}));

describe("HomePageView", () => {
  it.each(["en", "ru", "vi"] as const)(
    "renders localized copy and canonical links in %s",
    (locale) => {
      render(
        <HomePageView
          locale={locale}
          locations={[
            {
              id: "city-id",
              slug: "da-nang",
              name: { en: "Da Nang" },
              kind: "CITY",
              parentId: null,
            },
          ]}
          features={[
            {
              id: "sea",
              slug: "sea",
              name: { en: "Sea" },
              category: "COAST",
              iconKey: null,
            },
          ]}
          listings={[]}
        />,
      );
      const prefix = locale === "en" ? "" : `/${locale}`;

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        getDictionary(locale).home.title.replace(/\s+/g, " "),
      );
      expect(screen.getByRole("link", { name: "Da Nang" })).toHaveAttribute(
        "href",
        `${prefix}/listings?locationId=city-id`,
      );
      expect(screen.getByRole("link", { name: "Sea" })).toHaveAttribute(
        "href",
        `${prefix}/listings?environmentSlugs=sea`,
      );
      expect(
        screen.getByRole("link", { name: getHomeCopy(locale).hostAction }),
      ).toHaveAttribute(
        "href",
        `${prefix}/login?callbackUrl=${encodeURIComponent(`${prefix}/account/listings/new`)}`,
      );
      expect(
        screen.getByText(getHomeCopy(locale).benefits[0].description),
      ).toBeVisible();
    },
  );

  it("distinguishes API failures from an empty catalogue without inventing reference links", () => {
    const { rerender } = render(
      <HomePageView
        locale="en"
        locations={null}
        features={null}
        listings={null}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Homes could not be loaded" }),
    ).toBeVisible();
    expect(screen.queryByRole("link", { name: "Sea" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search homes" })).toBeEnabled();
    rerender(
      <HomePageView
        locale="en"
        locations={[]}
        features={[]}
        listings={[]}
        authenticated
      />,
    );

    expect(
      screen.getByRole("heading", { name: "A new place to find your place" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Homes could not be loaded" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "List your home" }),
    ).toHaveAttribute("href", "/account/listings/new");
  });
});
