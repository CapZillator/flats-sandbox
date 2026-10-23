"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";

import { browserApi } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import { useToast } from "@/shared/hooks/useToast";
import type { Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { localizedPath } from "@/shared/i18n/routing";
import { Button, CheckIcon, CloseIcon } from "@/shared/ui";

function Requirement({
  complete,
  label,
}: {
  complete: boolean;
  label: string;
}) {
  return (
    <li className="flex items-center gap-2 text-body-sm text-foreground">
      <span
        className={classNames(
          "grid size-6 shrink-0 place-items-center rounded-compact",
          complete ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
        )}
      >
        {complete ? (
          <CheckIcon className="size-3.5" />
        ) : (
          <CloseIcon className="size-3.5" />
        )}
      </span>

      {label}
    </li>
  );
}

export function ListingSubmit({
  hasContacts,
  hasImages,
  id,
  locale,
}: {
  hasContacts: boolean;
  hasImages: boolean;
  id: string;
  locale: Locale;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const copy = getDictionary(locale).listingManagement.moderation;
  const canSubmit = hasContacts && hasImages;
  const submitMutation = useMutation({
    mutationFn: () => browserApi(`/listings/${id}/submit`, { method: "POST" }),
    onSuccess: async () => {
      showToast(copy.success, "success");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.listing(id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.myListings }),
      ]);
      router.refresh();
    },
    onError: () => showToast(copy.error, "error"),
  });

  return (
    <aside className="grid gap-4 rounded-surface border border-border bg-surface p-5 sm:p-6">
      <div>
        <h2 className="text-h3 text-foreground">{copy.title}</h2>

        <p className="mt-1 text-body-sm text-muted">{copy.description}</p>
      </div>

      <ul className="grid gap-2">
        <Requirement
          complete={hasImages}
          label={hasImages ? copy.imagesReady : copy.imagesMissing}
        />

        <Requirement
          complete={hasContacts}
          label={hasContacts ? copy.contactsReady : copy.contactsMissing}
        />
      </ul>

      {!hasContacts ? (
        <Link
          className="w-fit rounded-control text-body-sm font-semibold text-foreground hover:text-muted"
          href={localizedPath(locale, "/account")}
        >
          {copy.profileLink} →
        </Link>
      ) : null}

      {submitMutation.error ? (
        <p className="text-body-sm font-medium text-danger" role="alert">
          {copy.error}
        </p>
      ) : null}

      <Button
        disabled={!canSubmit}
        fullWidth
        loading={submitMutation.isPending}
        loadingLabel={copy.submitting}
        onClick={() => submitMutation.mutate()}
      >
        {copy.submit}
      </Button>
    </aside>
  );
}
