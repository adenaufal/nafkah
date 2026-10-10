import type { Feature, Geometry, Position } from "geojson";

/** [[west, south], [east, north]] — the shape MapLibre's fitBounds takes. */
export type Bounds = [[number, number], [number, number]];

/** Indonesia with a little sea around it. */
export const INDONESIA_BOUNDS: Bounds = [
  [94.8, -11.2],
  [141.2, 6.2],
];

const boundsCache = new WeakMap<Geometry, Bounds | null>();

export function geometryBounds(geometry: Geometry): Bounds | null {
  const cached = boundsCache.get(geometry);
  if (cached !== undefined) return cached;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const walk = (coords: unknown): void => {
    if (!Array.isArray(coords)) return;
    if (typeof coords[0] === "number") {
      const [x, y] = coords as Position;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      return;
    }
    coords.forEach(walk);
  };
  if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
    walk(geometry.coordinates);
  }
  const bounds: Bounds | null =
    minX === Infinity
      ? null
      : [
          [minX, minY],
          [maxX, maxY],
        ];
  boundsCache.set(geometry, bounds);
  return bounds;
}

export function mergeBounds(list: readonly (Bounds | null)[]): Bounds | null {
  let out: Bounds | null = null;
  for (const b of list) {
    if (!b) continue;
    out = out
      ? [
          [Math.min(out[0][0], b[0][0]), Math.min(out[0][1], b[0][1])],
          [Math.max(out[1][0], b[1][0]), Math.max(out[1][1], b[1][1])],
        ]
      : b;
  }
  return out;
}

/** Even-odd ray cast against one linear ring. */
function inRing(x: number, y: number, ring: Position[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function inPolygon(x: number, y: number, rings: Position[][]): boolean {
  if (!rings.length || !inRing(x, y, rings[0])) return false;
  // Later rings are holes (lakes, enclaves).
  return !rings.slice(1).some((hole) => inRing(x, y, hole));
}

export function pointInGeometry(
  lng: number,
  lat: number,
  geometry: Geometry,
): boolean {
  if (geometry.type === "Polygon")
    return inPolygon(lng, lat, geometry.coordinates);
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.some((poly) => inPolygon(lng, lat, poly));
  }
  return false;
}

/** First feature whose polygon contains the point (bbox pre-filtered). */
export function findFeatureAt<P>(
  lng: number,
  lat: number,
  features: readonly Feature<Geometry, P>[],
): Feature<Geometry, P> | undefined {
  return features.find((f) => {
    const b = geometryBounds(f.geometry);
    if (
      !b ||
      lng < b[0][0] ||
      lng > b[1][0] ||
      lat < b[0][1] ||
      lat > b[1][1]
    ) {
      return false;
    }
    return pointInGeometry(lng, lat, f.geometry);
  });
}
