import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/shared/api/client";
import type { FavoriteListing, Paginated } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";
import { ToastProvider } from "@/shared/model/toast/ToastContext";
import { ToastContainer } from "@/shared/ui";
import { FavoritesList } from "./FavoritesList";

const { browserApiMock } = vi.hoisted(() => ({ browserApiMock: vi.fn() }));

vi.mock("@/shared/api/client", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/shared/api/client")>();

  return { ...original, browserApi: browserApiMock };
});

function listing(id: string): FavoriteListing {
  return {
    id,
    slug: id,
    title: { en: `Home ${id}`, ru: `Дом ${id}` },
    propertyType: "HOUSE",
    furnishing: null,
    bedrooms: 2,
    bathrooms: 1,
    floorAreaSqm: null,
    monthlyPrice: "1000",
    currency: "USD",
    minimumLeaseMonths: 3,
    availableFrom: null,
    latitude: 16,
    longitude: 108,
    petsAllowed: false,
    isFeatured: false,
    images: [],
    favoritedAt: "2026-10-04T00:00:00Z",
    location: {
      id: "city",
      slug: "da-nang",
      name: { en: "Da Nang" },
      kind: "CITY",
      parentId: null,
    },
  };
}

function result(
  items: FavoriteListing[],
  page = 1,
  pages = 1,
  total = items.length,
): Paginated<FavoriteListing> {
  return { items, meta: { page, pages, total, limit: 12 } };
}

function setup(initialData: Paginated<FavoriteListing>, locale: Locale = "en") {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
      mutations: { retry: false },
    },
  });
  render(
    <QueryClientProvider client={client}>
      <ToastProvider>
        <FavoritesList
          initialData={initialData}
          initialDataUpdatedAt={Date.now()}
          locale={locale}
        />

        <ToastContainer dismissLabel="Dismiss" />
      </ToastProvider>
    </QueryClientProvider>,
  );

  return client;
}

describe("FavoritesList", () => {
  beforeEach(() => {
    browserApiMock.mockReset();
  });

  it.each(["en", "ru", "vi"] as const)(
    "links the empty state to the catalogue in %s",
    (locale) => {
      setup(result([], 1, 0), locale);

      expect(screen.getByRole("link")).toHaveAttribute(
        "href",
        locale === "en" ? "/listings" : `/${locale}/listings`,
      );
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    },
  );

  it("uses server data without fetching the first page again and loads other pages", async () => {
    browserApiMock.mockImplementation((path: string) => {
      if (path === "/favorites/ids") {
        return Promise.resolve({ listingIds: ["first", "second"] });
      }

      return Promise.resolve(result([listing("second")], 2, 2, 13));
    });
    setup(result([listing("first")], 1, 2, 13));

    expect(screen.getByRole("heading", { name: "Home first" })).toBeVisible();
    expect(browserApiMock).not.toHaveBeenCalledWith(
      "/favorites?page=1&limit=12",
      expect.anything(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(
      await screen.findByRole("heading", { name: "Home second" }),
    ).toBeVisible();
    expect(screen.getByText("Page 2 of 2")).toBeVisible();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(browserApiMock).toHaveBeenCalledWith("/favorites?page=2&limit=12", {
      signal: expect.any(AbortSignal),
    });
  });

  it("removes a card after success and shows the empty state", async () => {
    let removed = false;
    browserApiMock.mockImplementation((path: string, options?: RequestInit) => {
      if (options?.method === "DELETE") {
        removed = true;

        return Promise.resolve({ removed: true });
      }

      if (path === "/favorites/ids") {
        return Promise.resolve({ listingIds: removed ? [] : ["first"] });
      }

      return Promise.resolve(result([], 1, 0));
    });
    setup(result([listing("first")]));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Saved" })).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Saved" }));

    expect(
      await screen.findByRole("link", { name: "Browse homes" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Home first" }),
    ).not.toBeInTheDocument();
    expect(browserApiMock).toHaveBeenCalledWith("/favorites/first", {
      method: "DELETE",
    });
  });

  it("returns to the previous page when the last card on the last page is removed", async () => {
    let removed = false;
    browserApiMock.mockImplementation((path: string, options?: RequestInit) => {
      if (options?.method === "DELETE") {
        removed = true;

        return Promise.resolve({ removed: true });
      }

      if (path === "/favorites/ids") {
        return Promise.resolve({
          listingIds: removed ? ["first"] : ["first", "second"],
        });
      }

      if (path.includes("page=2")) {
        return Promise.resolve(
          result(
            removed ? [] : [listing("second")],
            2,
            removed ? 1 : 2,
            removed ? 12 : 13,
          ),
        );
      }

      return Promise.resolve(result([listing("first")], 1, 1, 12));
    });
    setup(result([listing("first")], 1, 2, 13));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    await screen.findByRole("heading", { name: "Home second" });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Saved" })).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Saved" }));

    expect(
      await screen.findByRole("heading", { name: "Home first" }),
    ).toBeVisible();
    await waitFor(() =>
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Saved homes: 12")).toBeVisible();
  });

  it("keeps the card and rolls back its heart if removal fails", async () => {
    browserApiMock.mockImplementation((path: string, options?: RequestInit) => {
      if (options?.method === "DELETE") {
        return Promise.reject(new ApiError(500));
      }

      if (path === "/favorites/ids") {
        return Promise.resolve({ listingIds: ["first"] });
      }

      return Promise.resolve(result([listing("first")]));
    });
    setup(result([listing("first")]));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Saved" })).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Saved" }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Could not"),
    );
    expect(screen.getByRole("heading", { name: "Home first" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Saved" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("offers retry after a page error", async () => {
    let failed = true;
    browserApiMock.mockImplementation((path: string) => {
      if (path === "/favorites/ids") {
        return Promise.resolve({ listingIds: ["first", "second"] });
      }

      if (failed) {
        return Promise.reject(new ApiError(500));
      }

      return Promise.resolve(result([listing("second")], 2, 2, 13));
    });
    setup(result([listing("first")], 1, 2, 13));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not load favorites",
    );
    failed = false;
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(
      await screen.findByRole("heading", { name: "Home second" }),
    ).toBeVisible();
  });

  it("shows a loading state instead of stale cards when another page is loading", async () => {
    let finish: (value: Paginated<FavoriteListing>) => void = () => {};
    const pending = new Promise<Paginated<FavoriteListing>>((resolve) => {
      finish = resolve;
    });
    browserApiMock.mockImplementation((path: string) => {
      if (path === "/favorites/ids") {
        return Promise.resolve({ listingIds: ["first", "second"] });
      }

      return pending;
    });
    setup(result([listing("first")], 1, 2, 13));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByRole("status")).toHaveTextContent("Updating favorites");
    expect(
      screen.queryByRole("heading", { name: "Home first" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    finish(result([listing("second")], 2, 2, 13));

    expect(
      await screen.findByRole("heading", { name: "Home second" }),
    ).toBeVisible();
  });

  it("hides stale cards when the session expires and preserves the return path", async () => {
    browserApiMock.mockResolvedValue({ listingIds: ["first"] });
    const client = setup(result([listing("first")]), "ru");
    browserApiMock.mockRejectedValue(new ApiError(401));
    await client.invalidateQueries({ queryKey: ["favorites"] });

    const link = await screen.findByRole("link", { name: "Войти" });
    expect(link).toHaveAttribute(
      "href",
      "/ru/login?callbackUrl=%2Fru%2Faccount%2Ffavorites",
    );
    expect(
      screen.queryByRole("heading", { name: "Дом first" }),
    ).not.toBeInTheDocument();
  });
});
