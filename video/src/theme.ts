import type { AffordabilityBand } from "./types";

/** Atlas tokens from src/app/globals.css (light theme). */
export const C = {
  accent: "#c2452d",
  accentStrong: "#a83624",
  accentSoft: "#f6e3dc",
  accentInk: "#a83624",
  paper: "#f8f6f1",
  paper2: "#f0ece4",
  paper3: "#e8e2d8",
  ink: "#1e1b18",
  ink2: "#4a433d",
  muted: "#6b6660",
  rule: "#e2dbd0",
  rule2: "#cdc4b6",
  field: "#948b80",
  ok: "#0b6b42",
  danger: "#a5271f",
  white: "#ffffff",
} as const;

/** Map fills — BAND_COLORS in src/lib/calculations.ts. */
export const BAND_FILL: Record<AffordabilityBand, string> = {
  comfortable: "#0b7a4b",
  manageable: "#56a3c4",
  tight: "#e2a336",
  insufficient: "#a5271f",
};

/** Text-safe band colours — BAND_INK_LIGHT in src/lib/bands.ts. */
export const BAND_INK: Record<AffordabilityBand, string> = {
  comfortable: "#0b6b42",
  manageable: "#22698a",
  tight: "#8a5a0c",
  insufficient: "#a5271f",
};

export const BAND_LABEL: Record<AffordabilityBand, string> = {
  comfortable: "Nyaman",
  manageable: "Cukup",
  tight: "Ketat",
  insufficient: "Tak Cukup",
};

export const BAND_ORDER: AffordabilityBand[] = [
  "comfortable",
  "manageable",
  "tight",
  "insufficient",
];

export const FONT = {
  sans: '"Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif',
  display: 'Fraunces, Georgia, serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
} as const;

/** `.f-display` in globals.css. */
export const DISPLAY_STYLE = {
  fontFamily: FONT.display,
  fontVariationSettings: '"SOFT" 40, "opsz" 72',
  fontVariantNumeric: "lining-nums",
} as const;

export const VIDEO = { width: 1080, height: 1920, fps: 30 } as const;

/** 16:9 cut (YouTube, X, LinkedIn): same timeline, landscape layout. */
export const WIDE = { width: 1920, height: 1080 } as const;

/**
 * Keep text clear of platform chrome (TikTok/Reels/Threads): top bar,
 * bottom caption block and the right-hand action rail.
 */
export const SAFE = { top: 210, bottom: 1440, left: 70, right: 960 } as const;

/** Phone UI is drawn at this multiple of the app's CSS pixels. */
export const UI = 2.4;
