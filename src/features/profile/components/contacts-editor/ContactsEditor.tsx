"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import type { Contact } from "@/shared/api/types";
import { queryKeys } from "@/shared/api/query-keys";
import {
  ControlledAdaptiveDropdown,
  ControlledTextField,
} from "@/shared/forms";
import { useToast } from "@/shared/hooks/useToast";
import type { Locale } from "@/shared/i18n/config";
import { Button, Checkbox, DeleteIcon, IconButton } from "@/shared/ui";
import { profileApi } from "../../profile.api";
import { getProfileCopy } from "../../profile.copy";
import {
  contactTypes,
  createContactsSchema,
  type ContactsValues,
} from "../../profile.schema";

export function ContactsEditor({
  contacts,
  locale,
}: {
  contacts: Contact[];
  locale: Locale;
}) {
  const copy = getProfileCopy(locale);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const form = useForm<ContactsValues>({
    resolver: zodResolver(createContactsSchema(copy)),
    defaultValues: {
      contacts: contacts.map(({ type, value, isPrimary }) => ({
        type,
        value,
        isPrimary,
      })),
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contacts",
  });
  const values = useWatch({ control: form.control, name: "contacts" });
  const mutation = useMutation({
    mutationFn: (input: ContactsValues) =>
      profileApi.replaceContacts({
        contacts: input.contacts.map((contact) => ({
          ...contact,
          value:
            contact.type === "EMAIL"
              ? contact.value.toLowerCase()
              : contact.value,
        })),
      }),
    onSuccess: async (saved) => {
      form.reset({
        contacts: saved.map(({ type, value, isPrimary }) => ({
          type,
          value,
          isPrimary,
        })),
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.profile }),
        queryClient.invalidateQueries({ queryKey: queryKeys.allContacts }),
      ]);
      showToast(copy.contactsSaved, "success");
      router.refresh();
    },
    onError: () => showToast(copy.error, "error"),
  });

  return (
    <form
      className="grid gap-5 rounded-surface border border-border bg-surface p-5 sm:p-6"
      noValidate
      onSubmit={form.handleSubmit((input) => mutation.mutate(input))}
    >
      <div>
        <h2 className="text-h3 text-foreground">{copy.contacts}</h2>

        <p className="mt-2 max-w-2xl text-body-sm text-muted">
          {copy.contactsHint}
        </p>
      </div>

      <fieldset className="grid min-w-0 gap-4" disabled={mutation.isPending}>
        {fields.length === 0 ? (
          <p className="rounded-control bg-surface-muted p-4 text-body-sm text-muted">
            {copy.empty}
          </p>
        ) : null}

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid min-w-0 gap-3 border-b border-border-light pb-4"
          >
            <div className="grid min-w-0 gap-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:grid-rows-[auto_auto_auto] sm:gap-y-1.5">
              <ControlledAdaptiveDropdown
                containerClassName="sm:row-span-3 sm:grid-rows-subgrid"
                control={form.control}
                name={`contacts.${index}.type`}
                label={copy.type}
                options={contactTypes.map((type) => ({
                  value: type,
                  label: copy.types[type],
                }))}
              />

              <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_auto_auto] gap-x-3 gap-y-1.5 sm:row-span-3 sm:grid-rows-subgrid">
                <ControlledTextField
                  containerClassName="row-span-3 grid-rows-subgrid"
                  control={form.control}
                  name={`contacts.${index}.value`}
                  label={copy.value}
                  required
                  maxLength={255}
                  inputMode={
                    values[index]?.type === "EMAIL"
                      ? "email"
                      : values[index]?.type === "TELEGRAM"
                        ? "text"
                        : "tel"
                  }
                  placeholder={
                    values[index]?.type === "TELEGRAM"
                      ? "@username"
                      : values[index]?.type === "EMAIL"
                        ? "name@example.com"
                        : "+84 912 345 678"
                  }
                />

                <IconButton
                  className="col-start-2 row-start-2 self-end"
                  variant="outline"
                  aria-label={`${copy.remove} ${index + 1}`}
                  onClick={() => remove(index)}
                >
                  <DeleteIcon className="size-4" />
                </IconButton>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <Checkbox
                label={copy.primary}
                checked={values[index]?.isPrimary ?? false}
                onChange={(event) => {
                  fields.forEach((_, contactIndex) =>
                    form.setValue(
                      `contacts.${contactIndex}.isPrimary`,
                      contactIndex === index && event.target.checked,
                      { shouldDirty: true, shouldValidate: true },
                    ),
                  );
                }}
              />
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-fit"
          disabled={fields.length >= 12}
          onClick={() =>
            append({ type: "PHONE", value: "", isPrimary: fields.length === 0 })
          }
        >
          + {copy.add}
        </Button>

        <p className="text-caption text-muted">{copy.limit}</p>
      </fieldset>

      {form.formState.errors.contacts?.root?.message ? (
        <p role="alert" className="text-body-sm text-danger">
          {form.formState.errors.contacts.root.message}
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
        disabled={!form.formState.isDirty}
        loading={mutation.isPending}
        loadingLabel={copy.saving}
      >
        {copy.saveContacts}
      </Button>
    </form>
  );
}
