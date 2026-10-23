import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ListingGallery } from "./ListingGallery";

const images = Array.from({ length: 6 }, (_, index) => ({
  id: `image-${index}`,
  url: `https://imagedelivery.net/test/${index}/public`,
  alt: { en: `Room ${index + 1}` },
  sortOrder: index,
}));

describe("ListingGallery", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      width: 700,
      height: 500,
      top: 0,
      right: 700,
      bottom: 500,
      left: 0,
      toJSON: () => ({}),
    });
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(700);
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(500);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("lets the user browse every image, including images beyond the first five", async () => {
    render(<ListingGallery images={images} locale="en" title="Home" />);
    fireEvent.click(screen.getByRole("button", { name: "Photo 6" }));

    await waitFor(() => {
      expect(screen.getByRole("img", { name: "Room 6" })).toBeVisible();
    });
    expect(screen.getByRole("button", { name: "Photo 6" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    fireEvent.click(screen.getByRole("button", { name: "Next photo" }));
    await waitFor(() => {
      expect(screen.getByRole("img", { name: "Room 1" })).toBeVisible();
    });
    fireEvent.click(screen.getByRole("button", { name: "Previous photo" }));
    await waitFor(() => {
      expect(screen.getByRole("img", { name: "Room 6" })).toBeVisible();
    });
  });

  it("renders a localized empty state", () => {
    render(<ListingGallery images={[]} locale="ru" title="Дом" />);

    expect(screen.getByText("Фотографий пока нет")).toBeVisible();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("keeps the counter and thumbnails in sync after a touch swipe", async () => {
    const { container } = render(
      <ListingGallery images={images} locale="en" title="Home" />,
    );
    const slider = container.querySelector(".keen-slider")!;
    const touch = (x: number, y: number) => ({
      identifier: 1,
      target: slider,
      clientX: x,
      clientY: y,
      screenX: x,
      screenY: y,
      pageX: x,
      pageY: y,
    });

    fireEvent.touchStart(slider, { targetTouches: [touch(600, 250)] });
    fireEvent.touchMove(slider, { targetTouches: [touch(580, 250)] });
    fireEvent.touchMove(slider, { targetTouches: [touch(150, 250)] });
    fireEvent.touchEnd(slider, {
      touches: [],
      changedTouches: [touch(150, 250)],
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Photo 2" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });
    expect(screen.getByText("2 / 6")).toBeVisible();
    expect(screen.getByRole("img", { name: "Room 2" })).toBeVisible();
  });

  it("shows a single photo without navigation controls", () => {
    render(
      <ListingGallery images={images.slice(0, 1)} locale="en" title="Home" />,
    );

    expect(screen.getByRole("img", { name: "Room 1" })).toBeVisible();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
