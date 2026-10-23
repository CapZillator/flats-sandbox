import { defaultLocale, isLocale, type Locale } from "./config";

function normalizePath(path: string): string {
  if (!path || path === "/") {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

export function localizedPath(locale: Locale, path = "/"): string {
  const normalizedPath = normalizePath(path);

  if (locale === defaultLocale) {
    return normalizedPath;
  }

  return normalizedPath === "/" ? `/${locale}` : `/${locale}${normalizedPath}`;
}

export function localePathname(pathname: string, locale: Locale): string {
  const normalizedPath = normalizePath(pathname);
  const [firstSegment] = normalizedPath.slice(1).split("/");
  const pathWithoutLocale = isLocale(firstSegment)
    ? normalizedPath.slice(firstSegment.length + 1) || "/"
    : normalizedPath;

  return localizedPath(locale, pathWithoutLocale);
}
