import { describe, expect, it } from "vitest";
import type { Feature, Geometry } from "geojson";
import {
  findFeatureAt,
  geometryBounds,
  mergeBounds,
  pointInGeometry,
} from "./geo";

// A 10×10 square with a 2×2 hole in the middle, plus a separate island.
const withHole: Geometry = {
  type: "Polygon",
  coordinates: [
    [
      [100, -10],
      [110, -10],
      [110, 0],
      [100, 0],
      [100, -10],
    ],
    [
      [104, -6],
      [106, -6],
      [106, -4],
      [104, -4],
      [104, -6],
    ],
  ],
};
const archipelago: Geometry = {
  type: "MultiPolygon",
  coordinates: [
    [
      [
        [120, -2],
        [122, -2],
        [122, 0],
        [120, 0],
        [120, -2],
      ],
    ],
    [
      [
        [125, -2],
        [126, -2],
        [126, -1],
        [125, -1],
        [125, -2],
      ],
    ],
  ],
};

describe("pointInGeometry", () => {
  it("respects holes", () => {
    expect(pointInGeometry(101, -1, withHole)).toBe(true);
    expect(pointInGeometry(105, -5, withHole)).toBe(false);
    expect(pointInGeometry(111, -5, withHole)).toBe(false);
  });

  it("checks every polygon of a multipolygon", () => {
    expect(pointInGeometry(125.5, -1.5, archipelago)).toBe(true);
    expect(pointInGeometry(123.5, -1.5, archipelago)).toBe(false);
  });
});

describe("bounds", () => {
  it("covers all coordinates and merges", () => {
    expect(geometryBounds(withHole)).toEqual([
      [100, -10],
      [110, 0],
    ]);
    expect(
      mergeBounds([
        geometryBounds(withHole),
        null,
        geometryBounds(archipelago),
      ]),
    ).toEqual([
      [100, -10],
      [126, 0],
    ]);
    expect(mergeBounds([])).toBeNull();
  });
});

describe("findFeatureAt", () => {
  const features: Feature<Geometry, { kode: string }>[] = [
    { type: "Feature", geometry: withHole, properties: { kode: "A" } },
    { type: "Feature", geometry: archipelago, properties: { kode: "B" } },
  ];

  it("returns the containing feature, or nothing at sea", () => {
    expect(findFeatureAt(121, -1, features)?.properties.kode).toBe("B");
    expect(findFeatureAt(102, -8, features)?.properties.kode).toBe("A");
    expect(findFeatureAt(105, -5, features)).toBeUndefined();
    expect(findFeatureAt(90, 10, features)).toBeUndefined();
  });
});
