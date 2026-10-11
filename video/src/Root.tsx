import { Composition, Still } from "remotion";
import { Cover } from "./Cover";
import { Teaser, type TeaserProps } from "./Teaser";
import { VIDEO, WIDE } from "./theme";
import { DURATION } from "./timeline";

export function RemotionRoot() {
  return (
    <>
      {/* 9:16 for Threads, Reels and TikTok. */}
      <Composition
        id="Teaser"
        component={Teaser}
        durationInFrames={DURATION}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ music: true } satisfies TeaserProps}
      />
      {/* 16:9 for YouTube, X and LinkedIn: same audio and timing. */}
      <Composition
        id="Teaser16x9"
        component={Teaser}
        durationInFrames={DURATION}
        fps={VIDEO.fps}
        width={WIDE.width}
        height={WIDE.height}
        defaultProps={{ music: true } satisfies TeaserProps}
      />
      <Still id="Cover" component={Cover} width={VIDEO.width} height={VIDEO.height} />
      <Still id="Cover16x9" component={Cover} width={WIDE.width} height={WIDE.height} />
    </>
  );
}
