import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getDictionary } from "@/shared/i18n/dictionaries";
import { QueryTestProvider } from "@/shared/test/components/query-test-provider/QueryTestProvider";

import { AuthForm } from "./AuthForm";

const { browserApiMock } = vi.hoisted(() => ({
  browserApiMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/shared/api/client", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/shared/api/client")>();

  return {
    ...original,
    browserApi: browserApiMock,
    publicApiUrl: (path: string) => `http://localhost:3000/api/v1${path}`,
  };
});

describe("AuthForm", () => {
  beforeEach(() => {
    browserApiMock.mockReset();
  });

  it("shows localized Zod validation before requesting a magic link", async () => {
    render(
      <QueryTestProvider>
        <AuthForm locale="ru" dictionary={getDictionary("ru")} />
      </QueryTestProvider>,
    );

    fireEvent.change(screen.getByLabelText(/Электронная почта/), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Отправить ссылку" }));

    expect(
      await screen.findByText("Введите корректный адрес электронной почты"),
    ).toHaveAttribute("role", "alert");
    expect(browserApiMock).not.toHaveBeenCalled();
  });

  it("normalizes the email and backend-compatible one-time code", async () => {
    browserApiMock.mockResolvedValueOnce({ ok: true });
    render(
      <QueryTestProvider>
        <AuthForm locale="en" dictionary={getDictionary("en")} />
      </QueryTestProvider>,
    );

    fireEvent.change(screen.getByLabelText(/Email address/), {
      target: { value: "  USER@Example.COM " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send sign-in link" }));

    expect(await screen.findByText("user@example.com")).toBeVisible();
    expect(browserApiMock).toHaveBeenNthCalledWith(
      1,
      "/auth/magic-link/request",
      {
        method: "POST",
        body: JSON.stringify({
          email: "user@example.com",
          locale: "en",
          callbackUrl: "/account",
        }),
      },
    );

    browserApiMock.mockRejectedValueOnce(new Error("offline"));
    fireEvent.change(screen.getByLabelText(/One-time code/), {
      target: { value: "abcd-2345" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Verify code" }));

    await waitFor(() => expect(browserApiMock).toHaveBeenCalledTimes(2));
    expect(browserApiMock).toHaveBeenNthCalledWith(
      2,
      "/auth/magic-link/verify-code",
      {
        method: "POST",
        body: JSON.stringify({
          email: "user@example.com",
          code: "ABCD2345",
        }),
      },
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to verify the code",
    );
  });
});
