import { describe, expect, it } from "vitest";

import { getDictionary } from "@/shared/i18n/dictionaries";

import { createAvailabilityBlockSchema } from "./availability-manager.schema";

const schema = createAvailabilityBlockSchema(
  getDictionary("en").availabilityManager.errors,
);

describe("availability block form schema", () => {
  it("accepts an inclusive date range", () => {
    expect(
      schema.safeParse({
        startsOn: "2026-10-10",
        endsOn: "2026-10-10",
        type: "OCCUPIED",
        note: "Tenant extension",
      }).success,
    ).toBe(true);
  });

  it("rejects a reversed date range", () => {
    const result = schema.safeParse({
      startsOn: "2026-10-11",
      endsOn: "2026-10-10",
      type: "MAINTENANCE",
      note: "",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: ["endsOn"] })]),
    );
  });
});
