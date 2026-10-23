import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DatePicker } from "./DatePicker";

const originalMatchMedia = window.matchMedia;

function mockMobileViewport(isMobile: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: isMobile,
      media: "(max-width: 719px)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

afterEach(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: originalMatchMedia,
  });
  document.body.style.overflow = "";
});

describe("DatePicker", () => {
  it("selects and clears a localized date in normal form data", () => {
    mockMobileViewport(false);
    const onValueChange = vi.fn();

    const { container } = render(
      <form>
        <DatePicker
          aria-label="Move-in date"
          clearLabel="Clear"
          defaultValue="2026-10-03"
          dialogLabel="Choose a date"
          locale="en"
          name="availableBy"
          onValueChange={onValueChange}
        />
      </form>,
    );

    const trigger = screen.getByRole("button", { name: "Move-in date" });
    expect(trigger).toHaveTextContent("10/03/2026");

    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "Choose a date" })).toBeVisible();
    expect(
      container.querySelector(".nestly-calendar")?.parentElement,
    ).toHaveClass("mx-auto", "w-full", "max-w-[30rem]");

    fireEvent.click(screen.getByText("15"));

    expect(trigger).toHaveTextContent("10/15/2026");
    expect(onValueChange).toHaveBeenCalledWith("2026-10-15");
    expect(
      new FormData(container.querySelector("form")!).get("availableBy"),
    ).toBe("2026-10-15");

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));

    expect(trigger).toHaveTextContent("dd/mm/yyyy");
    expect(
      new FormData(container.querySelector("form")!).get("availableBy"),
    ).toBe("");
  });

  it("uses a modal bottom sheet on a mobile viewport", () => {
    mockMobileViewport(true);

    render(
      <DatePicker
        aria-label="Дата заезда"
        closeLabel="Закрыть"
        dialogLabel="Выберите дату"
        locale="ru"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Дата заезда" }));

    expect(
      screen.getByRole("dialog", { name: "Выберите дату" }),
    ).toHaveAttribute("aria-modal", "true");
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(screen.getByRole("button", { name: "Закрыть" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });
});
