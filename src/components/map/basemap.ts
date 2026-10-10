import type { LayerSpecification, StyleSpecification } from "maplibre-gl";

/**
 * Basemap "kertas": keyless CARTO Positron / Dark Matter (OSM-derived),
 * recoloured into Nafkah's warm palette so the basemap no longer reads
 * cool blue-grey next to the cream UI. Esri imagery for satellite, and a
 * fully local style when there is no network at all.
 *
 * The choropleth is inserted before the country boundary + label layers, so
 * roads and buildings stay under the region colours and labels stay on top.
 */

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

interface PaperPalette {
  land: string;
  water: string;
  waterLine: string;
  waterLabel: string;
  road: string;
  roadCase: string;
  building: string;
  boundary: string;
  countryLabel: string;
  placeLabel: string;
  halo: string;
}

const PAPER_LIGHT: PaperPalette = {
  land: "#ebe6de",
  water: "#f6f3ee",
  waterLine: "#e3ddd2",
  waterLabel: "#b2a99c",
  road: "#f4f0ea",
  roadCase: "#ddd6cb",
  building: "#ddd6cb",
  boundary: "#c9bfb1",
  countryLabel: "#a39a8e",
  placeLabel: "#6f665c",
  halo: "#f6f3ee",
};

const PAPER_DARK: PaperPalette = {
  land: "#2a2520",
  water: "#161310",
  waterLine: "#221e1a",
  waterLabel: "#5f574e",
  road: "#3a332c",
  roadCase: "#2f2924",
  building: "#332d27",
  boundary: "#4a423a",
  countryLabel: "#7d746a",
  placeLabel: "#a39a90",
  halo: "#161310",
};

/** Region layers go right before this layer (labels stay on top). */
export const REGION_LAYER_ANCHOR = "boundary_country_outline";

const HIDE = new Set([
  "landcover",
  "park_national_park",
  "park_nature_reserve",
  "landuse_residential",
  "landuse",
  "boundary_county",
  "water_shadow",
  "aeroway-runway",
  "aeroway-taxiway",
  "place_state",
  "place_city_dot_r2",
  "place_city_dot_r4",
  "place_city_dot_r7",
  "place_city_dot_z7",
  "place_capital_dot_z7",
  "place_city_r5",
  "place_city_r6",
  "place_town",
  "place_continent",
  "poi_stadium",
  "poi_park",
  "housenumber",
]);

function recolor(
  layer: LayerSpecification,
  p: PaperPalette,
): LayerSpecification | null {
  const id = layer.id;
  if (HIDE.has(id)) return null;

  if (layer.type === "background") {
    return { ...layer, paint: { "background-color": p.land } };
  }
  if (id === "water" && layer.type === "fill") {
    return { ...layer, paint: { ...layer.paint, "fill-color": p.water } };
  }
  if (id === "waterway" && layer.type === "line") {
    return { ...layer, paint: { ...layer.paint, "line-color": p.waterLine } };
  }
  if (id === "boundary_state" && layer.type === "line") {
    return {
      ...layer,
      paint: { ...layer.paint, "line-color": p.boundary, "line-opacity": 0.55 },
    };
  }
  if (id.startsWith("boundary_country") && layer.type === "line") {
    return { ...layer, paint: { ...layer.paint, "line-color": p.boundary } };
  }
  if (/^(tunnel|road|bridge|rail)/.test(id) && layer.type === "line") {
    const isCase = /_case|rail/.test(id);
    return {
      ...layer,
      paint: {
        ...layer.paint,
        "line-color": isCase ? p.roadCase : p.road,
      },
    };
  }
  if (id.startsWith("building") && layer.type === "fill") {
    return { ...layer, paint: { ...layer.paint, "fill-color": p.building } };
  }
  if (layer.type === "symbol") {
    const isWater = id.startsWith("water");
    const isCountry = id.startsWith("place_country");
    // The choropleth already says "Indonesia"; its country label would sit
    // on top of the data, so only neighbours keep theirs.
    const filter =
      isCountry && Array.isArray(layer.filter) && layer.filter[0] === "all"
        ? ([
            ...layer.filter,
            ["!=", "name_en", "Indonesia"],
          ] as unknown as typeof layer.filter)
        : layer.filter;
    return {
      ...layer,
      filter,
      paint: {
        ...layer.paint,
        "text-color": isWater
          ? p.waterLabel
          : isCountry
            ? p.countryLabel
            : p.placeLabel,
        "text-halo-color": p.halo,
        "text-halo-width": 1.2,
      },
    };
  }
  return layer;
}

/** Turn a CARTO Positron/Dark Matter style into the warm paper treatment. */
export function toPaperStyle(
  base: StyleSpecification,
  dark: boolean,
): StyleSpecification {
  const palette = dark ? PAPER_DARK : PAPER_LIGHT;
  const layers = base.layers
    .map((layer) => recolor(layer, palette))
    .filter((layer): layer is LayerSpecification => layer !== null);
  return { ...base, name: dark ? "Nafkah paper dark" : "Nafkah paper", layers };
}

/** Fully local style: works with no tile servers at all. */
export function flatStyle(dark: boolean): StyleSpecification {
  return {
    version: 8,
    name: "Nafkah offline",
    sources: {},
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": dark ? PAPER_DARK.water : PAPER_LIGHT.water,
        },
      },
    ],
  };
}

const styleCache = new Map<string, Promise<StyleSpecification>>();

/**
 * Resolve the app's basemap id into a concrete style object. Remote CARTO
 * styles are fetched once and recoloured; any failure falls back to the flat
 * local style so the choropleth still renders offline.
 */
export function resolveBasemapStyle(
  basemap: string,
  dark: boolean,
): Promise<StyleSpecification> {
  if (basemap === "offline") return Promise.resolve(flatStyle(dark));
  if (basemap === "satellite") {
    // SAFETY: BASEMAPS.satellite is declared inline as a StyleSpecification.
    return Promise.resolve(BASEMAPS.satellite as StyleSpecification);
  }
  const key = dark ? "dark" : "light";
  let cached = styleCache.get(key);
  if (!cached) {
    const url = BASEMAPS[key] as string;
    cached = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Basemap HTTP ${res.status}`);
        return res.json() as Promise<StyleSpecification>;
      })
      .then((style) => toPaperStyle(style, dark))
      .catch(() => {
        styleCache.delete(key);
        return flatStyle(dark);
      });
    styleCache.set(key, cached);
  }
  return cached;
}
