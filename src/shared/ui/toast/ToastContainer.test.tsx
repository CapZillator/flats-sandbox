import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useToast } from "@/shared/hooks/useToast";
import { ToastProvider } from "@/shared/model/toast/ToastContext";

import { ToastContainer } from "./ToastContainer";

function ToastHarness() {
  const { showToast } = useToast();

  return (
    <>
      <button onClick={() => showToast("Saved", "success")}>Success</button>

      <button onClick={() => showToast("Try again", "error")}>Error</button>

      <ToastContainer dismissLabel="Dismiss notification" />
    </>
  );
}

describe("ToastContainer", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("announces variants with the appropriate live-region role", () => {
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Success" }));
    fireEvent.click(screen.getByRole("button", { name: "Error" }));

    expect(screen.getByRole("status")).toHaveTextContent("Saved");
    expect(screen.getByRole("alert")).toHaveTextContent("Try again");
  });

  it("supports explicit and automatic dismissal", () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Success" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Dismiss notification" }),
    );
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Error" }));
    act(() => vi.advanceTimersByTime(4500));
    expect(screen.queryByText("Try again")).not.toBeInTheDocument();
  });
});
