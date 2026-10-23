import { Suspense } from "react";
import { notFound } from "next/navigation";
import { HomeContent } from "@/features/home/components/home-content/HomeContent";
import { HomeLoading } from "@/features/home/components/home-loading/HomeLoading";
import { isLocale } from "@/shared/i18n/config";
import { buildHomeMetadata } from "@/features/home/seo/home-seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return buildHomeMetadata(locale);
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent locale={locale} />
    </Suspense>
  );
}
