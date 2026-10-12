import sounds from "../data/sounds.json";
import { ramp } from "../motion";
import { MORE } from "./scenes/More";
import { SHARE } from "./scenes/Share";
import { PHASE, TAP, TYPE, WAVE_FRAMES } from "./story";
import { DURATION, HAS_VOICE, SCENE, TOKENS, cue } from "./timeline";

/*
 * Sound design for the update, on the same cues as the picture. Reuses the
 * teaser's ElevenLabs effects and music bed (src/data/sounds.json).
 */

type Name = "pop" | "whoosh" | "tick" | "tap" | "print" | "hit" | "chime" | "cash" | "type" | "swoosh";

const manifest = sounds as { music: string | null; musicVolume?: number; sfx: Partial<Record<Name, string>> };

export const MUSIC = manifest.music ? { file: manifest.music, volume: manifest.musicVolume ?? 0.16 } : null;

/**
 * Bed under the voice; it comes up once the last word has been said. Without
 * a voice take the music carries the cut, at a normal level.
 */
export function musicVolume(frame: number): number {
  if (!MUSIC) return 0;
  const lastWord = TOKENS[TOKENS.length - 1].end;
  const fadeIn = Math.min(1, frame / 10);
  const swell = ramp(frame, lastWord + 2, lastWord + 14);
  const out = 1 - ramp(frame, DURATION - 18, DURATION);
  const [bed, lift] = HAS_VOICE ? [MUSIC.volume, 1.6] : [0.55, 0.3];
  return bed * fadeIn * (1 + lift * swell) * out;
}

interface Cue {
  at: number;
  name: Name;
  volume: number;
  frames?: number;
}

function placements(): Cue[] {
  const out: Cue[] = [];
  // Requests printing, then six checks and the stamp.
  out.push({ at: 0, name: "print", volume: 0.18, frames: 40 });
  for (let i = 0; i < 6; i++) out.push({ at: cue("now") + i * 3, name: "pop", volume: 0.24 - i * 0.015 });
  out.push({ at: cue("done") + 1, name: "hit", volume: 0.3 });
  // Scene moves.
  out.push({ at: SCENE.home.from, name: "whoosh", volume: 0.26 });
  out.push({ at: SCENE.support.from, name: "swoosh", volume: 0.2 });
  out.push({ at: SCENE.more.from, name: "whoosh", volume: 0.24 });
  out.push({ at: SCENE.share.from, name: "swoosh", volume: 0.2 });
  out.push({ at: SCENE.about.from, name: "whoosh", volume: 0.22 });
  out.push({ at: SCENE.cta.from, name: "swoosh", volume: 0.2 });
  // Rumah sendiri: tap, the map greens.
  out.push({ at: TAP.owner, name: "tap", volume: 0.32 });
  out.push({ at: PHASE.owner + WAVE_FRAMES, name: "chime", volume: 0.22 });
  // Tanggungan keluarga: tap, type, the map turns.
  out.push({ at: TAP.support, name: "tap", volume: 0.32 });
  out.push({ at: TYPE.start - 1, name: "type", volume: 0.2, frames: Math.ceil(TYPE.end - TYPE.start) + 4 });
  out.push({ at: PHASE.support + 4, name: "hit", volume: 0.36 });
  // Mobil, jalan kaki, gaji pasangan.
  for (const at of [MORE.car, MORE.walk, MORE.toggle, MORE.input]) out.push({ at, name: "tap", volume: 0.3 });
  out.push({ at: MORE.typing - 1, name: "type", volume: 0.18, frames: 16 });
  // Bagikan struk: tap, the image, the switch, copy.
  out.push({ at: SHARE.tap, name: "tap", volume: 0.32 });
  out.push({ at: SHARE.png, name: "print", volume: 0.2, frames: 34 });
  out.push({ at: SHARE.hide, name: "tap", volume: 0.3 });
  out.push({ at: SHARE.hide + 4, name: "swoosh", volume: 0.16 });
  out.push({ at: SHARE.copy, name: "tap", volume: 0.3 });
  out.push({ at: SHARE.copy + 4, name: "pop", volume: 0.22 });
  // Halaman Tentang: from the FAQ answer to "Cara dibuat".
  out.push({ at: cue("made") - 4, name: "swoosh", volume: 0.16 });
  // Address and question.
  const url = TOKENS.find((t) => t.seg === "cta" && t.show.includes("."))!;
  out.push({ at: url.start - 2, name: "type", volume: 0.22, frames: url.end - url.start });
  out.push({ at: cue("ask") - 2, name: "chime", volume: 0.26 });
  return out;
}

export const SFX = placements()
  .filter((c) => manifest.sfx[c.name])
  .map((c) => ({ at: Math.max(0, Math.round(c.at)), file: manifest.sfx[c.name]!, volume: c.volume, frames: c.frames ?? 45 }));
