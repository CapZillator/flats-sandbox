import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Listing } from "@/shared/api/types";
import { getDictionary } from "@/shared/i18n/dictionaries";

import { ListingCard } from "./ListingCard";

vi.mock(
  "@/features/favorites/components/favorite-button/FavoriteButton",
  () => ({
    FavoriteButton: () => <button type="button">Save</button>,
  }),
);

const listing: Listing = {
  id: "listing-1",
  slug: "quiet-house-da-nang",
  title: { en: "Quiet house near the river", ru: "Тихий дом у реки" },
  description: { en: "A quiet home" },
  status: "PUBLISHED",
  propertyType: "HOUSE",
  furnishing: "FULLY_FURNISHED",
  bedrooms: 2,
  bathrooms: 1,
  floorAreaSqm: "72",
  floor: null,
  monthlyPrice: "1200",
  currency: "USD",
  securityDeposit: null,
  minimumLeaseMonths: 6,
  availableFrom: null,
  addressLine: null,
  latitude: 16.05,
  longitude: 108.2,
  petsAllowed: false,
  isFeatured: true,
  location: {
    id: "location-1",
    slug: "da-nang",
    name: { en: "Da Nang", ru: "Дананг" },
    kind: "CITY",
    parentId: null,
  },
  images: [],
};

describe("ListingCard", () => {
  it("renders localized property information and a canonical link", () => {
    render(
      <ListingCard
        listing={listing}
        locale="en"
        dictionary={getDictionary("en")}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Quiet house near the river" }),
    ).toBeVisible();
    expect(screen.getByText("Da Nang")).toBeVisible();
    expect(screen.getByText("Featured")).toBeVisible();
    expect(screen.getByTitle("Bedrooms: 2")).toHaveTextContent("2");
    expect(screen.getByTitle("Bathrooms: 1")).toHaveTextContent("1");
    expect(screen.getByTitle("Floor area, m²: 72")).toHaveTextContent("72 m²");
    expect(screen.getByRole("article")).toHaveClass(
      "bg-surface",
      "border",
      "border-border-light",
      "rounded-surface",
    );
    expect(
      screen.getAllByRole("link", { name: "Quiet house near the river" })[0],
    ).toHaveAttribute("href", "/listings/quiet-house-da-nang");
  });

  it("shows localized studio text and omits missing floor area", () => {
    render(
      <ListingCard
        listing={{
          ...listing,
          propertyType: "STUDIO",
          bedrooms: 0,
          floorAreaSqm: null,
        }}
        locale="ru"
        dictionary={getDictionary("ru")}
      />,
    );

    expect(screen.getByText("Студия")).toBeVisible();
    expect(screen.queryByTitle("Спальни: 0")).not.toBeInTheDocument();
    expect(screen.getByTitle("Ванные: 1")).toBeVisible();
    expect(screen.queryByText(/m²/)).not.toBeInTheDocument();
  });
});
