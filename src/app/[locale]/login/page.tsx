import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthForm } from "@/features/auth/components/auth-form/AuthForm";
import { AuthFormSkeleton } from "@/features/auth/components/auth-form-skeleton/AuthFormSkeleton";
import { isLocale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function LoginPage({
  params,
}: PageProps<"/[locale]/login">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);

  return (
    <section className="page-gutters relative isolate flex min-h-[80svh] items-center overflow-hidden py-10 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:hidden before:bg-[url('/cave-entrance.webp')] before:bg-cover before:bg-center before:bg-no-repeat before:opacity-[0.12] before:mix-blend-multiply before:mask-[radial-gradient(ellipse_at_center,black_40%,transparent_80%)] min-[768px]:before:block md:py-16 lg:py-20">
      <div className="mx-auto grid w-full max-w-container-sm gap-8 md:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)] md:items-center md:gap-12 lg:gap-16">
        <header className="grid max-w-xl gap-4">
          <h1 className="text-h1 text-foreground">{dictionary.auth.title}</h1>

          <p className="max-w-lg text-body-lg font-normal text-foreground">
            {dictionary.auth.copy}
          </p>
        </header>

        <Suspense
          fallback={<AuthFormSkeleton label={dictionary.common.loading} />}
        >
          <AuthForm locale={locale} dictionary={dictionary} />
        </Suspense>
      </div>
    </section>
  );
}
