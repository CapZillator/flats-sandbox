import { z } from "zod";

import type { UpdateProfileInput } from "@/shared/api/types";
import type { ProfileCopy } from "./profile.copy";

export const contactTypes = [
  "PHONE",
  "EMAIL",
  "WHATSAPP",
  "ZALO",
  "TELEGRAM",
] as const;

export function createProfileSchema(copy: ProfileCopy) {
  return z.object({
    name: z.string().trim().max(255, copy.tooLong),
    displayName: z.record(z.string(), z.string().trim().max(120, copy.tooLong)),
    bio: z.record(z.string(), z.string().trim().max(1000, copy.tooLong)),
    preferredLocale: z.enum(["en", "ru", "vi"]),
    landlordType: z.enum(["", "OWNER", "REALTOR"]),
  });
}

export type ProfileValues = z.infer<ReturnType<typeof createProfileSchema>>;

export function toProfileInput(values: ProfileValues): UpdateProfileInput {
  const nonEmpty = (text: Record<string, string>) => {
    const entries = Object.entries(text)
      .map(([locale, value]) => [locale, value.trim()] as const)
      .filter(([, value]) => value.length > 0);

    return entries.length ? Object.fromEntries(entries) : null;
  };

  return {
    landlordType: values.landlordType || null,
    name: values.name.trim() || null,
    displayName: nonEmpty(values.displayName),
    bio: nonEmpty(values.bio),
    preferredLocale: values.preferredLocale,
  };
}

export function createContactsSchema(copy: ProfileCopy) {
  return z
    .object({
      contacts: z
        .array(
          z
            .object({
              type: z.enum(contactTypes),
              value: z
                .string()
                .trim()
                .min(1, copy.invalid)
                .max(255, copy.tooLong),
              isPrimary: z.boolean(),
            })
            .superRefine((contact, context) => {
              const valid =
                contact.type === "EMAIL"
                  ? z.email().safeParse(contact.value).success
                  : contact.type === "TELEGRAM"
                    ? /^@?[a-zA-Z0-9_.-]{2,64}$/.test(contact.value)
                    : /^\+?[0-9\s().-]{6,30}$/.test(contact.value);

              if (!valid) {
                context.addIssue({
                  code: "custom",
                  path: ["value"],
                  message: copy.invalid,
                });
              }
            }),
        )
        .max(12, copy.limit),
    })
    .superRefine(({ contacts }, context) => {
      const keys = new Set<string>();

      contacts.forEach((contact, index) => {
        const key = `${contact.type}:${contact.value.toLowerCase()}`;

        if (keys.has(key)) {
          context.addIssue({
            code: "custom",
            path: ["contacts", index, "value"],
            message: copy.duplicate,
          });
        }

        keys.add(key);
      });

      if (contacts.filter((contact) => contact.isPrimary).length > 1) {
        context.addIssue({
          code: "custom",
          path: ["contacts"],
          message: copy.onlyPrimary,
        });
      }
    });
}

export type ContactsValues = z.infer<ReturnType<typeof createContactsSchema>>;
