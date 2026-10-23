import { describe, expect, it } from "vitest";
import { rejectionSchema } from "./admin.schema";

describe("rejectionSchema", () => {
  it("trims reasons and mirrors backend length bounds", () => {
    const schema = rejectionSchema("Invalid reason");

    expect(schema.parse({ reason: "  Add photos  " })).toEqual({
      reason: "Add photos",
    });
    expect(schema.safeParse({ reason: "     " }).success).toBe(false);
    expect(schema.safeParse({ reason: "1234" }).success).toBe(false);
    expect(schema.safeParse({ reason: "a".repeat(1000) }).success).toBe(true);
    expect(schema.safeParse({ reason: "a".repeat(1001) }).success).toBe(false);
  });
});
