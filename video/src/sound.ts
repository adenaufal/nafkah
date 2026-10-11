import sounds from "./data/sounds.json";
import { ramp } from "./motion";
import { DRAG, openAt, salaryAt } from "./story";
import { DURATION, SCENE, TOKENS, cue } from "./timeline";

/*
 * Sound design, placed on the same cues as the picture. Files come from
 * scripts/sfx.ts (ElevenLabs sound effects); missing ones are skipped so the
 * edit renders before they exist.
 */

type Name =
  | "pop"
  | "whoosh"
  | "tick"
  | "tap"
  | "print"
  | "hit"
  | "chime"
  | "cash"
  | "type"
  | "swoosh";

const manifest = sounds as { music: string | null; musicVolume?: number; sfx: Partial<Record<Name, string>> };

export const MUSIC = manifest.music
  ? { file: manifest.music, volume: manifest.musicVolume ?? 0.16 }
  : null;

/** Bed under the voice; it comes up once the last word has been said. */
export function musicVolume(frame: number): number {
  if (!MUSIC) return 0;
  const lastWord = TOKENS[TOKENS.length - 1].end;
  const fadeIn = Math.min(1, frame / 10);
  const swell = ramp(frame, lastWord + 2, lastWord + 14);
  const out = 1 - ramp(frame, DURATION - 18, DURATION);
  return MUSIC.volume * fadeIn * (1 + 1.6 * swell) * out;
}

interface Cue {
  at: number;
  name: Name;
  volume: number;
  frames?: number;
}

function placements(): Cue[] {
  const out: Cue[] = [];
  // Files are peak-normalised (-1 dBFS); these volumes set the mix under
  // the voice (mean around -19 dB).
  // Replies popping in under the hook.
  [0, 10, 15, 20, 26].forEach((at, i) => out.push({ at, name: "pop", volume: 0.3 - i * 0.02 }));
  // Scene moves.
  out.push({ at: SCENE.slider.from, name: "whoosh", volume: 0.26 });
  out.push({ at: SCENE.profile.from, name: "swoosh", volume: 0.2 });
  out.push({ at: SCENE.receipt.from, name: "whoosh", volume: 0.3 });
  out.push({ at: SCENE.app.from, name: "whoosh", volume: 0.26 });
  out.push({ at: SCENE.cta.from, name: "swoosh", volume: 0.2 });
  // One tick per 100 rb step while the slider moves.
  let last = salaryAt(DRAG.start);
  for (let f = DRAG.start; f <= DRAG.end; f++) {
    const s = salaryAt(f);
    if (s !== last) out.push({ at: f, name: "tick", volume: 0.12, frames: 5 });
    last = s;
  }
  // Taps in the profile editor and on the map.
  const married = cue("married");
  const kids = cue("kids");
  for (const at of [married + 9, kids - 6, kids + 3, cue("dual") + 5, openAt()]) {
    out.push({ at, name: "tap", volume: 0.32 });
  }
  out.push({ at: cue("red") - 2, name: "hit", volume: 0.42 });
  out.push({ at: cue("blue") - 4, name: "chime", volume: 0.22 });
  out.push({ at: Math.max(cue("print") - 4, openAt() + 10), name: "print", volume: 0.26, frames: 52 });
  out.push({ at: cue("surplus") + 4, name: "cash", volume: 0.36 });
  [0, 1, 2].forEach((i) => out.push({ at: cue("free") - 2 + i * 4, name: "pop", volume: 0.24 }));
  const url = TOKENS.find((t) => t.seg === "cta" && t.show.includes("."))!;
  out.push({ at: url.start - 2, name: "type", volume: 0.22, frames: url.end - url.start });
  out.push({ at: cue("ask") - 2, name: "chime", volume: 0.26 });
  return out;
}

export const SFX = placements()
  .filter((c) => manifest.sfx[c.name])
  .map((c) => ({ at: Math.max(0, c.at), file: manifest.sfx[c.name]!, volume: c.volume, frames: c.frames ?? 45 }));
