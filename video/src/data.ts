import mapJson from "./data/map.json";
import numbersJson from "./data/numbers.json";
import { BAND_FILL, BAND_ORDER } from "./theme";
import type { AffordabilityBand, BandCounts } from "./types";

export interface MapRegion {
  code: string;
  d: string;
  /** Projected centroid in map units (0..MAP.width). */
  cx: number;
  cy: number;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const MAP = mapJson as unknown as {
  width: number;
  height: number;
  java: Box;
  pins: { jogja: [number, number]; jaksel: [number, number] };
  regions: MapRegion[];
};

export interface ReceiptData {
  code: string;
  label: string;
  province: string;
  wage: number;
  total: number;
  coverage: number;
  surplus: number;
  band: AffordabilityBand;
  rows: { key: string; label: string; value: number; share: number }[];
}

export const NUM = numbersJson as unknown as {
  bands: { comfortableAt: number; manageableAt: number; tightAt: number };
  defaultCounts: BandCounts;
  familyCounts: BandCounts;
  familyDualCounts: BandCounts;
  salaryCounts: Record<string, BandCounts>;
  perRegion: Record<string, { umk: number; cost: number; costFamily2: number }>;
  jogja: ReceiptData;
  jogjaWithJakselWage: ReceiptData;
  jaksel: { code: string; label: string; umk: number };
};

/** classify() from src/lib/calculations.ts. */
export function classify(coverage: number): AffordabilityBand {
  const b = NUM.bands;
  if (coverage >= b.comfortableAt) return "comfortable";
  if (coverage >= b.manageableAt) return "manageable";
  if (coverage >= b.tightAt) return "tight";
  return "insufficient";
}

export function emptyCounts(): BandCounts {
  return { comfortable: 0, manageable: 0, tight: 0, insufficient: 0 };
}

export function countBands(bands: Iterable<AffordabilityBand>): BandCounts {
  const c = emptyCounts();
  for (const b of bands) c[b]++;
  return c;
}

/* ---------- Colour ---------- */

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const RGB = Object.fromEntries(
  BAND_ORDER.map((b) => [b, hexToRgb(BAND_FILL[b])]),
) as Record<AffordabilityBand, [number, number, number]>;

/**
 * Average band colour over the last few frames: a region that changes band
 * cross-fades over that many frames instead of snapping. `history` lists the
 * band at frame f, f-1, f-2, …
 */
export function blendBands(history: AffordabilityBand[]): string {
  let r = 0;
  let g = 0;
  let b = 0;
  for (const band of history) {
    const c = RGB[band];
    r += c[0];
    g += c[1];
    b += c[2];
  }
  const n = history.length;
  return `rgb(${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)})`;
}

export function mix(a: string, b: string, t: number): string {
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  const k = Math.min(1, Math.max(0, t));
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * k)).join(",")})`;
}

/* ---------- Format (src/lib/format.ts) ---------- */

const grouping = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

/** "1.235.000" — rounded to the nearest thousand, like the receipt. */
export function digits(value: number): string {
  return grouping.format(Math.round(Math.abs(value) / 1000) * 1000);
}

/** "3.000.000" — exact, like the salary field. */
export function rupiahInput(value: number): string {
  return grouping.format(value);
}

export function pct(value: number): string {
  return `${Math.round(value).toLocaleString("id-ID")}%`;
}
