import { useCurrentFrame } from "remotion";
import { Distribution } from "../components/Distribution";
import { ProfileCard, type ProfileTouch } from "../components/ProfileCard";
import { SalaryCard } from "../components/SalaryCard";
import { useFormat, type Format } from "../format";
import { POP, SMOOTH, SNAPPY, ramp, springAt } from "../motion";
import { DRAG, PHASE, countsAt, salaryAt } from "../story";
import { C, FONT } from "../theme";
import { SCENE, cue } from "../timeline";

/** Cards are drawn 940 px wide and scaled into their slot. */
const CARD_W = 940;

const LAYOUT: Record<
  Format,
  {
    dist: { x: number; y: number; w: number };
    card: { x: number; y: number; scale: number; delay: number };
    stamp: { x: number; y: number };
  }
> = {
  // Distribution and cards stacked under the map.
  portrait: {
    dist: { x: 70, y: 655, w: 940 },
    card: { x: 70, y: 842, scale: 1, delay: 2 },
    stamp: { x: 540, y: 440 },
  },
  // Cards in a left column, the distribution under the map on the right.
  landscape: {
    dist: { x: 845, y: 640, w: 980 },
    card: { x: 90, y: 318, scale: 0.78, delay: 12 },
    stamp: { x: 1335, y: 385 },
  },
};

/** Gajiku slider, then the household profile, over the live map. */
export function Calc() {
  const frame = useCurrentFrame();
  const format = useFormat();
  const L = LAYOUT[format];
  const from = SCENE.slider.from;
  const to = SCENE.receipt.from;
  if (frame < from - 2 || frame > to + 16) return null;

  const enter = springAt(frame, from + L.card.delay, SNAPPY);
  const leave = springAt(frame, to - 2, SMOOTH, 14);
  const swap = springAt(frame, SCENE.profile.from, SNAPPY);

  // Finger on the thumb: down just before the drag, up after it.
  const press = Math.min(ramp(frame, DRAG.start - 8, DRAG.start - 2), 1 - ramp(frame, DRAG.end + 2, DRAG.end + 8));

  // Profile taps.
  const married = cue("married");
  const kids = cue("kids");
  const dual = cue("dual");
  const tapFamily = married + 9;
  const tapPlus1 = kids - 6;
  const tapPlus2 = kids + 3;
  const tapDual = dual + 5;
  const household = 2 * springAt(frame, tapFamily, SNAPPY);
  const kidCount = (frame >= tapPlus1 ? 1 : 0) + (frame >= tapPlus2 ? 1 : 0);
  const dualT = springAt(frame, tapDual, SNAPPY);

  const tapAt = (at: number) => ({
    press: Math.min(ramp(frame, at - 7, at - 2), 1 - ramp(frame, at + 4, at + 9)),
    ripple: ramp(frame, at, at + 12),
  });
  let touch: ProfileTouch | undefined;
  if (frame < tapFamily + 10) touch = { target: "family", ...tapAt(tapFamily) };
  else if (frame < tapPlus1 + 8) touch = { target: "plus", ...tapAt(tapPlus1) };
  else if (frame < tapPlus2 + 10) touch = { target: "plus", ...tapAt(tapPlus2) };
  else touch = { target: "dual", ...tapAt(tapDual) };

  const counts = countsAt(frame);
  // Short travel + fade, so cards never sweep through the captions (portrait)
  // or across the map (landscape: they come in from the left edge).
  const travel =
    format === "portrait"
      ? `translateY(${(1 - enter) * 220 + leave * 160}px)`
      : `translateX(${-(1 - enter) * 160 - leave * 120}px)`;
  const cardOpacity = Math.min(1, enter * 1.6) * (1 - leave);
  // Salary → profile: a side swipe on the phone layout, a cross-fade in the
  // narrow landscape column.
  const salaryCard =
    format === "portrait"
      ? { transform: `translateX(${-swap * 1100}px)`, opacity: 1 - swap * 0.6 }
      : { transform: `translateY(${-swap * 50}px)`, opacity: 1 - Math.min(1, swap * 1.4) };
  const profileCard =
    format === "portrait"
      ? { transform: `translateX(${(1 - swap) * 1100}px)` }
      : { transform: `translateY(${(1 - swap) * 50}px)`, opacity: Math.min(1, swap * 1.2) };

  // "491 dari 514" stamp while the map is all red.
  const red = cue("red");
  // Wait for the red wave to finish so the stamp shows the final count.
  const stampAt = Math.max(red + 1, PHASE.family + 17);
  const stamp = springAt(frame, stampAt, POP) * (1 - springAt(frame, tapDual - 2, SMOOTH, 10));

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: L.dist.x,
          top: L.dist.y,
          opacity: ramp(frame, from + 6, from + 16) * (1 - leave),
          transform: `translateY(${(1 - ramp(frame, from + 6, from + 18)) * 30 + leave * 60}px)`,
        }}
      >
        <Distribution counts={counts} width={L.dist.w} />
      </div>

      <div
        style={{
          position: "absolute",
          left: L.card.x,
          top: L.card.y,
          opacity: cardOpacity,
          transform: `${travel} scale(${L.card.scale})`,
          transformOrigin: "0 0",
        }}
      >
        <div style={{ position: "absolute", ...salaryCard }}>
          <SalaryCard salary={salaryAt(frame)} modeAt={1} press={press} width={CARD_W} />
        </div>
        <div style={{ position: "absolute", ...profileCard }}>
          <ProfileCard
            width={CARD_W}
            household={household}
            kids={kidCount}
            dual={dualT}
            salaryLabel="Gajiku · Rp5 jt"
            touch={frame >= SCENE.profile.from ? touch : undefined}
          />
        </div>
      </div>

      {stamp > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: L.stamp.x,
            top: L.stamp.y,
            transform: `translate(-50%, -50%) rotate(-3deg) scale(${0.6 + 0.4 * stamp})`,
            opacity: Math.min(1, stamp * 1.4),
            background: C.danger,
            color: C.white,
            fontFamily: FONT.sans,
            fontWeight: 800,
            fontSize: 46,
            padding: "18px 34px",
            borderRadius: 22,
            boxShadow: "0 18px 50px rgb(165 39 31 / 0.35)",
            whiteSpace: "nowrap",
          }}
        >
          {counts.insufficient} dari 514 · Tak Cukup
        </div>
      )}
    </>
  );
}
