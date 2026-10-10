import { useCurrentFrame } from "remotion";
import { Phone } from "../components/Phone";
import { useFormat, type Format } from "../format";
import { POP, SMOOTH, SNAPPY, ramp, springAt } from "../motion";
import { C, FONT } from "../theme";
import { SCENE, cue } from "../timeline";

interface PhoneSpot {
  src: string;
  x: number;
  y: number;
  w: number;
  r: number;
  delay: number;
  dark: boolean;
  then?: string;
}

/** Later entries are drawn on top; the centre phone comes last. */
const PHONES: Record<Format, PhoneSpot[]> = {
  portrait: [
    { src: "shots/profile.png", x: 250, y: 800, w: 400, r: -9, delay: 4, dark: false },
    { src: "shots/jogja-dark.png", x: 830, y: 800, w: 400, r: 9, delay: 8, dark: true },
    { src: "shots/home.png", x: 540, y: 735, w: 520, r: 0, delay: 0, dark: false, then: "shots/gajiku.png" },
  ],
  // Five across, light and dark alternating.
  landscape: [
    { src: "shots/profile.png", x: 255, y: 500, w: 300, r: -11, delay: 10, dark: false },
    { src: "shots/jogja-receipt.png", x: 1665, y: 500, w: 300, r: 11, delay: 12, dark: false },
    { src: "shots/home-dark.png", x: 590, y: 478, w: 340, r: -6, delay: 4, dark: true },
    { src: "shots/jogja-dark.png", x: 1330, y: 478, w: 340, r: 6, delay: 7, dark: true },
    { src: "shots/home.png", x: 960, y: 455, w: 390, r: 0, delay: 0, dark: false, then: "shots/gajiku.png" },
  ],
};

/** `rise` starts every phone fully below the frame. */
const LAYOUT: Record<Format, { rise: number; exit: number; badgesY: number }> = {
  portrait: { rise: 1800, exit: 1400, badgesY: 1195 },
  landscape: { rise: 1150, exit: 1150, badgesY: 806 },
};

const BADGES = ["Gratis", "Tanpa login", "Open source"];

/** Real screenshots of the new UI (light + dark), phones fanned out. */
export function AppMontage() {
  const frame = useCurrentFrame();
  const format = useFormat();
  const L = LAYOUT[format];
  const from = SCENE.app.from;
  const to = SCENE.cta.from;
  if (frame < from - 4 || frame > to + 18) return null;
  const leave = springAt(frame, to - 4, SMOOTH, 16);
  const free = cue("free");
  return (
    <>
      {PHONES[format].map((p) => {
        const t = springAt(frame, from + 4 + p.delay, SNAPPY);
        const float = Math.sin((frame - from + p.delay * 5) / 18) * 8;
        const y = p.y + (1 - t) * L.rise + float - leave * L.exit;
        return (
          <div
            key={p.src}
            style={{
              position: "absolute",
              left: p.x,
              top: y,
              transform: `translate(-50%, -50%) rotate(${p.r * t}deg)`,
            }}
          >
            <Phone
              src={p.src}
              width={p.w}
              dark={p.dark}
              crossfadeTo={p.then}
              crossfade={p.then ? ramp(frame, from + 40, from + 52) : 0}
            />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: L.badgesY,
          display: "flex",
          justifyContent: "center",
          gap: 18,
          opacity: 1 - leave,
        }}
      >
        {BADGES.map((b, i) => {
          const t = springAt(frame, free - 2 + i * 4, POP);
          return (
            <div
              key={b}
              style={{
                transform: `scale(${t}) rotate(${(i - 1) * 2}deg)`,
                opacity: Math.min(1, t * 1.5),
                background: i === 0 ? C.accent : C.ink,
                color: C.white,
                fontFamily: FONT.sans,
                fontSize: 36,
                fontWeight: 800,
                padding: "16px 30px",
                borderRadius: 999,
                boxShadow: "0 12px 30px rgb(30 27 24 / 0.25)",
              }}
            >
              {b}
            </div>
          );
        })}
      </div>
    </>
  );
}
