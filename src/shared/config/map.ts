export const mapStyleUrl =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL ??
  "https://tiles.openfreemap.org/styles/liberty";

export const mapWorkerUrl = "/maplibre/maplibre-gl-worker.mjs";

export const vietnamMapBounds: [[number, number], [number, number]] = [
  [101, 7],
  [111, 24.5],
];
