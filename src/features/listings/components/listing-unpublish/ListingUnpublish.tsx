"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, browserApi } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import type { Listing } from "@/shared/api/types";
import { useToast } from "@/shared/hooks/useToast";
import type { Locale } from "@/shared/i18n/config";
import { Button, ConfirmationDialog, EyeOffIcon } from "@/shared/ui";
import { getUnpublishCopy } from "./listing-unpublish.copy";

export function ListingUnpublish({
  id,
  locale,
}: {
  id: string;
  locale: Locale;
}) {
  const copy = getUnpublishCopy(locale);
  const [confirming, setConfirming] = useState(false);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();
  const client = useQueryClient();
  const { showToast } = useToast();
  const mutation = useMutation({
    mutationFn: () =>
      browserApi<Listing>(`/listings/${id}/unpublish`, { method: "POST" }),
    onSuccess: async () => {
      setCompleted(true);
      setConfirming(false);
      showToast(copy.success, "success");
      client.removeQueries({ queryKey: queryKeys.contacts(id) });
      await Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.listing(id) }),
        client.invalidateQueries({ queryKey: queryKeys.myListings }),
        client.invalidateQueries({ queryKey: queryKeys.moderation }),
        client.invalidateQueries({ queryKey: queryKeys.favorites.all }),
        client.invalidateQueries({ queryKey: queryKeys.allMapListings }),
      ]);
      router.refresh();
    },
    onError: (error) => {
      showToast(
        error instanceof ApiError && error.status === 409
          ? copy.conflict
          : copy.error,
        "error",
      );

      if (
        error instanceof ApiError &&
        [401, 403, 404, 409].includes(error.status)
      ) {
        router.refresh();
      }
    },
  });

  if (completed) {
    return (
      <p role="status" className="text-body-sm text-muted">
        {copy.success}
      </p>
    );
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        aria-haspopup="dialog"
        onClick={() => {
          mutation.reset();
          setConfirming(true);
        }}
      >
        <EyeOffIcon className="size-4 shrink-0" />

        {copy.action}
      </Button>

      <ConfirmationDialog
        open={confirming}
        title={copy.action}
        description={copy.description}
        confirmLabel={copy.confirm}
        cancelLabel={copy.cancel}
        confirmVariant="outline"
        pending={mutation.isPending}
        error={
          mutation.error
            ? mutation.error instanceof ApiError &&
              mutation.error.status === 409
              ? copy.conflict
              : copy.error
            : undefined
        }
        onConfirm={() => mutation.mutate()}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
