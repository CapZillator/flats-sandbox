import { useState, type PropsWithChildren } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { browserApi } from "@/shared/api/client";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { ToastProvider } from "@/shared/model/toast/ToastContext";

import type { ListingUpload } from "./listing-image-uploader.types";
import { ListingImageUploader } from "./ListingImageUploader";

vi.mock("@/shared/api/client", () => ({ browserApi: vi.fn() }));
vi.mock("react-sortablejs", () => ({
  ReactSortable: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

const copy = getDictionary("en").listingForm.photos;
const browserApiMock = vi.mocked(browserApi);

function TestUploader({ initial = [] }: { initial?: ListingUpload[] }) {
  const [images, setImages] = useState(initial);

  return (
    <ToastProvider>
      <ListingImageUploader
        copy={copy}
        images={images}
        locale="en"
        onImagesChange={setImages}
      />
    </ToastProvider>
  );
}

describe("ListingImageUploader", () => {
  beforeEach(() => {
    browserApiMock.mockReset();
    Object.defineProperties(URL, {
      createObjectURL: {
        configurable: true,
        value: vi.fn(() => "blob:preview"),
      },
      revokeObjectURL: {
        configurable: true,
        value: vi.fn(),
      },
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
  });

  it("uploads multiple-step Cloudflare assets and removes a new upload", async () => {
    browserApiMock.mockImplementation((path, options) => {
      if (path === "/uploads/images" && options?.method === "POST") {
        return Promise.resolve({
          id: "11111111-1111-4111-8111-111111111111",
          uploadUrl: "https://upload.example.test/direct",
        }) as never;
      }

      if (path.endsWith("/confirm")) {
        return Promise.resolve({
          id: "11111111-1111-4111-8111-111111111111",
          url: "https://imagedelivery.net/account/image/public",
        }) as never;
      }

      return Promise.resolve({ ok: true }) as never;
    });
    render(<TestUploader />);
    const file = new File(["image"], "living-room.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(screen.getByLabelText("Choose photos"), {
      target: { files: [file] },
    });

    expect(await screen.findByAltText("living-room")).toBeVisible();
    expect(screen.getByText("Cover")).toBeVisible();
    expect(screen.getByText("1 / 30")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Remove photo" }));

    await waitFor(() =>
      expect(screen.queryByAltText("living-room")).not.toBeInTheDocument(),
    );
    expect(browserApiMock).toHaveBeenCalledWith(
      "/uploads/images/11111111-1111-4111-8111-111111111111",
      { method: "DELETE" },
    );
  });

  it("reorders existing photos with keyboard-accessible controls", () => {
    render(
      <TestUploader
        initial={[
          {
            alt: { en: "First room" },
            id: "first",
            isNew: false,
            url: "https://imagedelivery.net/account/first/public",
          },
          {
            alt: { en: "Second room" },
            id: "second",
            isNew: false,
            url: "https://imagedelivery.net/account/second/public",
          },
        ]}
      />,
    );

    fireEvent.click(
      screen.getAllByRole("button", { name: "Move photo earlier" })[1],
    );

    expect(
      screen.getAllByRole("img").map((image) => image.getAttribute("alt")),
    ).toEqual(["Second room", "First room"]);
    expect(browserApiMock).not.toHaveBeenCalled();
  });
});
