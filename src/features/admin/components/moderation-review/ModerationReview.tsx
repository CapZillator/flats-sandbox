"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminCopy } from "@/features/admin/admin.copy";
import { rejectionSchema } from "@/features/admin/admin.schema";
import { ListingStatusBadge } from "@/features/listings/components/listing-status-badge/ListingStatusBadge";
import { ApiError, browserApi } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import type { ModerationListing } from "@/shared/api/types";
import { ControlledTextareaField } from "@/shared/forms";
import { useToast } from "@/shared/hooks/useToast";
import type { Locale } from "@/shared/i18n/config";
import { getLocalizedText } from "@/shared/i18n/localized-text";
import { localizedPath } from "@/shared/i18n/routing";
import {
  BackLink,
  Button,
  ConfirmationDialog,
  EmptyState,
  getButtonClassName,
  WarningIcon,
} from "@/shared/ui";
import { ModerationDetail } from "../moderation-detail/ModerationDetail";

type Decision = { action: "publish" } | { action: "reject"; reason: string };

export function ModerationReview({
  initial,
  locale,
}: {
  initial: ModerationListing;
  locale: Locale;
}) {
  const copy = getAdminCopy(locale);
  const router = useRouter();
  const client = useQueryClient();
  const { showToast } = useToast();
  const [confirmPublish, setConfirmPublish] = useState(false);
  const form = useForm<{ reason: string }>({
    resolver: zodResolver(rejectionSchema(copy.reasonError)),
    defaultValues: { reason: "" },
  });
  const key = queryKeys.moderationListing(initial.id);
  const query = useQuery({
    queryKey: key,
    queryFn: ({ signal }) =>
      browserApi<ModerationListing>(`/admin/listings/${initial.id}`, {
        signal,
      }),
    initialData: initial,
    staleTime: 0,
  });
  const mutation = useMutation({
    mutationFn: (decision: Decision) =>
      browserApi<ModerationListing>(
        `/admin/listings/${initial.id}/${decision.action}`,
        {
          method: "POST",
          ...(decision.action === "reject"
            ? { body: JSON.stringify({ reason: decision.reason }) }
            : {}),
        },
      ),
    onSuccess: async (listing, decision) => {
      client.setQueryData(key, listing);
      setConfirmPublish(false);
      form.reset();
      showToast(
        decision.action === "publish" ? copy.published : copy.rejected,
        "success",
      );
      await Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.moderation }),
        client.invalidateQueries({ queryKey: queryKeys.myListings }),
        client.invalidateQueries({ queryKey: queryKeys.listing(initial.id) }),
        client.invalidateQueries({ queryKey: queryKeys.favorites.all }),
        client.invalidateQueries({ queryKey: queryKeys.allMapListings }),
      ]);
      router.refresh();
    },
    onError: async (error) => {
      const conflict = error instanceof ApiError && error.status === 409;
      showToast(conflict ? copy.conflict : copy.error, "error");

      if (conflict) {
        await query.refetch();
        router.refresh();
      }
    },
  });
  const listing = query.data;
  const denied = [mutation.error, query.error].some(
    (error) =>
      error instanceof ApiError &&
      (error.status === 401 || error.status === 403),
  );

  if (denied) {
    return (
      <EmptyState
        title={copy.denied}
        icon={<WarningIcon className="size-5" />}
        role="alert"
        action={
          <Link
            className={getButtonClassName({ variant: "outline" })}
            href={`${localizedPath(locale, "/login")}?callbackUrl=${encodeURIComponent(localizedPath(locale, `/admin/listings/${initial.id}`))}`}
          >
            {copy.retry}
          </Link>
        }
      />
    );
  }

  const pending = listing.status === "PENDING_REVIEW";
  const canPublish =
    listing.images.length > 0 &&
    listing.owner.contacts.length > 0 &&
    listing.owner.status === "ACTIVE";
  const busy = mutation.isPending || query.isFetching || query.isError;
  const conflict =
    mutation.error instanceof ApiError && mutation.error.status === 409;

  return (
    <section className="grid min-w-0 gap-6">
      <BackLink href={localizedPath(locale, "/admin")}>{copy.back}</BackLink>

      <header className="grid justify-items-start gap-3">
        <ListingStatusBadge locale={locale} status={listing.status} />

        <h1 className="break-words text-h1">
          {getLocalizedText(listing.title, locale)}
        </h1>
      </header>

      {listing.rejectionReason ? (
        <p className="rounded-surface border border-danger bg-danger/5 p-4 text-body-sm">
          {copy.reason}: {listing.rejectionReason}
        </p>
      ) : null}

      {query.isError ? (
        <div
          role="alert"
          className="grid gap-3 rounded-surface border border-danger p-4"
        >
          <p>{copy.loadError}</p>

          <Button
            variant="outline"
            onClick={() => void query.refetch()}
            loading={query.isFetching}
          >
            {copy.retry}
          </Button>
        </div>
      ) : null}

      <aside className="grid gap-4 rounded-surface border border-border bg-surface p-5">
        {!pending ? (
          <p className="text-body-sm text-muted">{copy.locked}</p>
        ) : (
          <>
            {!canPublish ? (
              <p className="text-body-sm text-danger">{copy.requirements}</p>
            ) : null}

            {mutation.error && !confirmPublish ? (
              <p role="alert" className="text-body-sm text-danger">
                {conflict ? copy.conflict : copy.error}
              </p>
            ) : null}

            <Button
              className="w-fit"
              disabled={busy || !canPublish}
              aria-haspopup="dialog"
              onClick={() => {
                mutation.reset();
                setConfirmPublish(true);
              }}
            >
              {copy.publish}
            </Button>

            <ConfirmationDialog
              open={confirmPublish}
              title={copy.confirm}
              description={copy.confirmCopy}
              confirmLabel={copy.confirm}
              cancelLabel={copy.cancel}
              pending={mutation.isPending}
              confirmDisabled={busy || !canPublish}
              error={
                mutation.error
                  ? conflict
                    ? copy.conflict
                    : copy.error
                  : undefined
              }
              onConfirm={() => mutation.mutate({ action: "publish" })}
              onCancel={() => setConfirmPublish(false)}
            />

            <form
              className="grid gap-3 border-t border-border-light pt-4"
              noValidate
              onSubmit={form.handleSubmit(({ reason }) =>
                mutation.mutate({ action: "reject", reason }),
              )}
            >
              <ControlledTextareaField
                control={form.control}
                name="reason"
                label={copy.reason}
                hint={copy.reasonHint}
                required
                rows={3}
                maxLength={1000}
                disabled={busy}
              />

              <Button
                type="submit"
                variant="danger"
                className="w-fit"
                disabled={busy}
                loading={mutation.isPending}
              >
                {copy.reject}
              </Button>
            </form>
          </>
        )}
      </aside>

      <ModerationDetail listing={listing} locale={locale} />
    </section>
  );
}
