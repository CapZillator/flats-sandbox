import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "@/shared/styles/index.css";
import { QueryProvider } from "@/shared/api/components/query-provider/QueryProvider";
import { getSiteUrl } from "@/shared/lib/seo";

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: "Manden Vietnam", template: "%s · Manden" },
  description: "Medium and long-term homes for expats in Vietnam.",
  applicationName: "Manden",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Manden" },
  icons: { apple: "/icons/icon-192.png" },
};
export const viewport: Viewport = {
  themeColor: "#ededed",
  colorScheme: "light",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = (await headers()).get("x-nestly-locale") ?? "en";

  return (
    <html
      lang={locale}
      className={inter.variable}
      data-theme="default"
      suppressHydrationWarning
    >
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
