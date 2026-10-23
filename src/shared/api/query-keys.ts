export const queryKeys = {
  moderation: ["moderation"] as const,
  moderationListing: (id: string) => ["moderation", "listing", id] as const,
  allMapListings: ["map-listings"] as const,
  allContacts: ["contacts"] as const,
  availability: (listingId: string, from: string, to: string) =>
    ["availability", listingId, { from, to }] as const,
  contacts: (listingId: string) => ["contacts", listingId] as const,
  favorites: {
    all: ["favorites"] as const,
    ids: ["favorites", "ids"] as const,
    page: (page: number, limit: number) =>
      ["favorites", "list", { page, limit }] as const,
  },
  listing: (listingId: string) => ["listing", listingId] as const,
  mapListings: (query: string) => ["map-listings", query] as const,
  myListings: ["my-listings"] as const,
  profile: ["profile"] as const,
  session: ["session"] as const,
};
