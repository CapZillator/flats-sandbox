import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireAdmin } from "@/features/admin/admin.access";
import { isLocale } from "@/shared/i18n/config";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({
  children,
  params,
}: LayoutProps<"/[locale]/admin">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  await requireAdmin(locale);

  return (
    <div className="content-container page-gutters grid gap-6 py-8 md:py-12">
      {children}
    </div>
  );
}
