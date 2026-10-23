import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ToastProvider } from "@/shared/model/toast/ToastContext";
import { QueryTestProvider } from "@/shared/test/components/query-test-provider/QueryTestProvider";

import { AvailabilityManager } from "./AvailabilityManager";

const { browserApiMock } = vi.hoisted(() => ({
  browserApiMock: vi.fn(),
}));

vi.mock("@/shared/api/client", () => ({
  ApiError: class ApiError extends Error {},
  browserApi: browserApiMock,
}));

describe("AvailabilityManager", () => {
  beforeEach(() => {
    browserApiMock.mockReset();
    browserApiMock.mockImplementation(
      (_path: string, options?: RequestInit) => {
        if (options?.method === "DELETE") {
          return Promise.resolve({ ok: true });
        }

        return Promise.resolve([
          {
            id: "block-1",
            startsOn: "2026-10-12",
            endsOn: "2026-10-18",
            type: "MAINTENANCE",
            note: "Air conditioner service",
          },
        ]);
      },
    );
  });

  it("renders private blocks and removes them from the cached list", async () => {
    render(
      <QueryTestProvider>
        <ToastProvider>
          <AvailabilityManager listingId="listing-1" locale="en" />
        </ToastProvider>
      </QueryTestProvider>,
    );

    expect(await screen.findByText("Air conditioner service")).toBeVisible();
    expect(screen.getByText("Maintenance")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    await waitFor(() =>
      expect(browserApiMock).toHaveBeenCalledWith(
        "/listings/listing-1/availability/block-1",
        { method: "DELETE" },
      ),
    );
    await waitFor(() =>
      expect(
        screen.queryByText("Air conditioner service"),
      ).not.toBeInTheDocument(),
    );
  });
});
