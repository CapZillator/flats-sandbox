import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ToastProvider } from "@/shared/model/toast/ToastContext";
import { QueryTestProvider } from "@/shared/test/components/query-test-provider/QueryTestProvider";

import { ListingSubmit } from "./ListingSubmit";

const { browserApiMock, refreshMock } = vi.hoisted(() => ({
  browserApiMock: vi.fn(),
  refreshMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

vi.mock("@/shared/api/client", () => ({
  browserApi: browserApiMock,
}));

function renderSubmit({
  hasContacts = true,
  hasImages = true,
}: {
  hasContacts?: boolean;
  hasImages?: boolean;
} = {}) {
  return render(
    <QueryTestProvider>
      <ToastProvider>
        <ListingSubmit
          hasContacts={hasContacts}
          hasImages={hasImages}
          id="listing-1"
          locale="en"
        />
      </ToastProvider>
    </QueryTestProvider>,
  );
}

describe("ListingSubmit", () => {
  beforeEach(() => {
    browserApiMock.mockReset();
    browserApiMock.mockResolvedValue({ status: "PENDING_REVIEW" });
    refreshMock.mockReset();
  });

  it("submits a complete listing and refreshes the server page", async () => {
    renderSubmit();

    fireEvent.click(screen.getByRole("button", { name: "Submit for review" }));

    await waitFor(() =>
      expect(browserApiMock).toHaveBeenCalledWith(
        "/listings/listing-1/submit",
        { method: "POST" },
      ),
    );
    await waitFor(() => expect(refreshMock).toHaveBeenCalledOnce());
  });

  it("prevents submission and links to the profile when contacts are missing", () => {
    renderSubmit({ hasContacts: false });

    expect(
      screen.getByRole("button", { name: "Submit for review" }),
    ).toBeDisabled();
    expect(screen.getByRole("link", { name: /Open profile/ })).toHaveAttribute(
      "href",
      "/account",
    );
  });
});
