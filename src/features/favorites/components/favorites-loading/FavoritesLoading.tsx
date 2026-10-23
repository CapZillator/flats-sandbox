import { ListingCardSkeleton, Skeleton } from "@/shared/ui";

export function FavoritesLoading({
  showHeader = true,
}: {
  showHeader?: boolean;
}) {
  return (
    <div aria-busy="true" className="grid gap-6">
      {showHeader ? (
        <div className="grid gap-2">
          <Skeleton className="h-[1lh] w-48 max-w-full text-h3" />

          <Skeleton className="h-[1lh] w-full max-w-lg text-body-sm" />

          <Skeleton className="h-[1lh] w-24 text-caption" />
        </div>
      ) : null}

      <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <ListingCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
