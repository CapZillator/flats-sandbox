import { notFound } from "next/navigation";
import { AvailabilityManager } from "@/features/availability/components/availability-manager/AvailabilityManager";
import { api } from "@/shared/api/endpoints";
import { isLocale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { getLocalizedText } from "@/shared/i18n/localized-text";
import { localizedPath } from "@/shared/i18n/routing";
import { BackLink } from "@/shared/ui";

export const dynamic = "force-dynamic";

export default async function ManageAvailabilityPage({
  params,
}: PageProps<"/[locale]/account/listings/[id]/availability">) {
  const { locale, id } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const listing = await api.myListing(id);
  const copy = getDictionary(locale).availabilityManager;

  return (
    <section className="grid gap-6">
      <BackLink href={localizedPath(locale, `/account/listings/${id}`)}>
        {copy.back}
      </BackLink>

      <header>
        <p className="text-caption font-bold uppercase tracking-[0.14em] text-muted">
          {copy.eyebrow}
        </p>

        <h1 className="mt-2 text-h1 text-foreground">
          {getLocalizedText(listing.title, locale)}
        </h1>
      </header>

      <AvailabilityManager listingId={id} locale={locale} />
    </section>
  );
}
