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
  partnerWageSource: null,
  totalMonthlyCost: 1_000_000,
  coveragePercent: 500,
  surplusOrDeficit: 4_000_000,
  affordabilityRatio: 0.2,
  band: "comfortable",
  breakdown: Object.fromEntries(
    EXPENSE_CATEGORIES.map((category) => [category.key, 100_000]),
  ) as RegionMetrics["breakdown"],
  familySupport: 0,
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

  it("names a typed partner salary beside the minimum wage it joins", () => {
    const csv = buildComparisonCsv({
      rows: [
        {
          region,
          metrics: {
            ...metrics,
            wageAmount: 9_500_000,
            regionalWageAmount: 10_000_000,
            partnerWageSource: "custom",
          },
          wage,
          costs,
        },
      ],
      assumptions: {
        ...DEFAULT_ASSUMPTIONS,
        householdType: "couple",
        dualIncome: true,
        partnerIncome: 4_500_000,
      },
      datasetVersion: "2026.1",
      generatedAt: "2026-09-22T00:00:00.000Z",
    });

    const lines = csv.trimEnd().split("\n");
    expect(lines).toHaveLength(17); // + destination wage as comparator
    expect(csv).toContain(
      "pendapatan_yang_dipakai,9500000,IDR/bulan,," +
        '"BPS, catatan model; pasangan: Input pengguna (bukan dataset)",' +
        "2026-09-22,sample,",
    );
    expect(csv).toContain("umk_kota_tujuan_pembanding,10000000,IDR/bulan");
  });

  it("credits no partner when only the user's salary is typed", () => {
    const csv = buildComparisonCsv({
      rows: [
        {
          region,
          metrics: { ...metrics, wageSource: "custom", wageAmount: 8_000_000 },
          wage,
          costs,
          originWage: { ...wage, regionCode: "32.73", asOf: "2026-07-01" },
        },
      ],
      assumptions: { ...DEFAULT_ASSUMPTIONS, customIncome: 8_000_000 },
      datasetVersion: "2026.1",
      origin: { ...region, code: "32.73", name: "Kota Bandung" },
      generatedAt: "2026-09-22T00:00:00.000Z",
    });

    expect(csv).toContain(
      "pendapatan_yang_dipakai,8000000,IDR/bulan,," +
        "Input pengguna (bukan dataset),2026-09-22,estimate,",
    );
    expect(csv).not.toContain("pasangan");
  });

  it("adds the user's family support as its own row, marked as user input", () => {
    const withSupport = (familySupport: number) =>
      buildComparisonCsv({
        rows: [
          {
            region,
            metrics: {
              ...metrics,
              familySupport,
              totalMonthlyCost: metrics.totalMonthlyCost + familySupport,
            },
            wage,
            costs,
          },
        ],
        assumptions: {
          ...DEFAULT_ASSUMPTIONS,
          familySupportMonthly: familySupport || null,
        },
        datasetVersion: "2026.1",
        generatedAt: "2026-09-22T00:00:00.000Z",
      });

    const csv = withSupport(1_500_000);
    expect(csv.trimEnd().split("\n")).toHaveLength(17);
    expect(csv).toContain(
      "biaya_tanggungan_keluarga,1500000,IDR/bulan,Nyaman," +
        "Input pengguna (bukan dataset),2026-09-22,estimate,",
    );
    expect(csv).toContain("biaya_bulanan,2500000,IDR/bulan");
    expect(withSupport(0)).not.toContain("biaya_tanggungan_keluarga");
  });
});
