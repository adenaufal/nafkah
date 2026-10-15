import type { CSSProperties } from "react";
import { Img, staticFile } from "remotion";
import { Touch } from "../../components/Touch";
import { lerp } from "../../motion";
import { C } from "../../theme";
import { shot } from "../data";

export interface Tap {
  /** Target name in the crop's manifest entry. */
  target: string;
  press: number;
  ripple: number;
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/** 0→1 finger down and up around `at`, with a ripple on contact. */
export function tapAt(frame: number, at: number, target: string): Tap {
  const press = Math.min(clamp((frame - (at - 7)) / 5), 1 - clamp((frame - (at + 4)) / 5));
  return { target, press, ripple: clamp((frame - at) / 12) };
}

const CARD_SHADOW = `0 0 0 2px ${C.rule}, 0 2px 6px rgb(30 27 24 / 0.06), 0 26px 60px rgb(30 27 24 / 0.12)`;

/** A highlighter stroke over words in a crop (CSS px), drawn left to right by `t`. */
export interface Mark {
  x: number;
  y: number;
  w: number;
  h: number;
  t: number;
}

function Marks({ marks, scale }: { marks: Mark[]; scale: number }) {
  return (
    <>
      {marks.map((m, i) =>
        m.t > 0.001 ? (
          <div
            key={i}
            style={{
              position: "absolute",
              left: m.x * scale,
              top: m.y * scale,
              width: m.w * scale * Math.min(1, m.t),
              height: m.h * scale,
              borderRadius: 8,
              background: "rgb(226 163 54 / 0.42)",
              mixBlendMode: "multiply",
            }}
          />
        ) : null,
      )}
    </>
  );
}

/**
 * A crop of the real app (public/shots/v040) on a card. `states` are crops of
 * the same control; `at` picks one, and a fraction cross-fades to the next
 * (the card's height follows). Drawn at `scale` × the app's CSS pixels.
 */
export function UiShot({
  states,
  at = 0,
  scale,
  tap,
  marks = [],
  style,
}: {
  states: string[];
  at?: number;
  scale: number;
  tap?: Tap;
  marks?: Mark[];
  style?: CSSProperties;
}) {
  const i = Math.max(0, Math.min(states.length - 1, Math.floor(at)));
  const j = Math.min(states.length - 1, i + 1);
  const f = Math.min(1, Math.max(0, at - i));
  const a = shot(states[i]);
  const b = shot(states[j]);
  const width = Math.max(a.w, b.w) * scale;
  const height = lerp(a.h, b.h, f) * scale;
  const target = tap ? (f < 0.5 ? a : b).targets[tap.target] : undefined;
  return (
    <div style={{ position: "relative", width, height, ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          borderRadius: 30,
          background: C.paper,
          boxShadow: CARD_SHADOW,
        }}
      >
        <Img src={staticFile(a.file)} style={{ position: "absolute", left: 0, top: 0, width: a.w * scale }} />
        {f > 0 && j !== i && (
          <Img
            src={staticFile(b.file)}
            style={{ position: "absolute", left: 0, top: 0, width: b.w * scale, opacity: f }}
          />
        )}
        <Marks marks={marks} scale={scale} />
      </div>
      {tap && target && <Touch x={target.x * scale} y={target.y * scale} press={tap.press} ripple={tap.ripple} />}
    </div>
  );
}

/**
 * A horizontal band of one crop (`top`…`top + height`, CSS px) on a card, for
 * crops taller than the frame; `top` can move to scroll. The band's edges
 * fade instead of cutting a line of text in half.
 */
export function ShotSlice({
  name,
  top,
  height,
  scale,
  tap,
  fade = 18,
  style,
}: {
  name: string;
  top: number;
  height: number;
  scale: number;
  tap?: Tap;
  /** CSS px of fade at a cut edge. */
  fade?: number;
  style?: CSSProperties;
}) {
  const s = shot(name);
  const target = tap ? s.targets[tap.target] : undefined;
  const cutTop = top > 0.5;
  const cutBottom = top + height < s.h - 0.5;
  const f = fade * scale;
  const mask = `linear-gradient(to bottom, ${cutTop ? `transparent 0, #000 ${f}px` : "#000 0"}, ${
    cutBottom ? `#000 calc(100% - ${f}px), transparent 100%` : "#000 100%"
  })`;
  return (
    <div style={{ position: "relative", width: s.w * scale, height: height * scale, ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          borderRadius: 30,
          background: C.paper,
          boxShadow: CARD_SHADOW,
        }}
      >
        <div style={{ position: "absolute", inset: 0, maskImage: mask, WebkitMaskImage: mask }}>
          <Img src={staticFile(s.file)} style={{ position: "absolute", left: 0, top: -top * scale, width: s.w * scale }} />
        </div>
      </div>
      {tap && target && (
        <Touch x={target.x * scale} y={(target.y - top) * scale} press={tap.press} ripple={tap.ripple} />
      )}
    </div>
  );
}
