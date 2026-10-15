import vo from "./data/vo.json";
import { SCRIPT, spoken, type Emphasis, type SceneId, type Segment } from "./script";
import { VIDEO } from "./theme";

/**
 * Every visual beat is keyed to the voice: scenes start a few frames before
 * their first word and `CUE.x` is the frame a cued word begins. Until the
 * ElevenLabs take exists (vo.json has no tokens), timings are estimated so
 * the edit can still be previewed.
 */

const FPS = VIDEO.fps;
/** Picture leads the voice slightly, as in a normal edit. */
const LEAD = 4;
/** Hold on the end card after the last word. */
const TAIL_SEC = 1.6;

interface Timed {
  start: number;
  end: number;
}

export interface VoFile {
  audio: string | null;
  durationSec: number;
  tokens: Timed[];
}

/**
 * Word timings at the pace of the teaser's ElevenLabs take (17 characters a
 * second, short gaps between words and longer ones after a sentence), plus
 * each segment's pause, so a cut made before the voice exists keeps its
 * length once the take is in.
 */
function estimate(script: Segment<string>[]): Timed[] {
  const out: Timed[] = [];
  let t = 0;
  for (const seg of script) {
    for (const page of seg.pages) {
      for (const tok of page) {
        const s = spoken(tok);
        const d = Math.max(0.2, s.length / 17);
        out.push({ start: t, end: t + d });
        t += d + (/[,:]$/.test(s) ? 0.04 : /[.?!]$/.test(s) ? 0.18 : 0.045);
      }
    }
    t += (seg.pauseAfter ?? 0) + 0.02;
  }
  return out;
}

export interface TimedToken<Id extends string = SceneId> {
  seg: Id;
  page: number;
  show: string;
  em?: Emphasis;
  /** Frames. */
  start: number;
  end: number;
}

export type SceneWindows<Id extends string> = Record<Id, { from: number; to: number; dur: number }>;

/** Frames for a script: word timings, cues, scene windows, total length. */
export function makeTimeline<Id extends string>(script: Segment<Id>[], file: VoFile) {
  const hasVoice = Boolean(file.audio) && file.tokens.length > 0;
  const times = hasVoice ? file.tokens : estimate(script);

  const tokens: TimedToken<Id>[] = [];
  const cues: Record<string, number> = {};
  let i = 0;
  for (const seg of script) {
    seg.pages.forEach((page, p) => {
      for (const tok of page) {
        const t = times[i++];
        if (!t) throw new Error("vo.json does not match the script — run npm run voice");
        const start = Math.round(t.start * FPS);
        const end = Math.max(start + 1, Math.round(t.end * FPS));
        tokens.push({ seg: seg.id, page: p, show: tok.show, em: tok.em, start, end });
        if (tok.cue) cues[tok.cue] = start;
      }
    });
  }

  const lastWord = tokens[tokens.length - 1].end;
  const duration = lastWord + Math.round(TAIL_SEC * FPS);

  const order = script.map((s) => s.id);
  const firstWord = (id: Id) => tokens.find((t) => t.seg === id)!.start;

  /** Scene windows in frames: [from, to). The first starts at 0. */
  const scene = Object.fromEntries(
    order.map((id, k) => {
      const from = k === 0 ? 0 : firstWord(id) - LEAD;
      const to = k === order.length - 1 ? duration : firstWord(order[k + 1]) - LEAD;
      return [id, { from, to, dur: to - from }];
    }),
  ) as SceneWindows<Id>;

  const cue = (name: string): number => {
    const f = cues[name];
    if (f === undefined) throw new Error(`Unknown cue: ${name}`);
    return f;
  };

  return {
    HAS_VOICE: hasVoice,
    VO_AUDIO: hasVoice ? file.audio : null,
    TOKENS: tokens,
    CUE: cues,
    DURATION: duration,
    SCENE: scene,
    cue,
  };
}

const teaser = makeTimeline(SCRIPT, vo as VoFile);

export const HAS_VOICE = teaser.HAS_VOICE;
export const VO_AUDIO = teaser.VO_AUDIO;
export const TOKENS = teaser.TOKENS;
export const CUE = teaser.CUE;
export const DURATION = teaser.DURATION;
export const SCENE = teaser.SCENE;
export const cue = teaser.cue;
