import { describe, expect, it } from "vitest";
import { formatMoney } from "./format";

describe("formatMoney", () => {
  it("rounds displayed dollars to the nearest whole unit", () => {
    expect(formatMoney("579.16", "USD", "en")).toBe("$579");
    expect(formatMoney("579.50", "USD", "en")).toBe("$580");
    expect(formatMoney(579.8, "USD", "en")).toBe("$580");
  });

  it("omits fractional digits for whole amounts and zero", () => {
    expect(formatMoney(579, "USD", "en")).toBe("$579");
    expect(formatMoney(0, "USD", "en")).toBe("$0");
  });

  it("rounds rubles to units and preserves Russian grouping", () => {
    expect(formatMoney("12579.80", "RUB", "ru").replace(/\s/g, " ")).toBe(
      "12 580 ₽",
    );
  });

  it("rounds dong to units and preserves Vietnamese grouping", () => {
    expect(formatMoney("1257950.80", "VND", "vi").replace(/\s/g, " ")).toBe(
      "1.257.951 ₫",
    );
  });
});
