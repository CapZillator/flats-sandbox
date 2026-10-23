import { z } from "zod";

import type { Dictionary } from "@/shared/i18n/dictionaries";

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

export function createAvailabilityBlockSchema(
  errors: Dictionary["availabilityManager"]["errors"],
) {
  const date = z
    .string()
    .refine((value) => dateOnlyPattern.test(value), errors.required);

  return z
    .object({
      startsOn: date,
      endsOn: date,
      type: z.enum(["OCCUPIED", "OWNER_BLOCKED", "MAINTENANCE"]),
      note: z.string().trim().max(1000, errors.noteMax),
    })
    .superRefine((value, context) => {
      if (
        dateOnlyPattern.test(value.startsOn) &&
        dateOnlyPattern.test(value.endsOn) &&
        value.startsOn > value.endsOn
      ) {
        context.addIssue({
          code: "custom",
          message: errors.dateRange,
          path: ["endsOn"],
        });
      }
    });
}

export type AvailabilityBlockFormValues = z.infer<
  ReturnType<typeof createAvailabilityBlockSchema>
>;
