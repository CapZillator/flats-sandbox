import {
  fireEvent,
  render as renderUi,
  screen,
  within,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CurrentUser } from "@/shared/api/types";
import { getDictionary } from "@/shared/i18n/dictionaries";

import { Footer } from "@/features/shell/components/footer/Footer";
import { Header } from "@/features/shell/components/header/Header";
import { LocaleSwitcher } from "@/shared/ui/locale-switcher/LocaleSwitcher";

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }));

vi.mock("next/navigation", () => ({
  usePathname: () => "/login",
  useRouter: () => ({ push: pushMock }),
}));

const user: CurrentUser = {
  id: "user-1",
  email: "host@example.com",
  name: "Host",
  image: null,
  role: "LANDLORD",
  status: "ACTIVE",
  preferredLocale: "en",
};

function render(ui: ReactNode) {
  const queryClient = new QueryClient();

  return renderUi(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
}

describe("localized application shell", () => {
  it("only exposes moderation navigation to admins", () => {
    const { rerender } = render(
      <Header locale="en" dictionary={getDictionary("en")} user={user} />,
    );

    expect(
      screen.queryByRole("link", { name: "Moderation" }),
    ).not.toBeInTheDocument();
    rerender(
      <Header
        locale="en"
        dictionary={getDictionary("en")}
        user={{ ...user, role: "ADMIN" }}
      />,
    );
    expect(screen.getByRole("link", { name: "Moderation" })).toHaveAttribute(
      "href",
      "/admin",
    );
    fireEvent.click(screen.getByLabelText("Menu"));
    expect(screen.getAllByRole("link", { name: "Moderation" })).toHaveLength(2);
  });
  beforeEach(() => {
    pushMock.mockReset();
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
  });

  it("renders public navigation with a drawer and sign-in actions", () => {
    const dictionary = getDictionary("en");
    render(<Header locale="en" dictionary={dictionary} user={null} />);

    expect(screen.getByRole("link", { name: "Manden home" })).toHaveAttribute(
      "href",
      "/",
    );
    const menuButton = screen.getByLabelText("Menu");
    expect(menuButton).toBeVisible();
    expect(menuButton).toHaveClass("bg-transparent");
    expect(menuButton).not.toHaveClass("border");
    expect(menuButton.querySelector("svg")).toBeVisible();
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(menuButton);
    expect(screen.getByRole("dialog", { name: "Menu" })).toBeVisible();
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("link", { name: "Sign in" })).not.toHaveLength(
      0,
    );
    expect(
      screen.getAllByRole("link", { name: "List a home" })[0],
    ).toHaveAttribute("href", "/login");
    expect(
      screen.queryByRole("button", { name: dictionary.auth.logout }),
    ).not.toBeInTheDocument();
  });

  it("routes authenticated navigation to landlord and account areas", () => {
    const dictionary = getDictionary("en");
    render(
      <>
        <Header locale="en" dictionary={dictionary} user={user} />

        <Footer locale="en" dictionary={dictionary} user={user} />
      </>,
    );

    expect(screen.getAllByRole("link", { name: "Account" })[0]).toHaveAttribute(
      "href",
      "/account",
    );
    expect(
      screen.getAllByRole("link", { name: "List a home" })[0],
    ).toHaveAttribute("href", "/account/listings/new");
    expect(screen.getAllByRole("link", { name: "Favorites" })).not.toHaveLength(
      0,
    );

    fireEvent.click(screen.getByLabelText("Menu"));
    const drawer = within(screen.getByRole("dialog", { name: "Menu" }));

    expect(
      drawer.getByRole("link", { name: dictionary.account.listings }),
    ).toHaveAttribute("href", "/account/listings");
    expect(
      drawer.getByRole("link", { name: dictionary.nav.favorites }),
    ).toHaveAttribute("href", "/account/favorites");
    expect(
      drawer.getByRole("link", { name: dictionary.account.profile }),
    ).toHaveAttribute("href", "/account");
    expect(
      drawer.getByRole("button", { name: dictionary.auth.logout }),
    ).toBeVisible();
    expect(drawer.getByRole("navigation").lastElementChild).toBe(
      drawer.getByRole("button", { name: dictionary.auth.logout }),
    );
  });

  it("preserves the current page when switching locale", () => {
    render(<LocaleSwitcher locale="en" label="Language" />);

    fireEvent.click(screen.getByRole("combobox", { name: "Language" }));
    fireEvent.click(screen.getByRole("option", { name: "RU" }));

    expect(pushMock).toHaveBeenCalledWith("/ru/login");
  });
});
