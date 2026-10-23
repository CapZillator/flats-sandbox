"use client";

import { OwnerListingsError } from "@/features/listings/components/owner-listings-error/OwnerListingsError";

export default function Error({ retry }: { retry: () => void }) {
  return <OwnerListingsError retry={retry} />;
}
