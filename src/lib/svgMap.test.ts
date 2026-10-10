import { describe, expect, it } from "vitest";
import type { Topology } from "topojson-specification";
import {
  borderPaths,
  classPaths,
  decodeArcs,
  fitMercator,
  prepareMap,
  ringArea,
  ringsPath,
  simplify,
  type Point,
} from "./svgMap";

/*
 * Three 1°×1° kabupaten in a row (A and B in province 11, C in 12) and a
 * lake east of C that carries a non-administrative .88 code. All rings run
 * clockwise and shared arcs are used once in each direction, as TopoJSON
 * writes them.
 */
const TOPOLOGY = {
  type: "Topology",
  arcs: [
    [[101, 1], [101, 0]], // 0: A | B
    [[101, 0], [100, 0], [100, 1], [101, 1]], // 1: A outside
    [[102, 1], [102, 0]], // 2: B | C
    [[101, 1], [102, 1]], // 3: B top
    [[102, 0], [101, 0]], // 4: B bottom
    [[103, 1], [103, 0]], // 5: C | lake
    [[102, 1], [103, 1]], // 6: C top
    [[103, 0], [102, 0]], // 7: C bottom
    [[103, 1], [104, 1], [104, 0], [103, 0]], // 8: lake outside
  ],
  objects: {
    idn_admin2: {
      type: "GeometryCollection",
      geometries: [
        { type: "Polygon", arcs: [[1, 0]], properties: { adm2_pcode: "ID1101", adm1_pcode: "ID11" } },
        { type: "Polygon", arcs: [[-1, 3, 2, 4]], properties: { adm2_pcode: "ID1102", adm1_pcode: "ID11" } },
        { type: "Polygon", arcs: [[-3, 6, 5, 7]], properties: { adm2_pcode: "ID1201", adm1_pcode: "ID12" } },
        { type: "Polygon", arcs: [[-6, 8]], properties: { adm2_pcode: "ID1288", adm1_pcode: "ID12" } },
      ],
    },
  },
} as unknown as Topology;

const moves = (path: string) => path.split("M").length - 1;

describe("decodeArcs", () => {
  it("undoes delta encoding and the quantize transform", () => {
    const quantized = {
      type: "Topology",
      transform: { scale: [0.5, 0.25], translate: [100, -10] },
      arcs: [[[2, 4], [2, 0], [0, -4]]],
      objects: {},
    } as unknown as Topology;
    expect(decodeArcs(quantized)).toEqual([
      [
        [101, -9],
        [102, -9],
        [102, -10],
      ],
    ]);
  });

  it("passes absolute arcs through", () => {
    expect(decodeArcs(TOPOLOGY)[0]).toEqual([
      [101, 1],
      [101, 0],
    ]);
  });
});

describe("fitMercator", () => {
  it("spans the width west to east, with north at the top", () => {
    const frame = fitMercator(
      [
        [100, -5],
        [110, 5],
      ],
      1000,
    );
    expect(frame.project([100, 0])[0]).toBeCloseTo(0, 6);
    expect(frame.project([110, 0])[0]).toBeCloseTo(1000, 6);
    expect(frame.project([105, 5])[1]).toBeCloseTo(0, 6);
    expect(frame.project([105, -5])[1]).toBeGreaterThan(
      frame.project([105, 0])[1],
    );
    // Near the equator Mercator is almost square: 10° × 10° ≈ 1000 × 1000.
    expect(frame.height).toBeGreaterThan(995);
    expect(frame.height).toBeLessThan(1010);
  });
});

describe("simplify", () => {
  it("drops points closer than the tolerance and keeps both ends", () => {
    const line: Point[] = [
      [0, 0],
      [1, 0.1],
      [2, -0.1],
      [3, 0],
      [4, 3],
      [5, 0],
    ];
    expect(simplify(line, 0.5)).toEqual([
      [0, 0],
      [3, 0],
      [4, 3],
      [5, 0],
    ]);
  });

  it("keeps the far side of a closed ring", () => {
    const ring: Point[] = [
      [0, 0],
      [4, 0],
      [4, 4],
      [0, 4],
      [0, 0],
    ];
    const out = simplify(ring, 0.5);
    expect(out[0]).toEqual([0, 0]);
    expect(out[out.length - 1]).toEqual([0, 0]);
    expect(ringArea(out)).toBe(16);
  });

  it("leaves two-point lines alone", () => {
    expect(
      simplify(
        [
          [0, 0],
          [1, 1],
        ],
        5,
      ),
    ).toEqual([
      [0, 0],
      [1, 1],
    ]);
  });
});

describe("ringsPath", () => {
  it("writes relative steps on the integer grid", () => {
    expect(
      ringsPath([
        [
          [10.2, 20.4],
          [13, 20],
          [13, 25],
          [10, 25],
          [10.2, 20.4],
        ],
      ]),
    ).toBe("M10 20l3 0 0 5-3 0 0-5z");
  });

  it("leaves out rings smaller than the minimum area", () => {
    const tiny: Point[] = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 0],
    ];
    expect(ringsPath([tiny], 2)).toBe("");
  });
});

describe("prepared maps", () => {
  const map = prepareMap(TOPOLOGY, { width: 400, tolerance: 0.5 });

  it("keeps kabupaten/kota and skips the lake", () => {
    expect([...map.regions.keys()].sort()).toEqual(["11.01", "11.02", "12.01"]);
    expect(map.width).toBe(400);
    expect(map.height).toBeGreaterThanOrEqual(100);
  });

  it("merges each class into one shape without inner borders", () => {
    const paths = classPaths(map, (code) => (code === "12.01" ? "c" : "ab"));
    expect(moves(paths.ab ?? "")).toBe(1);
    expect(moves(paths.c ?? "")).toBe(1);
  });

  it("skips regions without a class", () => {
    const paths = classPaths(map, (code) => (code === "11.01" ? "a" : null));
    expect(Object.keys(paths)).toEqual(["a"]);
  });

  it("draws region borders once and province borders separately", () => {
    const borders = borderPaths(map);
    // A|B and B|C; the shore of the lake is not a region border.
    expect(moves(borders.regions)).toBe(2);
    expect(borders.provinces).toBe("M200 0l0 100");
  });
});
