/**
 * Formatting. Rupiah follows EYD: "Rp" directly before the number, dots as
 * thousand separators ("Rp1.235.000"). Display rounds to the nearest
 * thousand; state keeps full precision. Every rupiah helper formats the
 * magnitude — sign words ("sisa", "kurang") or rpSigned carry the direction.
 */

const grouping = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

function thousands(value: number): number {
  return Math.round(Math.abs(value) / 1000) * 1000;
}

/** "1.235.000" — receipt figures, no currency prefix. */
export function digits(value: number): string {
  return grouping.format(thousands(value));
}

/** "Rp1.235.000" */
export function rp(value: number): string {
  return `Rp${digits(value)}`;
}

/** "Rp4,74 jt" / "Rp832 rb" — compact, for sentences and tight UI. */
export function rpShort(value: number): string {
  const rb = Math.round(Math.abs(value) / 1000);
  if (rb >= 1000) {
    const jt = Math.abs(value) / 1_000_000;
    return `Rp${jt.toLocaleString("id-ID", { maximumFractionDigits: 2 })} jt`;
  }
  return `Rp${grouping.format(rb)} rb`;
}

/** "+Rp426 rb" / "−Rp1,25 jt" (true minus sign). */
export function rpSigned(value: number, short = true): string {
  const sign = value >= 0 ? "+" : "−";
  return `${sign}${short ? rpShort(value) : rp(value)}`;
}

/** "97%" / "97,1%" */
export function pct(value: number, fractionDigits = 0): string {
  return `${value.toLocaleString("id-ID", { maximumFractionDigits: fractionDigits })}%`;
}

/** "1 Agustus 2026" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "Agustus 2026" */
export function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}
