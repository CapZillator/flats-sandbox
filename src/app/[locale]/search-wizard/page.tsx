import Image from "next/image";
import { notFound } from "next/navigation";

import { SearchWizard } from "@/features/search-wizard/components/search-wizard/SearchWizard";
import { getSearchWizardCopy } from "@/features/search-wizard/search-wizard.copy";
import { api } from "@/shared/api/endpoints";
import { getPreferredCurrency } from "@/shared/currency/server";
import { isLocale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { buildSeoMetadata } from "@/shared/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getSearchWizardCopy(locale);

  return buildSeoMetadata({
    title: copy.title,
    description: copy.subtitle,
    locale,
    path: "/search-wizard",
    index: false,
  });
}

export default async function SearchWizardPage({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const [locationsResult, currency] = await Promise.all([
    api.locations({ kind: "CITY" }).then(
      (locations) => ({ locations, failed: false }),
      () => ({ locations: [], failed: true }),
    ),
    getPreferredCurrency(locale),
  ]);
  const copy = getSearchWizardCopy(locale);

  return (
    <div className="content-container page-gutters grid gap-7 py-8 lg:gap-9 lg:py-12">
      <header className="relative grid min-h-[768px] content-center overflow-hidden rounded-surface bg-surface-muted p-6 md:p-10">
        <Image
          src="/cave-home.webp"
          alt=""
          fill
          sizes="200vw"
          loading="lazy"
          fetchPriority="low"
          className="object-cover opacity-25"
        />

        <div className="relative grid max-w-3xl gap-3">
          <h1 className="text-h1 text-foreground">
            {copy.title.split(copy.titleHighlight)[0]}

            <span className="text-[#f2d33f]">{copy.titleHighlight}</span>

            {copy.title.split(copy.titleHighlight)[1]}
          </h1>

          <p className="text-body-lg text-muted">{copy.subtitle}</p>
        </div>
      </header>

      <SearchWizard
        locale={locale}
        dictionary={getDictionary(locale)}
        locations={locationsResult.locations}
        locationsFailed={locationsResult.failed}
        preferredCurrency={currency}
      />
    </div>
  );
}
