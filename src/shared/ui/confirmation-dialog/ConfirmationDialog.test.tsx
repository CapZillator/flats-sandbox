import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ConfirmationDialog } from "./ConfirmationDialog";

function Harness({
  pending = false,
  error,
}: {
  pending?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>

      <ConfirmationDialog
        open={open}
        title="Delete listing"
        description="This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="danger"
        pending={pending}
        error={error}
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

function openDialog() {
  const trigger = screen.getByRole("button", { name: "Open" });
  trigger.focus();
  fireEvent.click(trigger);

  return trigger;
}

describe("ConfirmationDialog", () => {
  it("labels the dialog, focuses cancel and restores focus and scrolling", () => {
    document.body.style.overflow = "auto";
    render(<Harness />);
    const trigger = openDialog();
    expect(
      screen.getByRole("dialog", { name: "Delete listing" }),
    ).toHaveAccessibleDescription("This cannot be undone.");
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("auto");
    document.body.style.overflow = "";
  });

  it("supports native Escape cancellation and can reopen", () => {
    render(<Harness />);
    openDialog();
    fireEvent(
      screen.getByRole("dialog"),
      new Event("cancel", { cancelable: true }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    openDialog();
    expect(screen.getByRole("dialog")).toBeVisible();
  });

  it("blocks dismissal and confirmation while pending, then shows a retryable error", () => {
    const { rerender } = render(<Harness pending />);
    openDialog();
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(dialog).toBeVisible();
    rerender(<Harness error="Please try again" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Please try again");
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not confirm a disabled action", () => {
    const confirm = vi.fn();
    render(
      <ConfirmationDialog
        open
        title="Publish"
        description="Make public"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        confirmDisabled
        onConfirm={confirm}
        onCancel={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(confirm).not.toHaveBeenCalled();
  });
});
