import { useCurrentFrame } from "remotion";
import { Logo } from "../components/ui";
import { useFormat, type Format } from "../format";
import { POP, SNAPPY, ramp, springAt } from "../motion";
import { BAND_FILL, BAND_LABEL, BAND_ORDER, C, DISPLAY_STYLE, FONT } from "../theme";
import { SCENE, TOKENS, cue } from "../timeline";

const URL = "nafkah.adenaufal.com";

/** Both shapes stack logo, map, address and question; landscape is tighter. */
const LAYOUT: Record<
  Format,
  {
    logo: { top: number; scale: number };
    field: { top: number; side: number; height: number; font: number };
    ask: { top: number; font: number; oneLine: boolean; gap: number; legend: number; comment: number };
  }
> = {
  portrait: {
    logo: { top: 232, scale: 1.05 },
    field: { top: 800, side: 110, height: 112, font: 50 },
    ask: { top: 965, font: 118, oneLine: false, gap: 40, legend: 34, comment: 40 },
  },
  landscape: {
    logo: { top: 50, scale: 0.9 },
    field: { top: 578, side: 520, height: 100, font: 46 },
    ask: { top: 712, font: 104, oneLine: true, gap: 26, legend: 32, comment: 38 },
  },
};

/** Logo, the address typed into a search field, and the comment prompt. */
export function EndCard() {
  const frame = useCurrentFrame();
  const L = LAYOUT[useFormat()];
  const from = SCENE.cta.from;
  if (frame < from - 2) return null;

  const logo = springAt(frame, from + 4, SNAPPY);
  // Type the address while the voice reads it.
  const urlTok = TOKENS.find((t) => t.seg === "cta" && t.show === URL)!;
  const typed = Math.round(ramp(frame, urlTok.start - 2, urlTok.end - 4, (t) => t) * URL.length);
  const field = springAt(frame, cue("url") - 2, SNAPPY);
  const ask = springAt(frame, cue("ask") - 2, POP);
  const caret = Math.floor(frame / 8) % 2 === 0 || typed < URL.length;
  const icon = L.field.font * 0.88;
  const swatch = Math.round(L.ask.legend * 0.88);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: L.logo.top,
          display: "flex",
          justifyContent: "center",
          opacity: logo,
          transform: `translateY(${(1 - logo) * -40}px)`,
        }}
      >
        <Logo scale={L.logo.scale} />
      </div>

      <div
        style={{
          position: "absolute",
          left: L.field.side,
          right: L.field.side,
          top: L.field.top,
          height: L.field.height,
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "0 36px",
          borderRadius: 999,
          border: `3px solid ${C.ink}`,
          background: C.white,
          boxShadow: "0 18px 50px rgb(30 27 24 / 0.14)",
          transform: `scale(${0.85 + 0.15 * field})`,
          opacity: field,
        }}
      >
        <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none">
          <circle cx="10.5" cy="10.5" r="6.5" stroke={C.muted} strokeWidth={2.2} />
          <path d="M15.5 15.5L20 20" stroke={C.muted} strokeWidth={2.2} strokeLinecap="round" />
        </svg>
        <span style={{ fontFamily: FONT.sans, fontSize: L.field.font, fontWeight: 700, color: C.ink, letterSpacing: "-0.01em" }}>
          {URL.slice(0, typed)}
          <span
            style={{
              display: "inline-block",
              width: 4,
              height: L.field.font * 1.08,
              marginLeft: 4,
              background: caret ? C.accent : "transparent",
              verticalAlign: -L.field.font * 0.16,
            }}
          />
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: L.ask.top,
          textAlign: "center",
          opacity: Math.min(1, ask * 1.4),
          transform: `translateY(${(1 - ask) * 40}px) scale(${0.9 + 0.1 * ask})`,
        }}
      >
        <div style={{ ...DISPLAY_STYLE, fontSize: L.ask.font, fontWeight: 620, lineHeight: 1.0, letterSpacing: "-0.02em", color: C.ink }}>
          Daerahmu
          {L.ask.oneLine ? " " : <br />}
          warna <span style={{ color: C.accent }}>apa?</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 30, marginTop: L.ask.gap }}>
          {BAND_ORDER.map((b, i) => {
            const t = springAt(frame, cue("ask") + 6 + i * 3, POP);
            return (
              <div
                key={b}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontFamily: FONT.sans,
                  fontSize: L.ask.legend,
                  fontWeight: 700,
                  color: C.ink2,
                  opacity: t,
                  transform: `scale(${0.6 + 0.4 * t})`,
                }}
              >
                <span style={{ width: swatch, height: swatch, borderRadius: 999, background: BAND_FILL[b] }} />
                {BAND_LABEL[b]}
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: L.ask.gap,
            fontFamily: FONT.sans,
            fontSize: L.ask.comment,
            fontWeight: 650,
            color: C.muted,
            opacity: ramp(frame, cue("ask") + 18, cue("ask") + 28),
          }}
        >
          Tulis di komen 👇
        </div>
      </div>
    </>
  );
}
