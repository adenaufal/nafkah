"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { type Map as MLMap, type MapMouseEvent } from "maplibre-gl";
import type { ExpressionSpecification, StyleSpecification } from "maplibre-gl";
import { useApp } from "@/state/AppContext";
import { NO_DATA_PATTERN, VALUE_RAMP, bandColors } from "@/lib/calculations";
import type { RegionFeatureProps, RegionMetrics } from "@/lib/types";
import { formatPct, formatIDRCompact } from "@/lib/format";

/**
 * MapLibre canvas: keyless basemaps, two geometry layers (data + no-data
 * hatch pattern), hover tooltip, click to open detail, data-driven recolor.
 */

const SOURCE_ID = "regions";

export const BASEMAPS: Record<string, StyleSpecification | string> = {
  // Keyless, OSM-derived — attribution stays visible per OSM license.
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  satellite: {
    version: 8,
    // Raster-only style must still declare glyphs: our label symbol layers
    // use text-field, and MapLibre errors without a glyphs URL.
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    sources: {
      esri: {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution:
          "Imagery © Esri, Maxar, Earthstar Geographics and the GIS User Community",
      },
    },
    layers: [{ id: "esri", type: "raster", source: "esri" }],
  },
};

const INDONESIA_CENTER: [number, number] = [117.5, -2.2];

/**
 * Fully local style: no tile servers, no fonts — works without internet.
 * Region boundaries come from the local TopoJSON, so the choropleth still
 * renders end-to-end offline. Symbol label layers are only added when the
 * active style provides a glyphs URL (remote fonts).
 */
function offlineStyle(): StyleSpecification {
  const dark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");
  return {
    version: 8,
    name: "Offline (local boundaries only)",
    sources: {},
    layers: [
      {
        id: "background",
        type: "background",
        paint: { "background-color": dark ? "#26211c" : "#e8e4dc" },
      },
    ],
  };
}

/** Resolve a basemap id to a style; "offline" is always fully local. */
function resolveStyle(id: string): StyleSpecification | string {
  return id === "offline" ? offlineStyle() : BASEMAPS[id];
}

/** Diagonal hatch pattern for regions without data, rendered on a canvas. */
function makeHatchImage(): Uint8Array {
  const s = 8;
  const data = new Uint8Array(s * s * 4);
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const i = (y * s + x) * 4;
      const onLine = (x + y) % s < 2;
      data[i] = 120;
      data[i + 1] = 120;
      data[i + 2] = 120;
      data[i + 3] = onLine ? 90 : 26;
    }
  }
  return data;
}

function coverageFillColor(dark: boolean): ExpressionSpecification {
  // SAFETY: MapLibre paint expressions are JSON arrays typed loosely;
  // the match expression is a valid ExpressionSpecification per the spec.
  const c = bandColors(dark);
  // SAFETY: match expression di atas adalah ExpressionSpecification valid;
  // JSON array tak dapat di-narrow otomatis oleh TypeScript.
  return [
    "match",
    ["get", "band"],
    "comfortable",
    c.comfortable,
    "manageable",
    c.manageable,
    "tight",
    c.tight,
    "insufficient",
    c.insufficient,
    c.tight, // fallback (hidden by layer filter anyway)
  ] as unknown as ExpressionSpecification;
}

/** Warna label peta mengikuti tema; halo menjaga keterbacaan di atas fill. */
function labelPaint(dark: boolean, secondary = false) {
  return dark
    ? {
        "text-color": secondary
          ? "rgba(240,236,231,0.7)"
          : "rgba(240,236,231,0.95)",
        "text-halo-color": "rgba(22,19,15,0.9)",
        "text-halo-width": 1.4,
      }
    : {
        "text-color": secondary ? "#3f3a35" : "#1e1b18",
        "text-halo-color": secondary
          ? "rgba(255,255,255,0.8)"
          : "rgba(255,255,255,0.85)",
        "text-halo-width": 1.4,
      };
}

export default function MapCanvas() {
  const { state, metrics, metricsReady, select, pin } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);
  const hoverRef = useRef<string | null>(null);
  /* Latest values are read after asynchronous style loads complete. */
  const stateRef = useRef(state);
  stateRef.current = state;
  const metricsRef = useRef<Map<string, RegionMetrics>>(metrics);
  metricsRef.current = metrics;

  /* ---------- init map ---------- */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      // Start offline if the browser already knows it has no network.
      style: navigator.onLine
        ? resolveStyle(stateRefStyle())
        : resolveStyle("offline"),
      center: INDONESIA_CENTER,
      zoom: 4,
      attributionControl: { compact: false },
      maxZoom: 13,
      minZoom: 3,
    });

    function stateRefStyle(): keyof typeof BASEMAPS {
      return document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
    }

    map.addControl(
      new maplibregl.NavigationControl({ visualizePitch: true }),
      "top-left",
    );
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
      }),
      "top-left",
    );

    map.on("load", () => {
      // 'load' fires again after every setStyle (and StrictMode remounts in
      // dev re-run this effect), so guard against double registration.
      if (!map.hasImage(NO_DATA_PATTERN)) {
        map.addImage(
          NO_DATA_PATTERN,
          { width: 8, height: 8, data: makeHatchImage() },
          { pixelRatio: 2 },
        );
      }
      setMapReady(true);
    });

    mapRef.current = map;

    // Offline fallback: if tiles can't be fetched (no internet, blocked CDN),
    // the remote style never finishes loading — swap in the local style so
    // the boundary choropleth still renders.
    const fallbackTimer = setTimeout(() => {
      if (!map.isStyleLoaded()) map.setStyle(offlineStyle());
    }, 4000);
    map.on("load", () => clearTimeout(fallbackTimer));

    return () => {
      clearTimeout(fallbackTimer);
      mapRef.current = null;
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- basemap switching ---------- */
  const firstBasemapRun = useRef(true);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // Skip the initial mount: the map was already constructed with the
    // current basemap; calling setStyle here would needlessly re-fire 'load'.
    if (firstBasemapRun.current) {
      firstBasemapRun.current = false;
      return;
    }
    let cancelled = false;
    let frame = 0;
    map.setStyle(resolveStyle(state.basemap), { diff: false });

    // MapLibre removes custom sources, images and layers on setStyle. Polling
    // is intentional: style.load is not emitted consistently for an inline,
    // source-free style, while isStyleLoaded() works for every basemap type.
    const restoreLayers = () => {
      if (cancelled || mapRef.current !== map) return;
      if (!map.isStyleLoaded()) {
        frame = requestAnimationFrame(restoreLayers);
        return;
      }
      const current = stateRef.current;
      const geometry = current.geometry
        ? geometryWithMetrics(
            current.geometry,
            metricsRef.current,
            current.dataStatus === "ready",
          )
        : null;
      reprovision(map, geometry, current);
    };
    frame = requestAnimationFrame(restoreLayers);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.basemap]);

  /* Tema berubah: repaint band/ramp/label/outline, dan background offline. */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    syncPaint(map, stateRef.current);
    if (state.basemap !== "offline") return;
    let cancelled = false;
    let frame = 0;
    map.setStyle(offlineStyle(), { diff: false });

    const restoreLayers = () => {
      if (cancelled || mapRef.current !== map) return;
      if (!map.isStyleLoaded()) {
        frame = requestAnimationFrame(restoreLayers);
        return;
      }
      const current = stateRef.current;
      const geometry = current.geometry
        ? geometryWithMetrics(
            current.geometry,
            metricsRef.current,
            current.dataStatus === "ready",
          )
        : null;
      reprovision(map, geometry, current);
    };
    frame = requestAnimationFrame(restoreLayers);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.darkMode]);

  /* ---------- geometry source + layers ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !state.geometry) return;
    addRegionLayers(map, state.geometry, state.darkMode);
    registerInteractions(map, {
      select: (code) => select(code),
      metricsRef,
      stateRef,
      setTooltip,
      hoverRef,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, state.geometry]);

  /* ---------- push metrics into feature properties (data-driven styling) ---------- */
  useEffect(() => {
    const map = mapRef.current;
    const geo = state.geometry;
    if (!map || !mapReady || !geo) return;
    const src = map.getSource(SOURCE_ID) as
      | maplibregl.GeoJSONSource
      | undefined;
    if (!src) return;

    src.setData(geometryWithMetrics(geo, metrics, metricsReady));
    syncPaint(map, state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics, metricsReady, mapReady, state.geometry]);

  /* ---------- paint updates for mode / legend filter / selection ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    syncPaint(map, state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.colorMode, state.legendFilter, state.selectedCode]);

  /* ---------- reset view ---------- */
  useEffect(() => {
    if (state.resetViewToken === 0) return;
    mapRef.current?.fitBounds(
      [
        [94, -11],
        [142, 6.5],
      ],
      { padding: 24, duration: 700 },
    );
  }, [state.resetViewToken]);

  /* ---------- flyTo on selection from search/list ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !state.selectedCode) return;
    // Region lookup is by kode wilayah; geometry names may differ in casing.
    const feature = state.geometry?.features.find(
      (f) => f.properties.kode === state.selectedCode,
    );
    if (!feature) return;
    // Compute bbox on the fly — cheaper than shipping one.
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    const walk = (coords: number[] | number[][] | number[][][]): void => {
      if (typeof coords[0] === "number") {
        // SAFETY: position arrays in GeoJSON Polygon/MultiPolygon coordinates
        // are [lng, lat] number pairs when the first element is a number.
        const [x, y] = coords as unknown as [number, number];
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        return;
      }
      (coords as number[][][] | number[][]).forEach((c) =>
        walk(c as number[][]),
      );
    };
    const geom = feature.geometry;
    if (geom.type === "Polygon") walk(geom.coordinates as number[][][]);
    if (geom.type === "MultiPolygon")
      (geom.coordinates as number[][][][]).forEach((p) =>
        walk(p as number[][][]),
      );
    if (minX !== Infinity) {
      map.fitBounds(
        [
          [minX, minY],
          [maxX, maxY],
        ],
        { padding: 120, maxZoom: 10.5, duration: 900 },
      );
    }
  }, [state.selectedCode, state.geometry, state.pinned]);

  return (
    <div
      className="absolute inset-0"
      aria-label="Peta keterjangkauan Indonesia (choropleth)"
    >
      {/* MapLibre applies position: relative to its container, which overrides
          Tailwind's absolute utility. Size it from the full-screen wrapper
          instead so the WebGL canvas never initializes at zero height. */}
      <div ref={containerRef} className="h-full w-full" />

      {/* Hover tooltip (lightweight; click opens the modal instead) */}
      {tooltip && (
        <div
          role="status"
          className="pointer-events-none absolute z-20 max-w-[240px] rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs shadow-md"
          style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Selected-region quick action: pin without opening modal */}
      {state.selectedCode && metrics.has(state.selectedCode) && (
        <div className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2 md:hidden">
          <button
            type="button"
            onClick={() => pin(state.selectedCode!)}
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-on-accent shadow-lg"
          >
            Pin wilayah ini
          </button>
        </div>
      )}
    </div>
  );
}

/* ============ helpers (module scope, no hooks) ============ */

type AppState = ReturnType<typeof useApp>["state"];
type RegionGeometry = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  RegionFeatureProps
>;

/** Attach live affordability metrics to geometry properties for map styling. */
function geometryWithMetrics(
  geometry: RegionGeometry,
  metrics: Map<string, RegionMetrics>,
  metricsReady: boolean,
): RegionGeometry {
  return {
    type: "FeatureCollection",
    features: geometry.features.map((feature) => {
      const metric = metricsReady
        ? metrics.get(feature.properties.kode)
        : undefined;
      return {
        ...feature,
        properties: {
          ...feature.properties,
          hasData: Boolean(metric),
          band: metric?.band ?? null,
          coverage: metric
            ? Math.round(metric.coveragePercent * 10) / 10
            : null,
          cost: metric?.totalMonthlyCost ?? null,
          wage: metric?.regionalWageAmount ?? null,
        },
      };
    }),
  };
}

/** Re-add custom images + layers after a setStyle (which drops them). */
function reprovision(
  map: MLMap,
  geo: GeoJSON.FeatureCollection<GeoJSON.Geometry, RegionFeatureProps> | null,
  state: AppState,
) {
  if (!map.hasImage(NO_DATA_PATTERN)) {
    map.addImage(
      NO_DATA_PATTERN,
      { width: 8, height: 8, data: makeHatchImage() },
      { pixelRatio: 2 },
    );
  }
  addRegionLayers(map, geo, state.darkMode);
  syncPaint(map, state);
}

function addRegionLayers(
  map: MLMap,
  geo: GeoJSON.FeatureCollection<GeoJSON.Geometry, RegionFeatureProps> | null,
  dark: boolean,
) {
  if (!geo) return;
  const existing = map.getSource(SOURCE_ID) as
    | maplibregl.GeoJSONSource
    | undefined;
  if (existing) {
    // SAFETY: RegionFeatureProps is a superset of what MapLibre stores per
    // feature; property names match the adapter in lib/geometry.ts.
    existing.setData(geo as unknown as GeoJSON.GeoJSON);
    return;
  }
  map.addSource(SOURCE_ID, {
    type: "geojson",
    // SAFETY: same normalisation guarantee as the setData call above.
    data: geo as unknown as GeoJSON.GeoJSON,
    promoteId: "kode",
  });

  // No-data layer: distinct hatch pattern, per success criterion 1.
  map.addLayer({
    id: "regions-nodata",
    type: "fill",
    source: SOURCE_ID,
    filter: ["!", ["to-boolean", ["coalesce", ["get", "hasData"], false]]],
    paint: {
      "fill-pattern": NO_DATA_PATTERN,
      "fill-opacity": 0.7,
    },
  });

  map.addLayer({
    id: "regions-fill",
    type: "fill",
    source: SOURCE_ID,
    filter: ["to-boolean", ["coalesce", ["get", "hasData"], false]],
    paint: {
      "fill-color": coverageFillColor(dark),
      "fill-opacity": 0.78,
    },
  });

  map.addLayer({
    id: "regions-outline",
    type: "line",
    source: SOURCE_ID,
    paint: {
      "line-color": dark ? "rgba(240,236,231,0.16)" : "#5d5f6333",
      "line-width": 0.6,
    },
  });

  // Hover outline (distinct from selection).
  map.addLayer({
    id: "regions-hover",
    type: "line",
    source: SOURCE_ID,
    filter: ["==", ["get", "kode"], ""],
    paint: { "line-color": dark ? "#c9c2b9" : "#5d5f63", "line-width": 2 },
  });

  // Selected outline: accent, thicker.
  map.addLayer({
    id: "regions-selected",
    type: "line",
    source: SOURCE_ID,
    filter: ["==", ["get", "kode"], ""],
    paint: { "line-color": dark ? "#e0704f" : "#c2452d", "line-width": 3 },
  });

  // Labels: data regions always-ish; all regions once zoomed in enough that
  // collisions are rare. Symbol layers place at polygon centroid inherently.
  // Symbol layers need a glyphs URL — the offline style has none, and
  // MapLibre throws if text-field is used without glyphs. Gate on it.
  if (map.getStyle().glyphs) {
    map.addLayer({
      id: "labels-data",
      type: "symbol",
      source: SOURCE_ID,
      filter: ["to-boolean", ["coalesce", ["get", "hasData"], false]],
      minzoom: 4,
      layout: {
        "text-field": ["get", "name"],
        "text-size": 11,
        "text-font": ["Noto Sans Regular"],
        "text-allow-overlap": false,
      },
      paint: labelPaint(dark),
    });

    map.addLayer({
      id: "labels-all",
      type: "symbol",
      source: SOURCE_ID,
      minzoom: 7.5,
      filter: ["!", ["to-boolean", ["coalesce", ["get", "hasData"], false]]],
      layout: {
        "text-field": ["get", "name"],
        "text-size": 10,
        "text-font": ["Noto Sans Regular"],
        "text-allow-overlap": false,
      },
      paint: {
        "text-opacity": 0.75,
        ...labelPaint(dark, true),
      },
    });
  }
}

function syncPaint(map: MLMap, state: AppState) {
  if (!map.getLayer("regions-fill")) return;
  const dark = state.darkMode;

  // Fill color expression depends on color mode.
  let fillColor: unknown;
  if (state.colorMode === "coverage") {
    fillColor = coverageFillColor(dark);
  } else {
    const prop = state.colorMode === "cost" ? "cost" : "wage";
    // Sequential warm ramp, stops derived from the sample value range.
    const ramp = dark ? VALUE_RAMP.dark : VALUE_RAMP.light;
    fillColor = [
      "interpolate",
      ["linear"],
      ["get", prop],
      state.colorMode === "cost" ? 3_000_000 : 2_000_000,
      ramp[0],
      state.colorMode === "cost" ? 5_500_000 : 3_500_000,
      ramp[1],
      state.colorMode === "cost" ? 8_000_000 : 5_500_000,
      ramp[2],
    ];
  }
  map.setPaintProperty(
    "regions-fill",
    "fill-color",
    fillColor as ExpressionSpecification,
  );

  // Legend click-to-filter: dim non-matching regions.
  const filter = state.legendFilter;
  map.setPaintProperty(
    "regions-fill",
    "fill-opacity",
    filter
      ? ([
          "case",
          ["==", ["get", "band"], filter],
          0.85,
          0.12,
        ] as ExpressionSpecification)
      : 0.78,
  );
  if (map.getLayer("regions-nodata")) {
    map.setPaintProperty("regions-nodata", "fill-opacity", filter ? 0.15 : 0.7);
  }

  if (map.getLayer("regions-selected")) {
    map.setFilter("regions-selected", [
      "==",
      ["get", "kode"],
      state.selectedCode ?? "",
    ]);
    map.setPaintProperty(
      "regions-selected",
      "line-color",
      dark ? "#e0704f" : "#c2452d",
    );
  }

  // Label peta mengikuti tema (repaint tanpa setStyle penuh).
  for (const id of ["labels-data", "labels-all"]) {
    if (map.getLayer(id)) {
      // SAFETY: labelPaint mengembalikan string warna CSS + angka, valid untuk
      // paint property text-* MapLibre; union gaya MapLibre tidak bisa
      // di-infer dari objek literal, jadi di-assert sekali di sini.
      const paint = labelPaint(dark, id === "labels-all") as unknown as {
        "text-color": ExpressionSpecification;
        "text-halo-color": ExpressionSpecification;
        "text-halo-width": ExpressionSpecification;
      };
      map.setPaintProperty(id, "text-color", paint["text-color"]);
      map.setPaintProperty(id, "text-halo-color", paint["text-halo-color"]);
      map.setPaintProperty(id, "text-halo-width", paint["text-halo-width"]);
    }
  }
}

function registerInteractions(
  map: MLMap,
  ctx: {
    select: (code: string | null) => void;
    metricsRef: React.RefObject<Map<string, RegionMetrics>>;
    stateRef: React.RefObject<AppState>;
    setTooltip: (t: { x: number; y: number; text: string } | null) => void;
    hoverRef: React.RefObject<string | null>;
  },
) {
  // Guard: interactions registered once per map instance.
  // SAFETY: private registration flag on the Map instance, set once at init.
  const flagged = map as unknown as { __interactions?: boolean };
  if (flagged.__interactions) return;
  flagged.__interactions = true;

  const updateHover = (e: MapMouseEvent) => {
    const feats = map.queryRenderedFeatures(e.point, {
      layers: ["regions-fill", "regions-nodata"],
    });
    const f = feats[0];
    const code = f?.properties?.kode as string | undefined;

    if (ctx.hoverRef.current !== (code ?? null)) {
      ctx.hoverRef.current = code ?? null;
      map.setFilter("regions-hover", ["==", ["get", "kode"], code ?? ""]);
      map.getCanvas().style.cursor = code ? "pointer" : "";
    }

    if (!f) {
      ctx.setTooltip(null);
      return;
    }
    const name = String(f.properties?.name ?? code ?? "Region");
    const m = code ? ctx.metricsRef.current?.get(code) : undefined;
    const dataReady = ctx.stateRef.current?.dataStatus === "ready";

    let text: string;
    if (!dataReady) {
      text = `${name} — memuat data…`;
    } else if (m) {
      const delta = m.surplusOrDeficit >= 0 ? "+" : "−";
      text = `${name} · cakupan ${formatPct(m.coveragePercent)} · ${delta}${formatIDRCompact(Math.abs(m.surplusOrDeficit))}/bln`;
    } else {
      text = `${name} — belum ada data`;
    }
    ctx.setTooltip({ x: e.point.x, y: e.point.y, text });
  };

  map.on("mousemove", "regions-fill", updateHover);
  map.on("mousemove", "regions-nodata", updateHover);
  map.on("mouseleave", "regions-fill", () => {
    ctx.hoverRef.current = null;
    map.setFilter("regions-hover", ["==", ["get", "kode"], ""]);
    ctx.setTooltip(null);
  });
  map.on("mouseleave", "regions-nodata", () => ctx.setTooltip(null));

  map.on("click", (e: MapMouseEvent) => {
    const feats = map.queryRenderedFeatures(e.point, {
      layers: ["regions-fill", "regions-nodata"],
    });
    const code = feats[0]?.properties?.kode as string | undefined;
    ctx.select(code ?? null);
  });
}
