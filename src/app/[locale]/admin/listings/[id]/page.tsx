import { notFound } from "next/navigation";
import { requireAdmin } from "@/features/admin/admin.access";
import { moderationListingIdSchema } from "@/features/admin/admin.schema";
import { ModerationReview } from "@/features/admin/components/moderation-review/ModerationReview";
import { ApiError } from "@/shared/api/client";
import { api } from "@/shared/api/endpoints";
import { isLocale } from "@/shared/i18n/config";

export const dynamic = "force-dynamic";

export default async function ReviewPage({
  params,
}: PageProps<"/[locale]/admin/listings/[id]">) {
  const { locale, id } = await params;

  if (!isLocale(locale) || !moderationListingIdSchema.safeParse(id).success) {
    notFound();
  }

  await requireAdmin(locale, `/admin/listings/${id}`);
  let listing;

  try {
    listing = await api.moderationListing(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  return <ModerationReview initial={listing} locale={locale} />;
}
