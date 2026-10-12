import { describe, expect, it } from "vitest";
import { EXPENSE_CATEGORIES } from "@/data/costs";
import { DEFAULT_ASSUMPTIONS } from "./calculations";
import { wageLabel } from "./labels";
import type { IncomeSource, RegionMetrics, WageBasis } from "./types";
import type { WageKind } from "./wages";

function metric(
  wageSource: IncomeSource,
  partnerWageSource: IncomeSource | null,
): RegionMetrics {
  return {
    code: "00.00",
    wageAmount: 0,
    regionalWageAmount: 0,
    wageSource,
    partnerWageSource,
    totalMonthlyCost: 0,
    coveragePercent: 0,
    surplusOrDeficit: 0,
    affordabilityRatio: Infinity,
    band: "insufficient",
    breakdown: Object.fromEntries(
      EXPENSE_CATEGORIES.map((category) => [category.key, 0]),
    ) as RegionMetrics["breakdown"],
    familySupport: 0,
  };
}

describe("wageLabel", () => {
  const cases: [
    IncomeSource,
    IncomeSource | null,
    WageBasis,
    WageKind,
    string,
  ][] = [
    ["region", null, "gross", "UMK", "UMK"],
    ["region", "region", "gross", "UMP", "UMP × 2"],
    ["region", "region", "takeHome", "UMK", "UMK setelah potongan (est.) × 2"],
    ["region", "custom", "gross", "UMK", "UMK + gaji pasangan"],
    [
      "region",
      "custom",
      "takeHome",
      "UMP",
      "UMP setelah potongan (est.) + gaji pasangan",
    ],
    ["origin", "origin", "gross", "UMK", "UMK kota asal × 2"],
    ["origin", "custom", "gross", "UMK", "UMK kota asal + gaji pasangan"],
    ["custom", null, "takeHome", "UMK", "Gajimu"],
    ["custom", "region", "gross", "UMP", "Gajimu + UMP pasangan"],
    ["custom", "origin", "gross", "UMK", "Gajimu + UMK pasangan"],
    ["custom", "custom", "gross", "UMK", "Gajimu + gaji pasangan"],
  ];

  it.each(cases)(
    "%s + pasangan %s (%s, %s) → %s",
    (own, partner, wageBasis, kind, expected) => {
      const a = { ...DEFAULT_ASSUMPTIONS, wageBasis };
      expect(wageLabel(metric(own, partner), a, kind)).toBe(expected);
    },
  );
});
