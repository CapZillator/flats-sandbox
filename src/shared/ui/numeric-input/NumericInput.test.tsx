import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NumericInput } from "./NumericInput";

function NumericInputFixture({
  allowNegative = false,
  maxFractionDigits = 0,
}: {
  allowNegative?: boolean;
  maxFractionDigits?: number;
}) {
  const [value, setValue] = useState("");

  return (
    <NumericInput
      aria-label="Amount"
      allowNegative={allowNegative}
      maxFractionDigits={maxFractionDigits}
      onChange={setValue}
      suffix="VND"
      value={value}
    />
  );
}

describe("NumericInput", () => {
  it("formats digit groups while keeping a canonical value", () => {
    render(<NumericInputFixture />);
    const input = screen.getByRole("textbox", { name: "Amount" });

    fireEvent.change(input, { target: { value: "1234567" } });

    expect(input).toHaveValue("1 234 567");
  });

  it("accepts a decimal comma and rejects excess fraction digits", () => {
    render(<NumericInputFixture allowNegative maxFractionDigits={2} />);
    const input = screen.getByRole("textbox", { name: "Amount" });

    fireEvent.change(input, { target: { value: "-1234,5" } });
    expect(input).toHaveValue("-1 234.5");

    fireEvent.change(input, { target: { value: "-1 234.567" } });
    expect(input).toHaveValue("-1 234.5");
  });
});
