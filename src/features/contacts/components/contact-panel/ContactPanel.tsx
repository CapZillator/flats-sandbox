"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { getListingDetailCopy } from "@/features/listings/components/listing-detail/listing-detail.copy";
import { browserApi } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import type { Contact } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";
import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localizedPath } from "@/shared/i18n/routing";
import { Badge, Button, getButtonClassName } from "@/shared/ui";
import { ContactMethodIcon } from "./components/contact-method-icon/ContactMethodIcon";

export function ContactPanel({
  listingId,
  locale,
  dictionary,
  signedIn,
  callbackPath,
}: {
  listingId: string;
  locale: Locale;
  dictionary: Dictionary;
  signedIn: boolean;
  callbackPath?: string;
}) {
  const copy = getListingDetailCopy(locale);
  const contactsQuery = useQuery({
    queryKey: queryKeys.contacts(listingId),
    queryFn: async ({ signal }) =>
      (
        await browserApi<{ contacts: Contact[] }>(
          `/listings/${listingId}/contacts`,
          { signal },
        )
      ).contacts,
    enabled: false,
  });

  if (!signedIn) {
    return (
      <div className="grid gap-3">
        <p className="text-body-sm text-muted">
          {dictionary.listing.signInContacts}
        </p>

        <Link
          className={getButtonClassName({ fullWidth: true })}
          href={`${localizedPath(locale, "/login")}?callbackUrl=${encodeURIComponent(callbackPath ?? localizedPath(locale, "/listings"))}`}
        >
          {dictionary.nav.signIn}
        </Link>
      </div>
    );
  }

  if (!contactsQuery.data) {
    return (
      <div className="grid gap-3">
        <Button
          fullWidth
          onClick={() => contactsQuery.refetch()}
          loading={contactsQuery.isFetching}
          loadingLabel={dictionary.common.loading}
        >
          {contactsQuery.error ? dictionary.common.retry : copy.reveal}
        </Button>

        {contactsQuery.error ? (
          <p role="alert" className="text-body-sm text-danger">
            {copy.contactError}
          </p>
        ) : null}
      </div>
    );
  }

  if (contactsQuery.data.length === 0) {
    return <p className="text-body-sm text-muted">{copy.noContacts}</p>;
  }

  return (
    <ul className="grid gap-4">
      {contactsQuery.data.map((contact) => (
        <li key={contact.id} className="grid gap-1">
          <div className="flex items-center gap-2">
            <ContactMethodIcon type={contact.type} />

            <span className="text-caption text-muted">
              {copy.contactTypes[contact.type]}
            </span>

            {contact.isPrimary ? <Badge>{copy.primary}</Badge> : null}
          </div>

          <span className="min-w-0 select-text break-all text-body-sm font-semibold text-foreground">
            {contact.value}
          </span>
        </li>
      ))}
    </ul>
  );
}
