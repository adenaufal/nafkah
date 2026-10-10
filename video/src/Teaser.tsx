import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Captions } from "./components/Captions";
import { IndonesiaMap } from "./components/IndonesiaMap";
import { NUM } from "./data";
import { loadFonts } from "./fonts";
import { useFormat } from "./format";
import { lerp, ramp } from "./motion";
import { AppMontage } from "./scenes/AppMontage";
import { Calc } from "./scenes/Calc";
import { EndCard } from "./scenes/EndCard";
import { Hook } from "./scenes/Hook";
import { RAIL, Region, railAt } from "./scenes/Region";
import { MUSIC, SFX, musicVolume } from "./sound";
import { cameraAt, fillsAt, mapHiddenAt, openAt } from "./story";
import { C } from "./theme";
import { DURATION, SCENE, VO_AUDIO, cue } from "./timeline";

loadFonts();

// A type alias (not an interface) so it satisfies Record<string, unknown>.
export type TeaserProps = {
  music: boolean;
};

function MapLayer() {
  const frame = useCurrentFrame();
  const format = useFormat();
  const fills = fillsAt(frame);
  const cam = cameraAt(frame, format);
  const hidden = ramp(frame, SCENE.app.from - 2, mapHiddenAt());
  const back = ramp(frame, SCENE.cta.from + 4, SCENE.cta.from + 20);
  const opacity = frame >= SCENE.cta.from ? back : 1 - hidden;
  if (opacity <= 0.001) return null;
  // Spotlight Kota Yogyakarta once it is tapped, until "Upah kotaku".
  const spot = ramp(frame, openAt(), openAt() + 8) * (1 - ramp(frame, cue("wage") + 4, cue("wage") + 16));
  const dim = spot > 0 ? (code: string) => (code === NUM.jogja.code ? 1 : 1 - 0.3 * spot) : undefined;
  // Landscape: the zoomed map fades out beside the region rail, as the
  // app's map stops at its rail.
  const rail = format === "landscape" ? railAt(frame) : 0;
  const edge = lerp(-120, RAIL.x + RAIL.width + 10, rail);
  const mask = rail > 0 ? `linear-gradient(to right, transparent ${edge}px, #000 ${edge + 80}px)` : undefined;
  return (
    <IndonesiaMap
      fills={fills}
      cam={cam}
      opacity={opacity}
      dim={dim}
      style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
    />
  );
}

/**
 * The address, out of the way of the story. Portrait: under the safe area,
 * where TikTok and Reels put their own caption (on Threads it fills the
 * bottom of the frame). Landscape: top left, where the hook's logo was.
 */
function Footer() {
  const frame = useCurrentFrame();
  const landscape = useFormat() === "landscape";
  // Landscape: in once the hook's logo has gone from the same corner.
  const fadeIn = landscape ? ramp(frame, SCENE.slider.from + 8, SCENE.slider.from + 18) : 1;
  const o = fadeIn * (1 - ramp(frame, SCENE.cta.from - 6, SCENE.cta.from + 6));
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        // Landscape: on a paper pill, since the zoomed map can pass under it.
        ...(landscape
          ? { left: 80, top: 46, padding: "10px 22px 10px 10px", borderRadius: 999, background: C.paper }
          : { left: 0, right: 0, top: 1560, justifyContent: "center" }),
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity: 0.75 * o,
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        fontSize: landscape ? 30 : 32,
        fontWeight: 650,
        color: C.muted,
      }}
    >
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: C.accent,
          color: C.white,
          display: "grid",
          placeItems: "center",
          fontWeight: 800,
          fontSize: 21,
        }}
      >
        N
      </span>
      nafkah.adenaufal.com
    </div>
  );
}

export function Teaser({ music }: TeaserProps) {
  const bed = music ? MUSIC : null;
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <MapLayer />
      <Hook />
      <Calc />
      <Region />
      <AppMontage />
      <EndCard />
      <Captions />
      <Footer />

      {VO_AUDIO && <Audio src={staticFile(VO_AUDIO)} />}
      {bed && <Audio src={staticFile(bed.file)} volume={musicVolume} />}
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.at} durationInFrames={s.frames}>
          <Audio src={staticFile(s.file)} volume={s.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
