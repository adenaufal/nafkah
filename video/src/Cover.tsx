import type { CSSProperties } from "react";
import { AbsoluteFill } from "remotion";
import { IndonesiaMap } from "./components/IndonesiaMap";
import { Logo } from "./components/ui";
import { MAP, NUM, blendBands, classify } from "./data";
import { loadFonts } from "./fonts";
import { useFormat } from "./format";
import { BAND_FILL, BAND_LABEL, BAND_ORDER, C, DISPLAY_STYLE, FONT } from "./theme";

loadFonts();

/** The app's default map: UMK, lajang. */
const FILLS = MAP.regions.map((r) => {
  const v = NUM.perRegion[r.code];
  return blendBands([classify((v.umk / v.cost) * 100)]);
});

const HEADLINE = {
  ...DISPLAY_STYLE,
  fontWeight: 620,
  lineHeight: 1.0,
  letterSpacing: "-0.02em",
  color: C.ink,
} as const;

export function Cover() {
  return useFormat() === "landscape" ? <WideCover /> : <TallCover />;
}

/**
 * Cover for Reels/TikTok. Key content sits inside the centre 1080×1350,
 * which is what the profile grid shows.
 */
function TallCover() {
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Logo scale={0.95} />
      </div>
      <div style={{ ...HEADLINE, position: "absolute", top: 470, left: 70, right: 70, textAlign: "center", fontSize: 124 }}>
        Gajimu cukup
        <br />
        buat hidup
        <br />
        <span style={{ color: C.accent }}>di mana?</span>
      </div>
      <IndonesiaMap fills={FILLS} cam={{ fx: MAP.width / 2, fy: MAP.height / 2, sx: 540, sy: 1040, k: 1.02 }} />
      <Legend style={{ top: 1290, left: 0, right: 0 }} />
      <div style={{ position: "absolute", top: 1395, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Chip />
      </div>
    </AbsoluteFill>
  );
}

/** Thumbnail for YouTube / X: headline left, map right, both large. */
function WideCover() {
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <div style={{ position: "absolute", top: 190, left: 110 }}>
        <Logo scale={0.95} />
      </div>
      <div style={{ ...HEADLINE, position: "absolute", top: 330, left: 110, fontSize: 132 }}>
        Gajimu cukup
        <br />
        buat hidup
        <br />
        <span style={{ color: C.accent }}>di mana?</span>
      </div>
      <div style={{ position: "absolute", top: 800, left: 110 }}>
        <Chip />
      </div>
      <IndonesiaMap fills={FILLS} cam={{ fx: MAP.width / 2, fy: MAP.height / 2, sx: 1410, sy: 540, k: 0.86 }} />
      <Legend style={{ top: 760, left: 980, right: 80 }} />
    </AbsoluteFill>
  );
}

function Legend({ style }: { style: CSSProperties }) {
  return (
    <div style={{ position: "absolute", display: "flex", justifyContent: "center", gap: 30, ...style }}>
      {BAND_ORDER.map((b) => (
        <div key={b} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FONT.sans, fontSize: 34, fontWeight: 700, color: C.ink2 }}>
          <span style={{ width: 30, height: 30, borderRadius: 999, background: BAND_FILL[b] }} />
          {BAND_LABEL[b]}
        </div>
      ))}
    </div>
  );
}

function Chip() {
  return (
    <div
      style={{
        fontFamily: FONT.sans,
        fontSize: 30,
        fontWeight: 800,
        letterSpacing: "0.12em",
        color: C.accentInk,
        background: C.accentSoft,
        padding: "16px 30px",
        borderRadius: 999,
      }}
    >
      514 KAB/KOTA · TAMPILAN BARU
    </div>
  );
}
