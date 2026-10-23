import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AvailabilityCalendar } from "./AvailabilityCalendar";

describe("AvailabilityCalendar", () => {
  it("does not label dates beyond the loaded range as available or unavailable", () => {
    render(
      <AvailabilityCalendar
        locale="en"
        start="2026-09-10"
        end="2026-09-15"
        blocks={[]}
      />,
    );

    expect(screen.queryByLabelText(/2026-09-09,/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/2026-09-16,/)).not.toBeInTheDocument();
    expect(screen.getByLabelText("2026-09-15, available")).toBeVisible();
  });

  it("marks API date ranges as unavailable", () => {
    render(
      <AvailabilityCalendar
        locale="en"
        start="2026-09-01"
        blocks={[{ startsOn: "2026-09-10", endsOn: "2026-09-12" }]}
      />,
    );
    expect(screen.getByLabelText("2026-09-10, Unavailable")).toHaveClass(
      "blocked",
    );
    expect(screen.getByLabelText("2026-09-13, available")).not.toHaveClass(
      "blocked",
    );
  });

  it("navigates through loaded months and includes the availability start date", () => {
    render(
      <AvailabilityCalendar
        locale="en"
        start="2026-09-01"
        end="2026-10-31"
        availableFrom="2026-09-15"
        blocks={[{ startsOn: "2026-10-10", endsOn: "2026-10-12" }]}
      />,
    );

    expect(screen.getByLabelText("2026-09-14, Unavailable")).toHaveClass(
      "blocked",
    );
    expect(screen.getByLabelText("2026-09-15, available")).not.toHaveClass(
      "blocked",
    );
    fireEvent.click(screen.getByRole("button", { name: /next month/i }));
    expect(screen.getByLabelText("2026-10-10, Unavailable")).toHaveClass(
      "blocked",
    );
    expect(screen.getByRole("button", { name: /next month/i })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});
