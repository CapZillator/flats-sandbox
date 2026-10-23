"use client";

import { FavoritesError } from "@/features/favorites/components/favorites-error/FavoritesError";

export default function Error({ retry }: { retry: () => void }) {
  return <FavoritesError retry={retry} />;
}
