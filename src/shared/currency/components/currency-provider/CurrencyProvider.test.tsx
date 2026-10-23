import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QueryTestProvider } from "@/shared/test/components/query-test-provider/QueryTestProvider";
import { Money } from "@/shared/ui/money/Money";
import { CurrencyProvider, useCurrency } from "./CurrencyProvider";
import type { ExchangeRatesSnapshot } from "../../currency";
import { formatMoney } from "@/shared/lib/format";

const { refresh } = vi.hoisted(() => ({ refresh: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));
const snapshot: ExchangeRatesSnapshot = {
  baseCurrency: "USD",
  rates: { USD: "1", VND: "25000", RUB: "100" },
  updatedAt: "2026-10-07T00:00:00Z",
  asOf: "2026-10-07T00:00:00Z",
};

function ChangeCurrency() {
  const context = useCurrency();

  return <button onClick={() => context?.setCurrency("RUB")}>RUB</button>;
}

describe("CurrencyProvider", () => {
  it("updates displayed amounts and persists the selected currency for server rendering", () => {
    render(
      <QueryTestProvider>
        <CurrencyProvider initialCurrency="USD" initialSnapshot={snapshot}>
          <Money amount="100" currency="USD" locale="ru" />

          <ChangeCurrency />
        </CurrencyProvider>
      </QueryTestProvider>,
    );
    expect(
      screen.getByText(formatMoney(100, "USD", "ru"), {
        normalizer: (value) => value,
      }),
    ).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "RUB" }));
    expect(
      screen.getByText(formatMoney(10000, "RUB", "ru"), {
        normalizer: (value) => value,
      }),
    ).toHaveAttribute("title", formatMoney(100, "USD", "ru"));
    expect(document.cookie).toContain("nestly.currency=RUB");
    expect(refresh).toHaveBeenCalled();
  });

  it("uses the search snapshot even when the provider has a newer one", () => {
    render(
      <QueryTestProvider>
        <CurrencyProvider
          initialCurrency="RUB"
          initialSnapshot={{
            ...snapshot,
            rates: { ...snapshot.rates, RUB: "200" },
          }}
        >
          <Money amount="100" currency="USD" locale="ru" snapshot={snapshot} />
        </CurrencyProvider>
      </QueryTestProvider>,
    );
    expect(
      screen.getByText(formatMoney(10000, "RUB", "ru"), {
        normalizer: (value) => value,
      }),
    ).toBeVisible();
  });
});
