import { api } from "@/shared/api/endpoints";
import type { Locale } from "@/shared/i18n/config";
import { HomePageView } from "../home-page-view/HomePageView";

export async function HomeContent({ locale }: { locale: Locale }) {
  const [locations, features, listings, session] = await Promise.allSettled([
    api.locations({ kind: "CITY" }),
    api.environmentFeatures(),
    api.listings({ sort: "newest", page: 1, limit: 6 }),
    api.session(),
  ]);

  return (
    <HomePageView
      locale={locale}
      authenticated={session.status === "fulfilled" && session.value !== null}
      locations={locations.status === "fulfilled" ? locations.value : null}
      features={features.status === "fulfilled" ? features.value : null}
      listings={listings.status === "fulfilled" ? listings.value.items : null}
    />
  );
}
