import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { QueryTestProvider } from "@/shared/test/components/query-test-provider/QueryTestProvider";
import { ToastProvider } from "@/shared/model/toast/ToastContext";
import { ContactsEditor } from "./ContactsEditor";

const { request, refresh } = vi.hoisted(() => ({
  request: vi.fn(),
  refresh: vi.fn(),
}));
vi.mock("@/shared/api/client", () => ({ browserApi: request }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));

function renderEditor() {
  return render(
    <QueryTestProvider>
      <ToastProvider>
        <ContactsEditor
          locale="en"
          contacts={[
            {
              id: "1",
              type: "EMAIL",
              value: "anna@example.com",
              isPrimary: true,
            },
          ]}
        />
      </ToastProvider>
    </QueryTestProvider>,
  );
}

describe("ContactsEditor", () => {
  beforeEach(() => {
    request.mockReset();
    refresh.mockReset();
  });

  it("saves normalized contacts without backend IDs", async () => {
    request.mockResolvedValue([
      { id: "2", type: "EMAIL", value: "new@example.com", isPrimary: true },
    ]);
    renderEditor();
    fireEvent.change(screen.getByRole("textbox", { name: "Contact" }), {
      target: { value: "NEW@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save contacts" }));

    await waitFor(() =>
      expect(request).toHaveBeenCalledWith("/users/me/contacts", {
        method: "PUT",
        body: JSON.stringify({
          contacts: [
            { type: "EMAIL", value: "new@example.com", isPrimary: true },
          ],
        }),
      }),
    );
    await waitFor(() => expect(refresh).toHaveBeenCalledOnce());
    expect(
      screen.getByRole("button", { name: "Save contacts" }),
    ).toBeDisabled();
  });

  it("keeps at most one contact marked as primary", () => {
    renderEditor();
    fireEvent.click(screen.getByRole("button", { name: /Add contact/ }));
    const checkboxes = screen.getAllByRole("checkbox", {
      name: "Primary contact",
    });
    fireEvent.click(checkboxes[1]);

    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
  });

  it("does not submit invalid contacts", async () => {
    renderEditor();
    fireEvent.change(screen.getByRole("textbox", { name: "Contact" }), {
      target: { value: "not-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save contacts" }));

    expect(await screen.findByText("Enter a valid contact")).toBeVisible();
    expect(request).not.toHaveBeenCalled();
  });

  it("allows deleting the final contact and saving the empty list", async () => {
    request.mockResolvedValue([]);
    renderEditor();
    fireEvent.click(screen.getByRole("button", { name: "Remove contact 1" }));
    fireEvent.click(screen.getByRole("button", { name: "Save contacts" }));

    await waitFor(() =>
      expect(request).toHaveBeenCalledWith("/users/me/contacts", {
        method: "PUT",
        body: JSON.stringify({ contacts: [] }),
      }),
    );
  });

  it("keeps edits after a failed save and reports the error", async () => {
    request.mockRejectedValue(new Error("Unavailable"));
    renderEditor();
    fireEvent.change(screen.getByRole("textbox", { name: "Contact" }), {
      target: { value: "new@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save contacts" }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Could not save changes",
      ),
    );
    expect(screen.getByRole("textbox", { name: "Contact" })).toHaveValue(
      "new@example.com",
    );
    expect(refresh).not.toHaveBeenCalled();
  });
});
