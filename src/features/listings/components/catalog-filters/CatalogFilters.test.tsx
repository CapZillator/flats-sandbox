import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { getDictionary } from "@/shared/i18n/dictionaries";
import { CatalogFilters } from "./CatalogFilters";

describe("CatalogFilters", () => {
  it("restores the owners-only query and removes it when unchecked", () => {
    render(
      <CatalogFilters
        dictionary={getDictionary("en")}
        features={[]}
        locations={[]}
        locale="en"
        search={{ landlordType: "OWNER" }}
      />,
    );
    const checkbox = within(
      screen.getByRole("group", { name: "Advertiser" }),
    ).getByRole("checkbox", { name: "Owners only" });
    const form = checkbox.closest("form")!;

    expect(checkbox).toBeChecked();
    expect(new FormData(form).get("landlordType")).toBe("OWNER");
    fireEvent.click(checkbox);
    expect(new FormData(form).has("landlordType")).toBe(false);
  });
  it("restores RUB price filters in the submitted form", () => {
    render(
      <CatalogFilters
        dictionary={getDictionary("ru")}
        features={[]}
        locations={[]}
        locale="ru"
        search={{ currency: "RUB", minPrice: "10000", maxPrice: "50000" }}
      />,
    );
    const form = screen.getByLabelText("Цена в месяц от").closest("form")!;
    const data = new FormData(form);

    expect(data.get("currency")).toBe("RUB");
    expect(data.get("minPrice")).toBe("10000");
    expect(data.get("maxPrice")).toBe("50000");
  });

  it("formats price inputs and submits canonical decimal values", () => {
    render(
      <CatalogFilters
        dictionary={getDictionary("en")}
        features={[]}
        locations={[]}
        locale="en"
        search={{ minPrice: "1000", maxPrice: "5000" }}
      />,
    );
    const minPrice = screen.getByRole("textbox", {
      name: "Monthly price from",
    });
    const maxPrice = screen.getByRole("textbox", { name: "Monthly price to" });
    const form = minPrice.closest("form")!;

    expect(minPrice).toHaveValue("1 000");
    expect(maxPrice).toHaveValue("5 000");

    fireEvent.change(minPrice, { target: { value: "1234,56" } });
    fireEvent.change(maxPrice, { target: { value: "9876.54" } });

    expect(minPrice).toHaveValue("1 234.56");
    expect(maxPrice).toHaveValue("9 876.54");
    expect(new FormData(form).get("minPrice")).toBe("1234.56");
    expect(new FormData(form).get("maxPrice")).toBe("9876.54");

    fireEvent.change(minPrice, { target: { value: "-1" } });
    expect(minPrice).toHaveValue("1 234.56");

    fireEvent.change(maxPrice, { target: { value: "" } });
    expect(new FormData(form).get("maxPrice")).toBe("");
  });
});
