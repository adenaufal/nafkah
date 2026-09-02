import { describe, expect, it } from "vitest";
import { ALL_REGIONS, ALL_WAGES, ALL_COSTS } from "./provinces";
import { EXPECTED_REGION_COUNT, validateDataset } from "./schema";

/**
 * Reliability gate (AP-02): the shipped dataset must satisfy the Zod schema
 * and cross-record integrity, or CI fails. This is the guard that lets us
 * accept community data corrections without silently breaking provenance.
 */
describe("dataset integrity", () => {
  it("passes schema + join validation with zero problems", () => {
    const problems = validateDataset({
      regions: ALL_REGIONS,
      wages: ALL_WAGES,
      costs: ALL_COSTS,
    });
    // Full list on failure — pinpoints the offending record.
    expect(problems).toEqual([]);
  });

  it("covers exactly the expected number of kabupaten/kota", () => {
    expect(ALL_REGIONS.length).toBe(EXPECTED_REGION_COUNT);
    expect(ALL_WAGES.length).toBe(EXPECTED_REGION_COUNT);
    expect(ALL_COSTS.length).toBe(EXPECTED_REGION_COUNT);
  });
});
