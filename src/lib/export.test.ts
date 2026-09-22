import { describe, expect, it } from "vitest";
import { EXPENSE_CATEGORIES } from "@/data/costs";
import { DEFAULT_ASSUMPTIONS } from "@/lib/calculations";
import type {
  CostProfile,
  Region,
  RegionMetrics,
  WageRecord,
} from "@/lib/types";
import { buildComparisonCsv, escapeCsvCell } from "./export";

const provenance = {
  source: "BPS, catatan model",
  asOf: "2026-08-01",
  confidence: "sample" as const,
};

const region: Region = {
  code: "31.73",
  name: "Kota Jakarta Pusat",
  province: "DKI Jakarta",
  provinceCode: "31",
  centroid: [106.83, -6.18],
  tier: "kota",
};

const wage: WageRecord = {
  regionCode: region.code,
  year: 2026,
  grossMonthly: 5_000_000,
  estimatedTakeHomeMonthly: 4_700_000,
  ...provenance,
};

const costs: CostProfile = {
  regionCode: region.code,
  baseline: Object.fromEntries(
    EXPENSE_CATEGORIES.map((category) => [
      category.key,
      { amount: 100_000, ...provenance },
    ]),
  ) as CostProfile["baseline"],
};

const metrics: RegionMetrics = {
  code: region.code,
  wageAmount: 5_000_000,
  regionalWageAmount: 5_000_000,
  wageSource: "region",
  totalMonthlyCost: 1_000_000,
  coveragePercent: 500,
  surplusOrDeficit: 4_000_000,
  affordabilityRatio: 0.2,
  band: "comfortable",
  breakdown: Object.fromEntries(
    EXPENSE_CATEGORIES.map((category) => [category.key, 100_000]),
  ) as RegionMetrics["breakdown"],
};

describe("comparison CSV export", () => {
  it("quotes cells and keeps provenance beside every value", () => {
    expect(escapeCsvCell("BPS, catatan model")).toBe('"BPS, catatan model"');

    const csv = buildComparisonCsv({
      rows: [{ region, metrics, wage, costs }],
      assumptions: DEFAULT_ASSUMPTIONS,
      datasetVersion: "2026.1",
      generatedAt: "2026-09-22T00:00:00.000Z",
    });

    const lines = csv.trimEnd().split("\n");
    expect(lines).toHaveLength(16);
    expect(lines[0]).toContain("source");
    expect(csv).toContain('"BPS, catatan model"');
    expect(csv).toContain("biaya_housing,100000,IDR/bulan");
    expect(csv).toContain("2026-08-01,sample");
  });
});
