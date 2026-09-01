/**
 * Formatting: rupiah as Rp 1.234.567 (Indonesian grouping).
 * Display rounds to the nearest thousand; state keeps full precision.
 */

const grouping = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

export function formatIDR(value: number): string {
  const rounded = Math.round(value / 1000) * 1000;
  return `Rp ${grouping.format(rounded)}`;
}

/** Compact for axes/tooltips: Rp 4,4 jt / Rp 720 rb */
export function formatIDRCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
  }
  if (Math.abs(value) >= 1_000) {
    return `Rp ${grouping.format(Math.round(value / 1000))} rb`;
  }
  return formatIDR(value);
}

export function formatPct(value: number): string {
  return `${value.toLocaleString("id-ID", { maximumFractionDigits: 1 })}%`;
}

export function formatSignedIDR(value: number): string {
  const sign = value >= 0 ? "+" : "−";
  return `${sign}${formatIDR(Math.abs(value)).replace("Rp", "Rp ")}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
