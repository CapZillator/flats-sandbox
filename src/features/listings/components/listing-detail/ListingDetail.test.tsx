import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Listing } from "@/shared/api/types";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { ListingDetail } from "./ListingDetail";

vi.mock(
  "@/features/favorites/components/favorite-button/FavoriteButton",
  () => ({ FavoriteButton: () => <button>Save</button> }),
);
vi.mock("@/features/contacts/components/contact-panel/ContactPanel", () => ({
  ContactPanel: () => <div>Contacts</div>,
}));
vi.mock("../listing-location-map/ListingLocationMap", () => ({
  ListingLocationMap: ({ label }: { label: string }) => (
    <div role="region" aria-label={label} />
  ),
}));

const listing: Listing = {
  id: "home-1",
  slug: "quiet-house",
  title: { en: "Quiet house", ru: "Тихий дом" },
  description: { en: "A bright home" },
  status: "PUBLISHED",
  propertyType: "HOUSE",
  furnishing: "FULLY_FURNISHED",
  bedrooms: 2,
  bathrooms: 1,
  floorAreaSqm: "72",
  floor: 0,
  monthlyPrice: "1200",
  currency: "USD",
  securityDeposit: "0",
  minimumLeaseMonths: 3,
  availableFrom: null,
  addressLine: "123 Beach Road",
  latitude: 16.05,
  longitude: 108.2,
  petsAllowed: false,
  isFeatured: false,
  location: {
    id: "city-1",
    slug: "da-nang",
    name: { en: "Da Nang" },
    kind: "CITY",
    parentId: null,
  },
  images: [],
  owner: {
    landlordType: null,
    id: "owner-1",
    name: "Anna",
    image: null,
    displayName: { ru: "Анна" },
    bio: { en: "I live nearby" },
  },
};

function renderDetail(
  overrides: Partial<Listing> = {},
  blocks: Array<{ startsOn: string; endsOn: string }> | null = [],
) {
  return render(
    <ListingDetail
      listing={{ ...listing, ...overrides }}
      locale="en"
      signedIn={false}
      blocks={blocks}
      calendarStart="2026-09-01"
      calendarEnd="2027-09-01"
    />,
  );
}

describe("ListingDetail", () => {
  it("shows public rental details, including zero-valued fields", () => {
    renderDetail();
    const fields = getDictionary("en").listingForm.fields;

    expect(
      screen.getByRole("heading", { level: 1, name: "Quiet house" }),
    ).toBeVisible();
    expect(screen.getAllByText("Da Nang, 123 Beach Road")).toHaveLength(2);
    expect(
      screen.getByRole("region", { name: "Map: Quiet house" }),
    ).toBeVisible();
    expect(screen.getByText(fields.floor).nextElementSibling).toHaveTextContent(
      "0",
    );
    expect(
      screen.getByText(fields.securityDeposit).nextElementSibling,
    ).toHaveTextContent("$0");
    expect(
      screen.getByText(fields.petsAllowed).nextElementSibling,
    ).toHaveTextContent("No");
    expect(screen.getByText("Анна")).toBeVisible();
  });

  it("does not present a failed calendar load as open availability", () => {
    renderDetail({}, null);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "The calendar could not be loaded",
    );
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("hides missing optional sections", () => {
    renderDetail({ owner: undefined, floor: null, securityDeposit: null });

    expect(
      screen.queryByRole("heading", { name: "About the landlord" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Nature nearby" }),
    ).not.toBeInTheDocument();
  });
});
