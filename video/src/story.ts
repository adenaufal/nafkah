import { MAP, NUM, blendBands, classify, countBands } from "./data";
import type { Format } from "./format";
import { clamp01, easeInOut, lerp, ramp } from "./motion";
import { SCENE, cue } from "./timeline";
import type { AffordabilityBand } from "./types";

/*
 * What the map shows at any frame, as the app would compute it:
 * coverage = income / monthly cost per region (src/lib/calculations.ts).
 * Each step of the story changes income or cost; changes roll across the
 * map as a wave (west→east, or outward from a city) so the recount reads.
 */

export const SALARY_FROM = 3_000_000;
export const SALARY_TO = 5_000_000;

export const DRAG = {
  get start() {
    return cue("drag") + 2;
  },
  get end() {
    return Math.max(cue("recount") + 12, cue("drag") + 50);
  },
};

/** Gajiku slider value: snaps to 100 rb like SALARY_STEPS. */
export function salaryAt(frame: number): number {
  const t = ramp(frame, DRAG.start, DRAG.end, easeInOut);
  const raw = lerp(SALARY_FROM, SALARY_TO, t);
  return Math.round(raw / 100_000) * 100_000;
}

const regions = MAP.regions.map((r) => {
  const v = NUM.perRegion[r.code];
  return { ...r, ...v };
});

const [jogX, jogY] = MAP.pins.jogja;
const [jakX, jakY] = MAP.pins.jaksel;
const maxDist = (x: number, y: number) =>
  Math.max(...regions.map((r) => Math.hypot(r.cx - x, r.cy - y)));
const FROM_JOGJA = maxDist(jogX, jogY);
const FROM_JAKARTA = maxDist(jakX, jakY);

/** 0→1 progress for one region, delayed by its position in the wave. */
function wave(frame: number, start: number, delay: number, dur = 8): number {
  return easeInOut(clamp01((frame - start - delay) / dur));
}

export const PHASE = {
  get family() {
    return cue("kids") + 3;
  },
  get dual() {
    return cue("dual") + 10;
  },
  get reset() {
    return SCENE.receipt.from + 2;
  },
  get relocate() {
    return cue("wage") + 8;
  },
};

const JAKSEL_UMK = NUM.jaksel.umk;

function coverage(i: number, frame: number): number {
  const r = regions[i];
  const west = (r.cx / MAP.width) * 10;
  // 1. Gajiku, lajang.
  const salary = salaryAt(frame);
  // 2. Keluarga, 2 anak; 3. pasangan ikut bekerja (UMK daerah).
  const fam = wave(frame, PHASE.family, west, 6);
  const dual = wave(frame, PHASE.dual, west, 6);
  let wage = salary + dual * r.umk;
  let cost = lerp(r.cost, r.costFamily2, fam);
  // 4. Back to the app's default view (UMK, lajang), rippling out from Jogja.
  const reset = wave(frame, PHASE.reset, (Math.hypot(r.cx - jogX, r.cy - jogY) / FROM_JOGJA) * 14);
  wage = lerp(wage, r.umk, reset);
  cost = lerp(cost, r.cost, reset);
  // 5. "Upah kotaku" = Kota Jakarta Selatan, rippling out from Jakarta.
  const move = wave(
    frame,
    PHASE.relocate,
    (Math.hypot(r.cx - jakX, r.cy - jakY) / FROM_JAKARTA) * 20,
    10,
  );
  wage = lerp(wage, JAKSEL_UMK, move);
  return (wage / cost) * 100;
}

/** The map has faded out under the app montage by this frame. */
export const mapHiddenAt = () => SCENE.app.from + 10;

/** The end card shows the app's default map: UMK, lajang. */
function defaultCoverage(i: number): number {
  const r = regions[i];
  return (r.umk / r.cost) * 100;
}

export function bandsAt(frame: number): AffordabilityBand[] {
  // Swapped while the map is hidden, so the fade-out keeps the last story.
  if (frame >= mapHiddenAt()) return regions.map((_, i) => classify(defaultCoverage(i)));
  return regions.map((_, i) => classify(coverage(i, frame)));
}

/** Fill per region, cross-faded over the last 2 frames. */
export function fillsAt(frame: number): string[] {
  const now = bandsAt(frame);
  const prev = bandsAt(frame - 1);
  return now.map((b, i) => blendBands([b, b, prev[i]]));
}

export const countsAt = (frame: number) => countBands(bandsAt(frame));

/* ---------- Camera ---------- */

export interface Cam {
  /** Map point (map units) placed at screen point (sx, sy), scale k px/unit. */
  fx: number;
  fy: number;
  sx: number;
  sy: number;
  k: number;
}

/** Tap on Jogja: the frame the region is "opened". */
export const openAt = () => SCENE.receipt.from + 24;

interface Shots {
  hook: Cam;
  overview: Cam;
  /** Zoom on Kota Yogyakarta as it is tapped. */
  jogja: Cam;
  /** Landscape only: the map shifts right as the region rail opens beside it. */
  rail?: Cam;
  move: Cam;
  end: Cam;
}

const CENTER = { fx: MAP.width / 2, fy: MAP.height / 2 };
const ON_JOGJA = { fx: jogX, fy: jogY };
const JAKARTA_JOGJA = { fx: (jogX + jakX) / 2, fy: (jogY + jakY) / 2 };

export const CAM: Record<Format, Shots> = {
  portrait: {
    hook: { ...CENTER, sx: 540, sy: 765, k: 1.12 },
    overview: { ...CENTER, sx: 540, sy: 440, k: 1.0 },
    jogja: { ...ON_JOGJA, sx: 540, sy: 400, k: 8 },
    move: { ...JAKARTA_JOGJA, sx: 560, sy: 392, k: 6.4 },
    end: { ...CENTER, sx: 540, sy: 560, k: 0.98 },
  },
  // Cards sit in a left column (like the app's desktop rail); the map
  // keeps the right of the frame.
  landscape: {
    hook: { ...CENTER, sx: 960, sy: 500, k: 1.5 },
    overview: { ...CENTER, sx: 1335, sy: 385, k: 0.98 },
    jogja: { ...ON_JOGJA, sx: 960, sy: 540, k: 8 },
    rail: { ...ON_JOGJA, sx: 1350, sy: 520, k: 9 },
    move: { ...JAKARTA_JOGJA, sx: 1380, sy: 500, k: 7 },
    end: { ...CENTER, sx: 960, sy: 345, k: 1.05 },
  },
};

export function mixCam(a: Cam, b: Cam, t: number): Cam {
  return {
    fx: lerp(a.fx, b.fx, t),
    fy: lerp(a.fy, b.fy, t),
    sx: lerp(a.sx, b.sx, t),
    sy: lerp(a.sy, b.sy, t),
    k: Math.exp(lerp(Math.log(a.k), Math.log(b.k), t)),
  };
}

export function cameraAt(frame: number, format: Format): Cam {
  const shot = CAM[format];
  if (frame >= SCENE.cta.from) return shot.end;
  let cam: Cam = shot.hook;
  cam = mixCam(cam, shot.overview, ramp(frame, SCENE.slider.from, SCENE.slider.from + 20));
  cam = mixCam(cam, shot.jogja, ramp(frame, SCENE.receipt.from, SCENE.receipt.from + 26));
  if (shot.rail) cam = mixCam(cam, shot.rail, ramp(frame, openAt() + 2, openAt() + 20));
  cam = mixCam(cam, shot.move, ramp(frame, cue("wage"), cue("wage") + 22));
  return cam;
}
