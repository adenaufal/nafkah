import vo from "./data/vo.json";
import { SCRIPT, spoken, type Emphasis, type SceneId } from "./script";
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

interface VoFile {
  audio: string | null;
  durationSec: number;
  tokens: Timed[];
}

function estimate(): Timed[] {
  const out: Timed[] = [];
  let t = 0.2;
  for (const seg of SCRIPT) {
    for (const page of seg.pages) {
      for (const tok of page) {
        const s = spoken(tok);
        const d = Math.max(0.2, s.length / 15.5);
        out.push({ start: t, end: t + d });
        t += d + (/[,:]$/.test(s) ? 0.18 : /[.?!]$/.test(s) ? 0.34 : 0.05);
      }
    }
    t += 0.15;
  }
  return out;
}

const file = vo as VoFile;
export const HAS_VOICE = Boolean(file.audio) && file.tokens.length > 0;
export const VO_AUDIO = HAS_VOICE ? file.audio : null;
const times = HAS_VOICE ? file.tokens : estimate();

export interface TimedToken {
  seg: SceneId;
  page: number;
  show: string;
  em?: Emphasis;
  /** Frames. */
  start: number;
  end: number;
}

export const TOKENS: TimedToken[] = [];
export const CUE: Record<string, number> = {};
{
  let i = 0;
  for (const seg of SCRIPT) {
    seg.pages.forEach((page, p) => {
      for (const tok of page) {
        const t = times[i++];
        if (!t) throw new Error("vo.json does not match script.ts — run npm run voice");
        const start = Math.round(t.start * FPS);
        const end = Math.max(start + 1, Math.round(t.end * FPS));
        TOKENS.push({ seg: seg.id, page: p, show: tok.show, em: tok.em, start, end });
        if (tok.cue) CUE[tok.cue] = start;
      }
    });
  }
}

const lastWord = TOKENS[TOKENS.length - 1].end;
export const DURATION = lastWord + Math.round(TAIL_SEC * FPS);

const ORDER = SCRIPT.map((s) => s.id);
const firstWord = (id: SceneId) => TOKENS.find((t) => t.seg === id)!.start;

/** Scene windows in frames: [from, to). The first starts at 0. */
export const SCENE = Object.fromEntries(
  ORDER.map((id, i) => {
    const from = i === 0 ? 0 : firstWord(id) - LEAD;
    const to = i === ORDER.length - 1 ? DURATION : firstWord(ORDER[i + 1]) - LEAD;
    return [id, { from, to, dur: to - from }];
  }),
) as Record<SceneId, { from: number; to: number; dur: number }>;

export const cue = (name: string): number => {
  const f = CUE[name];
  if (f === undefined) throw new Error(`Unknown cue: ${name}`);
  return f;
};
