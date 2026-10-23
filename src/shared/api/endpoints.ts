import type { ExchangeRatesSnapshot } from "@/shared/currency/currency";
import { ApiError } from "./client";
import { serverApi } from "./server";
import type {
  Amenity,
  CurrentUser,
  EnvironmentFeature,
  FavoriteListing,
  Listing,
  ListingQuery,
  Location,
  ModerationListing,
  ListingStatus,
  Paginated,
  UserProfile,
} from "./types";

export const api = {
  exchangeRates: () =>
    serverApi<ExchangeRatesSnapshot>("/currencies/exchange-rates"),
  moderationListings: (query: {
    status: ListingStatus;
    page: number;
    limit: number;
  }) =>
    serverApi<Paginated<ModerationListing>>("/admin/listings", {
      auth: true,
      query,
    }),
  moderationListing: (id: string) =>
    serverApi<ModerationListing>(`/admin/listings/${encodeURIComponent(id)}`, {
      auth: true,
    }),
  listings: (query: ListingQuery = {}) =>
    serverApi<Paginated<Listing>>("/listings", {
      query: query as Record<string, unknown>,
    }),
  listing: (slug: string) =>
    serverApi<Listing>(`/listings/${encodeURIComponent(slug)}`),
  availability: (id: string, from: string, to: string) =>
    serverApi<Array<{ startsOn: string; endsOn: string }>>(
      `/listings/${encodeURIComponent(id)}/availability`,
      { query: { from, to } },
    ),
  locations: (query: Record<string, unknown> = {}) =>
    serverApi<Location[]>("/locations", { query, next: { revalidate: 3600 } }),
  amenities: () =>
    serverApi<Amenity[]>("/amenities", { next: { revalidate: 3600 } }),
  environmentFeatures: () =>
    serverApi<EnvironmentFeature[]>("/environment-features", {
      next: { revalidate: 3600 },
    }),
  favorites: (query: { page?: number; limit?: number } = {}) =>
    serverApi<Paginated<FavoriteListing>>("/favorites", {
      auth: true,
      query,
    }),
  myListings: () => serverApi<Listing[]>("/listings/mine", { auth: true }),
  myListing: (id: string) =>
    serverApi<Listing>(`/listings/manage/${encodeURIComponent(id)}`, {
      auth: true,
    }),
  profile: () => serverApi<UserProfile>("/users/me", { auth: true }),
  async session(): Promise<CurrentUser | null> {
    try {
      return (
        await serverApi<{ user: CurrentUser }>("/auth/me", { auth: true })
      ).user;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return null;
      }

      throw error;
    }
  },
};
