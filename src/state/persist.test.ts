import { describe, expect, it } from "vitest";
import { MAX_CHILDREN, normalizeAssumptions } from "./persist";
import { DEFAULT_ASSUMPTIONS } from "@/lib/calculations";
import type { Assumptions } from "@/lib/types";

/**
 * AP-03: asumsi tersimpan di localStorage tanpa validasi, jadi normalisasi
 * adalah gerbang satu-satunya sebelum dipakai kalkulasi.
 */
describe("normalizeAssumptions", () => {
  it("mengisi field baru dengan default untuk state v0.1", () => {
    const legacy = {
      householdType: "couple" as const,
      lifestyle: "budget" as const,
    };
    const out = normalizeAssumptions(legacy);
    expect(out.children).toBe(0);
    expect(out.installmentMonthly).toBeNull();
    expect(out.householdType).toBe("couple");
    expect(out.lifestyle).toBe("budget");
    expect(out.wageBasis).toBe(DEFAULT_ASSUMPTIONS.wageBasis);
  });

  it("migrasi profil Keluarga lama ke pasangan + 2 anak (angka v0.1 tetap)", () => {
    const legacyFamily: Partial<Assumptions> = { householdType: "family" };
    expect(normalizeAssumptions(legacyFamily).children).toBe(2);
    // State baru yang sudah menyimpan children dihormati.
    expect(
      normalizeAssumptions({ householdType: "family", children: 3 }).children,
    ).toBe(3);
  });

  it("menjepit children ke 0..MAX_CHILDREN dan membulatkan", () => {
    expect(normalizeAssumptions({ children: -1 }).children).toBe(0);
    expect(normalizeAssumptions({ children: 99 }).children).toBe(MAX_CHILDREN);
    expect(normalizeAssumptions({ children: 2.7 }).children).toBe(2);
    expect(
      normalizeAssumptions({ children: Number.NaN }).children,
    ).toBe(0);
  });

  it("cicilan hanya valid bila angka positif", () => {
    expect(normalizeAssumptions({ installmentMonthly: 4_500_000 })
      .installmentMonthly).toBe(4_500_000);
    expect(
      normalizeAssumptions({ installmentMonthly: 0 }).installmentMonthly,
    ).toBeNull();
    expect(
      normalizeAssumptions({ installmentMonthly: -1 }).installmentMonthly,
    ).toBeNull();
    expect(
      normalizeAssumptions({ installmentMonthly: 1234.5 }).installmentMonthly,
    ).toBe(1234);
    // null eksplisit = tidak dipakai.
    expect(
      normalizeAssumptions({ installmentMonthly: null }).installmentMonthly,
    ).toBeNull();
  });

  it("input kosong/bukan objek tetap menghasilkan asumsi default yang valid", () => {
    expect(normalizeAssumptions(null)).toEqual(DEFAULT_ASSUMPTIONS);
    expect(normalizeAssumptions(undefined)).toEqual(DEFAULT_ASSUMPTIONS);
    expect(normalizeAssumptions({})).toEqual(DEFAULT_ASSUMPTIONS);
  });
});
