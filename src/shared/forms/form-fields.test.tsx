import { zodResolver } from "@hookform/resolvers/zod";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { Button } from "@/shared/ui";

import { ControlledCheckboxField } from "@/shared/forms/components/controlled-checkbox-field/ControlledCheckboxField";
import { ControlledDatePicker } from "@/shared/forms/components/controlled-date-picker/ControlledDatePicker";
import { ControlledAdaptiveDropdown } from "@/shared/forms/components/controlled-adaptive-dropdown/ControlledAdaptiveDropdown";
import { ControlledLocalizedTextField } from "@/shared/forms/components/controlled-localized-text-field/ControlledLocalizedTextField";
import { ControlledNumericField } from "@/shared/forms/components/controlled-numeric-field/ControlledNumericField";
import { ControlledTextField } from "@/shared/forms/components/controlled-text-field/ControlledTextField";

const schema = z.object({
  name: z.string().min(2, "Enter at least two characters"),
  title: z.record(z.string(), z.string()),
  accepted: z.boolean(),
  propertyType: z.string().min(1, "Choose a home type"),
  availableFrom: z.string(),
  amount: z.string(),
});

type FormValues = z.infer<typeof schema>;

function TestForm({ onSubmit }: { onSubmit: (values: FormValues) => void }) {
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      title: { en: "Existing title", ru: "Старое название", vi: "" },
      accepted: false,
      propertyType: "",
      availableFrom: "",
      amount: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ControlledTextField control={control} name="name" label="Name" />

      <ControlledLocalizedTextField
        control={control}
        name="title"
        locale="ru"
        label="Title"
      />

      <ControlledCheckboxField
        control={control}
        name="accepted"
        label="I accept"
      />

      <ControlledAdaptiveDropdown
        control={control}
        name="propertyType"
        label="Home type"
        options={[
          { value: "", label: "Any home" },
          { value: "house", label: "House" },
        ]}
      />

      <ControlledDatePicker
        control={control}
        name="availableFrom"
        locale="en"
        label="Available from"
      />

      <ControlledNumericField
        control={control}
        maxFractionDigits={2}
        name="amount"
        label="Amount"
        suffix="VND"
      />

      <Button type="submit">Submit</Button>
    </form>
  );
}

describe("React Hook Form fields", () => {
  it("renders Zod errors and submits typed localized values", async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(
      await screen.findByText("Enter at least two characters"),
    ).toHaveAttribute("role", "alert");

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Linh" },
    });
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Новое название" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: "I accept" }));
    fireEvent.change(screen.getByLabelText("Amount"), {
      target: { value: "1234567,5" },
    });
    fireEvent.click(screen.getByRole("combobox", { name: "Home type" }));
    fireEvent.click(screen.getByRole("option", { name: "House" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit).toHaveBeenCalledWith(
      {
        name: "Linh",
        title: {
          en: "Existing title",
          ru: "Новое название",
          vi: "",
        },
        accepted: true,
        propertyType: "house",
        availableFrom: "",
        amount: "1234567.5",
      },
      expect.anything(),
    );
  });
});
