"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import * as maplibregl from "maplibre-gl";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";

import { browserApi } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import type { MapListing } from "@/shared/api/types";
import {
  mapStyleUrl,
  mapWorkerUrl,
  vietnamMapBounds,
} from "@/shared/config/map";
import {
  formatConvertedMoney,
  type ExchangeRatesSnapshot,
} from "@/shared/currency/currency";
import { useCurrency } from "@/shared/currency/components/currency-provider/CurrencyProvider";
import type { Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { PropertyTypeIcon } from "../property-type-icon/PropertyTypeIcon";
import { MapPopupDetails } from "./components/map-popup-details/MapPopupDetails";
import styles from "./MapView.module.css";

type MapResponse = {
  items: MapListing[];
  meta: {
    returned: number;
    limit: number;
    hasMore: boolean;
    exchangeRates?: ExchangeRatesSnapshot;
  };
};

const emptyMapListings: MapListing[] = [];

function buildMapQuery(
  map: MapLibreMap,
  filters: Record<string, string | string[] | undefined>,
) {
  const bounds = map.getBounds();
  const query = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (
      ["page", "sort", "view"].includes(key) ||
      value === undefined ||
      value === ""
    ) {
      return;
    }

    [value].flat().forEach((item) => query.append(key, item));
  });
  query.set("north", String(bounds.getNorth()));
  query.set("south", String(bounds.getSouth()));
  query.set("east", String(bounds.getEast()));
  query.set("west", String(bounds.getWest()));

  return query.toString();
}

export function MapView({
  filters,
  errorLabel,
  locale,
  mapLabel,
  truncatedLabel,
}: {
  filters: Record<string, string | string[] | undefined>;
  errorLabel: string;
  locale: Locale;
  mapLabel: string;
  truncatedLabel: string;
}) {
  const currencyContext = useCurrency();
  const targetCurrency = currencyContext?.currency;
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const filtersRef = useRef(filters);
  const [mapQuery, setMapQuery] = useState("");
  const [popupContents, setPopupContents] = useState<
    {
      item: MapListing;
      container: HTMLDivElement;
      markerContainer: HTMLButtonElement;
      price: string;
    }[]
  >([]);
  const listingsQuery = useQuery({
    queryKey: queryKeys.mapListings(mapQuery),
    queryFn: ({ signal }) =>
      browserApi<MapResponse>(`/listings/map?${mapQuery}`, { signal }),
    enabled: mapQuery.length > 0,
    placeholderData: keepPreviousData,
  });
  const items = listingsQuery.data?.items ?? emptyMapListings;
  const snapshot =
    listingsQuery.data?.meta.exchangeRates ?? currencyContext?.snapshot;
  const hasMore = listingsQuery.data?.meta.hasMore ?? false;
  const error = listingsQuery.error;

  useEffect(() => {
    if (!container.current || mapRef.current) {
      return;
    }

    maplibregl.setWorkerUrl(mapWorkerUrl);

    const map = new maplibregl.Map({
      container: container.current,
      style: mapStyleUrl,
      center: [108.2, 16.05],
      zoom: 4.5,
      maxBounds: vietnamMapBounds,
      attributionControl: false,
    });
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );
    map.addControl(new maplibregl.AttributionControl({ compact: true }));
    mapRef.current = map;

    const load = () => setMapQuery(buildMapQuery(map, filtersRef.current));

    map.on("load", load);
    map.on("moveend", load);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    filtersRef.current = filters;

    if (mapRef.current) {
      setMapQuery(buildMapQuery(mapRef.current, filters));
    }
  }, [filters]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    markers.current.forEach((marker) => marker.remove());
    const nextPopupContents: typeof popupContents = [];
    markers.current = items.map((item) => {
      const element = document.createElement("button");
      element.className =
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-control border-2 border-foreground bg-accent px-2 py-1 text-caption font-bold text-accent-content shadow-[2px_2px_0_rgb(24_28_28_/_18%)]";
      element.type = "button";
      const price = formatConvertedMoney(
        item.monthlyPrice,
        item.currency,
        targetCurrency ?? item.currency,
        locale,
        snapshot,
      );
      element.setAttribute(
        "aria-label",
        `${getDictionary(locale).catalog.propertyTypes[item.propertyType]}: ${price}`,
      );

      const popupContainer = document.createElement("div");
      nextPopupContents.push({
        item,
        container: popupContainer,
        markerContainer: element,
        price,
      });
      const popup = new maplibregl.Popup({
        offset: 18,
        className: styles.popup,
      }).setDOMContent(popupContainer);

      return new maplibregl.Marker({ element })
        .setLngLat([item.longitude, item.latitude])
        .setPopup(popup)
        .addTo(map);
    });
    setPopupContents(nextPopupContents);
  }, [items, locale, snapshot, targetCurrency]);

  return (
    <div className="relative overflow-hidden rounded-surface border border-border bg-surface">
      {popupContents.map(({ item, markerContainer, price }) =>
        createPortal(
          <>
            <PropertyTypeIcon
              type={item.propertyType}
              className="size-4 shrink-0"
            />

            <span>{price}</span>
          </>,
          markerContainer,
          `${item.id}-marker`,
        ),
      )}

      {popupContents.map(({ item, container: popupContainer, price }) =>
        createPortal(
          <MapPopupDetails item={item} locale={locale} price={price} />,
          popupContainer,
          item.id,
        ),
      )}

      <div
        ref={container}
        className="h-[70dvh] min-h-[30rem] w-full"
        aria-label={mapLabel}
        role="region"
      />

      {hasMore ? (
        <p className="absolute top-3 left-3 max-w-xs rounded-control border border-border bg-surface/95 px-3 py-2 text-caption text-foreground shadow-[2px_2px_0_rgb(24_28_28_/_12%)]">
          {truncatedLabel}
        </p>
      ) : null}

      {error ? (
        <div
          className="absolute top-3 left-3 rounded-control border border-danger bg-surface px-3 py-2 text-body-sm text-danger"
          role="alert"
        >
          {error instanceof Error ? error.message : errorLabel}
        </div>
      ) : null}
    </div>
  );
}
