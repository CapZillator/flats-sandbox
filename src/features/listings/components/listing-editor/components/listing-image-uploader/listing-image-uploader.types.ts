import type { LocalizedText } from "@/shared/i18n/localized-text";

export type ListingUpload = {
  alt: LocalizedText;
  id: string;
  isNew: boolean;
  url: string;
};

export type PendingListingImage = {
  file: File;
  id: string;
  previewUrl: string;
  status: "queued" | "uploading" | "failed";
};
