import { CurrencyProvider } from "@/shared/currency/components/currency-provider/CurrencyProvider";
import { getPreferredCurrency } from "@/shared/currency/server";
import { notFound } from "next/navigation";
import { Footer } from "@/features/shell/components/footer/Footer";
import { Header } from "@/features/shell/components/header/Header";
import { OfflineBanner } from "@/shared/ui/offline-banner/OfflineBanner";
import { PwaRegister } from "@/shared/pwa/components/pwa-register/PwaRegister";
import { SessionRecovery } from "@/features/auth/components/session-recovery/SessionRecovery";
import { api } from "@/shared/api/endpoints";
import { isLocale, locales } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { ToastProvider } from "@/shared/model/toast/ToastContext";
import { ToastContainer } from "@/shared/ui";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale: value } = await params;

  if (!isLocale(value)) {
    notFound();
  }

  const dictionary = getDictionary(value);
  const currency = await getPreferredCurrency(value);
  const snapshot = await api.exchangeRates().catch(() => undefined);
  let user = null;

  try {
    user = await api.session();
  } catch {
    /* public shell remains usable while API is down */
  }

  return (
    <CurrencyProvider initialCurrency={currency} initialSnapshot={snapshot}>
      <ToastProvider>
        <PwaRegister />

        <SessionRecovery />

        <div className="flex min-h-dvh flex-col">
          <OfflineBanner message={dictionary.common.offline} />

          <Header locale={value} dictionary={dictionary} user={user} />

          <main className="flex-1">{children}</main>

          <Footer locale={value} dictionary={dictionary} user={user} />
        </div>

        <ToastContainer dismissLabel={dictionary.common.dismissNotification} />
      </ToastProvider>
    </CurrencyProvider>
  );
}
