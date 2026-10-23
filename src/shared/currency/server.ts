import "server-only";
import { cookies } from "next/headers";
import type { Locale } from "@/shared/i18n/config";
import { currencyCookie, defaultCurrency, isCurrency } from "./currency";

export async function getPreferredCurrency(locale: Locale) {
  const stored = (await cookies()).get(currencyCookie)?.value;

  return isCurrency(stored) ? stored : defaultCurrency(locale);
}
