"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { browserApi } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import { useToast } from "@/shared/hooks/useToast";
import type { Locale } from "@/shared/i18n/config";
import { localizedPath } from "@/shared/i18n/routing";
import { Button, ConfirmationDialog, DeleteIcon } from "@/shared/ui";
import { getDeleteCopy } from "./listing-delete.copy";

export function ListingDelete({ id, locale }: { id: string; locale: Locale }) {
  const copy = getDeleteCopy(locale);
  const [confirming, setConfirming] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const client = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();
  const mutation = useMutation({
    mutationFn: () =>
      browserApi<{ ok: true; imageCleanupPending: boolean }>(
        `/listings/${id}`,
        { method: "DELETE" },
      ),
    onSuccess: async () => {
      setDeleted(true);
      client.removeQueries({ queryKey: queryKeys.listing(id) });
      client.removeQueries({ queryKey: queryKeys.contacts(id) });
      client.removeQueries({ queryKey: ["availability", id] });
      client.removeQueries({ queryKey: queryKeys.moderationListing(id) });
      showToast(copy.success, "success");
      await Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.myListings }),
        client.invalidateQueries({ queryKey: queryKeys.favorites.all }),
        client.invalidateQueries({ queryKey: queryKeys.allMapListings }),
        client.invalidateQueries({ queryKey: queryKeys.moderation }),
      ]);
      router.replace(localizedPath(locale, "/account/listings"));
      router.refresh();
    },
    onError: () => showToast(copy.error, "error"),
  });

  if (deleted) {
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
        className="text-danger"
        aria-haspopup="dialog"
        onClick={() => {
          mutation.reset();
          setConfirming(true);
        }}
      >
        <DeleteIcon className="size-4 shrink-0" />

        {copy.action}
      </Button>

      <ConfirmationDialog
        open={confirming}
        title={copy.action}
        description={copy.description}
        confirmLabel={copy.confirm}
        cancelLabel={copy.cancel}
        confirmVariant="danger"
        pending={mutation.isPending}
        error={mutation.error ? copy.error : undefined}
        onConfirm={() => mutation.mutate()}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
