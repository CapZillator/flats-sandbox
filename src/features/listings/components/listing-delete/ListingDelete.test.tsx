import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ToastProvider } from "@/shared/model/toast/ToastContext";
import { QueryTestProvider } from "@/shared/test/components/query-test-provider/QueryTestProvider";
import { ListingDelete } from "./ListingDelete";

const { request, replace, refresh } = vi.hoisted(() => ({
  request: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace, refresh }) }));
vi.mock("@/shared/api/client", () => ({ browserApi: request }));

function setup() {
  render(
    <QueryTestProvider>
      <ToastProvider>
        <ListingDelete id="id" locale="ru" />
      </ToastProvider>
    </QueryTestProvider>,
  );
}

describe("ListingDelete", () => {
  beforeEach(() => {
    request.mockReset();
    replace.mockReset();
    refresh.mockReset();
  });

  it("requires confirmation, allows cancellation and redirects after DELETE", async () => {
    request.mockResolvedValue({ ok: true, imageCleanupPending: true });
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Удалить объявление" }));
    expect(request).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Восстановить объявление не получится/),
    ).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Отмена" }));
    expect(request).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Удалить объявление" }));
    fireEvent.click(screen.getByRole("button", { name: "Удалить навсегда" }));
    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith("/ru/account/listings"),
    );
    expect(request).toHaveBeenCalledExactlyOnceWith("/listings/id", {
      method: "DELETE",
    });
    expect(refresh).toHaveBeenCalledOnce();
  });

  it("shows a failure and keeps the confirmation available for retry", async () => {
    request.mockRejectedValue(new Error("Failed"));
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Удалить объявление" }));
    fireEvent.click(screen.getByRole("button", { name: "Удалить навсегда" }));
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Удалить навсегда" }),
      ).toBeEnabled(),
    );
    expect(screen.getAllByText(/Не удалось удалить/).length).toBeGreaterThan(0);
    expect(replace).not.toHaveBeenCalled();
  });
});
