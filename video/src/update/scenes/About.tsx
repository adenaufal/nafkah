import { useCurrentFrame } from "remotion";
import { SMOOTH, SNAPPY, ramp, springAt } from "../../motion";
import { ShotSlice, UiShot } from "../components/UiShot";
import { shot } from "../data";
import { SCENE, cue } from "../timeline";

/** Ends ~1190 px, clear of a two-line caption; the scroll lands on the "Data." bullet. */
const MADE = { scale: 2.2, height: 390, scroll: 145 };

/**
 * "Angkanya dari mana, bikinnya pakai apa?": the About page's answer on where
 * the numbers come from, then its "Cara dibuat" section, both as the site
 * shows them.
 */
export function About() {
  const frame = useCurrentFrame();
  const from = SCENE.about.from;
  const to = SCENE.cta.from;
  if (frame < from - 2 || frame > to + 16) return null;

  const enter = springAt(frame, from + 2, SNAPPY);
  const swap = springAt(frame, cue("made") - 4, SNAPPY);
  const leave = springAt(frame, to - 4, SMOOTH, 14);
  const scroll = ramp(frame, cue("made") + 8, to + 6) * MADE.scroll;
  const made = shot("about-made");
  // Hand over without the two blocks of text overlapping: the answer is gone
  // before "Cara dibuat" is half in.
  const fadeOut = Math.min(1, swap * 2.2);
  const fadeIn = Math.min(1, Math.max(0, (swap - 0.3) * 2));

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave }}>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 420,
          opacity: Math.min(1, enter * 1.6) * (1 - fadeOut),
          transform: `translateY(${(1 - enter) * 220 - swap * 200}px) scale(${1 - 0.08 * swap})`,
        }}
      >
        <UiShot states={["about-source"]} scale={2.4} />
      </div>
      <div
        style={{
          position: "absolute",
          left: (1080 - made.w * MADE.scale) / 2,
          top: 330,
          opacity: fadeIn,
          transform: `translateY(${(1 - swap) * 260}px)`,
        }}
      >
        <ShotSlice name="about-made" top={scroll} height={MADE.height} scale={MADE.scale} />
      </div>
    </div>
  );
}
