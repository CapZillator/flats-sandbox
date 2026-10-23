import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeSearch } from "./HomeSearch";

describe("HomeSearch", () => {
  it("submits API-compatible filters through a localized GET form", () => {
    render(
      <HomeSearch
        locale="ru"
        locations={[
          {
            id: "city-id",
            slug: "da-nang",
            name: { ru: "Дананг" },
            kind: "CITY",
            parentId: null,
          },
        ]}
      />,
    );
    const form = screen.getByRole("form", {
      name: "Искать",
    }) as HTMLFormElement;

    expect(form).toHaveAttribute("action", "/ru/listings");
    expect(form).toHaveAttribute("method", "get");
    fireEvent.click(screen.getByRole("combobox", { name: "Где ищем?" }));
    fireEvent.click(screen.getByRole("option", { name: "Дананг" }));
    fireEvent.click(screen.getByRole("combobox", { name: "Тип жилья" }));
    fireEvent.click(screen.getByRole("option", { name: "Дом" }));
    fireEvent.click(screen.getByRole("checkbox"));
    const data = new FormData(form);

    expect(data.get("locationId")).toBe("city-id");
    expect(data.get("propertyType")).toBe("HOUSE");
    expect(data.get("landlordType")).toBe("OWNER");
    expect(data.get("availableBy")).toBe("");
    expect(
      screen.getByRole("link", { name: "Посмотреть на карте" }),
    ).toHaveAttribute("href", "/ru/listings?view=map");
  });

  it("keeps searching available if the location service fails", () => {
    render(<HomeSearch locale="en" locations={null} />);

    expect(screen.getByRole("combobox", { name: "Where?" })).toHaveTextContent(
      "All Vietnam",
    );
    expect(screen.getByRole("button", { name: "Search homes" })).toBeEnabled();
    expect(screen.getByText(/Cities could not be loaded/)).toBeVisible();
  });
});
