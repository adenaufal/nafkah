import { merge, mesh } from "topojson-client";
import type {
  GeometryCollection,
  GeometryObject,
  MultiPolygon,
  Polygon,
  Topology,
} from "topojson-specification";
import { regionCodeOf } from "./geometry";

/**
 * Static SVG maps for print (the booklet). The shipped TopoJSON is projected
 * with Web Mercator — the projection the live map uses — and every arc is
 * simplified once, before polygons are assembled, so neighbours that share
 * a border still share it exactly: no gaps, no slivers. Paths use relative
 * commands on an integer grid to keep the inline SVG small.
 */

export type Point = [number, number];

/** Delta-decode quantized arcs into absolute [lng, lat] positions. */
export function decodeArcs(topology: Topology): Point[][] {
  const t = topology.transform;
  return topology.arcs.map((arc) => {
    if (!t) return arc.map(([x, y]) => [x, y] as Point);
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [
        x * t.scale[0] + t.translate[0],
        y * t.scale[1] + t.translate[1],
      ] as Point;
    });
  });
}

const RAD = Math.PI / 180;

/** Web Mercator in radians: x = λ, y = ln tan(π/4 + φ/2). */
function mercator([lng, lat]: Point): Point {
  return [lng * RAD, Math.log(Math.tan(Math.PI / 4 + (lat * RAD) / 2))];
}

export interface MapFrame {
  width: number;
  height: number;
  /** [lng, lat] → SVG user units (y grows downward). */
  project: (lngLat: Point) => Point;
}

/** Mercator scaled so the given positions span exactly `width` units. */
export function fitMercator(positions: Iterable<Point>, width: number): MapFrame {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of positions) {
    const [x, y] = mercator(p);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const k = width / (maxX - minX);
  return {
    width,
    height: Math.ceil((maxY - minY) * k),
    project: (p) => {
      const [x, y] = mercator(p);
      return [(x - minX) * k, (maxY - y) * k];
    },
  };
}

/**
 * Douglas–Peucker. Both ends always stay, so arcs still meet at their
 * junctions after simplification.
 */
export function simplify(points: readonly Point[], tolerance: number): Point[] {
  if (points.length <= 2) return [...points];
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const t2 = tolerance * tolerance;
  const stack: [number, number][] = [[0, points.length - 1]];
  while (stack.length) {
    const [i, j] = stack.pop()!;
    const [ax, ay] = points[i];
    const [bx, by] = points[j];
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    let far = -1;
    let farD = t2;
    for (let m = i + 1; m < j; m++) {
      const [px, py] = points[m];
      // A closed arc (island) starts and ends on the same point.
      const t =
        len2 === 0
          ? 0
          : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
      const d2 = (px - ax - t * dx) ** 2 + (py - ay - t * dy) ** 2;
      if (d2 > farD) {
        farD = d2;
        far = m;
      }
    }
    if (far > 0) {
      keep[far] = 1;
      stack.push([i, far], [far, j]);
    }
  }
  return points.filter((_, i) => keep[i] === 1);
}

/** Shoelace area of a ring, in square units. */
export function ringArea(ring: readonly Point[]): number {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  }
  return Math.abs(a) / 2;
}

/** "M12 40l3-2 4 0…" — one absolute move, then rounded relative steps. */
function polyline(points: readonly Point[]): string {
  let px = Math.round(points[0][0]);
  let py = Math.round(points[0][1]);
  let out = `M${px} ${py}`;
  let first = true;
  for (let i = 1; i < points.length; i++) {
    const x = Math.round(points[i][0]);
    const y = Math.round(points[i][1]);
    const dx = x - px;
    const dy = y - py;
    if (dx === 0 && dy === 0) continue;
    out += `${first ? "l" : dx < 0 ? "" : " "}${dx}${dy < 0 ? "" : " "}${dy}`;
    first = false;
    px = x;
    py = y;
  }
  return out;
}

/** Closed rings → path data. Rings under `minArea` square units are left out. */
export function ringsPath(rings: readonly Point[][], minArea = 0): string {
  let out = "";
  for (const ring of rings) {
    if (ring.length < 4 || ringArea(ring) < minArea) continue;
    out += `${polyline(ring)}z`;
  }
  return out;
}

/** Open lines → path data. */
export function linesPath(lines: readonly Point[][]): string {
  return lines
    .filter((line) => line.length > 1)
    .map(polyline)
    .join("");
}

type RegionProps = { adm1_pcode?: string; adm2_pcode?: string };
type RegionGeometry = (Polygon<RegionProps> | MultiPolygon<RegionProps>) &
  GeometryObject<RegionProps>;

export interface PreparedMap extends MapFrame {
  topology: Topology;
  /** Kabupaten/kota polygons keyed by kode wilayah. */
  regions: Map<string, RegionGeometry>;
  collection: GeometryCollection<RegionProps>;
}

/**
 * Project and simplify a boundary topology once; any number of maps can
 * then be drawn from it. `tolerance` is in output units (≈ the largest
 * shift a simplified border may make).
 */
export function prepareMap(
  source: Topology,
  { width, tolerance }: { width: number; tolerance: number },
): PreparedMap {
  const arcs = decodeArcs(source);
  const frame = fitMercator(
    (function* () {
      for (const arc of arcs) yield* arc;
    })(),
    width,
  );
  const projected = arcs.map((arc) => simplify(arc.map(frame.project), tolerance));
  const name = Object.keys(source.objects)[0];
  const collection = source.objects[name] as GeometryCollection<RegionProps>;
  const regions = new Map<string, RegionGeometry>();
  for (const g of collection.geometries) {
    if (g.type !== "Polygon" && g.type !== "MultiPolygon") continue;
    const code = regionCodeOf(g.properties);
    if (code) regions.set(code, g as RegionGeometry);
  }
  return {
    ...frame,
    // No transform: the arcs are now absolute, projected positions.
    topology: { type: "Topology", objects: source.objects, arcs: projected },
    regions,
    collection,
  };
}

/**
 * Regions grouped by a class (a band, say), each group merged into one
 * path: shared borders inside a group disappear, so the SVG holds each
 * coastline and class edge once. Regions whose class is null are skipped.
 */
export function classPaths<K extends string>(
  map: PreparedMap,
  classOf: (code: string) => K | null,
  minArea = 0,
): Partial<Record<K, string>> {
  const groups = new Map<K, RegionGeometry[]>();
  for (const [code, geometry] of map.regions) {
    const key = classOf(code);
    if (key === null) continue;
    const list = groups.get(key);
    if (list) list.push(geometry);
    else groups.set(key, [geometry]);
  }
  const out: Partial<Record<K, string>> = {};
  for (const [key, list] of groups) {
    const merged = merge(map.topology, list);
    out[key] = ringsPath(merged.coordinates.flat() as Point[][], minArea);
  }
  return out;
}

/** Every border between two kabupaten/kota, and the subset between provinces. */
export function borderPaths(map: PreparedMap): {
  regions: string;
  provinces: string;
} {
  const props = (g: GeometryObject) => (g.properties ?? {}) as RegionProps;
  const isRegion = (g: GeometryObject) => regionCodeOf(props(g)) !== null;
  const inner = mesh(
    map.topology,
    map.collection,
    (a, b) => a !== b && isRegion(a) && isRegion(b),
  );
  const provinces = mesh(
    map.topology,
    map.collection,
    (a, b) =>
      a !== b &&
      isRegion(a) &&
      isRegion(b) &&
      props(a).adm1_pcode !== props(b).adm1_pcode,
  );
  return {
    regions: linesPath(inner.coordinates as Point[][]),
    provinces: linesPath(provinces.coordinates as Point[][]),
  };
}
