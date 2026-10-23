"use client";

import { useCallback, useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";
import classNames from "classnames";

import {
  mapStyleUrl,
  mapWorkerUrl,
  vietnamMapBounds,
} from "@/shared/config/map";
import { IconButton, TargetIcon } from "@/shared/ui";

export type MapCoordinates = {
  latitude: number;
  longitude: number;
};

type LocationPickerMapProps = {
  coordinates?: MapCoordinates;
  error?: string;
  hint: string;
  label: string;
  mapLabel: string;
  mapMessages: {
    macGesture: string;
    map: string;
    mobileGesture: string;
    toggleAttribution: string;
    windowsGesture: string;
    zoomIn: string;
    zoomOut: string;
  };
  markerLabel: string;
  onChange: (coordinates: MapCoordinates) => void;
  suggestedCenter?: MapCoordinates;
  useCenterLabel: string;
};

const vietnamCenter: [number, number] = [108.2, 16.05];

function roundedCoordinates(longitude: number, latitude: number) {
  return {
    latitude: Number(latitude.toFixed(6)),
    longitude: Number(longitude.toFixed(6)),
  };
}

function markerElement(label: string) {
  const element = document.createElement("button");
  element.type = "button";
  element.className =
    "grid size-9 place-items-center rounded-full border-2 border-foreground bg-accent shadow-[3px_3px_0_rgb(24_28_28_/_18%)] outline-none focus-visible:ring-3 focus-visible:ring-accent/45";
  element.setAttribute("aria-label", label);

  const dot = document.createElement("span");
  dot.className = "size-2 rounded-full bg-foreground";
  dot.setAttribute("aria-hidden", "true");
  element.append(dot);

  return element;
}

export function LocationPickerMap({
  coordinates,
  error,
  hint,
  label,
  mapLabel,
  mapMessages,
  markerLabel,
  onChange,
  suggestedCenter,
  useCenterLabel,
}: LocationPickerMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const onChangeRef = useRef(onChange);
  const initialCoordinatesRef = useRef(coordinates);
  const initialSuggestedCenterRef = useRef(suggestedCenter);
  const selectedLatitude = coordinates?.latitude;
  const selectedLongitude = coordinates?.longitude;
  const suggestedLatitude = suggestedCenter?.latitude;
  const suggestedLongitude = suggestedCenter?.longitude;

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const placeMarker = useCallback(
    (nextCoordinates: MapCoordinates, notify: boolean) => {
      const map = mapRef.current;

      if (!map) {
        return;
      }

      const position: [number, number] = [
        nextCoordinates.longitude,
        nextCoordinates.latitude,
      ];
      let marker = markerRef.current;

      if (!marker) {
        const element = markerElement(markerLabel);
        marker = new maplibregl.Marker({
          draggable: true,
          element,
        })
          .setLngLat(position)
          .addTo(map);
        marker.on("dragend", () => {
          const point = marker?.getLngLat();

          if (!point) {
            return;
          }

          onChangeRef.current(roundedCoordinates(point.lng, point.lat));
        });
        element.addEventListener("keydown", (event) => {
          const offsets: Record<string, [number, number]> = {
            ArrowUp: [0, 1],
            ArrowDown: [0, -1],
            ArrowLeft: [-1, 0],
            ArrowRight: [1, 0],
          };
          const offset = offsets[event.key];

          if (!offset) {
            return;
          }

          event.preventDefault();
          const current = marker?.getLngLat();

          if (!current) {
            return;
          }

          const step = event.shiftKey ? 0.005 : 0.0005;
          const next = roundedCoordinates(
            current.lng + offset[0] * step,
            current.lat + offset[1] * step,
          );
          marker?.setLngLat([next.longitude, next.latitude]);
          onChangeRef.current(next);
        });
        markerRef.current = marker;
      }

      marker.setLngLat(position);

      if (notify) {
        onChangeRef.current(nextCoordinates);
      }
    },
    [markerLabel],
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    maplibregl.setWorkerUrl(mapWorkerUrl);

    const initialCoordinates = initialCoordinatesRef.current;
    const initialCenter = initialCoordinates
      ? [initialCoordinates.longitude, initialCoordinates.latitude]
      : initialSuggestedCenterRef.current
        ? [
            initialSuggestedCenterRef.current.longitude,
            initialSuggestedCenterRef.current.latitude,
          ]
        : vietnamCenter;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyleUrl,
      center: initialCenter as [number, number],
      zoom: initialCoordinates
        ? 14
        : initialSuggestedCenterRef.current
          ? 11
          : 5,
      maxBounds: vietnamMapBounds,
      cooperativeGestures: true,
      attributionControl: false,
      locale: {
        "AttributionControl.ToggleAttribution": mapMessages.toggleAttribution,
        "Map.Title": mapMessages.map,
        "NavigationControl.ZoomIn": mapMessages.zoomIn,
        "NavigationControl.ZoomOut": mapMessages.zoomOut,
        "CooperativeGesturesHandler.WindowsHelpText":
          mapMessages.windowsGesture,
        "CooperativeGesturesHandler.MacHelpText": mapMessages.macGesture,
        "CooperativeGesturesHandler.MobileHelpText": mapMessages.mobileGesture,
      },
    });
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );
    map.addControl(new maplibregl.AttributionControl({ compact: true }));
    mapRef.current = map;

    if (initialCoordinates) {
      placeMarker(initialCoordinates, false);
    }

    map.on("click", (event) => {
      placeMarker(roundedCoordinates(event.lngLat.lng, event.lngLat.lat), true);
    });

    return () => {
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [mapMessages, placeMarker]);

  useEffect(() => {
    const map = mapRef.current;

    if (
      !map ||
      suggestedLatitude === undefined ||
      suggestedLongitude === undefined
    ) {
      return;
    }

    map.flyTo({
      center: [suggestedLongitude, suggestedLatitude],
      zoom: 11,
    });
  }, [suggestedLatitude, suggestedLongitude]);

  useEffect(() => {
    if (selectedLatitude === undefined || selectedLongitude === undefined) {
      markerRef.current?.remove();
      markerRef.current = null;

      return;
    }

    placeMarker(
      { latitude: selectedLatitude, longitude: selectedLongitude },
      false,
    );
  }, [placeMarker, selectedLatitude, selectedLongitude]);

  return (
    <fieldset className="grid min-w-0 gap-1.5">
      <legend className="text-body-sm font-semibold text-foreground">
        {label}

        <span aria-hidden="true" className="ml-1 text-danger">
          *
        </span>
      </legend>

      <p className="text-caption text-muted">{hint}</p>

      <div
        className={classNames(
          "relative mt-1 overflow-hidden rounded-surface border bg-surface-muted",
          error
            ? "border-danger"
            : "border-border focus-within:border-foreground",
        )}
      >
        <div
          ref={containerRef}
          className="h-80 w-full md:h-[26rem]"
          aria-label={mapLabel}
          role="region"
        />

        <IconButton
          aria-label={useCenterLabel}
          className="absolute bottom-3 left-3 bg-surface/95 shadow-[2px_2px_0_rgb(24_28_28_/_12%)]"
          onClick={() => {
            const center = mapRef.current?.getCenter();

            if (!center) {
              return;
            }

            placeMarker(roundedCoordinates(center.lng, center.lat), true);
          }}
          size="sm"
          title={useCenterLabel}
          variant="outline"
        >
          <TargetIcon className="size-5" />
        </IconButton>
      </div>

      {error ? (
        <p className="text-caption font-medium text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
