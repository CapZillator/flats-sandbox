import type { ExchangeRatesSnapshot } from "@/shared/currency/currency";
import type { LocalizedText } from "@/shared/i18n/localized-text";

export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";
export type LandlordType = "OWNER" | "REALTOR";
export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";
export type ListingStatus =
  "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | "ARCHIVED";
export type PropertyType =
  "APARTMENT" | "SERVICED_APARTMENT" | "STUDIO" | "HOUSE" | "VILLA";
export type Furnishing = "UNFURNISHED" | "PARTLY_FURNISHED" | "FULLY_FURNISHED";
export type Currency = "VND" | "USD" | "RUB";
export type AvailabilityBlockType =
  "OCCUPIED" | "OWNER_BLOCKED" | "MAINTENANCE";
export type ContactType = "PHONE" | "EMAIL" | "WHATSAPP" | "ZALO" | "TELEGRAM";
export type LocationKind = "COUNTRY" | "CITY" | "DISTRICT" | "WARD";

export interface CurrentUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  status: UserStatus;
  preferredLocale: string;
}
export interface AvailabilityBlock {
  id: string;
  startsOn: string;
  endsOn: string;
  type: AvailabilityBlockType;
  note: string | null;
}
export interface Contact {
  id: string;
  type: ContactType;
  value: string;
  isPrimary: boolean;
}
export interface UserProfile extends CurrentUser {
  landlordType: LandlordType | null;
  displayName: LocalizedText;
  bio: LocalizedText;
  contacts: Contact[];
}
export interface UpdateProfileInput {
  landlordType: LandlordType | null;
  name: string | null;
  displayName: LocalizedText | null;
  bio: LocalizedText | null;
  preferredLocale: "en" | "ru" | "vi";
}
export interface ReplaceContactsInput {
  contacts: Array<Omit<Contact, "id">>;
}
export interface Location {
  id: string;
  slug: string;
  name: LocalizedText;
  kind: LocationKind;
  parentId: string | null;
  countryCode?: string;
  latitude?: string | null;
  longitude?: string | null;
  sortOrder?: number;
}
export interface Amenity {
  id: string;
  slug: string;
  name: LocalizedText;
  iconKey: string | null;
  sortOrder?: number;
}
export interface EnvironmentFeature extends Amenity {
  category: "COAST" | "INLAND_WATER" | "LANDSCAPE";
}
export interface ListingImage {
  id: string;
  assetId?: string | null;
  url: string;
  alt: LocalizedText;
  sortOrder: number;
}
export interface ListingEnvironment {
  distanceMeters: number | null;
  source: "OWNER" | "MODERATOR" | "COMPUTED";
  verifiedAt: string | null;
  feature: EnvironmentFeature;
}
export interface Listing {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  status: ListingStatus;
  propertyType: PropertyType;
  furnishing: Furnishing | null;
  bedrooms: number;
  bathrooms: number;
  floorAreaSqm: string | null;
  floor: number | null;
  monthlyPrice: string;
  currency: Currency;
  securityDeposit: string | null;
  minimumLeaseMonths: number;
  availableFrom: string | null;
  addressLine: string | null;
  latitude: string | number;
  longitude: string | number;
  petsAllowed: boolean;
  isFeatured: boolean;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  location: Location;
  images: ListingImage[];
  amenities?: Array<{ amenity: Amenity }>;
  environmentFeatures?: ListingEnvironment[];
  owner?: {
    landlordType: LandlordType | null;
    id: string;
    name: string | null;
    image: string | null;
    displayName: LocalizedText;
    bio: LocalizedText;
  };
  rejectionReason?: string | null;
}
export interface Paginated<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    exchangeRates?: ExchangeRatesSnapshot;
  };
}
export type ModerationListing = Omit<Listing, "owner"> & {
  owner: Omit<NonNullable<Listing["owner"]>, "landlordType"> & {
    email: string;
    status: UserStatus;
    contacts: Contact[];
  };
  availabilityBlocks: AvailabilityBlock[];
};
export type ListingCardData = Pick<
  Listing,
  | "id"
  | "propertyType"
  | "slug"
  | "title"
  | "bedrooms"
  | "bathrooms"
  | "floorAreaSqm"
  | "monthlyPrice"
  | "currency"
  | "isFeatured"
  | "location"
  | "images"
  | "owner"
>;
export type FavoriteListing = ListingCardData &
  Pick<
    Listing,
    | "propertyType"
    | "furnishing"
    | "minimumLeaseMonths"
    | "availableFrom"
    | "latitude"
    | "longitude"
    | "petsAllowed"
  > & { favoritedAt: string };
export interface ListingQuery {
  landlordType?: LandlordType;
  locationId?: string;
  propertyType?: PropertyType;
  furnishing?: Furnishing;
  currency?: Currency;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  petsAllowed?: boolean;
  availableBy?: string;
  amenitySlugs?: string[];
  environmentSlugs?: string[];
  maxEnvironmentDistanceMeters?: number;
  page?: number;
  limit?: number;
  sort?: "newest" | "price_asc" | "price_desc";
}
export interface MapListing {
  owner: { landlordType: LandlordType | null };
  id: string;
  slug: string;
  title: LocalizedText;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  monthlyPrice: string;
  currency: Currency;
  latitude: number;
  longitude: number;
  availableFrom: string | null;
  isFeatured: boolean;
  location: Location;
  image: Pick<ListingImage, "url" | "alt"> | null;
}
export interface ApiProblem {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}
