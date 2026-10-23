import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HomeContent } from "./HomeContent";

const { apiMock } = vi.hoisted(() => ({
  apiMock: {
    locations: vi.fn(),
    environmentFeatures: vi.fn(),
    listings: vi.fn(),
    session: vi.fn(),
  },
}));
vi.mock("@/shared/api/endpoints", () => ({ api: apiMock }));
vi.mock("@/features/listings/components/listing-card/ListingCard", () => ({
  ListingCard: ({ listing }: { listing: { id: string } }) => (
    <article>{listing.id}</article>
  ),
}));

describe("HomeContent", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    apiMock.locations.mockResolvedValue([]);
    apiMock.environmentFeatures.mockResolvedValue([]);
    apiMock.listings.mockResolvedValue({ items: [{ id: "real-listing" }] });
    apiMock.session.mockResolvedValue(null);
  });

  it("fetches real latest listings and the city directory with the checked API filters", async () => {
    render(await HomeContent({ locale: "en" }));

    expect(apiMock.locations).toHaveBeenCalledWith({ kind: "CITY" });
    expect(apiMock.listings).toHaveBeenCalledWith({
      sort: "newest",
      page: 1,
      limit: 6,
    });
    expect(screen.getByRole("article")).toHaveTextContent("real-listing");
  });

  it("isolates failed requests so the rest of the homepage stays usable", async () => {
    apiMock.locations.mockRejectedValue(new Error("Unavailable"));
    apiMock.session.mockRejectedValue(new Error("Unavailable"));
    render(await HomeContent({ locale: "en" }));

    expect(screen.getByRole("article")).toHaveTextContent("real-listing");
    expect(screen.getByRole("button", { name: "Search homes" })).toBeEnabled();
    expect(
      screen.getByRole("link", { name: "List your home" }),
    ).toHaveAttribute("href", "/login?callbackUrl=%2Faccount%2Flistings%2Fnew");
  });
});
