import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/shared/api/client";
import { ToastProvider } from "@/shared/model/toast/ToastContext";
import { QueryTestProvider } from "@/shared/test/components/query-test-provider/QueryTestProvider";
import { ListingUnpublish } from "./ListingUnpublish";

const { request, refresh } = vi.hoisted(() => ({
  request: vi.fn(),
  refresh: vi.fn(),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));
vi.mock("@/shared/api/client", async (original) => ({
  ...(await original<typeof import("@/shared/api/client")>()),
  browserApi: request,
}));

function setup() {
  render(
    <QueryTestProvider>
      <ToastProvider>
        <ListingUnpublish id="listing-1" locale="en" />
      </ToastProvider>
    </QueryTestProvider>,
  );
}

describe("ListingUnpublish", () => {
  beforeEach(() => {
    request.mockReset();
    refresh.mockReset();
  });

  it("requires confirmation, supports cancellation and makes one POST", async () => {
    request.mockResolvedValue({ status: "DRAFT" });
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Unpublish" }));
    expect(request).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Publishing again requires moderation/),
    ).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(request).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Unpublish" }));
    fireEvent.click(screen.getByRole("button", { name: "Return to draft" }));
    await waitFor(() => expect(refresh).toHaveBeenCalledOnce());
    expect(request).toHaveBeenCalledExactlyOnceWith(
      "/listings/listing-1/unpublish",
      { method: "POST" },
    );
    expect(
      screen.queryByRole("button", { name: "Unpublish" }),
    ).not.toBeInTheDocument();
  });

  it("preserves confirmation after a failure and allows retry", async () => {
    request
      .mockRejectedValueOnce(new Error("Offline"))
      .mockResolvedValueOnce({ status: "DRAFT" });
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Unpublish" }));
    fireEvent.click(screen.getByRole("button", { name: "Return to draft" }));
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Return to draft" }),
      ).toBeEnabled(),
    );
    expect(refresh).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Return to draft" }));
    await waitFor(() => expect(refresh).toHaveBeenCalledOnce());
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("refreshes a conflicting status without retrying the mutation", async () => {
    request.mockRejectedValue(new ApiError(409, { message: "Conflict" }));
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Unpublish" }));
    fireEvent.click(screen.getByRole("button", { name: "Return to draft" }));
    await waitFor(() => expect(refresh).toHaveBeenCalledOnce());
    expect(request).toHaveBeenCalledOnce();
    expect(
      screen.getAllByText(/listing status has changed/).length,
    ).toBeGreaterThan(0);
  });
});
