import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QueryTestProvider } from "@/shared/test/components/query-test-provider/QueryTestProvider";
import { MagicLinkVerifier } from "./MagicLinkVerifier";

const { replace, browserApi, params } = vi.hoisted(() => ({
  replace: vi.fn(),
  browserApi: vi.fn(),
  params: new URLSearchParams(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  useSearchParams: () => params,
}));

vi.mock("@/shared/api/client", () => ({ browserApi }));

describe("MagicLinkVerifier redirects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    params.forEach((_, key) => params.delete(key));
    browserApi.mockResolvedValue({ user: { id: "user-1" } });
  });

  it.each([
    "javascript:alert(document.cookie)",
    "https://attacker.example",
    "//attacker.example",
    "/\\attacker.example",
    "/\t/attacker.example",
    "/\n/attacker.example",
    "/safe/..//attacker.example",
    "account",
    "",
  ])("falls back to account for unsafe callback %j", async (callback) => {
    params.set("callbackUrl", callback);
    render(
      <QueryTestProvider>
        <MagicLinkVerifier />
      </QueryTestProvider>,
    );

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/account"));
  });

  it.each([false, true])(
    "preserves localized internal paths, queries and hashes (magic link: %s)",
    async (magicLink) => {
      const callback = "/ru/account/listings/new?city=da-nang#photos";
      params.set("callbackUrl", callback);

      if (magicLink) {
        params.set("email", "user@example.com");
        params.set("token", "test-token");
      }

      render(
        <QueryTestProvider>
          <MagicLinkVerifier />
        </QueryTestProvider>,
      );

      await waitFor(() => expect(replace).toHaveBeenCalledWith(callback));
      expect(browserApi.mock.calls[0][0]).toBe(
        magicLink ? "/auth/magic-link/verify" : "/auth/me",
      );
    },
  );
});
