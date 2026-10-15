import { useCurrentFrame } from "remotion";
import { Logo } from "../../components/ui";
import { POP, SNAPPY, ramp, springAt } from "../../motion";
import { C, DISPLAY_STYLE, FONT } from "../../theme";
import { SCENE, TOKENS, cue } from "../timeline";

const URL = "nafkah.adenaufal.com";

/**
 * Logo over the app's default map, the address typed into a search field,
 * the question that asks for the next wave of requests, and the caveat.
 */
export function EndCard() {
  const frame = useCurrentFrame();
  const from = SCENE.cta.from;
  if (frame < from - 2) return null;

  const logo = springAt(frame, from + 4, SNAPPY);
  const urlTok = TOKENS.find((t) => t.seg === "cta" && t.show === URL)!;
  const typed = Math.round(ramp(frame, urlTok.start - 2, urlTok.end - 4, (t) => t) * URL.length);
  const field = springAt(frame, cue("url") - 2, SNAPPY);
  const ask = springAt(frame, cue("ask") - 2, POP);
  const caret = Math.floor(frame / 8) % 2 === 0 || typed < URL.length;
  const note = ramp(frame, cue("ask") + 16, cue("ask") + 26);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 232,
          display: "flex",
          justifyContent: "center",
          opacity: logo,
          transform: `translateY(${(1 - logo) * -40}px)`,
        }}
      >
        <Logo scale={1.05} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          top: 800,
          height: 112,
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
        <svg width={44} height={44} viewBox="0 0 24 24" fill="none">
          <circle cx="10.5" cy="10.5" r="6.5" stroke={C.muted} strokeWidth={2.2} />
          <path d="M15.5 15.5L20 20" stroke={C.muted} strokeWidth={2.2} strokeLinecap="round" />
        </svg>
        <span style={{ fontFamily: FONT.sans, fontSize: 50, fontWeight: 700, color: C.ink, letterSpacing: "-0.01em" }}>
          {URL.slice(0, typed)}
          <span
            style={{
              display: "inline-block",
              width: 4,
              height: 54,
              marginLeft: 4,
              background: caret ? C.accent : "transparent",
              verticalAlign: -8,
            }}
          />
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 965,
          textAlign: "center",
          opacity: Math.min(1, ask * 1.4),
          transform: `translateY(${(1 - ask) * 40}px) scale(${0.9 + 0.1 * ask})`,
        }}
      >
        <div style={{ ...DISPLAY_STYLE, fontSize: 118, fontWeight: 620, lineHeight: 1.0, letterSpacing: "-0.02em", color: C.ink }}>
          Apa lagi
          <br />
          yang <span style={{ color: C.accent }}>kurang?</span>
        </div>
        <div
          style={{
            marginTop: 40,
            fontFamily: FONT.sans,
            fontSize: 40,
            fontWeight: 650,
            color: C.muted,
            opacity: ramp(frame, cue("ask") + 10, cue("ask") + 20),
          }}
        >
          Tulis di komen 👇
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1330,
          textAlign: "center",
          fontFamily: FONT.sans,
          fontSize: 30,
          fontWeight: 600,
          color: C.muted,
          opacity: note,
        }}
      >
        Biaya hidup = estimasi model, bukan survei.
      </div>
    </>
  );
}
