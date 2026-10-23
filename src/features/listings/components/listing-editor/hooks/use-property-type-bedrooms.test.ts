import { act, renderHook } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { expect, it } from "vitest";

import type { ListingFormValues } from "../listing-form.schema";
import { usePropertyTypeBedrooms } from "./use-property-type-bedrooms";

function setup(
  propertyType: ListingFormValues["propertyType"],
  bedrooms: string,
) {
  return renderHook(() => {
    const form = useForm<ListingFormValues>({
      defaultValues: { propertyType, bedrooms },
    });
    const isStudio = usePropertyTypeBedrooms(form);

    return { form, isStudio };
  });
}

it("preserves saved bedrooms when opening a non-studio listing", () => {
  const { result } = setup("HOUSE", "4");

  expect(result.current.isStudio).toBe(false);
  expect(result.current.form.getValues("bedrooms")).toBe("4");
});

it("normalizes an existing studio to zero bedrooms", () => {
  const { result } = setup("STUDIO", "1");

  expect(result.current.isStudio).toBe(true);
  expect(result.current.form.getValues("bedrooms")).toBe("0");
});

it("sets zero for studios and one for every other newly selected type", () => {
  const { result } = setup("APARTMENT", "3");
  act(() => result.current.form.setValue("propertyType", "STUDIO"));

  expect(result.current.isStudio).toBe(true);
  expect(result.current.form.getValues("bedrooms")).toBe("0");

  act(() => result.current.form.setValue("propertyType", "HOUSE"));

  expect(result.current.isStudio).toBe(false);
  expect(result.current.form.getValues("bedrooms")).toBe("1");

  act(() => result.current.form.setValue("bedrooms", "5"));

  expect(result.current.form.getValues("bedrooms")).toBe("5");

  act(() => result.current.form.setValue("propertyType", "VILLA"));

  expect(result.current.form.getValues("bedrooms")).toBe("1");
});

it("includes zero bedrooms in the submitted form values", async () => {
  const { result } = setup("APARTMENT", "1");
  act(() => result.current.form.setValue("propertyType", "STUDIO"));
  let submitted: ListingFormValues | undefined;

  await act(async () => {
    await result.current.form.handleSubmit((values) => {
      submitted = values;
    })();
  });

  expect(submitted).toMatchObject({ propertyType: "STUDIO", bedrooms: "0" });
});
