import { Img, staticFile } from "remotion";
import { FONT } from "../theme";

/** Screenshots are 390×844 CSS px @3x. */
const SCREEN_RATIO = 2532 / 1170;

/** A plain modern phone (no brand) around a real Nafkah screenshot. */
export function Phone({
  src,
  width,
  dark = false,
  crossfadeTo,
  crossfade = 0,
}: {
  src: string;
  width: number;
  dark?: boolean;
  /** Second screenshot faded in on top (same theme). */
  crossfadeTo?: string;
  crossfade?: number;
}) {
  const bezel = width * 0.034;
  const screenW = width - bezel * 2;
  const statusH = screenW * 0.115;
  const screenH = screenW * SCREEN_RATIO * 0.93 + statusH;
  const height = screenH + bezel * 2;
  const radius = width * 0.15;
  const fg = dark ? "#f0ece7" : "#1e1b18";
  const bg = dark ? "#1b1815" : "#f8f6f1";
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: radius,
        background: "#16130f",
        padding: bezel,
        boxSizing: "border-box",
        boxShadow:
          "0 0 0 2px #3a342d inset, 0 4px 10px rgb(30 27 24 / 0.18), 0 40px 90px rgb(30 27 24 / 0.28)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: screenW,
          height: screenH,
          borderRadius: radius - bezel,
          overflow: "hidden",
          background: bg,
        }}
      >
        <div
          style={{
            height: statusH,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `0 ${screenW * 0.09}px`,
            fontFamily: FONT.sans,
            fontWeight: 700,
            fontSize: screenW * 0.042,
            color: fg,
          }}
        >
          <span>9:41</span>
          <span style={{ display: "flex", gap: screenW * 0.015, alignItems: "center" }}>
            <Bars color={fg} size={screenW * 0.045} />
            <Battery color={fg} size={screenW * 0.06} />
          </span>
        </div>
        <div style={{ position: "relative" }}>
          <Img src={staticFile(src)} style={{ width: "100%", display: "block" }} />
          {crossfadeTo && (
            <Img
              src={staticFile(crossfadeTo)}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", display: "block", opacity: crossfade }}
            />
          )}
        </div>
        <div
          style={{
            position: "absolute",
            top: screenW * 0.028,
            left: "50%",
            width: screenW * 0.3,
            height: screenW * 0.082,
            transform: "translateX(-50%)",
            borderRadius: 999,
            background: "#0b0a09",
          }}
        />
      </div>
    </div>
  );
}

function Bars({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 20 14">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 5.2} y={10 - i * 3} width={3.6} height={4 + i * 3} rx={1} fill={color} />
      ))}
    </svg>
  );
}

function Battery({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 26 13">
      <rect x={0.75} y={0.75} width={22} height={11.5} rx={3.2} fill="none" stroke={color} strokeOpacity={0.45} strokeWidth={1.5} />
      <rect x={2.6} y={2.6} width={16} height={7.8} rx={1.8} fill={color} />
      <rect x={24} y={4.3} width={1.6} height={4.4} rx={0.8} fill={color} fillOpacity={0.45} />
    </svg>
  );
}
