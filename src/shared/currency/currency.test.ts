import { describe, expect, it } from "vitest";
import {
  defaultCurrency,
  formatConvertedMoney,
  isCurrency,
  type ExchangeRatesSnapshot,
} from "./currency";
import { formatMoney } from "@/shared/lib/format";

const snapshot: ExchangeRatesSnapshot = {
  baseCurrency: "USD",
  rates: { USD: "1", VND: "25000", RUB: "100" },
  updatedAt: "2026-10-07T00:00:00Z",
  asOf: "2026-10-07T00:00:00Z",
};

describe("currency display", () => {
  it("converts the precise amount before rounding the displayed result", () => {
    expect(formatConvertedMoney("1.49", "USD", "RUB", "en", snapshot)).toBe(
      "RUB 149",
    );
    expect(formatConvertedMoney("57916", "RUB", "USD", "en", snapshot)).toBe(
      "$579",
    );
  });

  it("converts VND to RUB through USD", () => {
    expect(formatConvertedMoney("2500000", "VND", "RUB", "ru", snapshot)).toBe(
      formatMoney(10000, "RUB", "ru"),
    );
  });
  it("preserves the original amount for the author's currency", () => {
    expect(formatConvertedMoney("120.75", "RUB", "RUB", "ru", snapshot)).toBe(
      formatMoney("120.75", "RUB", "ru"),
    );
  });
  it("keeps the original currency if exchange rates are unavailable or invalid", () => {
    expect(formatConvertedMoney(100, "USD", "RUB", "en")).toBe(
      formatMoney(100, "USD", "en"),
    );
    expect(
      formatConvertedMoney(100, "USD", "RUB", "en", {
        ...snapshot,
        rates: { ...snapshot.rates, RUB: "0" },
      }),
    ).toBe(formatMoney(100, "USD", "en"));
  });
  it("supports RUB and chooses locale defaults", () => {
    expect(isCurrency("RUB")).toBe(true);
    expect(isCurrency("EUR")).toBe(false);
    expect(defaultCurrency("ru")).toBe("RUB");
    expect(defaultCurrency("vi")).toBe("VND");
  });
});
