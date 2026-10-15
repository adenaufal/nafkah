import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CaptionTrack } from "../components/Captions";
import { IndonesiaMap } from "../components/IndonesiaMap";
import { loadFonts } from "../fonts";
import { ramp, springAt, SNAPPY } from "../motion";
import { C } from "../theme";
import type { TeaserProps } from "../Teaser";
import { RequestPill } from "./components/Badges";
import { REQUEST_SHORT } from "./components/RequestReceipt";
import { About } from "./scenes/About";
import { EndCard } from "./scenes/EndCard";
import { Hook } from "./scenes/Hook";
import { MORE, More } from "./scenes/More";
import { Profile } from "./scenes/Profile";
import { Share } from "./scenes/Share";
import { MUSIC, SFX, musicVolume } from "./sound";
import { cameraAt, fillsAt, mapHiddenAt } from "./story";
import { SCENE, TOKENS, VO_AUDIO } from "./timeline";

loadFonts();

function MapLayer() {
  const frame = useCurrentFrame();
  const show = ramp(frame, SCENE.home.from, SCENE.home.from + 12);
  const hidden = ramp(frame, SCENE.more.from - 2, mapHiddenAt());
  const back = ramp(frame, SCENE.cta.from + 4, SCENE.cta.from + 20);
  const opacity = frame >= SCENE.cta.from ? back : show * (1 - hidden);
  if (opacity <= 0.001) return null;
  return <IndonesiaMap fills={fillsAt(frame)} cam={cameraAt(frame)} opacity={opacity} />;
}

/** Which request is on screen, in the order of the hook's receipt. */
function pillWindows(): [number, number][] {
  const partner = MORE.toggle - 8;
  return [
    [SCENE.home.from, SCENE.home.to],
    [SCENE.support.from, SCENE.support.to],
    [SCENE.more.from, partner],
    [partner, SCENE.more.to],
    [SCENE.share.from, SCENE.share.to],
    [SCENE.about.from, SCENE.about.to],
  ];
}

function Pills() {
  const frame = useCurrentFrame();
  return (
    <>
      {pillWindows().map(([from, to], i) => {
        if (frame < from - 2 || frame > to + 8) return null;
        const t = springAt(frame, from + 4, SNAPPY) * (1 - ramp(frame, to - 6, to + 2));
        return (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 206, display: "flex", justifyContent: "center" }}>
            <RequestPill label={REQUEST_SHORT[i]} index={i + 1} t={t} />
          </div>
        );
      })}
    </>
  );
}

/** The address under the safe area, where TikTok and Reels put their caption. */
function Footer() {
  const frame = useCurrentFrame();
  const o = 1 - ramp(frame, SCENE.cta.from - 6, SCENE.cta.from + 6);
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1560,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 14,
        opacity: 0.75 * o,
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        fontSize: 32,
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

/** Update v0.4.0, 9:16: "kemarin kalian minta, sekarang sudah ada". */
export function Update({ music }: TeaserProps) {
  const bed = music ? MUSIC : null;
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <MapLayer />
      <Hook />
      <Profile />
      <More />
      <Share />
      <About />
      <EndCard />
      <Pills />
      <CaptionTrack tokens={TOKENS} silent={["cta:1", "cta:2"]} />
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
