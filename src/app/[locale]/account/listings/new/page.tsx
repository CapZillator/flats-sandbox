import { notFound } from "next/navigation";
import { ListingEditor } from "@/features/listings/components/listing-editor/ListingEditor";
import { api } from "@/shared/api/endpoints";
import { isLocale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
export default async function NewListingPage({
  params,
}: PageProps<"/[locale]/account/listings/new">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const d = getDictionary(locale);
  const [locations, amenities, features] = await Promise.all([
    api.locations(),
    api.amenities(),
    api.environmentFeatures(),
  ]);

  return (
    <section className="grid gap-6">
      <header className="max-w-3xl">
        <h2 className="text-h2 text-foreground">{d.account.newListing}</h2>

        <p className="mt-3 text-body text-muted">{d.listingForm.intro}</p>
      </header>

      <ListingEditor
        locale={locale}
        locations={locations.filter((item) => item.kind !== "COUNTRY")}
        amenities={amenities}
        features={features}
      />
    </section>
  );
}
