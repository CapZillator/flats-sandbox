import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/features/admin/admin.access";
import { moderationStatuses } from "@/features/admin/admin.schema";
import { ModerationQueue } from "@/features/admin/components/moderation-queue/ModerationQueue";
import { api } from "@/shared/api/endpoints";
import { isLocale } from "@/shared/i18n/config";
import { localizedPath } from "@/shared/i18n/routing";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  params,
  searchParams,
}: PageProps<"/[locale]/admin">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  await requireAdmin(locale);
  const raw = await searchParams;
  const status =
    moderationStatuses.find((item) => item === raw.status) ?? "PENDING_REVIEW";
  const requestedPage = Number(raw.page);
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;
  const result = await api.moderationListings({ status, page, limit: 12 });

  if (page > Math.max(1, result.meta.pages)) {
    redirect(
      `${localizedPath(locale, "/admin")}?${new URLSearchParams({ status, page: String(Math.max(1, result.meta.pages)) })}`,
    );
  }

  return <ModerationQueue result={result} status={status} locale={locale} />;
}
