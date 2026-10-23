"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";

import { mapStyleUrl, mapWorkerUrl } from "@/shared/config/map";
import type { Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";

export function ListingLocationMap({
  latitude,
  longitude,
  label,
  locale,
}: {
  latitude: number;
  longitude: number;
  label: string;
  locale: Locale;
}) {
  const container = useRef<HTMLDivElement>(null);
  const messages = getDictionary(locale).listingForm.locationPicker.mapMessages;

  useEffect(() => {
    const element = container.current;

    if (!element) {
      return;
    }

    let map: maplibregl.Map | undefined;
    const resizeObserver = new ResizeObserver(() => map?.resize());
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting) || map) {
          return;
        }

        maplibregl.setWorkerUrl(mapWorkerUrl);
        map = new maplibregl.Map({
          container: element,
          style: mapStyleUrl,
          center: [longitude, latitude],
          zoom: 14,
          cooperativeGestures: true,
          dragRotate: false,
          pitchWithRotate: false,
          attributionControl: false,
          locale: {
            "Map.Title": label,
            "NavigationControl.ZoomIn": messages.zoomIn,
            "NavigationControl.ZoomOut": messages.zoomOut,
            "AttributionControl.ToggleAttribution": messages.toggleAttribution,
            "CooperativeGesturesHandler.WindowsHelpText":
              messages.windowsGesture,
            "CooperativeGesturesHandler.MacHelpText": messages.macGesture,
            "CooperativeGesturesHandler.MobileHelpText": messages.mobileGesture,
          },
        });
        map.touchZoomRotate.disableRotation();
        map.addControl(
          new maplibregl.NavigationControl({ showCompass: false }),
          "top-right",
        );
        map.addControl(new maplibregl.AttributionControl({ compact: true }));

        const marker = document.createElement("div");
        marker.className =
          "size-6 rounded-full border-2 border-foreground bg-accent shadow-[0_0_0_6px_rgb(255_255_255_/_75%)]";
        marker.setAttribute("aria-hidden", "true");
        new maplibregl.Marker({ element: marker })
          .setLngLat([longitude, latitude])
          .addTo(map);
        resizeObserver.observe(element);
        observer.disconnect();
      },
      { rootMargin: "200px" },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      map?.remove();
    };
  }, [latitude, longitude, label, messages]);

  return (
    <div
      ref={container}
      className="min-h-80 flex-1 overflow-hidden rounded-control border border-border bg-background"
      role="region"
      aria-label={label}
    />
  );
}
