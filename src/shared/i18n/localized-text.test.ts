import { describe, expect, it } from "vitest";
import { getLocalizedText } from "./localized-text";

describe("getLocalizedText", () => {
  it("uses the requested locale", () => {
    expect(getLocalizedText({ en: "Sea", ru: "Море" }, "ru")).toBe("Море");
  });
  it("falls back to English and then the first non-empty value", () => {
    expect(getLocalizedText({ en: "Sea", vi: "Biển" }, "ru")).toBe("Sea");
    expect(getLocalizedText({ vi: "Biển" }, "ru")).toBe("Biển");
  });
  it("returns an empty string for missing content", () => {
    expect(getLocalizedText(undefined, "en")).toBe("");
  });
});
