import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getDictionary } from "@/shared/i18n/dictionaries";
import { QueryTestProvider } from "@/shared/test/components/query-test-provider/QueryTestProvider";
import { ContactPanel } from "./ContactPanel";

const { request } = vi.hoisted(() => ({ request: vi.fn() }));
vi.mock("@/shared/api/client", () => ({ browserApi: request }));

function renderPanel(signedIn = true) {
  return render(
    <QueryTestProvider>
      <ContactPanel
        signedIn={signedIn}
        listingId="listing-1"
        locale="en"
        dictionary={getDictionary("en")}
        callbackPath="/listings/my-home"
      />
    </QueryTestProvider>,
  );
}

describe("ContactPanel", () => {
  beforeEach(() => request.mockReset());

  it("does not request contacts for guests and returns to the same listing after login", () => {
    renderPanel(false);

    expect(
      screen.getByRole("link", { name: getDictionary("en").nav.signIn }),
    ).toHaveAttribute("href", "/login?callbackUrl=%2Flistings%2Fmy-home");
    expect(request).not.toHaveBeenCalled();
  });

  it("reveals contacts only after an explicit action", async () => {
    request.mockResolvedValue({
      contacts: [
        {
          id: "c1",
          type: "EMAIL",
          value: "owner@example.com",
          isPrimary: true,
        },
      ],
    });
    renderPanel();
    expect(request).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Show contacts" }));

    expect(await screen.findByText("owner@example.com")).toBeVisible();
    expect(screen.getByText("Primary")).toBeVisible();
    expect(request).toHaveBeenCalledWith(
      "/listings/listing-1/contacts",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("shows an empty response explicitly", async () => {
    request.mockResolvedValue({ contacts: [] });
    renderPanel();
    fireEvent.click(screen.getByRole("button", { name: "Show contacts" }));

    expect(
      await screen.findByText("The landlord has not added any contacts yet."),
    ).toBeVisible();
  });

  it("shows a localized error and allows retrying", async () => {
    request
      .mockRejectedValueOnce(new Error("Unavailable"))
      .mockResolvedValue({ contacts: [] });
    renderPanel();
    fireEvent.click(screen.getByRole("button", { name: "Show contacts" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not load contacts",
    );
    fireEvent.click(
      screen.getByRole("button", { name: getDictionary("en").common.retry }),
    );
    await waitFor(() =>
      expect(screen.queryByRole("alert")).not.toBeInTheDocument(),
    );
  });
});
