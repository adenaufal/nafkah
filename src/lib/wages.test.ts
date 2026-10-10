import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { WageRecord } from "./types";
import { wageKind } from "./wages";

const wages = JSON.parse(
  readFileSync(resolve("public/data/v2026.1/wages.json"), "utf8"),
) as WageRecord[];

describe("wageKind", () => {
  it("reads UMP from a provincial decree and UMK otherwise", () => {
    expect(
      wageKind({
        source:
          "Keputusan Gubernur Aceh … tentang Upah Minimum Provinsi Tahun 2026",
      }),
    ).toBe("UMP");
    expect(
      wageKind({
        source: "SK Gubernur … tentang Upah Minimum Kabupaten/Kota … 2026",
      }),
    ).toBe("UMK");
    expect(wageKind(undefined)).toBe("UMK");
  });

  it("recognises the legal basis of every record in the dataset", () => {
    const unknown = wages.filter(
      (w) =>
        !/upah minimum provinsi/i.test(w.source) &&
        !/kabupaten\/kota|\bUMK\b/i.test(w.source),
    );
    expect(unknown.map((w) => w.regionCode)).toEqual([]);
    const ump = wages.filter((w) => wageKind(w) === "UMP").length;
    expect(ump).toBeGreaterThan(0);
    expect(ump).toBeLessThan(wages.length);
  });
});
