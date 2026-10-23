"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { UserProfile } from "@/shared/api/types";
import { queryKeys } from "@/shared/api/query-keys";
import {
  ControlledTextField,
  ControlledAdaptiveDropdown,
  ControlledLocalizedTextField,
  ControlledLocalizedTextareaField,
} from "@/shared/forms";
import { useToast } from "@/shared/hooks/useToast";
import { isLocale, locales, type Locale } from "@/shared/i18n/config";
import { getLandlordTypeCopy } from "@/shared/i18n/landlord-type";
import { AdaptiveDropdown, Button, GlobeIcon } from "@/shared/ui";
import { profileApi } from "../../profile.api";
import { getProfileCopy } from "../../profile.copy";
import {
  createProfileSchema,
  toProfileInput,
  type ProfileValues,
} from "../../profile.schema";

function profileValues(profile: UserProfile, locale: Locale): ProfileValues {
  const emptyTranslations = { en: "", ru: "", vi: "" };

  return {
    landlordType: profile.landlordType ?? "",
    name: profile.name ?? "",
    displayName: { ...emptyTranslations, ...profile.displayName },
    bio: { ...emptyTranslations, ...profile.bio },
    preferredLocale: isLocale(profile.preferredLocale)
      ? profile.preferredLocale
      : locale,
  };
}

export function ProfileEditor({
  profile,
  locale,
}: {
  profile: UserProfile;
  locale: Locale;
}) {
  const copy = getProfileCopy(locale);
  const landlordCopy = getLandlordTypeCopy(locale);
  const [inputLocale, setInputLocale] = useState<Locale>(locale);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const form = useForm<ProfileValues>({
    resolver: zodResolver(createProfileSchema(copy)),
    defaultValues: profileValues(profile, locale),
  });
  const mutation = useMutation({
    mutationFn: (values: ProfileValues) =>
      profileApi.update(toProfileInput(values)),
    onSuccess: async (saved) => {
      form.reset(profileValues(saved, locale));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.profile }),
        queryClient.invalidateQueries({ queryKey: queryKeys.session }),
        queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.allMapListings }),
      ]);
      showToast(copy.profileSaved, "success");
      router.refresh();
    },
    onError: () => showToast(copy.error, "error"),
  });

  return (
    <form
      className="grid gap-5 rounded-surface border border-border bg-surface p-5 sm:p-6"
      noValidate
      onSubmit={form.handleSubmit(
        (values) => mutation.mutate(values),
        (errors) => {
          const invalidLocale = locales.find(
            (value) => errors.displayName?.[value] || errors.bio?.[value],
          );

          if (invalidLocale) {
            setInputLocale(invalidLocale);
          }
        },
      )}
    >
      <h2 className="text-h3 text-foreground">{copy.title}</h2>

      <div className="grid gap-1">
        <p className="text-body-sm font-semibold text-foreground">
          {copy.email}
        </p>

        <p className="break-all text-body text-foreground">{profile.email}</p>

        <p className="text-caption text-muted">{copy.emailHint}</p>
      </div>

      <fieldset className="grid min-w-0 gap-5" disabled={mutation.isPending}>
        <ControlledAdaptiveDropdown
          control={form.control}
          name="landlordType"
          label={landlordCopy.label}
          hint={landlordCopy.hint}
          options={[
            { value: "", label: landlordCopy.unknown },
            { value: "OWNER", label: landlordCopy.OWNER },
            { value: "REALTOR", label: landlordCopy.REALTOR },
          ]}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <ControlledTextField
            control={form.control}
            name="name"
            label={copy.name}
            autoComplete="name"
            maxLength={255}
          />

          <ControlledAdaptiveDropdown
            control={form.control}
            name="preferredLocale"
            label={copy.language}
            options={[
              { value: "en", label: "English" },
              { value: "ru", label: "Русский" },
              { value: "vi", label: "Tiếng Việt" },
            ]}
          />
        </div>

        <div className="flex flex-col items-start gap-4 border-t border-border-light pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-lg text-body-sm text-muted">{copy.profileHint}</p>

          <AdaptiveDropdown
            aria-label={copy.inputLanguage}
            sheetTitle={copy.inputLanguage}
            size="sm"
            fullWidth={false}
            variant="outline"
            icon={<GlobeIcon className="size-4" />}
            options={locales.map((value) => ({
              value,
              label: value.toUpperCase(),
            }))}
            value={inputLocale}
            onValueChange={(value) => {
              if (isLocale(value)) {
                setInputLocale(value);
              }
            }}
          />
        </div>

        <ControlledLocalizedTextField
          control={form.control}
          name="displayName"
          locale={inputLocale}
          label={copy.displayName}
          maxLength={120}
        />

        <ControlledLocalizedTextareaField
          control={form.control}
          name="bio"
          locale={inputLocale}
          label={copy.bio}
          maxLength={1000}
          rows={4}
        />
      </fieldset>

      {Object.keys(form.formState.errors).length > 0 ? (
        <p role="alert" className="text-body-sm text-danger">
          {copy.tooLong}
        </p>
      ) : null}

      {mutation.error ? (
        <p role="alert" className="text-body-sm text-danger">
          {copy.error}
        </p>
      ) : null}

      <Button
        className="w-full sm:w-fit"
        type="submit"
        loading={mutation.isPending}
        loadingLabel={copy.saving}
        disabled={!form.formState.isDirty}
      >
        {copy.saveProfile}
      </Button>
    </form>
  );
}
