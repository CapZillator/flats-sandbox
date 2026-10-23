import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Listing } from "@/shared/api/types";
import { getDictionary } from "@/shared/i18n/dictionaries";

import { OwnerListingCard } from "./OwnerListingCard";

vi.mock("../listing-unpublish/ListingUnpublish", () => ({
  ListingUnpublish: () => <button>Unpublish</button>,
}));

vi.mock("../listing-delete/ListingDelete", () => ({
  ListingDelete: () => <button>Delete listing</button>,
}));

const listing: Listing = {
  id: "listing-1",
  slug: "quiet-house",
  title: { en: "Quiet house", ru: "Тихий дом" },
  description: { en: "A quiet home" },
  status: "DRAFT",
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
  isFeatured: false,
  location: {
    id: "location-1",
    slug: "da-nang",
    name: { en: "Da Nang", ru: "Дананг" },
    kind: "CITY",
    parentId: null,
  },
  images: [],
};

describe("OwnerListingCard", () => {
  it("renders localized status and management links for a draft", () => {
    const dictionary = getDictionary("ru");
    render(<OwnerListingCard listing={listing} locale="ru" />);

    expect(screen.getByRole("heading", { name: "Тихий дом" })).toBeVisible();
    expect(
      screen.getByText(dictionary.listingManagement.statuses.DRAFT),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: dictionary.ownerListings.edit }),
    ).toHaveAttribute("href", "/ru/account/listings/listing-1");
    expect(
      screen.getByRole("link", { name: dictionary.listingManagement.calendar }),
    ).toHaveAttribute("href", "/ru/account/listings/listing-1/availability");
    expect(
      screen.queryByRole("link", { name: /Открыть объявление/ }),
    ).not.toBeInTheDocument();
  });

  it("links to the public page only when published", () => {
    render(
      <OwnerListingCard
        listing={{ ...listing, status: "PUBLISHED" }}
        locale="en"
      />,
    );

    expect(screen.getByRole("link", { name: /Open listing/ })).toHaveAttribute(
      "href",
      "/listings/quiet-house",
    );
    expect(screen.getByRole("button", { name: "Unpublish" })).toBeVisible();
  });

  it("groups management buttons and navigation links in one wrapping row and constrains the photo", () => {
    render(
      <OwnerListingCard
        listing={{ ...listing, status: "PUBLISHED" }}
        locale="en"
      />,
    );

    const edit = screen.getByRole("link", { name: "Edit" });
    const unpublish = screen.getByRole("button", { name: "Unpublish" });
    const remove = screen.getByRole("button", { name: "Delete listing" });
    const calendar = screen.getByRole("link", {
      name: getDictionary("en").listingManagement.calendar,
    });
    const publicLink = screen.getByRole("link", { name: /Open listing/ });
    const actions = edit.parentElement;

    expect(actions).toHaveClass("flex", "flex-wrap");
    expect(Array.from(actions!.children)).toEqual([
      edit,
      unpublish,
      remove,
      calendar,
      publicLink,
    ]);
    expect(screen.getAllByRole("link", { name: "Quiet house" })[0]).toHaveClass(
      "aspect-[4/3]",
      "self-start",
    );
    const heading = screen.getByRole("heading", { name: "Quiet house" });
    const headingRow = heading.parentElement!.parentElement;

    expect(headingRow).toHaveClass("flex", "flex-wrap", "items-center");
    expect(
      screen.getByText(getDictionary("en").listingManagement.statuses.PUBLISHED)
        .parentElement,
    ).toBe(headingRow);
  });

  it("shows rejection feedback with editing available", () => {
    render(
      <OwnerListingCard
        listing={{
          ...listing,
          status: "REJECTED",
          rejectionReason: "Please add photos of the kitchen",
        }}
        locale="en"
      />,
    );

    expect(screen.getByText(/Please add photos of the kitchen/)).toBeVisible();
    expect(screen.getByRole("link", { name: "Edit" })).toBeVisible();
  });

  it.each(["PENDING_REVIEW", "ARCHIVED"] as const)(
    "offers details rather than editing for %s",
    (status) => {
      render(<OwnerListingCard listing={{ ...listing, status }} locale="en" />);

      expect(screen.getByRole("link", { name: "View details" })).toBeVisible();
      expect(
        screen.queryByRole("link", { name: "Edit" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: /Open listing/ }),
      ).not.toBeInTheDocument();

      if (status === "ARCHIVED") {
        expect(
          screen.queryByRole("link", {
            name: getDictionary("en").listingManagement.calendar,
          }),
        ).not.toBeInTheDocument();
      }
    },
  );
});
