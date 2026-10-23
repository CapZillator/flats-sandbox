import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Modal } from "./Modal";

describe("Modal", () => {
  it("dismisses only a click that starts and ends on the backdrop", () => {
    const close = vi.fn();
    render(
      <Modal open title="Settings" onClose={close}>
        <button>Content</button>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue({
      left: 100,
      right: 500,
      top: 100,
      bottom: 400,
    } as DOMRect);
    fireEvent.pointerDown(screen.getByRole("button"));
    fireEvent.click(dialog, { clientX: 50, clientY: 50 });
    expect(close).not.toHaveBeenCalled();
    fireEvent.pointerDown(dialog, { clientX: 50, clientY: 50 });
    fireEvent.click(dialog, { clientX: 50, clientY: 50 });
    expect(close).toHaveBeenCalledOnce();
  });

  it("restores scrolling on unmount and keeps it locked for another open modal", () => {
    document.body.style.overflow = "auto";
    const first = render(<Modal open title="First" onClose={vi.fn()} />);
    const second = render(<Modal open title="Second" onClose={vi.fn()} />);
    first.unmount();
    expect(document.body.style.overflow).toBe("hidden");
    second.unmount();
    expect(document.body.style.overflow).toBe("auto");
    document.body.style.overflow = "";
  });
});
