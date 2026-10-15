import shotsJson from "../data/shots-v040.json";
import updateJson from "../data/update.json";
import type { ReceiptData } from "../data";
import type { BandCounts } from "../types";

/** Figures for v0.4.0 from scripts/build-data.ts (src/lib/calculations.ts). */
export const UPD = updateJson as unknown as {
  /** Tanggungan keluarga in the example: the app's own "cth. 1.000.000". */
  support: number;
  /** profileSummary() of each profile, as the app prints it. */
  profiles: { room: string; owner: string; ownerSupport: string };
  counts: Record<"room" | "owner" | "ownerSupport", BandCounts>;
  perRegion: Record<string, { umk: number; cost: number; costOwner: number }>;
  /** Kota Yogyakarta, rumah sendiri + tanggungan keluarga. */
  jogja: ReceiptData;
};

/** "cukup atau nyaman": regions at 100% or more, as the app's tally counts them. */
export const covered = (c: BandCounts) => c.comfortable + c.manageable;

export interface Shot {
  file: string;
  /** CSS px of the crop (the PNG is @3x). */
  w: number;
  h: number;
  /** Tap targets, CSS px from the crop's top-left. */
  targets: Record<string, { x: number; y: number }>;
}

const SHOTS = shotsJson as Record<string, Shot>;

/** A crop of the real app from `npm run shots -- ../out --set=update`. */
export function shot(name: string): Shot {
  const s = SHOTS[name];
  if (!s) throw new Error(`Screenshot ${name} tidak ada: jalankan npm run shots -- ../out --set=update`);
  return s;
}
