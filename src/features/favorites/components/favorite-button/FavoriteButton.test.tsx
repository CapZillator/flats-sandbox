import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ToastProvider } from "@/shared/model/toast/ToastContext";
import { QueryTestProvider } from "@/shared/test/components/query-test-provider/QueryTestProvider";
import { ToastContainer } from "@/shared/ui";

import { FavoriteButton } from "./FavoriteButton";

const { browserApiMock } = vi.hoisted(() => ({ browserApiMock: vi.fn() }));

vi.mock("@/shared/api/client", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/shared/api/client")>();

  return { ...original, browserApi: browserApiMock };
});

const labels = {
  favorite: "Save",
  saved: "Saved",
  signIn: "Sign in",
  added: "Saved to favorites",
  removed: "Removed from favorites",
  error: "Could not update favorites",
};

describe("FavoriteButton", () => {
  beforeEach(() => {
    browserApiMock.mockReset();
  });

  it("updates its state and confirms the change with a toast", async () => {
    browserApiMock
      .mockResolvedValueOnce({ listingIds: [] })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ listingIds: ["listing-1"] });

    render(
      <QueryTestProvider>
        <ToastProvider>
          <FavoriteButton listingId="listing-1" locale="en" labels={labels} />

          <ToastContainer dismissLabel="Dismiss notification" />
        </ToastProvider>
      </QueryTestProvider>,
    );

    await waitFor(() =>
      expect(browserApiMock).toHaveBeenCalledWith("/favorites/ids", {
        signal: expect.any(AbortSignal),
      }),
    );
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Save" })).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Saved to favorites",
    );
    expect(screen.getByRole("button", { name: "Saved" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(browserApiMock).toHaveBeenCalledWith("/favorites/listing-1", {
      method: "POST",
    });
  });
});
