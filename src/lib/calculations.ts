import type {
  AffordabilityBand,
  AffordabilityBands,
  Assumptions,
  CostProfile,
  ExpenseCategoryKey,
  RegionMetrics,
  WageRecord,
} from "./types";
import {
  HOUSEHOLD_MULTIPLIERS,
  HOUSING_MULTIPLIERS,
  LIFESTYLE_MULTIPLIERS,
  TRANSPORT_MULTIPLIERS,
} from "@/data/multipliers";

/**
 * Calculation core (also displayed in the UI):
 *
 *   totalMonthlyCost   = Σ active category values under current assumptions
 *   wageBasisAmount    = earners × (wageBasis === 'gross' ? grossMonthly : estimatedTakeHomeMonthly)
 *                          earners = 2 jika pasangan ikut bekerja (default 1)
 *   Dengan pendapatan sendiri (customIncome > 0):
 *     wageAmount = customIncome + (earners === 2 ? upah daerah 1 pekerja : 0)
 *   regionalWageAmount selalu = upah daerah (pembanding & layer peta "Upah").
 *   coveragePercent    = (wageBasisAmount / totalMonthlyCost) * 100
 *   surplusOrDeficit   = wageBasisAmount - totalMonthlyCost
 *   affordabilityRatio = totalMonthlyCost / wageBasisAmount
 */

/** Adjustable interpretation bands (constants, not inline literals). */
export const AFFORDABILITY_BANDS: AffordabilityBands = {
  comfortableAt: 120,
  manageableAt: 100,
  tightAt: 80,
};

export const BAND_LABEL: Record<AffordabilityBand, string> = {
  comfortable: "Nyaman",
  manageable: "Cukup",
  tight: "Ketat",
  insufficient: "Tak Cukup",
};

/**
 * Colorblind-aware ramp (Okabe-Ito inspired, lightness-differentiated so the
 * bands stay separable in grayscale). Numeric legend carries the meaning, not
 * color alone.
 */
export const BAND_COLORS: Record<AffordabilityBand, string> = {
  comfortable: "#0b7a4b", // dark green
  manageable: "#56a3c4", // mid blue
  tight: "#e2a336", // amber (light)
  insufficient: "#a5271f", // deep red
};

/**
 * Palet band versi gelap: warna lebih terang agar band tetap terbaca di atas
 * basemap gelap dan di atas card gelap (kontras ≥ 5.5:1).
 */
export const BAND_COLORS_DARK: Record<AffordabilityBand, string> = {
  comfortable: "#2fbd7f",
  manageable: "#6cb5d6",
  tight: "#f0c04a",
  insufficient: "#ef6a5a",
};

export function bandColors(dark: boolean): Record<AffordabilityBand, string> {
  return dark ? BAND_COLORS_DARK : BAND_COLORS;
}

/**
 * Ramp nilai (biaya/upah) untuk choropleth & legenda.
 * Light: gelap → terang bernilai naik; Dark: dim → menyala bernilai naik.
 */
export const VALUE_RAMP = {
  light: ["#fde8d9", "#e0704f", "#93250f"],
  dark: ["#54241a", "#d96a4a", "#ffb59b"],
} as const;

export const NO_DATA_COLOR = "#9aa0a6";
export const NO_DATA_PATTERN = "hatch-nodata";

export const DEFAULT_ASSUMPTIONS: Assumptions = {
  householdType: "single",
  lifestyle: "moderate",
  housing: "studio",
  transport: "motorcycle",
  includeSavings: true,
  wageBasis: "gross",
  dualIncome: false,
  customIncome: null,
};

export function classify(
  coveragePercent: number,
  bands: AffordabilityBands,
): AffordabilityBand {
  if (coveragePercent >= bands.comfortableAt) return "comfortable";
  if (coveragePercent >= bands.manageableAt) return "manageable";
  if (coveragePercent >= bands.tightAt) return "tight";
  return "insufficient";
}

/** Apply every assumption multiplier to a region's baseline cost profile. */
export function adjustCosts(
  profile: CostProfile,
  assumptions: Assumptions,
): Record<ExpenseCategoryKey, number> {
  const household = HOUSEHOLD_MULTIPLIERS[assumptions.householdType];
  const lifestyle = LIFESTYLE_MULTIPLIERS[assumptions.lifestyle];

  const entries = Object.entries(profile.baseline) as [
    ExpenseCategoryKey,
    { amount: number },
  ][];
  const out = {} as Record<ExpenseCategoryKey, number>;

  for (const [key, cell] of entries) {
    // Full precision in state; only display rounds to the nearest thousand.
    let amount = cell.amount * (household[key] ?? 1) * (lifestyle[key] ?? 1);
    if (key === "housing") amount *= HOUSING_MULTIPLIERS[assumptions.housing];
    if (key === "transport")
      amount *= TRANSPORT_MULTIPLIERS[assumptions.transport];
    if (key === "contingency" && !assumptions.includeSavings) amount = 0;
    out[key] = amount;
  }
  return out;
}

export function computeMetrics(
  code: string,
  wage: WageRecord,
  costs: CostProfile,
  assumptions: Assumptions,
  bands: AffordabilityBands = AFFORDABILITY_BANDS,
): RegionMetrics {
  // Dua penghasilan hanya untuk rumah tangga berpasangan: pasangan diasumsikan
  // bekerja dengan upah minimum (UMK/UMP) daerah yang sama.
  const earners =
    assumptions.dualIncome && assumptions.householdType !== "single" ? 2 : 1;
  const regionalSingle =
    assumptions.wageBasis === "gross"
      ? wage.grossMonthly
      : wage.estimatedTakeHomeMonthly;
  const regionalWageAmount = earners * regionalSingle;
  // Pendapatan sendiri menggantikan upah pengguna; dengan "2 upah", pasangan
  // tetap diasumsikan berupah minimum (UMK/UMP) daerah yang sama.
  const customIncomeActive =
    assumptions.customIncome != null && assumptions.customIncome > 0;
  // Pendapatan sendiri menggantikan upah pengguna; dengan "2 upah", pasangan
  // tetap diasumsikan berupah minimum (UMK/UMP) daerah yang sama.
  let wageAmount = regionalWageAmount;
  if (assumptions.customIncome != null && assumptions.customIncome > 0) {
    wageAmount =
      assumptions.customIncome + (earners === 2 ? regionalSingle : 0);
  }

  const breakdown = adjustCosts(costs, assumptions);
  const totalMonthlyCost = Object.values(breakdown).reduce((s, v) => s + v, 0);
  const coveragePercent =
    totalMonthlyCost > 0 ? (wageAmount / totalMonthlyCost) * 100 : 0;

  return {
    code,
    wageAmount,
    regionalWageAmount,
    wageSource: customIncomeActive ? "custom" : "region",
    totalMonthlyCost,
    coveragePercent,
    surplusOrDeficit: wageAmount - totalMonthlyCost,
    affordabilityRatio:
      wageAmount > 0 ? totalMonthlyCost / wageAmount : Infinity,
    band: classify(coveragePercent, bands),
    breakdown,
  };
}

export function computeAllMetrics(
  codes: string[],
  wages: Map<string, WageRecord>,
  costs: Map<string, CostProfile>,
  assumptions: Assumptions,
  bands: AffordabilityBands = AFFORDABILITY_BANDS,
): Map<string, RegionMetrics> {
  const out = new Map<string, RegionMetrics>();
  for (const code of codes) {
    const wage = wages.get(code);
    const cost = costs.get(code);
    if (!wage || !cost) continue;
    out.set(code, computeMetrics(code, wage, cost, assumptions, bands));
  }
  return out;
}
