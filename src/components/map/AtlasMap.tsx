"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, {
  type ExpressionSpecification,
  type Map as MLMap,
  type MapMouseEvent,
  type StyleSpecification,
} from "maplibre-gl";
import { useApp } from "@/state/AppContext";
import { NO_DATA_PATTERN, VALUE_RAMP, bandColors } from "@/lib/calculations";
import type { Region, RegionFeatureProps, RegionMetrics } from "@/lib/types";
import { type Bounds, INDONESIA_BOUNDS, geometryBounds } from "@/lib/geo";
import { valueStops } from "@/lib/insights";
import { REGION_LAYER_ANCHOR, flatStyle, resolveBasemapStyle } from "./basemap";

/**
 * MapLibre choropleth of the 514 regions.
 *  - Warm "paper" basemap (see basemap.ts); regions draw under its labels.
 *  - Live numbers travel as feature-state, so recolouring every region on an
 *    assumption change needs no setData — fast enough for a dragged slider.
 *  - Hover and click are lifted to the shell for tooltips and linked
 *    highlighting between the rail, the dot plot and the map.
 *  - The camera honours padding for the rail and sheets, so a selected
 *    region is never framed underneath them.
 */

export interface MapApi {
  zoomIn: () => void;
  zoomOut: () => void;
  fitIndonesia: () => void;
  fitBounds: (bounds: Bounds) => void;
}

export interface MapMarker {
  code: string;
  label: string;
}

interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface AtlasMapProps {
  padding?: Partial<Padding>;
  /** Region highlighted from outside the map (list row, dot, table row). */
  hoverCode?: string | null;
  onHover?: (hover: { code: string; x: number; y: number } | null) => void;
  /** Dim every other region while one is selected (focus + context). */
  dimUnselected?: boolean;
  /** Regions pushed to the background (e.g. filtered out of a table). */
  dimCodes?: ReadonlySet<string> | null;
  /** Region labels: names from zoom ~5.6, selected/hovered always. */
  labels?: boolean;
  fillOpacity?: number;
  markers?: MapMarker[];
  onReady?: (api: MapApi) => void;
  /** Click on a region (or the sea, with null). Defaults to selecting it. */
  onSelect?: (code: string | null) => void;
}

const SOURCE_ID = "regions";
/** One point per region for its name (polygon labels repeat on every part). */
const LABEL_SOURCE = "region-labels";
const INDONESIA = INDONESIA_BOUNDS;
const INK_LIGHT = "#1e1b18";
const INK_DARK = "#f0ece7";

type AppState = ReturnType<typeof useApp>["state"];
type RegionGeometry = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  RegionFeatureProps
>;

interface Live {
  state: AppState;
  metrics: Map<string, RegionMetrics>;
  metricsReady: boolean;
  regionByCode: Map<string, Region>;
  hoverCode: string | null;
  dimUnselected: boolean;
  dimCodes: ReadonlySet<string> | null;
  fillOpacity: number;
  labels: boolean;
  onHover?: AtlasMapProps["onHover"];
  select: (code: string | null) => void;
}

export default function AtlasMap({
  padding,
  hoverCode = null,
  onHover,
  dimUnselected = false,
  dimCodes = null,
  labels = true,
  fillOpacity = 0.9,
  markers = [],
  onReady,
  onSelect,
}: AtlasMapProps) {
  const { state, metrics, metricsReady, regionByCode, select } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const readyRef = useRef(false);
  const [loaded, setLoaded] = useState(false);

  const live = useRef<Live>(null as unknown as Live);
  live.current = {
    state,
    metrics,
    metricsReady,
    regionByCode,
    hoverCode,
    dimUnselected,
    dimCodes,
    fillOpacity,
    labels,
    onHover,
    select: onSelect ?? select,
  };

  const pad: Padding = {
    top: padding?.top ?? 0,
    right: padding?.right ?? 0,
    bottom: padding?.bottom ?? 0,
    left: padding?.left ?? 0,
  };
  const padRef = useRef(pad);
  padRef.current = pad;

  /* ---------- init ---------- */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let disposed = false;
    const container = containerRef.current;
    const initial = live.current.state;

    const create = (style: StyleSpecification) => {
      if (disposed) return;
      const map = new maplibregl.Map({
        container,
        style,
        bounds: INDONESIA,
        fitBoundsOptions: { padding: 20 },
        attributionControl: { compact: true },
        maxZoom: 12,
        // MapLibre's own labels for its canvas and controls, in Indonesian.
        locale: {
          "Map.Title": "Peta keterjangkauan 514 kabupaten/kota",
          "AttributionControl.ToggleAttribution": "Tampilkan sumber peta",
          "AttributionControl.MapFeedback": "Masukan peta",
          "Marker.Title": "Penanda",
        },
        // Low enough that a 320px phone can frame all of Indonesia.
        minZoom: 1.5,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
      });
      map.touchZoomRotate.disableRotation();
      mapRef.current = map;
      // The rail/sheet padding lives on the camera itself: fitBounds adds
      // its own padding on top, so every fit below passes only a margin.
      map.setPadding(padRef.current);
      map.fitBounds(INDONESIA, { padding: 20, animate: false });

      // Paint the (local) choropleth as soon as the style is parsed; the
      // basemap tiles can keep streaming in underneath.
      const start = () => {
        if (readyRef.current || disposed) return;
        provision(map, live.current);
        readyRef.current = true;
        setLoaded(true);
        container.dataset.ready = "true";
        registerInteractions(map, live);
        onReady?.({
          zoomIn: () => map.zoomIn({ duration: 250 }),
          zoomOut: () => map.zoomOut({ duration: 250 }),
          fitIndonesia: () =>
            map.fitBounds(INDONESIA, {
              padding: 20,
              duration: 700,
            }),
          fitBounds: (bounds) =>
            map.fitBounds(bounds, {
              padding: 40,
              maxZoom: 8,
              duration: 800,
            }),
        });
      };
      map.once("style.load", start);
      map.once("load", () => {
        start();
        // Compact attribution starts collapsed: an (i) button, not a banner.
        container
          .querySelector(".maplibregl-ctrl-attrib")
          ?.classList.remove("maplibregl-compact-show");
      });
    };

    // Wait briefly for the warm style; never block the map on the network.
    const timeout = new Promise<StyleSpecification>((resolve) =>
      setTimeout(() => resolve(flatStyle(initial.darkMode)), 2500),
    );
    void Promise.race([
      resolveBasemapStyle(
        navigator.onLine ? initial.basemap : "offline",
        initial.darkMode,
      ),
      timeout,
    ]).then(create);

    const ro = new ResizeObserver(() => mapRef.current?.resize());
    ro.observe(container);

    return () => {
      disposed = true;
      ro.disconnect();
      readyRef.current = false;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- basemap / theme ---------- */
  const firstStyle = useRef(true);
  useEffect(() => {
    if (firstStyle.current) {
      firstStyle.current = false;
      return;
    }
    let cancelled = false;
    let frame = 0;
    void resolveBasemapStyle(state.basemap, state.darkMode).then((style) => {
      const map = mapRef.current;
      if (cancelled || !map) return;
      readyRef.current = false;
      map.setStyle(style, { diff: false });
      const restore = () => {
        if (cancelled || mapRef.current !== map) return;
        if (!map.isStyleLoaded()) {
          frame = requestAnimationFrame(restore);
          return;
        }
        provision(map, live.current);
        readyRef.current = true;
      };
      frame = requestAnimationFrame(restore);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [state.basemap, state.darkMode]);

  /* ---------- geometry / which regions have data ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    provision(map, live.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.geometry, metricsReady, loaded]);

  /* ---------- metrics → feature-state (cheap, every assumption change) ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    pushStates(map, live.current);
    // Cost/wage ramps follow the distribution, so their stops move too.
    if (live.current.state.colorMode !== "coverage")
      syncPaint(map, live.current);
  }, [metrics, dimCodes, loaded]);

  /* ---------- paint ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    syncPaint(map, live.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.colorMode,
    state.legendFilter,
    state.selectedCode,
    hoverCode,
    dimUnselected,
    fillOpacity,
    labels,
    loaded,
  ]);

  /* ---------- camera padding (rails, sheets) ---------- */
  useEffect(() => {
    mapRef.current?.easeTo({ padding: pad, duration: 300 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pad.top, pad.right, pad.bottom, pad.left]);

  /* ---------- fly to selection ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !state.selectedCode || !state.geometry) return;
    const feature = state.geometry.features.find(
      (f) => f.properties.kode === state.selectedCode,
    );
    const box = feature ? geometryBounds(feature.geometry) : null;
    if (!box) return;
    map.fitBounds(box, {
      padding: 56,
      maxZoom: 8.4,
      duration: 900,
    });
  }, [state.selectedCode, state.geometry, loaded]);

  /* ---------- reset view ---------- */
  useEffect(() => {
    if (state.resetViewToken === 0) return;
    mapRef.current?.fitBounds(INDONESIA, {
      padding: 20,
      duration: 700,
    });
  }, [state.resetViewToken]);

  /* ---------- markers (pins) ---------- */
  const markerKey = markers.map((m) => `${m.code}:${m.label}`).join("|");
  useEffect(() => {
    const map = mapRef.current;
    if (!map || markers.length === 0) return;
    const made = markers.flatMap((m) => {
      const region = regionByCode.get(m.code);
      if (!region) return [];
      const el = document.createElement("div");
      el.className = "map-pin";
      el.textContent = m.label;
      el.setAttribute("aria-hidden", "true");
      return [
        new maplibregl.Marker({ element: el })
          .setLngLat(region.centroid)
          .addTo(map),
      ];
    });
    return () => made.forEach((mk) => mk.remove());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerKey, regionByCode, loaded]);

  return (
    // The shell's <section aria-label="Peta"> is the landmark; MapLibre
    // labels the canvas itself.
    <div className="absolute inset-0">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}

/* ================= helpers ================= */

/** Static per-feature properties; live numbers travel as feature-state. */
function staticGeometry(live: Live): RegionGeometry | null {
  const geo = live.state.geometry;
  if (!geo) return null;
  return {
    type: "FeatureCollection",
    features: geo.features.map((f) => {
      const tier =
        live.regionByCode.get(f.properties.kode)?.tier ?? "kabupaten";
      return {
        ...f,
        properties: {
          ...f.properties,
          hasData: live.metricsReady && live.state.costs.has(f.properties.kode),
          tier,
          rank: tier === "kota" ? 0 : 1,
        },
      };
    }),
  };
}

/**
 * Label anchors: each region's centroid from the dataset, so a region with
 * islands or an exclave still gets exactly one name on the map.
 */
function labelPoints(live: Live): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: "FeatureCollection",
    features: [...live.regionByCode.values()].map((r) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: r.centroid },
      properties: {
        kode: r.code,
        name: r.name,
        rank: r.tier === "kota" ? 0 : 1,
        hasData: live.metricsReady && live.state.costs.has(r.code),
      },
    })),
  };
}

function pushStates(map: MLMap, live: Live) {
  if (!map.getSource(SOURCE_ID) || !live.state.geometry) return;
  for (const f of live.state.geometry.features) {
    const code = f.properties.kode;
    const m = live.metricsReady ? live.metrics.get(code) : undefined;
    map.setFeatureState(
      { source: SOURCE_ID, id: code },
      {
        band: m?.band ?? "none",
        cost: m?.totalMonthlyCost ?? 0,
        wage: m?.regionalWageAmount ?? 0,
        dim: live.dimCodes ? live.dimCodes.has(code) : false,
      },
    );
  }
}

function hatch(): Uint8Array {
  const s = 8;
  const data = new Uint8Array(s * s * 4);
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const i = (y * s + x) * 4;
      const on = (x + y) % s < 2;
      data[i] = data[i + 1] = data[i + 2] = 120;
      data[i + 3] = on ? 90 : 26;
    }
  }
  return data;
}

function provision(map: MLMap, live: Live) {
  const geo = staticGeometry(live);
  if (!geo) return;
  if (!map.hasImage(NO_DATA_PATTERN)) {
    map.addImage(
      NO_DATA_PATTERN,
      { width: 8, height: 8, data: hatch() },
      { pixelRatio: 2 },
    );
  }
  const existing = map.getSource(SOURCE_ID) as
    maplibregl.GeoJSONSource | undefined;
  if (existing) {
    // SAFETY: RegionFeatureProps is a superset of what MapLibre stores per feature.
    existing.setData(geo as unknown as GeoJSON.GeoJSON);
    (
      map.getSource(LABEL_SOURCE) as maplibregl.GeoJSONSource | undefined
    )?.setData(labelPoints(live));
    pushStates(map, live);
    syncPaint(map, live);
    return;
  }
  map.addSource(SOURCE_ID, {
    type: "geojson",
    // SAFETY: same normalisation guarantee as setData above.
    data: geo as unknown as GeoJSON.GeoJSON,
    promoteId: "kode",
    // Less simplification at low zoom: shapes stay recognisable while the
    // camera flies in, instead of turning blocky for a moment.
    tolerance: 0.2,
  });
  map.addSource(LABEL_SOURCE, { type: "geojson", data: labelPoints(live) });
  const before = map.getLayer(REGION_LAYER_ANCHOR)
    ? REGION_LAYER_ANCHOR
    : undefined;
  const dark = live.state.darkMode;
  const hasData: ExpressionSpecification = [
    "to-boolean",
    ["coalesce", ["get", "hasData"], false],
  ];
  const none: ExpressionSpecification = ["==", ["get", "kode"], ""];

  map.addLayer(
    {
      id: "nafkah-nodata",
      type: "fill",
      source: SOURCE_ID,
      filter: ["!", hasData],
      paint: { "fill-pattern": NO_DATA_PATTERN, "fill-opacity": 0.7 },
    },
    before,
  );
  map.addLayer(
    {
      id: "nafkah-fill",
      type: "fill",
      source: SOURCE_ID,
      filter: hasData,
      paint: { "fill-color": "#ccc", "fill-opacity": live.fillOpacity },
    },
    before,
  );
  map.addLayer(
    {
      id: "nafkah-outline",
      type: "line",
      source: SOURCE_ID,
      paint: {
        "line-color": dark ? "rgba(22,19,16,0.75)" : "rgba(255,255,255,0.8)",
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          4,
          0.3,
          7,
          0.9,
          10,
          1.4,
        ],
      },
    },
    before,
  );
  map.addLayer(
    {
      id: "nafkah-hover",
      type: "line",
      source: SOURCE_ID,
      filter: none,
      paint: { "line-color": dark ? INK_DARK : INK_LIGHT, "line-width": 1.5 },
    },
    before,
  );
  map.addLayer(
    {
      id: "nafkah-selected-halo",
      type: "line",
      source: SOURCE_ID,
      filter: none,
      paint: {
        "line-color": dark ? "#161310" : "#ffffff",
        "line-width": 6,
        "line-opacity": 0.95,
      },
    },
    before,
  );
  map.addLayer(
    {
      id: "nafkah-selected",
      type: "line",
      source: SOURCE_ID,
      filter: none,
      paint: { "line-color": dark ? INK_DARK : INK_LIGHT, "line-width": 2.2 },
    },
    before,
  );

  const glyphs = map.getStyle().glyphs ?? "";
  if (glyphs) {
    const carto = glyphs.includes("cartocdn");
    const regular = carto
      ? ["Montserrat Regular", "Open Sans Regular"]
      : ["Noto Sans Regular"];
    const medium = carto
      ? ["Montserrat Medium", "Open Sans Bold"]
      : ["Noto Sans Regular"];
    map.addLayer({
      id: "nafkah-labels",
      type: "symbol",
      source: LABEL_SOURCE,
      minzoom: 5.6,
      filter: hasData,
      layout: {
        "text-field": ["get", "name"],
        "text-font": regular,
        "text-size": ["interpolate", ["linear"], ["zoom"], 5.6, 10, 9, 13],
        "text-max-width": 7,
        "symbol-sort-key": ["get", "rank"],
        "text-padding": 6,
      },
      paint: labelPaint(dark, false),
    });
    // Always shown, and it reserves its space: neighbouring names that
    // would collide with it are dropped instead of printed on top.
    map.addLayer({
      id: "nafkah-label-focus",
      type: "symbol",
      source: LABEL_SOURCE,
      filter: none,
      layout: {
        "text-field": ["get", "name"],
        "text-font": medium,
        "text-size": 13,
        "text-allow-overlap": true,
        "text-ignore-placement": false,
        "text-max-width": 8,
      },
      paint: labelPaint(dark, true),
    });
  }
  pushStates(map, live);
  syncPaint(map, live);
}

function labelPaint(dark: boolean, strong: boolean) {
  return dark
    ? {
        "text-color": strong ? "#fbf7f2" : "rgba(240,236,231,0.86)",
        "text-halo-color": "rgba(22,19,16,0.92)",
        "text-halo-width": strong ? 1.8 : 1.3,
      }
    : {
        "text-color": strong ? "#16130f" : "#2b2622",
        "text-halo-color": "rgba(255,255,255,0.92)",
        "text-halo-width": strong ? 1.8 : 1.3,
      };
}

/** Same percentile stops the legend shows (see valueStops). */
function colorStops(live: Pick<Live, "state" | "metrics" | "metricsReady">) {
  if (!live.metricsReady) return valueStops([]);
  const values = [...live.metrics.values()].map((m) =>
    live.state.colorMode === "cost" ? m.totalMonthlyCost : m.regionalWageAmount,
  );
  return valueStops(values);
}

function syncPaint(map: MLMap, live: Live) {
  if (!map.getLayer("nafkah-fill")) return;
  const { state } = live;
  const dark = state.darkMode;

  let fillColor: unknown;
  if (state.colorMode === "coverage") {
    const c = bandColors(dark);
    fillColor = [
      "match",
      ["feature-state", "band"],
      "comfortable",
      c.comfortable,
      "manageable",
      c.manageable,
      "tight",
      c.tight,
      "insufficient",
      c.insufficient,
      dark ? "#3a332c" : "#d8d1c6",
    ];
  } else {
    const prop = state.colorMode === "cost" ? "cost" : "wage";
    const ramp = dark ? VALUE_RAMP.dark : VALUE_RAMP.light;
    const [a, b, d] = colorStops(live);
    fillColor = [
      "interpolate",
      ["linear"],
      ["number", ["feature-state", prop], 0],
      a,
      ramp[0],
      b,
      ramp[1],
      d,
      ramp[2],
    ];
  }
  map.setPaintProperty(
    "nafkah-fill",
    "fill-color",
    fillColor as ExpressionSpecification,
  );

  const sel = state.selectedCode;
  const filter = state.legendFilter;
  const base = live.fillOpacity;
  const isSel: ExpressionSpecification = ["==", ["get", "kode"], sel ?? ""];
  const dimmed: ExpressionSpecification = [
    "boolean",
    ["feature-state", "dim"],
    false,
  ];
  const inBand: ExpressionSpecification = [
    "==",
    ["feature-state", "band"],
    filter ?? "",
  ];
  // Focus + context: neighbours stay legible, the selection carries the ink.
  const rest = sel && live.dimUnselected ? base * 0.75 : base;
  const opacity: ExpressionSpecification = [
    "case",
    isSel,
    base,
    dimmed,
    0.1,
    ...(filter ? ([["!", inBand], 0.1] as const) : []),
    rest,
  ] as unknown as ExpressionSpecification;
  map.setPaintProperty("nafkah-fill", "fill-opacity", opacity);

  const pick = (code: string | null): ExpressionSpecification => [
    "==",
    ["get", "kode"],
    code ?? "",
  ];
  map.setFilter("nafkah-hover", pick(live.hoverCode));
  map.setFilter("nafkah-selected", pick(sel));
  map.setFilter("nafkah-selected-halo", pick(sel));
  if (map.getLayer("nafkah-label-focus"))
    map.setFilter("nafkah-label-focus", pick(sel ?? live.hoverCode));
  if (map.getLayer("nafkah-labels")) {
    // The focused region's name is drawn by the focus layer; don't repeat it.
    map.setFilter("nafkah-labels", [
      "all",
      ["to-boolean", ["coalesce", ["get", "hasData"], false]],
      ["!=", ["get", "kode"], sel ?? live.hoverCode ?? ""],
    ]);
    map.setLayoutProperty(
      "nafkah-labels",
      "visibility",
      live.labels ? "visible" : "none",
    );
  }
}

function registerInteractions(map: MLMap, liveRef: { current: Live }) {
  // SAFETY: private registration flag on the Map instance, set once at init.
  const flagged = map as unknown as { __nafkahInteractions?: boolean };
  if (flagged.__nafkahInteractions) return;
  flagged.__nafkahInteractions = true;

  let last: string | null = null;
  const onMove = (e: MapMouseEvent) => {
    if (!map.getLayer("nafkah-fill")) return;
    const f = map.queryRenderedFeatures(e.point, {
      layers: ["nafkah-fill", "nafkah-nodata"],
    })[0];
    const code = (f?.properties?.kode as string | undefined) ?? null;
    if (code !== last) {
      last = code;
      map.getCanvas().style.cursor = code ? "pointer" : "";
    }
    liveRef.current.onHover?.(
      code ? { code, x: e.point.x, y: e.point.y } : null,
    );
  };
  map.on("mousemove", onMove);
  map.on("mouseout", () => {
    last = null;
    liveRef.current.onHover?.(null);
  });
  map.on("click", (e: MapMouseEvent) => {
    if (!map.getLayer("nafkah-fill")) return;
    const f = map.queryRenderedFeatures(e.point, {
      layers: ["nafkah-fill", "nafkah-nodata"],
    })[0];
    liveRef.current.select((f?.properties?.kode as string | undefined) ?? null);
  });
}
