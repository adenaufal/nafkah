import { Easing, interpolate, spring, type SpringConfig } from "remotion";
import { VIDEO } from "./theme";

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 0→1 between two frames with an ease. */
export function ramp(
  frame: number,
  from: number,
  to: number,
  easing: (t: number) => number = Easing.inOut(Easing.cubic),
): number {
  if (to <= from) return frame >= to ? 1 : 0;
  return interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
}

export const SNAPPY: Partial<SpringConfig> = { damping: 15, mass: 0.7, stiffness: 170 };
export const SMOOTH: Partial<SpringConfig> = { damping: 200 };
export const POP: Partial<SpringConfig> = { damping: 11, mass: 0.6, stiffness: 190 };

/** Spring that starts at `start` (absolute frame). */
export function springAt(
  frame: number,
  start: number,
  config: Partial<SpringConfig> = SNAPPY,
  durationInFrames?: number,
): number {
  return spring({
    frame: frame - start,
    fps: VIDEO.fps,
    config,
    durationInFrames,
  });
}

/** In at `inAt`, out at `outAt` — opacity-style 0→1→0 envelope. */
export function envelope(
  frame: number,
  inAt: number,
  outAt: number,
  inDur = 8,
  outDur = 8,
): number {
  return Math.min(ramp(frame, inAt, inAt + inDur), 1 - ramp(frame, outAt - outDur, outAt));
}

export const easeOut = Easing.out(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);
