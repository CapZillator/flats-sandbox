import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LocationPickerMap } from "./LocationPickerMap";

type ClickHandler = (event: { lngLat: { lat: number; lng: number } }) => void;

const mapState = vi.hoisted(() => ({
  center: { lat: 16.05, lng: 108.2 },
  clickHandler: undefined as ClickHandler | undefined,
  dragHandler: undefined as (() => void) | undefined,
  markerElement: undefined as HTMLButtonElement | undefined,
  markerPosition: [0, 0] as [number, number],
}));

vi.mock("maplibre-gl", () => {
  class MockMap {
    addControl() {}

    flyTo() {}

    getCenter() {
      return mapState.center;
    }

    on(event: string, handler: ClickHandler) {
      if (event === "click") {
        mapState.clickHandler = handler;
      }
    }

    remove() {}
  }

  class MockMarker {
    constructor({ element }: { element: HTMLButtonElement }) {
      mapState.markerElement = element;
    }

    addTo() {
      return this;
    }

    getLngLat() {
      return {
        lng: mapState.markerPosition[0],
        lat: mapState.markerPosition[1],
      };
    }

    on(event: string, handler: () => void) {
      if (event === "dragend") {
        mapState.dragHandler = handler;
      }

      return this;
    }

    remove() {}

    setLngLat(position: [number, number]) {
      mapState.markerPosition = position;

      return this;
    }
  }

  return {
    AttributionControl: class {},
    Map: MockMap,
    Marker: MockMarker,
    NavigationControl: class {},
    setWorkerUrl: vi.fn(),
  };
});

const labels = {
  hint: "Click the map or drag the marker.",
  label: "Exact location",
  mapLabel: "Choose a location",
  mapMessages: {
    macGesture: "Use Command and scroll",
    map: "Map",
    mobileGesture: "Use two fingers",
    toggleAttribution: "Toggle attribution",
    windowsGesture: "Use Control and scroll",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
  },
  markerLabel: "Property location",
  useCenterLabel: "Use map center",
};

describe("LocationPickerMap", () => {
  beforeEach(() => {
    mapState.clickHandler = undefined;
    mapState.dragHandler = undefined;
    mapState.markerElement = undefined;
    mapState.markerPosition = [0, 0];
  });

  it("selects a map point and supports keyboard marker adjustments", () => {
    const onChange = vi.fn();
    render(<LocationPickerMap {...labels} onChange={onChange} />);

    act(() => {
      mapState.clickHandler?.({ lngLat: { lat: 10.7769, lng: 106.7009 } });
    });

    expect(onChange).toHaveBeenLastCalledWith({
      latitude: 10.7769,
      longitude: 106.7009,
    });
    expect(screen.queryByText("Selected point")).not.toBeInTheDocument();
    expect(mapState.markerElement).toHaveAttribute(
      "aria-label",
      "Property location",
    );

    fireEvent.keyDown(mapState.markerElement!, { key: "ArrowRight" });

    expect(onChange).toHaveBeenLastCalledWith({
      latitude: 10.7769,
      longitude: 106.7014,
    });

    mapState.markerPosition = [105.8342, 21.0278];
    act(() => mapState.dragHandler?.());

    expect(onChange).toHaveBeenLastCalledWith({
      latitude: 21.0278,
      longitude: 105.8342,
    });
  });

  it("can select the current map center without pointer input", () => {
    const onChange = vi.fn();
    render(<LocationPickerMap {...labels} onChange={onChange} />);

    const useCenterButton = screen.getByRole("button", {
      name: "Use map center",
    });
    expect(useCenterButton.querySelector("svg")).toBeInTheDocument();

    fireEvent.click(useCenterButton);

    expect(onChange).toHaveBeenCalledWith({
      latitude: 16.05,
      longitude: 108.2,
    });
  });
});
