import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { QueryTestProvider } from "@/shared/test/components/query-test-provider/QueryTestProvider";
import { ToastProvider } from "@/shared/model/toast/ToastContext";

import { ListingEditor } from "./ListingEditor";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("./components/location-picker-map/LocationPickerMap", () => ({
  LocationPickerMap: ({ label }: { label: string }) => <div>{label}</div>,
}));

const location = {
  id: "11111111-1111-4111-8111-111111111111",
  slug: "da-nang",
  name: { en: "Da Nang", ru: "Дананг", vi: "Đà Nẵng" },
  kind: "CITY" as const,
  parentId: null,
};

describe("ListingEditor", () => {
  it("disables bedrooms for studios and resets the value when the type changes", () => {
    render(
      <QueryTestProvider>
        <ToastProvider>
          <ListingEditor
            locale="ru"
            locations={[location]}
            amenities={[]}
            features={[]}
          />
        </ToastProvider>
      </QueryTestProvider>,
    );
    const bedrooms = screen.getByRole("textbox", { name: /Спальни/ });
    fireEvent.change(bedrooms, { target: { value: "3" } });
    fireEvent.click(screen.getByRole("combobox", { name: /Тип жилья/ }));
    fireEvent.click(screen.getByRole("option", { name: "Студия" }));

    expect(bedrooms).toBeDisabled();
    expect(bedrooms).toHaveValue("0");

    fireEvent.click(screen.getByRole("combobox", { name: /Тип жилья/ }));
    fireEvent.click(screen.getByRole("option", { name: "Квартира" }));

    expect(bedrooms).toBeEnabled();
    expect(bedrooms).toHaveValue("1");
  });

  it("renders the complete section flow and validates the active locale", async () => {
    render(
      <QueryTestProvider>
        <ToastProvider>
          <ListingEditor
            locale="ru"
            locations={[location]}
            amenities={[
              {
                id: "wifi",
                slug: "wifi",
                name: { ru: "Wi-Fi" },
                iconKey: "wifi",
              },
              {
                id: "pool",
                slug: "swimming-pool",
                name: { ru: "Бассейн" },
                iconKey: "waves",
              },
            ]}
            features={[]}
          />
        </ToastProvider>
      </QueryTestProvider>,
    );

    expect(screen.getByRole("heading", { name: "О жилье" })).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Расположение и условия" }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Фотографии" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Особенности" })).toBeVisible();

    const wifi = screen.getByRole("checkbox", { name: "Wi-Fi" });
    const pool = screen.getByRole("checkbox", { name: "Бассейн" });
    fireEvent.click(wifi);
    fireEvent.click(pool);
    expect(wifi).toBeChecked();
    expect(pool).toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: "Сохранить черновик" }));

    expect(
      await screen.findByText("Введите не менее 3 символов"),
    ).toHaveAttribute("role", "alert");
    expect(screen.getByText("Введите не менее 20 символов")).toHaveAttribute(
      "role",
      "alert",
    );
    expect(screen.getByText("Обязательное поле")).toHaveAttribute(
      "role",
      "alert",
    );
  });

  it("keeps localized values when the listing language changes", () => {
    render(
      <QueryTestProvider>
        <ToastProvider>
          <ListingEditor
            locale="ru"
            locations={[location]}
            amenities={[]}
            features={[]}
          />
        </ToastProvider>
      </QueryTestProvider>,
    );

    fireEvent.change(screen.getByLabelText(/Заголовок/), {
      target: { value: "Дом у моря" },
    });
    fireEvent.click(screen.getByRole("combobox", { name: "Язык объявления" }));
    fireEvent.click(screen.getByRole("option", { name: "EN" }));

    expect(screen.getByLabelText(/Заголовок/)).toHaveValue("");

    fireEvent.change(screen.getByLabelText(/Заголовок/), {
      target: { value: "Home by the sea" },
    });
    fireEvent.click(screen.getByRole("combobox", { name: "Язык объявления" }));
    fireEvent.click(screen.getByRole("option", { name: "RU" }));

    expect(screen.getByLabelText(/Заголовок/)).toHaveValue("Дом у моря");
  });
});
