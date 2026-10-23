import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AdaptiveDropdown } from "./AdaptiveDropdown";

const options = [
  { value: "", label: "Any home" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
];

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

describe("AdaptiveDropdown", () => {
  it("selects with the keyboard and updates normal form data", () => {
    mockMobileViewport(false);
    const onValueChange = vi.fn();

    const { container } = render(
      <form>
        <AdaptiveDropdown
          aria-label="Home type"
          name="propertyType"
          defaultValue=""
          onValueChange={onValueChange}
          options={options}
        />
      </form>,
    );

    const trigger = screen.getByRole("combobox", { name: "Home type" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "Enter" });

    expect(trigger).toHaveTextContent("Apartment");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(onValueChange).toHaveBeenCalledWith("apartment");
    expect(
      new FormData(container.querySelector("form")!).get("propertyType"),
    ).toBe("apartment");
  });

  it("uses a modal bottom sheet on a mobile viewport", () => {
    mockMobileViewport(true);

    render(
      <AdaptiveDropdown
        aria-label="Home type"
        closeLabel="Close"
        defaultValue="house"
        options={options}
        sheetTitle="Choose a home type"
      />,
    );

    fireEvent.click(screen.getByRole("combobox", { name: "Home type" }));

    expect(
      screen.getByRole("dialog", { name: "Choose a home type" }),
    ).toBeVisible();
    expect(document.body.style.overflow).toBe("hidden");
    expect(screen.getByRole("button", { name: "Close" })).toHaveClass(
      "-mr-3",
      "size-10",
    );
    const selectedOption = screen.getByRole("option", { name: "House" });
    const hoveredOption = screen.getByRole("option", { name: "Apartment" });

    expect(selectedOption).toHaveAttribute("aria-selected", "true");
    expect(selectedOption).toHaveClass("bg-accent");
    expect(selectedOption).not.toHaveClass("bg-surface-muted");

    fireEvent.pointerMove(hoveredOption);

    expect(selectedOption).toHaveClass("bg-accent");
    expect(hoveredOption).toHaveClass("bg-surface-muted");

    fireEvent.click(hoveredOption);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveTextContent("Apartment");
  });

  it("supports an icon and a borderless trigger variant", () => {
    mockMobileViewport(false);

    render(
      <AdaptiveDropdown
        aria-label="Language"
        fullWidth={false}
        icon={<svg data-testid="language-icon" />}
        options={[{ value: "en", label: "EN" }]}
        size="sm"
        value="en"
        variant="ghost"
      />,
    );

    expect(screen.getByTestId("language-icon")).toBeVisible();
    expect(screen.getByRole("combobox", { name: "Language" })).toHaveClass(
      "border-transparent",
      "bg-transparent",
      "w-fit",
      "gap-2",
      "h-9",
    );
  });

  it("keeps the desktop options layer as wide as its trigger", () => {
    mockMobileViewport(false);

    render(
      <AdaptiveDropdown aria-label="Bedrooms" options={options} value="" />,
    );

    fireEvent.click(screen.getByRole("combobox", { name: "Bedrooms" }));

    expect(screen.getByRole("listbox").parentElement).toHaveClass("w-full");
    expect(screen.getByRole("listbox").parentElement).not.toHaveClass(
      "min-w-max",
    );
  });
});
