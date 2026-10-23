import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "@/shared/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const routeLocale = pathname.split("/")[1];

  if (routeLocale === defaultLocale) {
    const notFoundUrl = request.nextUrl.clone();
    notFoundUrl.pathname = "/_not-found";

    return NextResponse.rewrite(notFoundUrl);
  }

  const requestHeaders = new Headers(request.headers);
  const locale = isLocale(routeLocale) ? routeLocale : defaultLocale;
  requestHeaders.set("x-nestly-locale", locale);

  if (locale === defaultLocale) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;

    return NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}
export const config = {
  matcher: ["/((?!api|auth/callback|_next|.*\\..*).*)"],
};
