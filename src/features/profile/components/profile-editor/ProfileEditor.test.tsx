import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { UserProfile } from "@/shared/api/types";
import { QueryTestProvider } from "@/shared/test/components/query-test-provider/QueryTestProvider";
import { ToastProvider } from "@/shared/model/toast/ToastContext";
import { ProfileEditor } from "./ProfileEditor";

const { request, refresh } = vi.hoisted(() => ({
  request: vi.fn(),
  refresh: vi.fn(),
}));
vi.mock("@/shared/api/client", () => ({ browserApi: request }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));

const profile: UserProfile = {
  landlordType: null,
  id: "user-1",
  email: "anna@example.com",
  name: "Anna",
  image: null,
  role: "LANDLORD",
  status: "ACTIVE",
  preferredLocale: "en",
  displayName: { en: "Anna", ru: "Анна" },
  bio: {},
  contacts: [],
};

function renderEditor() {
  return render(
    <QueryTestProvider>
      <ToastProvider>
        <ProfileEditor locale="en" profile={profile} />
      </ToastProvider>
    </QueryTestProvider>,
  );
}

describe("ProfileEditor", () => {
  it("saves the account-wide realtor type without changing the access role", async () => {
    request.mockResolvedValue({ ...profile, landlordType: "REALTOR" });
    renderEditor();
    fireEvent.click(screen.getByRole("combobox", { name: "Advertiser" }));
    fireEvent.click(screen.getByRole("option", { name: "Realtor" }));
    fireEvent.click(screen.getByRole("button", { name: "Save profile" }));

    await waitFor(() => expect(request).toHaveBeenCalled());
    const payload = JSON.parse(request.mock.calls[0][1].body);

    expect(payload.landlordType).toBe("REALTOR");
    expect(payload).not.toHaveProperty("role");
  });

  beforeEach(() => {
    request.mockReset();
    refresh.mockReset();
  });

  it("saves optional localized profile fields without dropping other translations", async () => {
    request.mockResolvedValue({ ...profile, name: "Anna Nguyen" });
    renderEditor();
    expect(screen.getByRole("button", { name: "Save profile" })).toBeDisabled();
    fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
      target: { value: "Anna Nguyen" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save profile" }));

    await waitFor(() =>
      expect(request).toHaveBeenCalledWith("/users/me", {
        method: "PATCH",
        body: JSON.stringify({
          landlordType: null,
          name: "Anna Nguyen",
          displayName: { en: "Anna", ru: "Анна" },
          bio: null,
          preferredLocale: "en",
        }),
      }),
    );
    await waitFor(() => expect(refresh).toHaveBeenCalledOnce());
  });

  it("keeps unsaved translations when switching input language", () => {
    renderEditor();
    fireEvent.change(screen.getByRole("textbox", { name: /Public name/ }), {
      target: { value: "Anna's homes" },
    });
    fireEvent.click(
      screen.getByRole("combobox", { name: "Translation language" }),
    );
    fireEvent.click(screen.getByRole("option", { name: "RU" }));
    expect(screen.getByRole("textbox", { name: /Public name/ })).toHaveValue(
      "Анна",
    );
    fireEvent.click(
      screen.getByRole("combobox", { name: "Translation language" }),
    );
    fireEvent.click(screen.getByRole("option", { name: "EN" }));
    expect(screen.getByRole("textbox", { name: /Public name/ })).toHaveValue(
      "Anna's homes",
    );
  });

  it("preserves edits after a failed request", async () => {
    request.mockRejectedValue(new Error("Unavailable"));
    renderEditor();
    fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
      target: { value: "New name" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save profile" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not save changes",
    );
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(
      "New name",
    );
    expect(refresh).not.toHaveBeenCalled();
  });
});
