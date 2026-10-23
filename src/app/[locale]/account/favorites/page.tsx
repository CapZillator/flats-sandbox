import { FavoritesList } from "@/features/favorites/components/favorites-list/FavoritesList";
import { FAVORITES_PAGE_SIZE } from "@/features/favorites/favorites.config";
import { api } from "@/shared/api/endpoints";
import { isLocale } from "@/shared/i18n/config";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";

async function loadFavorites() {
  const result = await api.favorites({ page: 1, limit: FAVORITES_PAGE_SIZE });

  return { result, updatedAt: Date.now() };
}
export default async function FavoritesPage({
  params,
}: PageProps<"/[locale]/account/favorites">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const { result, updatedAt } = await loadFavorites();

  return (
    <FavoritesList
      initialData={result}
      initialDataUpdatedAt={updatedAt}
      locale={locale}
    />
  );
}
