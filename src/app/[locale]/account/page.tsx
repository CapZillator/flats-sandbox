import { notFound } from "next/navigation";

import { ContactsEditor } from "@/features/profile/components/contacts-editor/ContactsEditor";
import { ProfileEditor } from "@/features/profile/components/profile-editor/ProfileEditor";
import { getProfileCopy } from "@/features/profile/profile.copy";
import { api } from "@/shared/api/endpoints";
import { isLocale } from "@/shared/i18n/config";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  params,
}: PageProps<"/[locale]/account">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const profile = await api.profile();

  return (
    <section className="grid gap-6">
      <p className="text-body text-muted">{getProfileCopy(locale).subtitle}</p>

      <ProfileEditor profile={profile} locale={locale} />

      <ContactsEditor contacts={profile.contacts} locale={locale} />
    </section>
  );
}
