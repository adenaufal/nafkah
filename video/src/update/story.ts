import { MAP, blendBands, classify, countBands } from "../data";
import { clamp01, easeInOut, lerp } from "../motion";
import type { Cam } from "../story";
import type { AffordabilityBand } from "../types";
import { UPD } from "./data";
import { SCENE, cue } from "./timeline";

/*
 * What the map shows at any frame, as the app computes it: coverage = UMK /
 * monthly cost (src/lib/calculations.ts). The profile starts at the app's
 * default (lajang, rusun/kost), switches to "Rumah sendiri", then adds the
 * family support to every region's total. Changes roll west → east.
 */

const regions = MAP.regions.map((r) => ({ ...r, ...UPD.perRegion[r.code] }));

/** Taps and typing, shared by the scenes, the map and the sound. */
export const TAP = {
  /** "Rumah sendiri", on the word "rumah". */
  get owner() {
    return cue("owner") + 2;
  },
  /** Into the Tanggungan keluarga field, as "tanggungan" is said. */
  get support() {
    return cue("support") - 2;
  },
};

/** One key per few frames: "1.000.000" is seven digits. */
export const TYPE = {
  keys: String(UPD.support).length,
  step: 2.5,
  get start() {
    return TAP.support + 6;
  },
  get end() {
    return this.start + this.keys * this.step;
  },
};

/** Digits typed by `frame` (0 = the empty field with its placeholder). */
export const typedAt = (frame: number, start: number, keys: number, step = TYPE.step) =>
  Math.max(0, Math.min(keys, Math.floor((frame - start) / step) + 1));

export const PHASE = {
  get owner() {
    return TAP.owner + 3;
  },
  get support() {
    return TYPE.end + 3;
  },
};

/** 0→1 progress for one region, delayed by its position in the wave. */
function wave(frame: number, start: number, delay: number, dur = 6): number {
  return easeInOut(clamp01((frame - start - delay) / dur));
}

/** Frames until the last region (far east) has changed. */
export const WAVE_FRAMES = 16;

function coverage(i: number, frame: number): number {
  const r = regions[i];
  const west = (r.cx / MAP.width) * 10;
  const owner = wave(frame, PHASE.owner, west);
  const support = wave(frame, PHASE.support, west);
  const cost = lerp(r.cost, r.costOwner, owner) + support * UPD.support;
  return (r.umk / cost) * 100;
}

/** The map has faded out under the other features by this frame. */
export const mapHiddenAt = () => SCENE.more.from + 12;

export function bandsAt(frame: number): AffordabilityBand[] {
  // The end card shows the app's default map (UMK, lajang, rusun/kost);
  // swapped while the map is hidden.
  if (frame >= mapHiddenAt()) return regions.map((r) => classify((r.umk / r.cost) * 100));
  return regions.map((_, i) => classify(coverage(i, frame)));
}

/** Fill per region, cross-faded over the last 2 frames. */
export function fillsAt(frame: number): string[] {
  const now = bandsAt(frame);
  const prev = bandsAt(frame - 1);
  return now.map((b, i) => blendBands([b, b, prev[i]]));
}

export const countsAt = (frame: number) => countBands(bandsAt(frame));

const CENTER = { fx: MAP.width / 2, fy: MAP.height / 2 };

/** Portrait only: the whole country above the controls, then the end card. */
export const CAM: Record<"feature" | "end", Cam> = {
  feature: { ...CENTER, sx: 540, sy: 478, k: 1.0 },
  end: { ...CENTER, sx: 540, sy: 560, k: 0.98 },
};

export function cameraAt(frame: number): Cam {
  if (frame >= SCENE.cta.from) return CAM.end;
  // A slow push-in keeps the still map alive while it recolours.
  const t = clamp01((frame - SCENE.home.from) / (SCENE.more.from - SCENE.home.from));
  return { ...CAM.feature, k: lerp(1.0, 1.05, easeInOut(t)) };
}
