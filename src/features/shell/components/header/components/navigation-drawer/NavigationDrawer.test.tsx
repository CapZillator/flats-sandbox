import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getDictionary } from "@/shared/i18n/dictionaries";
import { Header } from "@/features/shell/components/header/Header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/ru",
  useRouter: () => ({ push: vi.fn() }),
}));

function openMenu() {
  render(<Header locale="ru" dictionary={getDictionary("ru")} user={null} />);
  const trigger = screen.getByRole("button", { name: "Меню" });
  trigger.focus();
  fireEvent.click(trigger);

  return { trigger, dialog: screen.getByRole("dialog", { name: "Меню" }) };
}

describe("navigation drawer", () => {
  it("keeps keyboard focus inside the panel", () => {
    const { dialog } = openMenu();
    const close = within(dialog).getByRole("button", { name: "Закрыть" });
    const last = within(dialog).getByRole("link", { name: "Войти" });
    last.focus();
    fireEvent.keyDown(last, { key: "Tab" });
    expect(close).toHaveFocus();
    fireEvent.keyDown(close, { key: "Tab", shiftKey: true });
    expect(last).toHaveFocus();
  });

  beforeEach(() => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
  });

  it("opens localized navigation and restores scroll and focus when closed", () => {
    document.body.style.overflow = "auto";
    const { trigger, dialog } = openMenu();
    expect(document.body.style.overflow).toBe("hidden");
    expect(
      within(dialog).getByRole("link", { name: "Каталог" }),
    ).toHaveAttribute("href", "/ru/listings");
    expect(within(dialog).getByRole("link", { name: "Войти" })).toHaveAttribute(
      "href",
      "/ru/login",
    );
    fireEvent.click(within(dialog).getByRole("button", { name: "Закрыть" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("auto");
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });

  it("closes when the browser cancels the dialog with Escape", () => {
    const { dialog } = openMenu();
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes on the backdrop but keeps clicks inside the panel open", () => {
    const { dialog } = openMenu();
    vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue({
      left: 100,
      right: 400,
      top: 0,
      bottom: 800,
    } as DOMRect);
    fireEvent.click(dialog, { clientX: 120, clientY: 20 });
    expect(dialog).toBeVisible();
    fireEvent.click(dialog, { clientX: 50, clientY: 20 });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when a navigation link is selected", () => {
    const { dialog } = openMenu();
    const link = within(dialog).getByRole("link", { name: "Каталог" });
    link.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(link);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });
});
