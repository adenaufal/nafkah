import { AFFORDABILITY_BANDS, BAND_LABEL, bandColors } from "./calculations";
import type { AffordabilityBand } from "./types";

/** Display order, most to least comfortable. */
export const BAND_ORDER: AffordabilityBand[] = [
  "comfortable",
  "manageable",
  "tight",
  "insufficient",
];

/** What each band means, in one line (Metode and the booklet). */
export const BAND_MEANING: Record<AffordabilityBand, string> = {
  comfortable:
    "Biaya hidup tertutup dan masih tersisa seperlimanya atau lebih.",
  manageable: "Biaya hidup tertutup, sisanya tipis.",
  tight: "Kurang, sampai seperlima biaya hidup.",
  insufficient: "Kurang lebih dari seperlima biaya hidup.",
};

/** "≥ 120%", "100–119%", "80–99%", "< 80%" — derived from the constants. */
export function bandRange(band: AffordabilityBand): string {
  const b = AFFORDABILITY_BANDS;
  if (band === "comfortable") return `≥ ${b.comfortableAt}%`;
  if (band === "manageable") return `${b.manageableAt}–${b.comfortableAt - 1}%`;
  if (band === "tight") return `${b.tightAt}–${b.manageableAt - 1}%`;
  return `< ${b.tightAt}%`;
}

/**
 * Text-safe band colours. The map fills are tuned for area, and the lighter
 * ones (Cukup blue, Ketat amber) fall below AA as small text on paper.
 */
const BAND_INK_LIGHT: Record<AffordabilityBand, string> = {
  comfortable: "#0b6b42",
  manageable: "#22698a",
  tight: "#8a5a0c",
  insufficient: "#a5271f",
};
const BAND_INK_DARK: Record<AffordabilityBand, string> = {
  comfortable: "#5fd3a0",
  manageable: "#8ccbe6",
  tight: "#f3cd6e",
  insufficient: "#ff8b80",
};

export interface BandStyle {
  label: string;
  range: string;
  /** Area colour (map, dots, swatches). */
  fill: string;
  /** Text colour that keeps AA contrast on the paper surface. */
  ink: string;
}

export function bandTheme(dark: boolean): Record<AffordabilityBand, BandStyle> {
  const fill = bandColors(dark);
  const ink = dark ? BAND_INK_DARK : BAND_INK_LIGHT;
  return Object.fromEntries(
    BAND_ORDER.map((band) => [
      band,
      {
        label: BAND_LABEL[band],
        range: bandRange(band),
        fill: fill[band],
        ink: ink[band],
      },
    ]),
  ) as Record<AffordabilityBand, BandStyle>;
}
