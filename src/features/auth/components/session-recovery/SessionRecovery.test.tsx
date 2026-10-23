import { render, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { ApiError } from "@/shared/api/client";
import { QueryTestProvider } from "@/shared/test/components/query-test-provider/QueryTestProvider";
import { SessionRecovery } from "./SessionRecovery";

const { browserApi, refresh } = vi.hoisted(() => ({
  browserApi: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("@/shared/api/client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/shared/api/client")>()),
  browserApi,
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));

beforeEach(() => {
  browserApi.mockReset();
  refresh.mockReset();
});

it("refreshes the server-rendered session after the client confirms authentication", async () => {
  browserApi.mockResolvedValue({ user: { id: "user" } });
  render(<SessionRecovery />, { wrapper: QueryTestProvider });

  await waitFor(() => expect(refresh).toHaveBeenCalledOnce());
  expect(browserApi).toHaveBeenCalledExactlyOnceWith("/auth/me", {
    signal: expect.any(AbortSignal),
  });
});

it("does not attempt another refresh when API recovery fails", async () => {
  browserApi.mockRejectedValue(new ApiError(401));
  render(<SessionRecovery />, { wrapper: QueryTestProvider });

  await waitFor(() => expect(browserApi).toHaveBeenCalledOnce());
  expect(browserApi.mock.calls[0][0]).toBe("/auth/me");
  expect(refresh).not.toHaveBeenCalled();
});
