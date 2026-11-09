import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { browserApi } from "@/shared/api/client";
import { locales, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { QueryTestProvider } from "@/shared/test/components/query-test-provider/QueryTestProvider";
import { getSearchWizardCopy } from "../../search-wizard.copy";
import { SearchWizard } from "./SearchWizard";

vi.mock("@/shared/api/client", () => ({ browserApi: vi.fn() }));

function setup(locale: Locale = "en") {
  render(
    <QueryTestProvider>
      <SearchWizard
        locale={locale}
        dictionary={getDictionary(locale)}
        locations={[]}
        locationsFailed={false}
        preferredCurrency="USD"
      />
    </QueryTestProvider>,
  );

  return getSearchWizardCopy(locale);
}

function next(label = "Next") {
  fireEvent.click(screen.getByRole("button", { name: label }));
}

describe("SearchWizard", () => {
  beforeEach(() => {
    vi.mocked(browserApi).mockReset();
  });

  it.each(locales)("shows localized questions in %s", (locale) => {
    const copy = setup(locale);

    expect(screen.getByRole("heading", { name: copy.location })).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Submit" }),
    ).not.toBeInTheDocument();
    next(copy.next);
    expect(
      screen.getByRole("heading", { name: copy.propertyType }),
    ).toHaveFocus();
    expect(vi.mocked(browserApi)).not.toHaveBeenCalled();
  });

  it("keeps answers across hidden steps and sends them on the final step", async () => {
    vi.mocked(browserApi).mockResolvedValue({ items: [], meta: { total: 0 } });
    const copy = setup();
    fireEvent.click(screen.getByRole("combobox", { name: copy.location }));
    fireEvent.click(screen.getByRole("option", { name: "All Vietnam" }));
    next();
    fireEvent.click(screen.getByRole("combobox", { name: copy.propertyType }));
    fireEvent.click(screen.getByRole("option", { name: "Villa" }));
    next();
    fireEvent.click(screen.getByRole("combobox", { name: copy.bedrooms }));
    fireEvent.click(screen.getByRole("option", { name: "2+" }));
    next();
    fireEvent.change(screen.getByRole("spinbutton", { name: copy.maxPrice }), {
      target: { value: "1200" },
    });
    next();
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByRole("spinbutton", { name: copy.maxPrice })).toHaveValue(
      1200,
    );
    next();
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(browserApi).toHaveBeenCalledOnce());
    const [url] = vi.mocked(browserApi).mock.calls[0];
    const query = new URL(url, "http://localhost").searchParams;

    expect(query.get("propertyType")).toBe("VILLA");
    expect(query.get("minBedrooms")).toBe("2");
    expect(query.get("maxPrice")).toBe("1200");
    expect(query.get("currency")).toBe("USD");
    expect(query.has("locationId")).toBe(false);
    expect(
      await screen.findByText(getDictionary("en").catalog.empty),
    ).toBeVisible();
  });

  it("shows a localized error when search fails", async () => {
    vi.mocked(browserApi).mockRejectedValue(new Error("Unavailable"));
    setup();

    for (let index = 0; index < 4; index += 1) {
      next();
    }

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      getDictionary("en").catalog.error,
    );
    expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled();
  });
});
