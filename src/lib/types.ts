/**
 * Domain types for Nafkah (map-first affordability explorer).
 *
 * Region identity is the BPS/Kemendagri kode wilayah ("12.75"), never a
 * display name. Wage, cost and geometry records all join on that code.
 */

export type Confidence = "official" | "estimate" | "sample";

/** Every displayed number must trace to one of these. */
export interface Provenance {
 source: string;
 asOf: string; // ISO date
 confidence: Confidence;
}

export type RegionTier = "metro" | "kota" | "kabupaten";

export interface Region {
 /** BPS/Kemendagri kode wilayah, e.g. "31.73" for Kota Jakarta Pusat. */
 code: string;
 name: string;
 province: string;
 provinceCode: string;
 centroid: [number, number]; // [lng, lat]
 tier: RegionTier;
}

export interface WageRecord extends Provenance {
 regionCode: string;
 year: number;
 /** Monthly UMK, rupiah. */
 grossMonthly: number;
 /** Rough after-deduction estimate, rupiah (labeled as estimate). */
 estimatedTakeHomeMonthly: number;
}

export type ExpenseCategoryKey =
 | "housing"
 | "food"
 | "transport"
 | "utilities"
 | "connectivity"
 | "healthcare"
 | "personalCare"
 | "leisure"
 | "education"
 | "contingency";

export interface CategoryValue extends Provenance {
 /** Monthly rupiah at the baseline profile (single · moderate · studio · motorcycle). */
 amount: number;
}

/**
 * Baseline category costs per region. Household type / lifestyle / housing /
 * transport are applied as multiplier tables (see data/multipliers.ts) rather
 * than a fully explicit matrix — the multipliers are data too, and every
 * baseline cell still carries its own provenance.
 */
export interface CostProfile {
 regionCode: string;
 baseline: Record<ExpenseCategoryKey, CategoryValue>;
}

/* ---------- Assumptions ---------- */

export type HouseholdType = "single" | "couple" | "family";
export type LifestyleLevel = "budget" | "moderate" | "comfortable";
export type HousingType = "room" | "studio" | "oneBedroom";
export type TransportMode = "motorcycle" | "publicTransport" | "rideHailing";
export type WageBasis = "gross" | "takeHome";

export interface Assumptions {
 householdType: HouseholdType;
 /** Jumlah anak (0–5). Menambah kebutuhan per-anak (lihat CHILD_MULTIPLIERS). */
 children: number;
 lifestyle: LifestyleLevel;
 housing: HousingType;
 transport: TransportMode;
 includeSavings: boolean;
 wageBasis: WageBasis;
 /** Pasangan ikut bekerja: total upah 2× UMK/UMP daerah terpilih. */
 dualIncome: boolean;
 /** Pendapatan bulanan milik pengguna (Rp). null = pakai upah daerah (UMK/UMP). */
 customIncome: number | null;
 /** Cicilan KPR/angsuran bulanan milik pengguna (Rp). null = estimasi sewa daerah. */
 installmentMonthly: number | null;
}

/* ---------- Derived ---------- */

export type AffordabilityBand =
 | "comfortable"
 | "manageable"
 | "tight"
 | "insufficient";

export interface AffordabilityBands {
 comfortableAt: number;
 manageableAt: number;
 tightAt: number;
}

export interface RegionMetrics {
 code: string;
 wageAmount: number;
 /** Upah daerah berbasis UMK/UMP — pembanding saat pendapatan custom aktif. */
 regionalWageAmount: number;
 /**
  * Sumber pembagi rasio keterjangkauan: upah tujuan, gaji asal, atau
  * pendapatan sendiri.
  */
 wageSource: "region" | "origin" | "custom";
 totalMonthlyCost: number;
 coveragePercent: number;
 surplusOrDeficit: number;
 affordabilityRatio: number;
 band: AffordabilityBand;
 breakdown: Record<ExpenseCategoryKey, number>;
}

export type ColorMode = "coverage" | "cost" | "wage";
export type BasemapId = "light" | "dark" | "satellite" | "offline";

/** Loading state machines kept separate per spec (geometry vs data). */
export type LoadStatus = "idle" | "loading" | "ready" | "error";

/** Normalised geometry feature joined to a Region (or not). */
export interface RegionFeatureProps {
 kode: string;
 name: string;
 province: string;
}
