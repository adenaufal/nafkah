import { BAND_FILL, BAND_LABEL, BAND_ORDER, C, DISPLAY_STYLE, FONT } from "../theme";
import type { BandCounts } from "../types";
import { Dot } from "./ui";

/** "Sebaran 514 daerah": stacked bar + four counts, as in the national rail. */
export function Distribution({ counts, width }: { counts: BandCounts; width: number }) {
  const total = BAND_ORDER.reduce((s, b) => s + counts[b], 0) || 1;
  return (
    <div style={{ width }}>
      <div style={{ display: "flex", gap: 4, height: 28, borderRadius: 7, overflow: "hidden" }}>
        {BAND_ORDER.map((b) => (
          <div
            key={b}
            style={{
              flexGrow: counts[b] / total,
              flexBasis: 0,
              minWidth: counts[b] > 0 ? 4 : 0,
              background: BAND_FILL[b],
            }}
          />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", marginTop: 18 }}>
        {BAND_ORDER.map((b) => (
          <div key={b}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: FONT.sans,
                fontSize: 27,
                fontWeight: 650,
                color: C.ink2,
              }}
            >
              <Dot color={BAND_FILL[b]} size={20} />
              {BAND_LABEL[b]}
            </div>
            <div
              style={{
                ...DISPLAY_STYLE,
                fontVariantNumeric: "tabular-nums lining-nums",
                fontSize: 68,
                fontWeight: 540,
                lineHeight: 1.05,
                marginTop: 4,
                color: counts[b] === 0 ? C.rule2 : C.ink,
              }}
            >
              {counts[b]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
