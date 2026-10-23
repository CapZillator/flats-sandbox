"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";

import { ApiError, browserApi } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import type { Locale } from "@/shared/i18n/config";
import { localizedPath } from "@/shared/i18n/routing";
import { useToast } from "@/shared/hooks/useToast";
import { HeartIcon } from "@/shared/ui";

type FavoriteLabels = {
  favorite: string;
  saved: string;
  signIn: string;
  added: string;
  removed: string;
  error: string;
};

export function FavoriteButton({
  compact = false,
  initiallySaved = false,
  labels,
  listingId,
  locale,
}: {
  compact?: boolean;
  initiallySaved?: boolean;
  labels: FavoriteLabels;
  listingId: string;
  locale: Locale;
}) {
  const [needsLogin, setNeedsLogin] = useState(false);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const favoriteIdsQuery = useQuery({
    queryKey: queryKeys.favorites.ids,
    queryFn: ({ signal }) =>
      browserApi<{ listingIds: string[] }>("/favorites/ids", { signal }),
  });
  const saved =
    favoriteIdsQuery.data?.listingIds.includes(listingId) ?? initiallySaved;
  const toggleMutation = useMutation({
    mutationFn: (nextSaved: boolean) =>
      browserApi(`/favorites/${listingId}`, {
        method: nextSaved ? "POST" : "DELETE",
      }),
    onMutate: async (nextSaved) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites.ids });
      const previous = queryClient.getQueryData<{ listingIds: string[] }>(
        queryKeys.favorites.ids,
      );
      queryClient.setQueryData<{ listingIds: string[] }>(
        queryKeys.favorites.ids,
        (current = { listingIds: [] }) => ({
          listingIds: nextSaved
            ? [...new Set([...current.listingIds, listingId])]
            : current.listingIds.filter((id) => id !== listingId),
        }),
      );

      return { saved: previous?.listingIds.includes(listingId) ?? saved };
    },
    onError: (error, _nextSaved, previous) => {
      if (previous) {
        queryClient.setQueryData<{ listingIds: string[] }>(
          queryKeys.favorites.ids,
          (current = { listingIds: [] }) => ({
            listingIds: previous.saved
              ? [...new Set([...current.listingIds, listingId])]
              : current.listingIds.filter((id) => id !== listingId),
          }),
        );
      }

      if (error instanceof ApiError && error.status === 401) {
        setNeedsLogin(true);

        return;
      }

      showToast(labels.error, "error");
    },
    onSuccess: (_data, nextSaved) => {
      showToast(nextSaved ? labels.added : labels.removed, "success");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all }),
  });

  if (needsLogin) {
    return (
      <Link
        className="inline-flex min-h-9 items-center rounded-control border border-foreground bg-surface px-3 text-body-sm font-semibold text-foreground"
        href={localizedPath(locale, "/login")}
      >
        {labels.signIn}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classNames(
        "inline-flex items-center justify-center gap-2 border font-semibold transition-colors disabled:cursor-wait disabled:opacity-60",
        compact
          ? "size-10 rounded-full border-border bg-surface/95 text-foreground shadow-[2px_2px_0_rgb(24_28_28_/_15%)] hover:border-foreground"
          : "min-h-11 rounded-control border-border bg-surface px-4 text-body-sm text-foreground hover:border-foreground hover:bg-surface-muted",
      )}
      onClick={() => toggleMutation.mutate(!saved)}
      disabled={toggleMutation.isPending || favoriteIdsQuery.isPending}
      aria-pressed={saved}
      aria-label={saved ? labels.saved : labels.favorite}
    >
      <HeartIcon className="size-5" filled={saved} />

      {!compact ? (saved ? labels.saved : labels.favorite) : null}
    </button>
  );
}
