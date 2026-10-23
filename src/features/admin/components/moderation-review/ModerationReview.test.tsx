import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/shared/api/client";
import type { ModerationListing } from "@/shared/api/types";
import { ToastProvider } from "@/shared/model/toast/ToastContext";
import { QueryTestProvider } from "@/shared/test/components/query-test-provider/QueryTestProvider";
import { ModerationReview } from "./ModerationReview";
import { moderationListing } from "./moderation.fixture";

const { request, refresh } = vi.hoisted(() => ({
  request: vi.fn(),
  refresh: vi.fn(),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));
vi.mock("@/shared/api/client", async (original) => ({
  ...(await original<typeof import("@/shared/api/client")>()),
  browserApi: request,
}));
vi.mock(
  "@/features/listings/components/listing-gallery/ListingGallery",
  () => ({ ListingGallery: () => <div>Gallery</div> }),
);

function setup(initial: ModerationListing = moderationListing) {
  render(
    <QueryTestProvider>
      <ToastProvider>
        <ModerationReview initial={initial} locale="en" />
      </ToastProvider>
    </QueryTestProvider>,
  );
}

describe("ModerationReview", () => {
  it.each(["DRAFT", "PUBLISHED", "REJECTED", "ARCHIVED"] as const)(
    "does not expose decisions for %s",
    async (status) => {
      const initial = { ...moderationListing, status };
      request.mockResolvedValue(initial);
      setup(initial);

      expect(
        screen.getByText("Only pending listings can be published or rejected."),
      ).toBeVisible();
      expect(
        screen.queryByRole("button", { name: "Publish" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Reject" }),
      ).not.toBeInTheDocument();
      await waitFor(() => expect(request).toHaveBeenCalled());
    },
  );
  beforeEach(() => {
    request.mockReset();
    refresh.mockReset();
    request.mockResolvedValue(moderationListing);
  });
  it("shows all translations, author contacts and private blocks", async () => {
    setup();

    expect(screen.getByText("Русское описание")).toBeVisible();
    expect(screen.getByText("English description")).toBeVisible();
    expect(screen.getByText("Private owner note")).toBeVisible();
    expect(screen.getByText("EMAIL: owner@example.com")).toBeVisible();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Publish" })).toBeEnabled(),
    );
  });
  it("requires explicit confirmation and updates status after publication", async () => {
    let current = moderationListing;
    request.mockImplementation((_path: string, options: RequestInit) => {
      if (options.method === "POST") {
        current = { ...current, status: "PUBLISHED" };
      }

      return Promise.resolve(current);
    });
    setup();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Publish" })).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Publish" }));

    expect(request).not.toHaveBeenCalledWith(
      expect.stringContaining("/publish"),
      expect.anything(),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Confirm publication" }),
    );

    await waitFor(() =>
      expect(
        screen.getByText("Only pending listings can be published or rejected."),
      ).toBeVisible(),
    );
    expect(request).toHaveBeenCalledWith(
      `/admin/listings/${current.id}/publish`,
      { method: "POST" },
    );
    expect(refresh).toHaveBeenCalled();
  });
  it("validates and sends a trimmed rejection reason", async () => {
    let current = moderationListing;
    request.mockImplementation((_path: string, options: RequestInit) => {
      if (options.method === "POST") {
        current = {
          ...current,
          status: "REJECTED",
          rejectionReason: "Update the address",
        };
      }

      return Promise.resolve(current);
    });
    setup();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Reject" })).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Reject" }));

    expect(
      await screen.findByText("Enter between 5 and 1,000 characters"),
    ).toBeVisible();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "  Update the address  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Reject" }));

    await waitFor(() =>
      expect(request).toHaveBeenCalledWith(
        `/admin/listings/${current.id}/reject`,
        {
          method: "POST",
          body: JSON.stringify({ reason: "Update the address" }),
        },
      ),
    );
    expect(
      await screen.findByText("Reason for rejection: Update the address"),
    ).toBeVisible();
  });
  it("preserves the entered reason on a failed mutation", async () => {
    request.mockImplementation((_path: string, options: RequestInit) =>
      options.method === "POST"
        ? Promise.reject(new ApiError(500))
        : Promise.resolve(moderationListing),
    );
    setup();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Reject" })).toBeEnabled(),
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Update the address" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Reject" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not complete",
    );
    expect(screen.getByRole("textbox")).toHaveValue("Update the address");
  });
  it("refreshes a concurrent moderation decision without retrying the mutation", async () => {
    let changed = false;
    request.mockImplementation((_path: string, options: RequestInit) => {
      if (options.method === "POST") {
        changed = true;

        return Promise.reject(new ApiError(409));
      }

      return Promise.resolve(
        changed
          ? { ...moderationListing, status: "PUBLISHED" }
          : moderationListing,
      );
    });
    setup();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Reject" })).toBeEnabled(),
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Update the address" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Reject" }));

    expect(
      await screen.findByText(
        "Only pending listings can be published or rejected.",
      ),
    ).toBeVisible();
    expect(
      request.mock.calls.filter(([, options]) => options.method === "POST"),
    ).toHaveLength(1);
  });
  it.each([401, 403])(
    "hides private data after access failure %s",
    async (status) => {
      request.mockRejectedValue(new ApiError(status));
      setup();

      expect(await screen.findByRole("alert")).toHaveTextContent(
        "Your session expired",
      );
      expect(screen.queryByText("Private owner note")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Publish" }),
      ).not.toBeInTheDocument();
    },
  );
  it.each(["images", "contacts", "status"])(
    "blocks publishing when prerequisite %s is missing",
    async (missing) => {
      const listing = {
        ...moderationListing,
        images: missing === "images" ? [] : moderationListing.images,
        owner: {
          ...moderationListing.owner,
          contacts:
            missing === "contacts" ? [] : moderationListing.owner.contacts,
          status:
            missing === "status" ? ("BLOCKED" as const) : ("ACTIVE" as const),
        },
      };
      request.mockResolvedValue(listing);
      setup(listing);

      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Reject" })).toBeEnabled(),
      );
      expect(screen.getByRole("button", { name: "Publish" })).toBeDisabled();
    },
  );
});
