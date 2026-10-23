import "server-only";
import { notFound, redirect } from "next/navigation";
import { api } from "@/shared/api/endpoints";
import type { Locale } from "@/shared/i18n/config";
import { localizedPath } from "@/shared/i18n/routing";

export async function requireAdmin(locale: Locale, path = "/admin") {
  const user = await api.session();

  if (!user) {
    redirect(
      `${localizedPath(locale, "/login")}?callbackUrl=${encodeURIComponent(localizedPath(locale, path))}`,
    );
  }

  if (user.role !== "ADMIN") {
    notFound();
  }

  return user;
}
