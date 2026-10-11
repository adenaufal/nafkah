import { EXPENSE_CATEGORIES } from "@/data/costs";
import type {
  Assumptions,
  Confidence,
  ExpenseCategoryKey,
  RegionMetrics,
} from "./types";
import type { WageKind } from "./wages";

/*
 * Display labels shared by the live app and the server-rendered pages
 * (Metode, booklet). Plain functions with no state, so server components
 * can call them too.
 */

/**
 * Cost-line names that fit the profile — display only; the CSV keeps the
 * canonical labels. A filled-in installment replaces rent, and a childless
 * household's education line is courses, not childcare.
 */
export function categoryLabel(key: ExpenseCategoryKey, a: Assumptions): string {
  if (key === "housing" && (a.installmentMonthly ?? 0) > 0)
    return "Cicilan rumah (angkamu)";
  if (key === "education" && a.children === 0) return "Pendidikan & kursus";
  return EXPENSE_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

/**
 * What the income line is: own salary, the origin city's wage, or the
 * region's — UMK or UMP per its legal basis, with the after-deduction figure
 * marked as the estimate it is — plus a working partner's salary or the same
 * minimum wage. `kind` belongs to the record the income comes from (the
 * origin city in relocation mode).
 */
export function wageLabel(
  m: RegionMetrics,
  a: Assumptions,
  kind: WageKind = "UMK",
): string {
  const net = a.wageBasis === "takeHome" ? " setelah potongan (est.)" : "";
  const own =
    m.wageSource === "custom"
      ? "Gajimu"
      : m.wageSource === "origin"
        ? `${kind} kota asal${net}`
        : `${kind}${net}`;
  if (m.partnerWageSource == null) return own;
  if (m.partnerWageSource === "custom") return `${own} + gaji pasangan`;
  return m.wageSource === "custom" ? `${own} + ${kind} pasangan` : `${own} × 2`;
}

export function confidenceLabel(c: Confidence): string {
  return c === "official" ? "Resmi" : c === "estimate" ? "Estimasi" : "Sampel";
}
