import { Composition, Still } from "remotion";
import { Cover } from "./Cover";
import { Teaser, type TeaserProps } from "./Teaser";
import { VIDEO, WIDE } from "./theme";
import { DURATION } from "./timeline";
import { Update } from "./update/Update";
import {
  Update16x9,
  UpdateCover,
  UpdateHome16x9,
  UpdateShare16x9,
  UpdateSupport16x9,
} from "./update/Stills";
import { DURATION as UPDATE_DURATION } from "./update/timeline";

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
      {/* Update v0.4.0, 9:16 for TikTok and Reels. */}
      <Composition
        id="Update"
        component={Update}
        durationInFrames={UPDATE_DURATION}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ music: true } satisfies TeaserProps}
      />
      <Still id="UpdateCover" component={UpdateCover} width={VIDEO.width} height={VIDEO.height} />
      {/* 16:9 images for X and Threads: the lead, then three details. */}
      <Still id="Update16x9" component={Update16x9} width={WIDE.width} height={WIDE.height} />
      <Still id="UpdateHome16x9" component={UpdateHome16x9} width={WIDE.width} height={WIDE.height} />
      <Still id="UpdateSupport16x9" component={UpdateSupport16x9} width={WIDE.width} height={WIDE.height} />
      <Still id="UpdateShare16x9" component={UpdateShare16x9} width={WIDE.width} height={WIDE.height} />
    </>
  );
}
