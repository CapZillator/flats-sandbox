"use client";

import { ListingDetailError } from "@/features/listings/components/listing-detail-error/ListingDetailError";

export default function Error({ retry }: { retry: () => void }) {
  return <ListingDetailError retry={retry} />;
}
