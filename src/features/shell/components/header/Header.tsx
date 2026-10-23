import { RegionalSettings } from "@/shared/ui/regional-settings/RegionalSettings";
import Link from "next/link";
import { getAdminCopy } from "@/features/admin/admin.copy";
import { LogoutButton } from "@/features/auth/components/logout-button/LogoutButton";

import type { CurrentUser } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";
import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localizedPath } from "@/shared/i18n/routing";
import {
  getButtonClassName,
  HeartIcon,
  FolderIcon,
  LoginIcon,
  MoneyIcon,
  ScalesIcon,
  TileIcon,
  UserIcon,
} from "@/shared/ui";

import { Logo } from "@/shared/ui/logo/Logo";

import { NavigationDrawer } from "./components/navigation-drawer/NavigationDrawer";

const navigationLinkClassName =
  "text-body-sm font-medium text-foreground transition-colors duration-150 hover:text-muted";

const drawerLinkClassName =
  "flex items-center gap-2 text-body font-medium text-foreground transition-colors duration-150 hover:text-muted";

export function Header({
  locale,
  dictionary,
  user,
}: {
  locale: Locale;
  dictionary: Dictionary;
  user: CurrentUser | null;
}) {
  const accountHref = user
    ? localizedPath(locale, "/account")
    : localizedPath(locale, "/login");
  const hostHref = user
    ? localizedPath(locale, "/account/listings/new")
    : localizedPath(locale, "/login");

  return (
    <header className="sticky top-0 z-40 border-b border-border-light bg-surface">
      <div className="content-container page-gutters flex min-h-16 items-center gap-2 py-2 sm:gap-4">
        <Logo locale={locale} label={dictionary.nav.home} />

        <nav
          className="ml-6 hidden items-center gap-6 lg:flex"
          aria-label={dictionary.nav.primary}
        >
          <Link
            className={navigationLinkClassName}
            href={localizedPath(locale, "/listings")}
          >
            {dictionary.nav.explore}
          </Link>

          {user ? (
            <Link
              className={navigationLinkClassName}
              href={localizedPath(locale, "/account/favorites")}
            >
              {dictionary.nav.favorites}
            </Link>
          ) : null}

          <Link className={navigationLinkClassName} href={hostHref}>
            {dictionary.nav.host}
          </Link>

          {user?.role === "ADMIN" ? (
            <Link
              className={navigationLinkClassName}
              href={localizedPath(locale, "/admin")}
            >
              {getAdminCopy(locale).title}
            </Link>
          ) : null}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <RegionalSettings
            locale={locale}
            closeLabel={dictionary.common.close}
          />

          <div className="hidden sm:block">
            <Link
              className={getButtonClassName({
                variant: "ghost",
                size: "sm",
                className: "border-0",
              })}
              href={accountHref}
            >
              {!user ? <LoginIcon className="size-5 shrink-0" /> : null}

              {user ? dictionary.nav.account : dictionary.nav.signIn}
            </Link>
          </div>

          <NavigationDrawer
            label={dictionary.nav.menu}
            closeLabel={dictionary.common.close}
          >
            {user?.role === "ADMIN" ? (
              <Link
                className={drawerLinkClassName}
                href={localizedPath(locale, "/admin")}
              >
                <ScalesIcon className="size-5 shrink-0" />

                {getAdminCopy(locale).title}
              </Link>
            ) : null}

            <Link
              className={drawerLinkClassName}
              href={localizedPath(locale, "/listings")}
            >
              <TileIcon className="size-5 shrink-0" />

              {dictionary.nav.explore}
            </Link>

            {user ? (
              <Link
                className={drawerLinkClassName}
                href={localizedPath(locale, "/account/favorites")}
              >
                <HeartIcon className="size-5 shrink-0" />

                {dictionary.nav.favorites}
              </Link>
            ) : null}

            <Link className={drawerLinkClassName} href={hostHref}>
              <MoneyIcon className="size-5 shrink-0" />

              {dictionary.nav.host}
            </Link>

            {user ? (
              <Link
                className={drawerLinkClassName}
                href={localizedPath(locale, "/account/listings")}
              >
                <FolderIcon className="size-5 shrink-0" />

                {dictionary.account.listings}
              </Link>
            ) : null}

            <Link className={drawerLinkClassName} href={accountHref}>
              {user ? (
                <UserIcon className="size-5 shrink-0" />
              ) : (
                <LoginIcon className="size-5 shrink-0" />
              )}

              {user ? dictionary.account.profile : dictionary.nav.signIn}
            </Link>

            {user ? (
              <LogoutButton
                label={dictionary.auth.logout}
                locale={locale}
                className="h-auto! justify-start border-0! p-0! text-body font-medium! hover:bg-transparent! hover:text-muted"
              />
            ) : null}
          </NavigationDrawer>
        </div>
      </div>
    </header>
  );
}
