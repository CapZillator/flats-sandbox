import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ExchangeRatesSnapshot } from "@/shared/currency/currency";
import { ListingCurrencyConverter } from "./ListingCurrencyConverter";

const state = vi.hoisted(() => ({
  snapshot: undefined as ExchangeRatesSnapshot | undefined,
}));

vi.mock(
  "@/shared/currency/components/currency-provider/CurrencyProvider",
  () => ({
    useCurrency: () => ({ currency: "RUB", snapshot: state.snapshot }),
  }),
);

describe("ListingCurrencyConverter", () => {
  beforeEach(() => {
    state.snapshot = {
      baseCurrency: "USD",
      rates: { USD: "1", RUB: "90", VND: "25000" },
      updatedAt: "2026-10-29T00:00:00Z",
      asOf: "2026-10-29",
    };
  });

  it("opens from the listing price and shows the other currencies", () => {
    render(
      <ListingCurrencyConverter amount="1200" currency="USD" locale="en" />,
    );
    const trigger = screen.getByRole("button", { name: "Convert currency" });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog");

    expect(within(dialog).getByText("$1,200")).toBeVisible();
    expect(
      within(dialog)
        .getAllByRole("term")
        .map((term) => term.textContent),
    ).toEqual(["VND", "RUB"]);
    expect(within(dialog).getByText(/108,000/)).toBeVisible();
    expect(within(dialog).getByText(/30,000,000/)).toBeVisible();
    fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("shows an unavailable message rather than amounts without rates", () => {
    state.snapshot = undefined;
    render(
      <ListingCurrencyConverter amount="1200" currency="USD" locale="en" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Convert currency" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Exchange rates are currently unavailable.",
    );
    expect(screen.queryByRole("definition")).not.toBeInTheDocument();
  });

  it.each([
    {
      currency: "VND" as const,
      amount: "30000000",
      expected: ["$1,200", "RUB 108,000"],
    },
    {
      currency: "RUB" as const,
      amount: "108000",
      expected: ["$1,200", "₫30,000,000"],
    },
  ])(
    "preserves conversion precision for $currency listings",
    ({ currency, amount, expected }) => {
      render(
        <ListingCurrencyConverter
          amount={amount}
          currency={currency}
          locale="en"
        />,
      );
      fireEvent.click(screen.getByRole("button", { name: "Convert currency" }));
      const values = within(screen.getByRole("dialog")).getAllByRole(
        "definition",
      );

      expect(values.map((value) => value.textContent)).toEqual(expected);
    },
  );
});
