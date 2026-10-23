import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RegionalSettings } from "./RegionalSettings";

const { push, setCurrency } = vi.hoisted(() => ({
  push: vi.fn(),
  setCurrency: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/listings/apartment",
  useRouter: () => ({ push }),
}));
vi.mock(
  "@/shared/currency/components/currency-provider/CurrencyProvider",
  () => ({ useCurrency: () => ({ currency: "USD", setCurrency }) }),
);

beforeEach(() => {
  vi.clearAllMocks();
  window.history.replaceState(
    null,
    "",
    "/listings/apartment?maxPrice=500&currency=USD#availability",
  );
});

describe("RegionalSettings", () => {
  it("applies currency and closes the panel without navigating", () => {
    render(<RegionalSettings locale="en" closeLabel="Close" />);
    fireEvent.click(
      screen.getByRole("button", { name: "Language and currency" }),
    );
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeVisible();
    expect(screen.getByRole("radio", { name: "English" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "$ USD" })).toBeChecked();
    fireEvent.click(screen.getByRole("radio", { name: "₽ RUB" }));
    expect(setCurrency).toHaveBeenCalledWith("RUB");
    expect(push).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
    expect(
      screen.getByRole("button", { name: "Language and currency" }),
    ).toHaveFocus();
  });

  it("preserves the page, filters and anchor when changing language", () => {
    render(<RegionalSettings locale="en" closeLabel="Close" />);
    fireEvent.click(
      screen.getByRole("button", { name: "Language and currency" }),
    );
    fireEvent.click(screen.getByRole("radio", { name: "Русский" }));
    expect(push).toHaveBeenCalledWith(
      "/ru/listings/apartment?maxPrice=500&currency=USD#availability",
    );
    expect(setCurrency).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("restores scrolling and trigger focus after dismissing the panel", () => {
    document.body.style.overflow = "auto";
    render(<RegionalSettings locale="en" closeLabel="Close" />);
    const trigger = screen.getByRole("button", {
      name: "Language and currency",
    });
    fireEvent.click(trigger);
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent(
      screen.getByRole("dialog"),
      new Event("cancel", { bubbles: true, cancelable: true }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("auto");
    expect(trigger).toHaveFocus();
    document.body.style.overflow = "";
  });
});
