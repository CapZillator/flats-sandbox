import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";
import { ApiError } from "@/shared/api/client";
import { api } from "@/shared/api/endpoints";

// Share one result between metadata and page rendering within this request.
export const getPublicListing = cache(async (slug: string) => {
  try {
    return await api.listing(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
});
