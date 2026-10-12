import { useCurrentFrame } from "remotion";
import { SMOOTH, SNAPPY, ramp, springAt } from "../../motion";
import { UiShot, tapAt } from "../components/UiShot";
import { typedAt } from "../story";
import { SCENE, cue } from "../timeline";

const SCALE = 2.4;
const PARTNER_KEYS = 7;
/** Frames per digit: quicker than the tanggungan field, so the full amount reads before the cut. */
const PARTNER_STEP = 2;
const PARTNER_STATES = [
  "partner-off",
  "partner-on",
  ...Array.from({ length: PARTNER_KEYS }, (_, i) => `partner-${i + 1}`),
];

/** Moments in the "more" beat, on the spoken words. */
export const MORE = {
  get car() {
    return cue("car") + 2;
  },
  get walk() {
    return cue("walk") + 2;
  },
  get toggle() {
    return cue("partner");
  },
  get input() {
    return cue("partner") + 8;
  },
  get typing() {
    return this.input + 3;
  },
};

/** Transportasi (Mobil, Jalan kaki) and Gaji pasangan, from the profile editor. */
export function More() {
  const frame = useCurrentFrame();
  const from = SCENE.more.from;
  const to = SCENE.share.from;
  if (frame < from - 2 || frame > to + 16) return null;

  const enter = springAt(frame, from + 2, SNAPPY);
  const leave = springAt(frame, to - 4, SMOOTH, 14);
  const partnerIn = springAt(frame, from + 8, SNAPPY);

  const transport = ramp(frame, MORE.car, MORE.car + 4) + ramp(frame, MORE.walk, MORE.walk + 4);
  const partner =
    ramp(frame, MORE.toggle, MORE.toggle + 5) + typedAt(frame, MORE.typing, PARTNER_KEYS, PARTNER_STEP);
  const partnerTap =
    frame < MORE.input - 6 ? tapAt(frame, MORE.toggle, "toggle") : tapAt(frame, MORE.input, "input");

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 336,
          opacity: Math.min(1, enter * 1.6) * (1 - leave),
          transform: `translateY(${(1 - enter) * 200 - leave * 120}px)`,
        }}
      >
        <UiShot
          states={["transport-motor", "transport-car", "transport-walk"]}
          at={transport}
          scale={SCALE}
          tap={frame < MORE.walk - 6 ? tapAt(frame, MORE.car, "car") : tapAt(frame, MORE.walk, "walk")}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 820,
          opacity: Math.min(1, partnerIn * 1.6) * (1 - leave),
          transform: `translateY(${(1 - partnerIn) * 200 - leave * 120}px)`,
        }}
      >
        <UiShot states={PARTNER_STATES} at={partner} scale={SCALE} tap={partnerTap} />
      </div>
    </>
  );
}
