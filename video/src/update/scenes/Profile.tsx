import { useCurrentFrame } from "remotion";
import { Distribution } from "../../components/Distribution";
import { POP, SMOOTH, SNAPPY, ramp, springAt } from "../../motion";
import { C } from "../../theme";
import { Stamp } from "../components/Badges";
import { UiShot, tapAt } from "../components/UiShot";
import { covered } from "../data";
import { PHASE, TAP, TYPE, WAVE_FRAMES, countsAt, typedAt } from "../story";
import { SCENE, cue } from "../timeline";

/** Real controls are drawn at the teaser's UI scale. */
const SCALE = 2.4;
const CARD = { x: 96, y: 880 };
const SUPPORT_STATES = ["support-0", ...Array.from({ length: TYPE.keys }, (_, i) => `support-${i + 1}`)];
/** "biaya hunian Rp0" in the Rumah sendiri hint (hunian-owner crop, CSS px). */
const HINT_RP0 = { x: 189, y: 139, w: 102, h: 18 };

/**
 * "Rumah sendiri", then "Tanggungan keluarga", over the live map: the real
 * controls from the profile editor, the national tally under the map, and a
 * stamp with the count of regions at 100% or more.
 */
export function Profile() {
  const frame = useCurrentFrame();
  const from = SCENE.home.from;
  const mid = SCENE.support.from;
  const to = SCENE.more.from;
  if (frame < from - 2 || frame > to + 16) return null;

  const enter = springAt(frame, from + 4, SNAPPY);
  const leave = springAt(frame, to - 4, SMOOTH, 14);
  const swap = springAt(frame, mid, SNAPPY);
  const counts = countsAt(frame);

  const hunian = ramp(frame, TAP.owner, TAP.owner + 4);
  const typed = typedAt(frame, TYPE.start, TYPE.keys);

  const ownerAt = Math.max(cue("zero"), PHASE.owner + WAVE_FRAMES);
  const supportAt = Math.max(cue("drop"), PHASE.support + WAVE_FRAMES);
  const ownerStamp = springAt(frame, ownerAt, POP) * (1 - springAt(frame, mid - 4, SMOOTH, 10));
  const supportStamp = springAt(frame, supportAt, POP) * (1 - leave);
  const stamp =
    supportStamp > 0.01
      ? { t: supportStamp, color: C.danger }
      : { t: ownerStamp, color: C.ok };

  const cardOpacity = Math.min(1, enter * 1.6) * (1 - leave);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 694,
          opacity: ramp(frame, from + 4, from + 14) * (1 - leave),
          transform: `translateY(${(1 - ramp(frame, from + 4, from + 16)) * 30 + leave * 60}px)`,
        }}
      >
        <Distribution counts={counts} width={940} />
      </div>

      <div
        style={{
          position: "absolute",
          left: CARD.x,
          top: CARD.y,
          opacity: cardOpacity,
          transform: `translateY(${(1 - enter) * 220 + leave * 160}px)`,
        }}
      >
        <div style={{ position: "absolute", transform: `translateX(${-swap * 1100}px)`, opacity: 1 - swap * 0.6 }}>
          <UiShot
            states={["hunian-room", "hunian-owner"]}
            at={hunian}
            scale={SCALE}
            tap={frame < mid ? tapAt(frame, TAP.owner, "owner") : undefined}
            marks={[{ ...HINT_RP0, t: ramp(frame, cue("zero") + 4, cue("zero") + 14) }]}
          />
        </div>
        <div style={{ position: "absolute", transform: `translateX(${(1 - swap) * 1100}px)` }}>
          <UiShot
            states={SUPPORT_STATES}
            at={typed}
            scale={SCALE}
            tap={frame >= mid ? tapAt(frame, TAP.support, "input") : undefined}
          />
        </div>
      </div>

      <div style={{ position: "absolute", left: 540, top: 470 }}>
        <Stamp text={`${covered(counts)} dari 514 · cukup atau nyaman`} color={stamp.color} t={stamp.t} />
      </div>
    </>
  );
}
