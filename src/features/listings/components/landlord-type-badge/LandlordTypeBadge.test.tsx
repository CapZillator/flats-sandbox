import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LandlordTypeBadge } from "./LandlordTypeBadge";

describe("LandlordTypeBadge", () => {
  it.each([
    ["en", "Realtor"],
    ["ru", "Риэлтор"],
    ["vi", "Môi giới"],
  ] as const)("labels realtors in %s", (locale, label) => {
    render(<LandlordTypeBadge type="REALTOR" locale={locale} />);

    expect(screen.getByText(label)).toBeVisible();
  });

  it("does not label unclassified accounts as owners", () => {
    const { container } = render(<LandlordTypeBadge type={null} locale="en" />);

    expect(container).toBeEmptyDOMElement();
  });
});
