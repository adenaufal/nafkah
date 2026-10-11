import { useCurrentFrame } from "remotion";
import { Bubble } from "../components/Bubble";
import { Logo } from "../components/ui";
import { useFormat, type Format } from "../format";
import { POP, SMOOTH, ramp, springAt } from "../motion";
import { C, FONT } from "../theme";
import { SCENE } from "../timeline";

/** Replies under the first thread (Sept 2026), lightly trimmed, no names. */
const REPLIES = [
  { text: "kok merah semua yah 😭", at: 0 },
  { text: "daritadi nyari yang ijo 👀", at: 0 },
  { text: "mana yang ijo??", at: 10 },
  { text: "Jogja kasihan wkwk", at: 15 },
  { text: "comfortable-nya 0 😭", at: 20 },
  { text: "pulau jawa merah semua 😂", at: 26 },
];

/** Where each reply floats (same order as REPLIES), around the map. */
const PLACES: Record<Format, { x: number; y: number; r: number }[]> = {
  portrait: [
    { x: 380, y: 380, r: -3 },
    { x: 640, y: 492, r: 2 },
    { x: 700, y: 690, r: 4 },
    { x: 330, y: 1025, r: -3 },
    { x: 730, y: 1112, r: 3 },
    { x: 450, y: 1205, r: -2 },
  ],
  landscape: [
    { x: 460, y: 195, r: -3 },
    { x: 1450, y: 300, r: 2 },
    { x: 1060, y: 470, r: 4 },
    { x: 480, y: 760, r: -3 },
    { x: 1480, y: 790, r: 3 },
    { x: 1080, y: 160, r: -2 },
  ],
};

const HEADER: Record<Format, { side: number; top: number }> = {
  portrait: { side: 70, top: 214 },
  landscape: { side: 90, top: 52 },
};

export function Hook() {
  const frame = useCurrentFrame();
  const format = useFormat();
  const end = SCENE.slider.from;
  if (frame > end + 12) return null;
  const head = 1 - ramp(frame, end - 4, end + 8);
  const header = HEADER[format];
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: header.side,
          right: header.side,
          top: header.top,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: head,
          transform: `translateY(${(1 - head) * -30}px)`,
        }}
      >
        <Logo scale={0.82} />
        <div
          style={{
            fontFamily: FONT.sans,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "0.12em",
            color: C.accentInk,
            background: C.accentSoft,
            padding: "14px 24px",
            borderRadius: 999,
            transform: `scale(${0.8 + 0.2 * springAt(frame, 4, POP)})`,
          }}
        >
          TAMPILAN BARU
        </div>
      </div>
      {REPLIES.map((b, i) => {
        const place = PLACES[format][i];
        const t = b.at === 0 ? 1 : springAt(frame, b.at, POP);
        const out = springAt(frame, end - 10 + i * 2, SMOOTH, 10);
        const drift = Math.sin((frame + i * 13) / 22) * 6;
        return (
          <Bubble key={b.text} text={b.text} x={place.x} y={place.y + drift} rotate={place.r} t={t} out={out} />
        );
      })}
    </>
  );
}
