import { describe, expect, it } from "vitest";
import {
  adjustCosts,
  AFFORDABILITY_BANDS,
  classify,
  computeMetrics,
  DEFAULT_ASSUMPTIONS,
} from "./calculations";
import type {
  Assumptions,
  CostProfile,
  ExpenseCategoryKey,
  WageRecord,
} from "./types";

const CATEGORIES: ExpenseCategoryKey[] = [
  "housing",
  "food",
  "transport",
  "utilities",
  "connectivity",
  "healthcare",
  "personalCare",
  "leisure",
  "education",
  "contingency",
];

function makeCosts(amount = 1_000_000): CostProfile {
  const baseline = {} as CostProfile["baseline"];
  for (const key of CATEGORIES) {
    baseline[key] = {
      amount,
      source: "test",
      asOf: "2026-01-01",
      confidence: "sample",
    };
  }
  return { regionCode: "00.00", baseline };
}

function makeWage(gross = 3_000_000, takeHome = 2_700_000): WageRecord {
  return {
    regionCode: "00.00",
    year: 2026,
    grossMonthly: gross,
    estimatedTakeHomeMonthly: takeHome,
    source: "test",
    asOf: "2026-01-01",
    confidence: "official",
  };
}

/** Oracle: total cost under the SAME assumptions the code would use. */
const totalCost = (a: Assumptions, c: CostProfile) =>
  Object.values(adjustCosts(c, a)).reduce((s, v) => s + v, 0);

describe("classify", () => {
  const b = AFFORDABILITY_BANDS; // comfortable 120, manageable 100, tight 80
  it("maps coverage% to bands at the exact boundaries", () => {
    expect(classify(120, b)).toBe("comfortable");
    expect(classify(119.99, b)).toBe("manageable");
    expect(classify(100, b)).toBe("manageable");
    expect(classify(99.99, b)).toBe("tight");
    expect(classify(80, b)).toBe("tight");
    expect(classify(79.99, b)).toBe("insufficient");
    expect(classify(0, b)).toBe("insufficient");
  });
});

describe("adjustCosts", () => {
  it("returns all ten expense categories", () => {
    const out = adjustCosts(makeCosts(), DEFAULT_ASSUMPTIONS);
    expect(Object.keys(out).sort()).toEqual([...CATEGORIES].sort());
  });

  it("zeroes contingency when savings excluded, keeps it otherwise", () => {
    const withSavings = adjustCosts(makeCosts(), {
      ...DEFAULT_ASSUMPTIONS,
      includeSavings: true,
    });
    const noSavings = adjustCosts(makeCosts(), {
      ...DEFAULT_ASSUMPTIONS,
      includeSavings: false,
    });
    expect(withSavings.contingency).toBeGreaterThan(0);
    expect(noSavings.contingency).toBe(0);
  });
});

describe("computeMetrics", () => {
  it("is internally consistent under default assumptions", () => {
    const wage = makeWage();
    const costs = makeCosts();
    const total = totalCost(DEFAULT_ASSUMPTIONS, costs);
    const m = computeMetrics("00.00", wage, costs, DEFAULT_ASSUMPTIONS);

    expect(m.totalMonthlyCost).toBe(total);
    expect(m.wageAmount).toBe(wage.grossMonthly); // gross basis, single earner
    expect(m.wageSource).toBe("region");
    expect(m.coveragePercent).toBeCloseTo((wage.grossMonthly / total) * 100, 6);
    expect(m.surplusOrDeficit).toBe(wage.grossMonthly - total);
    expect(m.affordabilityRatio).toBeCloseTo(total / wage.grossMonthly, 6);
    expect(m.band).toBe(classify(m.coveragePercent, AFFORDABILITY_BANDS));
  });

  it("uses take-home wage when wageBasis is takeHome", () => {
    const wage = makeWage();
    const m = computeMetrics("00.00", wage, makeCosts(), {
      ...DEFAULT_ASSUMPTIONS,
      wageBasis: "takeHome",
    });
    expect(m.wageAmount).toBe(wage.estimatedTakeHomeMonthly);
  });

  // Edge: zero cost. Division guard returns coverage 0 (documented behavior —
  // real regions never have zero cost; this only guards against divide-by-zero).
  it("handles zero total cost without dividing by zero", () => {
    const m = computeMetrics("00.00", makeWage(), makeCosts(0), DEFAULT_ASSUMPTIONS);
    expect(m.totalMonthlyCost).toBe(0);
    expect(m.coveragePercent).toBe(0);
    expect(m.surplusOrDeficit).toBe(3_000_000);
    expect(m.band).toBe("insufficient");
  });

  // Edge: zero wage -> affordabilityRatio is Infinity (cost per zero income).
  it("returns Infinity ratio when wage is zero", () => {
    const m = computeMetrics("00.00", makeWage(0, 0), makeCosts(), DEFAULT_ASSUMPTIONS);
    expect(m.wageAmount).toBe(0);
    expect(m.affordabilityRatio).toBe(Infinity);
    expect(m.coveragePercent).toBe(0);
    expect(m.band).toBe("insufficient");
  });

  it("lets custom income override the regional wage (single earner)", () => {
    const wage = makeWage();
    const m = computeMetrics("00.00", wage, makeCosts(), {
      ...DEFAULT_ASSUMPTIONS,
      customIncome: 50_000_000,
    });
    expect(m.wageAmount).toBe(50_000_000);
    expect(m.wageSource).toBe("custom");
    expect(m.regionalWageAmount).toBe(wage.grossMonthly); // comparator preserved
  });

  it("ignores dualIncome for single households", () => {
    const wage = makeWage();
    const m = computeMetrics("00.00", wage, makeCosts(), {
      ...DEFAULT_ASSUMPTIONS,
      householdType: "single",
      dualIncome: true,
    });
    expect(m.regionalWageAmount).toBe(wage.grossMonthly); // still one earner
  });

  it("doubles the regional wage for a dual-income couple", () => {
    const wage = makeWage();
    const m = computeMetrics("00.00", wage, makeCosts(), {
      ...DEFAULT_ASSUMPTIONS,
      householdType: "couple",
      dualIncome: true,
    });
    expect(m.regionalWageAmount).toBe(2 * wage.grossMonthly);
    expect(m.wageAmount).toBe(2 * wage.grossMonthly); // no custom income
  });

  it("adds the partner's regional wage on top of custom income (dual couple)", () => {
    const wage = makeWage();
    const m = computeMetrics("00.00", wage, makeCosts(), {
      ...DEFAULT_ASSUMPTIONS,
      householdType: "couple",
      dualIncome: true,
      customIncome: 50_000_000,
    });
    expect(m.wageAmount).toBe(50_000_000 + wage.grossMonthly);
  });
});

/* ---------- AP-03: jumlah anak & cicilan KPR ---------- */

/**
 * Oracle v0.1: tabel pengali Keluarga & Pasangan lama. Pasangan + 2 anak
 * HARUS mereproduksi profil Keluarga v0.1 secara persis (koreksi kalibrasi
 * per-anak), agar angka lama tidak berubah diam-diam.
 */
const LEGACY_FAMILY: Record<ExpenseCategoryKey, number> = {
  housing: 1.6,
  food: 2.6,
  transport: 2.0,
  utilities: 1.6,
  connectivity: 1.0,
  healthcare: 3.0,
  personalCare: 2.4,
  leisure: 2.2,
  education: 4.0,
  contingency: 2.0,
};

const LEGACY_COUPLE: Record<ExpenseCategoryKey, number> = {
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
};

/** Baseline test = 1.000.000/kategori; multiplier efektif = nilai/baseline. */
const BASELINE_AMOUNT = 1_000_000;

describe("children (AP-03)", () => {
  it("pasangan + 2 anak mereproduksi profil Keluarga v0.1 secara persis", () => {
    const out = adjustCosts(makeCosts(), {
      ...DEFAULT_ASSUMPTIONS,
      householdType: "couple",
      children: 2,
    });
    for (const key of CATEGORIES) {
      expect(out[key] / BASELINE_AMOUNT, key).toBeCloseTo(LEGACY_FAMILY[key], 10);
    }
  });

  it("pasangan tanpa anak tetap profil Pasangan v0.1", () => {
    const out = adjustCosts(makeCosts(), {
      ...DEFAULT_ASSUMPTIONS,
      householdType: "couple",
      children: 0,
    });
    for (const key of CATEGORIES) {
      expect(out[key] / BASELINE_AMOUNT, key).toBeCloseTo(LEGACY_COUPLE[key], 10);
    }
  });

  it("tipe keluarga = basis pasangan + anak (0 anak ≡ pasangan)", () => {
    const couple = adjustCosts(makeCosts(), {
      ...DEFAULT_ASSUMPTIONS,
      householdType: "couple",
      children: 0,
    });
    const family = adjustCosts(makeCosts(), {
      ...DEFAULT_ASSUMPTIONS,
      householdType: "family",
      children: 0,
    });
    expect(family).toEqual(couple);
  });

  it("single + 2 anak menambah faktor per-anak di atas baseline satu orang", () => {
    const out = adjustCosts(makeCosts(), {
      ...DEFAULT_ASSUMPTIONS,
      householdType: "single",
      children: 2,
    });
    // Faktor per-anak terkalibrasi: food 0.425/anak, education 1.4/anak.
    expect(out.food / BASELINE_AMOUNT).toBeCloseTo(1 + 2 * 0.425, 10);
    expect(out.education / BASELINE_AMOUNT).toBeCloseTo(1 + 2 * 1.4, 10);
    // Tanpa faktor per-anak: connectivity tetap baseline.
    expect(out.connectivity / BASELINE_AMOUNT).toBeCloseTo(1, 10);
  });

  it("anak tidak menyentuh sisi upah — hanya biaya yang naik", () => {
    const wage = makeWage();
    const costs = makeCosts();
    const m = computeMetrics("00.00", wage, costs, {
      ...DEFAULT_ASSUMPTIONS,
      householdType: "couple",
      children: 2,
    });
    expect(m.wageAmount).toBe(wage.grossMonthly);
    const total = Object.values(
      adjustCosts(costs, { ...DEFAULT_ASSUMPTIONS, householdType: "couple", children: 2 }),
    ).reduce((s, v) => s + v, 0);
    expect(m.totalMonthlyCost).toBe(total);
  });
});

describe("installment override (AP-03)", () => {
  it("menggantikan kategori hunian dengan cicilan pengguna, abaikan pilihan hunian", () => {
    const room = adjustCosts(makeCosts(), {
      ...DEFAULT_ASSUMPTIONS,
      housing: "room",
      installmentMonthly: 4_000_000,
    });
    const apartment = adjustCosts(makeCosts(), {
      ...DEFAULT_ASSUMPTIONS,
      housing: "oneBedroom",
      installmentMonthly: 4_000_000,
    });
    expect(room.housing).toBe(4_000_000);
    expect(apartment.housing).toBe(4_000_000);
  });

  it("hanya hunian yang digantikan — kategori lain tetap ikut pengali", () => {
    const out = adjustCosts(makeCosts(), {
      ...DEFAULT_ASSUMPTIONS,
      householdType: "couple",
      children: 2,
      installmentMonthly: 4_000_000,
    });
    expect(out.housing).toBe(4_000_000);
    expect(out.food / BASELINE_AMOUNT).toBeCloseTo(LEGACY_FAMILY.food, 10);
  });

  it("cicilan 0 atau negatif diabaikan (kembali ke estimasi daerah)", () => {
    const zero = adjustCosts(makeCosts(), {
      ...DEFAULT_ASSUMPTIONS,
      installmentMonthly: 0,
    });
    const negative = adjustCosts(makeCosts(), {
      ...DEFAULT_ASSUMPTIONS,
      installmentMonthly: -500_000,
    });
    expect(zero.housing).toBe(1_000_000); // baseline × hunian studio (×1)
    expect(negative.housing).toBe(1_000_000);
  });

  it("total biaya ikut berubah saat cicilan aktif", () => {
    const costs = makeCosts();
    const baseline = computeMetrics("00.00", makeWage(), costs, DEFAULT_ASSUMPTIONS);
    const withInstallment = computeMetrics("00.00", makeWage(), costs, {
      ...DEFAULT_ASSUMPTIONS,
      installmentMonthly: 2_000_000,
    });
    expect(withInstallment.breakdown.housing).toBe(2_000_000);
    expect(withInstallment.totalMonthlyCost).toBe(
      baseline.totalMonthlyCost - baseline.breakdown.housing + 2_000_000,
    );
  });
});
