import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { EXPECTED_REGION_COUNT, validateDataset } from "./schema";
import type { CostProfile, Region, WageRecord } from "@/lib/types";
import type { RegionNarrative } from "./narratives";

/**
 * Reliability gate (AP-02): the versioned JSON files that are actually served
 * must satisfy the Zod schema and cross-record integrity, or CI fails. This is
 * the guard that lets us accept community data corrections without silently
 * breaking provenance.
 */

const DIR = resolve("public/data/v2026.1");

const read = <T>(name: string): T =>
  JSON.parse(readFileSync(resolve(DIR, name), "utf8")) as T;

const regions = read<Region[]>("regions.json");
const wages = read<WageRecord[]>("wages.json");
const costs = read<CostProfile[]>("costs.json");
const narratives = read<RegionNarrative[]>("narratives.json");
const manifest = read<{
  datasetVersion: string;
  generatedAt: string;
  counts: Record<string, number>;
}>("manifest.json");

describe("dataset integrity", () => {
  it("passes schema + join validation with zero problems", () => {
    const problems = validateDataset({ regions, wages, costs, narratives });
    // Full list on failure — pinpoints the offending record.
    expect(problems).toEqual([]);
  });

  it("covers exactly the expected number of kabupaten/kota", () => {
    expect(regions).toHaveLength(EXPECTED_REGION_COUNT);
    expect(wages).toHaveLength(EXPECTED_REGION_COUNT);
    expect(costs).toHaveLength(EXPECTED_REGION_COUNT);
  });

  it("matches the manifest", () => {
    expect(manifest.datasetVersion).toMatch(/^\d{4}\.\d+$/);
    expect(manifest.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(manifest.counts).toEqual({
      regions: regions.length,
      wages: wages.length,
      costs: costs.length,
      narratives: narratives.length,
    });
  });

  it("joins every narrative to a known region", () => {
    const codes = new Set(
      regions.map((r) => (r as { code: string }).code),
    );
    narratives.forEach((n, i) => {
      const code = (n as { regionCode: string }).regionCode;
      expect(codes.has(code), `narrative[${i}] ${code}`).toBe(true);
    });
  });

  it("keeps displayed rent provenance aligned with the housing benchmark", () => {
    const housing = new Map(
      costs.map((cost) => [cost.regionCode, cost.baseline.housing]),
    );

    narratives.forEach((narrative) => {
      const housingProvenance = housing.get(narrative.regionCode);
      expect(narrative.rentRange.provenance).toEqual(
        housingProvenance && {
          source: housingProvenance.source,
          asOf: housingProvenance.asOf,
          confidence: housingProvenance.confidence,
        },
      );
    });
  });
});
