import Link from "next/link";

import type { CurrentUser } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";
import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localizedPath } from "@/shared/i18n/routing";

import { Logo } from "@/shared/ui/logo/Logo";

const footerLinkClassName =
  "w-fit text-body-sm text-surface/75 transition-colors duration-150 hover:text-accent";

export function Footer({
  locale,
  dictionary,
  user,
}: {
  locale: Locale;
  dictionary: Dictionary;
  user: CurrentUser | null;
}) {
  return (
    <footer className="border-t border-foreground bg-foreground text-surface">
      <div className="content-container page-gutters grid gap-8 py-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end lg:py-12">
        <div className="grid gap-4">
          <Logo locale={locale} label={dictionary.nav.home} inverse />

          <p className="max-w-sm text-body-sm text-surface/65">
            {dictionary.brandTagline}
          </p>
        </div>

        <nav
          className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6"
          aria-label={dictionary.nav.primary}
        >
          <Link
            className={footerLinkClassName}
            href={localizedPath(locale, "/listings")}
          >
            {dictionary.nav.explore}
          </Link>

          <Link
            className={footerLinkClassName}
            href={
              user
                ? localizedPath(locale, "/account/listings/new")
                : localizedPath(locale, "/login")
            }
          >
            {dictionary.nav.host}
          </Link>

          <Link
            className={footerLinkClassName}
            href={
              user
                ? localizedPath(locale, "/account")
                : localizedPath(locale, "/login")
            }
          >
            {user ? dictionary.nav.account : dictionary.nav.signIn}
          </Link>
        </nav>

        <p className="border-t border-surface/15 pt-5 text-caption text-surface/50 sm:col-span-2">
          © {new Date().getFullYear()} Manden
        </p>
      </div>
    </footer>
  );
}
