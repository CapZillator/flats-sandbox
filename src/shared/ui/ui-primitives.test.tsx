import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  AdaptiveDropdown,
  Button,
  ButtonLink,
  Badge,
  Checkbox,
  EmptyState,
  Field,
  IconButton,
  Skeleton,
  Textarea,
  TextInput,
} from "@/shared/ui";

describe("UI primitives", () => {
  it("uses safe button defaults and exposes loading state", () => {
    render(
      <Button loading loadingLabel="Saving">
        Save
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Saving" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveClass("rounded-control");
    expect(button).toHaveClass("h-11");
    expect(button).not.toHaveClass("rounded-full");
  });

  it("requires an accessible name for an icon button", () => {
    render(<IconButton aria-label="Close">×</IconButton>);

    expect(screen.getByRole("button", { name: "Close" })).toBeVisible();
  });

  it("renders navigation actions as links", () => {
    render(<ButtonLink href="/account">Open account</ButtonLink>);

    expect(screen.getByRole("link", { name: "Open account" })).toHaveAttribute(
      "href",
      "/account",
    );
  });

  it("associates labels, hints, and errors with a text input", () => {
    render(
      <Field
        htmlFor="email"
        label="Email"
        hint="We will send a code"
        error="Enter a valid email"
      >
        <TextInput
          id="email"
          invalid
          aria-describedby="email-hint email-error"
        />
      </Field>,
    );

    const input = screen.getByLabelText("Email");
    expect(input).toHaveClass("h-11");
    expect(input.parentElement).toHaveClass("min-w-0");
    expect(input).toHaveAccessibleDescription(
      "We will send a code Enter a valid email",
    );
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email");
  });

  it("keeps native textarea and checkbox semantics", () => {
    render(
      <>
        <Textarea aria-label="Description" />

        <Checkbox label="Pets allowed" />
      </>,
    );

    expect(screen.getByRole("textbox", { name: "Description" })).toBeVisible();
    expect(
      screen.getByRole("checkbox", { name: "Pets allowed" }),
    ).not.toBeChecked();
  });

  it("exposes adaptive dropdown value and invalid state", () => {
    render(
      <AdaptiveDropdown
        aria-label="Home type"
        invalid
        name="propertyType"
        defaultValue="house"
        options={[{ value: "house", label: "House" }]}
      />,
    );

    const dropdown = screen.getByRole("combobox", { name: "Home type" });
    expect(dropdown).toHaveClass("h-11", "max-w-full");
    expect(dropdown.parentElement).toHaveClass("min-w-0");
    expect(screen.getByText("House")).toHaveClass("truncate");
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(document.querySelector('input[name="propertyType"]')).toHaveValue(
      "house",
    );
  });

  it("renders semantic badges and reusable content states", () => {
    render(
      <>
        <Badge tone="accent">Featured</Badge>

        <EmptyState icon={<span>⌂</span>} title="No homes yet" />

        <Skeleton data-testid="skeleton" />
      </>,
    );

    expect(screen.getByText("Featured")).toHaveClass("bg-accent");
    expect(screen.getByRole("heading", { name: "No homes yet" })).toBeVisible();
    expect(screen.getByTestId("skeleton")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
