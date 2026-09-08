import type {
  ExpenseCategoryKey,
  HouseholdType,
  HousingType,
  LifestyleLevel,
  TransportMode,
} from "@/lib/types";

/**
 * Assumption multiplier tables. These are data — edit them here, not in code.
 * Baseline profile: single · moderate · studio · motorcycle · savings included.
 *
 * Household multipliers are EFFECTIVE factors on the baseline (1 orang dewasa):
 * couple scales sub-linearly for shared resources (housing, utilities) and
 * near-linearly for per-person costs (food, healthcare). Tipe "family" tidak
 * lagi punya tabelnya sendiri — sejak v1.1 keluarga = pasangan + anak, dengan
 * biaya per-anak dari CHILD_MULTIPLIERS (AP-03).
 */

export const HOUSEHOLD_MULTIPLIERS: Record<
  Exclude<HouseholdType, "family">,
  Partial<Record<ExpenseCategoryKey, number>>
> = {
  single: {},
  couple: {
    housing: 1.25,
    food: 1.75,
    transport: 1.6,
    utilities: 1.3,
    connectivity: 1.0,
    healthcare: 1.9,
    personalCare: 1.7,
    leisure: 1.8,
    education: 1.2,
    contingency: 1.5,
  },
};

/**
 * Biaya marginal per anak, ditambahkan secara aditif ke pengali rumah tangga:
 * efektif = household + children × CHILD_MULTIPLIERS. Dikalibrasi agar
 * pasangan + 2 anak mereproduksi profil "Keluarga" v0.1 secara persis
 * (mis. food 1.75 + 2×0.425 = 2.6; education 1.2 + 2×1.4 = 4.0). Basis konsep:
 * skala ekuivalensi OECD-modified (anak < 14 th ≈ 0,3–0,5 orang dewasa,
 * lebih tinggi untuk pendidikan/pengasuhan) — label estimasi, bukan data
 * survei primer.
 */
export const CHILD_MULTIPLIERS: Partial<Record<ExpenseCategoryKey, number>> = {
  housing: 0.175,
  food: 0.425,
  transport: 0.2,
  utilities: 0.15,
  connectivity: 0,
  healthcare: 0.55,
  personalCare: 0.35,
  leisure: 0.2,
  education: 1.4,
  contingency: 0.25,
};

export const LIFESTYLE_MULTIPLIERS: Record<
  LifestyleLevel,
  Partial<Record<ExpenseCategoryKey, number>>
> = {
  budget: {
    food: 0.78,
    utilities: 0.85,
    connectivity: 0.8,
    healthcare: 0.9,
    personalCare: 0.7,
    leisure: 0.5,
    contingency: 0.5,
  },
  moderate: {},
  comfortable: {
    food: 1.3,
    utilities: 1.15,
    connectivity: 1.15,
    healthcare: 1.2,
    personalCare: 1.4,
    leisure: 1.8,
    contingency: 1.6,
  },
};

/** Housing choice rescales only the housing category. */
export const HOUSING_MULTIPLIERS: Record<HousingType, number> = {
  room: 0.55,
  studio: 1.0,
  oneBedroom: 1.45,
};

/** Transport mode rescales only the transport category. */
export const TRANSPORT_MULTIPLIERS: Record<TransportMode, number> = {
  motorcycle: 1.0,
  publicTransport: 0.7,
  rideHailing: 1.9,
};
