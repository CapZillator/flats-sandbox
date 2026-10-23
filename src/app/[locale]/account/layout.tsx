import Link from "next/link";
import type { Metadata } from "next";
import { getAdminCopy } from "@/features/admin/admin.copy";
import { redirect, notFound } from "next/navigation";
import { LogoutButton } from "@/features/auth/components/logout-button/LogoutButton";
import { api } from "@/shared/api/endpoints";
import { isLocale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { localizedPath } from "@/shared/i18n/routing";
import { HeartIcon, FolderIcon, ScalesIcon, UserIcon } from "@/shared/ui";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AccountLayout({
  children,
  params,
}: LayoutProps<"/[locale]/account">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const d = getDictionary(locale);
  let user = null;

  try {
    user = await api.session();
  } catch {
    /* handled as unauthenticated */
  }

  if (!user) {
    redirect(
      `${localizedPath(locale, "/login")}?callbackUrl=${encodeURIComponent(localizedPath(locale, "/account"))}`,
    );
  }

  return (
    <div className="content-container page-gutters grid gap-6 py-8 md:py-12">
      <div className="hidden items-center gap-4 border-b border-border-light pb-2 lg:flex">
        <nav
          className="flex min-w-0 flex-1 gap-1 overflow-x-auto"
          aria-label={d.nav.primary}
        >
          {user.role === "ADMIN" ? (
            <Link
              className="inline-flex shrink-0 items-center gap-2 rounded-control px-3 py-2 text-body-sm font-medium text-foreground hover:bg-surface-muted"
              href={localizedPath(locale, "/admin")}
            >
              <ScalesIcon className="size-4 shrink-0" />

              {getAdminCopy(locale).title}
            </Link>
          ) : null}

          <Link
            className="inline-flex shrink-0 items-center gap-2 rounded-control px-3 py-2 text-body-sm font-medium text-foreground hover:bg-surface-muted"
            href={localizedPath(locale, "/account")}
          >
            <UserIcon className="size-4 shrink-0" />

            {d.account.profile}
          </Link>

          <Link
            className="inline-flex shrink-0 items-center gap-2 rounded-control px-3 py-2 text-body-sm font-medium text-foreground hover:bg-surface-muted"
            href={localizedPath(locale, "/account/favorites")}
          >
            <HeartIcon className="size-4 shrink-0" />

            {d.account.favorites}
          </Link>

          <Link
            className="inline-flex shrink-0 items-center gap-2 rounded-control px-3 py-2 text-body-sm font-medium text-foreground hover:bg-surface-muted"
            href={localizedPath(locale, "/account/listings")}
          >
            <FolderIcon className="size-4 shrink-0" />

            {d.account.listings}
          </Link>
        </nav>

        <LogoutButton
          label={d.auth.logout}
          locale={locale}
          className="shrink-0"
        />
      </div>

      {children}
    </div>
  );
}
