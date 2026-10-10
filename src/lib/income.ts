/**
 * Salary input helpers. The slider snaps to stops that are fine where most
 * wages sit and coarser above: 1–10 jt per 100 rb, then 10,5–25 jt per
 * 500 rb (121 stops). The text field next to it accepts any amount.
 */
export const SALARY_STEPS: readonly number[] = [
  ...Array.from({ length: 91 }, (_, i) => 1_000_000 + i * 100_000),
  ...Array.from({ length: 30 }, (_, i) => 10_500_000 + i * 500_000),
];

/** Index of the stop closest to `value` (clamped to the ends). */
export function salaryStepIndex(value: number): number {
  let lo = 0;
  let hi = SALARY_STEPS.length - 1;
  if (value <= SALARY_STEPS[lo]) return lo;
  if (value >= SALARY_STEPS[hi]) return hi;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (SALARY_STEPS[mid] <= value) lo = mid;
    else hi = mid;
  }
  return value - SALARY_STEPS[lo] <= SALARY_STEPS[hi] - value ? lo : hi;
}

/** Round to the nearest 100 rb — a friendly starting salary. */
export function roundSalary(value: number): number {
  return Math.round(value / 100_000) * 100_000;
}

/** Digits only, at most 12; empty or zero means "not set". */
export function parseRupiah(input: string): number | null {
  const digits = input.replace(/\D/g, "").slice(0, 12);
  const n = Number(digits);
  return digits && n > 0 ? n : null;
}

/** "4.500.000" for an input's value; empty when unset. */
export function rupiahInput(value: number | null | undefined): string {
  return value ? value.toLocaleString("id-ID") : "";
}
