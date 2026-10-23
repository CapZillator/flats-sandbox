import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { moderationListing } from "../moderation-review/moderation.fixture";
import { ModerationQueue } from "./ModerationQueue";

describe("ModerationQueue", () => {
  it("links to private review and preserves status in pagination", () => {
    render(
      <ModerationQueue
        locale="ru"
        status="PENDING_REVIEW"
        result={{
          items: [moderationListing],
          meta: { page: 1, pages: 2, total: 13, limit: 12 },
        }}
      />,
    );

    expect(
      screen.getByRole("link", { name: "Проверить объявление" }),
    ).toHaveAttribute("href", `/ru/admin/listings/${moderationListing.id}`);
    expect(screen.getByRole("link", { name: "Далее" })).toHaveAttribute(
      "href",
      "/ru/admin?status=PENDING_REVIEW&page=2",
    );
    expect(screen.getByRole("button", { name: "Назад" })).toBeDisabled();
  });
  it("shows an empty queue", () => {
    render(
      <ModerationQueue
        locale="en"
        status="REJECTED"
        result={{ items: [], meta: { page: 1, pages: 0, total: 0, limit: 12 } }}
      />,
    );

    expect(screen.getByText("No listings with this status")).toBeVisible();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
