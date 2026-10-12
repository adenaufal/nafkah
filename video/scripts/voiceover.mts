/**
 * Voice-over from src/script.ts via ElevenLabs, with per-word timings so
 * captions and visual cues land on the spoken words.
 *
 *   npm run voice -- --list                 voices in your library
 *   npm run voice -- --search               Indonesian voices in the shared library
 *   npm run voice -- --voice <id> [--model eleven_multilingual_v2] [--speed 1.08] [--check]
 *   npm run voice -- --finalize             re-apply pauses to the saved take (no API call)
 *   add --video update for the v0.4.0 update (src/update/script.ts)
 *
 * The raw take is kept in assets/vo-take.{mp3,json}; the final track (with
 * the pauses from script.ts) goes to public/audio/vo.wav + src/data/vo.json.
 * The update keeps its own: assets/update/, update-vo.wav, update-vo.json.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { SCRIPT, ttsText, type Segment } from "../src/script.ts";
import { UPDATE_SCRIPT } from "../src/update/script.ts";
import { el, elJson, usage } from "./elevenlabs.mts";

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const opt = (name: string, fallback?: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : fallback;
};

interface Voice {
  voice_id: string;
  name: string;
  category?: string;
  labels?: Record<string, string>;
  verified_languages?: { language: string; accent?: string; model_id?: string }[];
}

if (flag("list")) {
  const { voices } = await elJson<{ voices: Voice[] }>("/v1/voices");
  for (const v of voices) {
    const langs = (v.verified_languages ?? []).map((l) => l.language).join(",");
    console.log(`${v.voice_id}  ${v.name.padEnd(28)} ${v.category ?? ""}  ${JSON.stringify(v.labels ?? {})} ${langs}`);
  }
  process.exit(0);
}

if (flag("search")) {
  const q = new URLSearchParams({ page_size: "40", language: "id", sort: opt("sort", "trending")! });
  const gender = opt("gender");
  if (gender) q.set("gender", gender);
  const res = await elJson<{
    voices: {
      voice_id: string;
      public_owner_id: string;
      name: string;
      gender: string;
      age: string;
      accent: string;
      use_case: string;
      descriptive: string;
      cloned_by_count: number;
      usage_character_count_1y: number;
      free_users_allowed: boolean;
      description: string;
    }[];
  }>(`/v1/shared-voices?${q}`);
  for (const v of res.voices) {
    console.log(
      [v.voice_id, v.public_owner_id, v.name, v.gender, v.age, v.accent, v.use_case, v.descriptive, `clones=${v.cloned_by_count}`, `chars1y=${v.usage_character_count_1y}`].join(" | "),
    );
    if (v.description) console.log("   ", v.description.replace(/\s+/g, " ").slice(0, 160));
  }
  process.exit(0);
}

interface Target {
  script: Segment<string>[];
  takeMp3: string;
  takeJson: string;
  /** Final track, under public/. */
  audio: string;
  timing: string;
  /** Prefix for the scratch files in out/. */
  name: string;
}

const TARGETS: Record<string, Target> = {
  teaser: {
    script: SCRIPT,
    takeMp3: "assets/vo-take.mp3",
    takeJson: "assets/vo-take.json",
    audio: "audio/vo.wav",
    timing: "src/data/vo.json",
    name: "vo",
  },
  update: {
    script: UPDATE_SCRIPT,
    takeMp3: "assets/update/vo-take.mp3",
    takeJson: "assets/update/vo-take.json",
    audio: "audio/update-vo.wav",
    timing: "src/data/update-vo.json",
    name: "update-vo",
  },
};
const target = TARGETS[opt("video", "teaser")!];
if (!target) throw new Error(`--video ${opt("video")} tidak dikenal (teaser, update)`);

interface Timed {
  start: number;
  end: number;
}
interface Take {
  voiceId: string;
  model: string;
  speed: number;
  text: string;
  tokens: Timed[];
}

const TAKE_MP3 = target.takeMp3;
const TAKE_JSON = target.takeJson;

if (!flag("finalize")) await generate();
finalize(JSON.parse(readFileSync(TAKE_JSON, "utf8")) as Take);

async function generate() {
const voiceId = opt("voice");
if (!voiceId) throw new Error("Pilih suara: --voice <voice_id> (lihat --list / --search)");
const model = opt("model", "eleven_multilingual_v2")!;
const speed = Number(opt("speed", "1.08"));
const { text, ranges } = ttsText(target.script);

const before = await usage().catch(() => null);
console.log(`model=${model} voice=${voiceId} speed=${speed} chars=${text.length}`);
console.log(text);

const settings = {
  stability: Number(opt("stability", "0.4")),
  similarity_boost: 0.8,
  style: Number(opt("style", "0.35")),
  use_speaker_boost: true,
  speed,
};

interface Alignment {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

let audio: Buffer;
let chars: { c: string; start: number; end: number }[];
try {
  const res = await elJson<{ audio_base64: string; alignment: Alignment }>(
    `/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`,
    {
      method: "POST",
      json: { text, model_id: model, voice_settings: settings, seed: Number(opt("seed", "7")) },
    },
  );
  audio = Buffer.from(res.audio_base64, "base64");
  const a = res.alignment;
  chars = a.characters.map((c, i) => ({ c, start: a.character_start_times_seconds[i], end: a.character_end_times_seconds[i] }));
} catch (err) {
  // Some models have no timestamp endpoint: synthesize, then force-align.
  console.warn(String(err).slice(0, 300));
  console.warn("Falling back to plain TTS + forced alignment…");
  const res = await el(`/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: "POST",
    json: { text, model_id: model, voice_settings: settings, seed: Number(opt("seed", "7")) },
  });
  audio = Buffer.from(await res.arrayBuffer());
  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(audio)], { type: "audio/mpeg" }), "vo.mp3");
  form.append("text", text);
  const fa = await elJson<{ characters: { text: string; start: number; end: number }[] }>("/v1/forced-alignment", {
    method: "POST",
    body: form,
  });
  chars = fa.characters.map((x) => ({ c: x.text, start: x.start, end: x.end }));
}

// Map every character of our text onto the aligned characters, in order.
const aligned = chars.map((x) => x.c).join("");
const index: number[] = new Array(text.length).fill(-1);
if (aligned === text) {
  for (let i = 0; i < text.length; i++) index[i] = i;
} else {
  console.warn("Alignment text differs from input; matching in order.");
  let j = 0;
  for (let i = 0; i < text.length && j < chars.length; i++) {
    const want = text[i].toLowerCase();
    let k = j;
    while (k < chars.length && k < j + 6 && chars[k].c.toLowerCase() !== want) k++;
    if (k < chars.length && chars[k].c.toLowerCase() === want) {
      index[i] = k;
      j = k + 1;
    }
  }
}

const timeOf = (i: number, edge: "start" | "end") => {
  // Nearest mapped character in the right direction.
  let k = i;
  while (k >= 0 && k < text.length && index[k] < 0) k += edge === "start" ? 1 : -1;
  const c = chars[index[Math.max(0, Math.min(text.length - 1, k))]];
  return c ? c[edge] : 0;
};

const tokens = ranges.map((r) => {
  const start = timeOf(r.start, "start");
  const end = Math.max(start + 0.05, timeOf(r.end - 1, "end"));
  return { start: Math.round(start * 1000) / 1000, end: Math.round(end * 1000) / 1000 };
});

mkdirSync(TAKE_MP3.slice(0, TAKE_MP3.lastIndexOf("/")), { recursive: true });
mkdirSync("out", { recursive: true });
writeFileSync(TAKE_MP3, audio);
writeFileSync(`out/${target.name}-alignment.json`, JSON.stringify(chars));
writeFileSync(TAKE_JSON, JSON.stringify({ voiceId, model, speed, text, tokens } satisfies Take, null, 1));
console.log(`take: ${tokens.length} tokens, last word ends ${tokens[tokens.length - 1].end}s`);

if (flag("check")) {
  // Transcribe the take back (Scribe) to catch slurred or misread words.
  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(readFileSync(TAKE_MP3))], { type: "audio/mpeg" }), "vo.mp3");
  form.append("model_id", opt("stt", "scribe_v1")!);
  form.append("language_code", "id");
  const stt = await elJson<{ text: string }>("/v1/speech-to-text", { method: "POST", body: form });
  console.log("STT:", stt.text);
  writeFileSync(`out/${target.name}-stt.txt`, stt.text);
}

const after = await usage().catch(() => null);
if (before && after) {
  console.log(`credits used: ${after.used - before.used} (now ${after.used}/${after.limit}, ${after.tier})`);
}
}

/**
 * Insert each segment's pauseAfter as silence between its last word and the
 * next segment's first word, and shift the later word timings to match.
 */
function finalize(take: Take) {
  const { text } = ttsText(target.script);
  if (take.text !== text) {
    throw new Error("script.ts berubah sejak take ini dibuat — jalankan npm run voice -- --voice <id> lagi.");
  }
  const cuts: { at: number; pause: number }[] = [];
  let i = 0;
  for (const seg of target.script) {
    const n = seg.pages.flat().length;
    const last = take.tokens[i + n - 1];
    const next = take.tokens[i + n];
    i += n;
    if (!seg.pauseAfter || !next) continue;
    const gap = Math.max(0, next.start - last.end);
    cuts.push({ at: last.end + Math.min(0.08, gap / 2), pause: seg.pauseAfter });
  }

  // atrim pieces with 6 ms fades at every cut, silence in between.
  const F = 0.006;
  const bounds = [0, ...cuts.map((c) => c.at), null];
  const parts: string[] = [];
  const labels: string[] = [];
  const splits = bounds.length - 1;
  parts.push(`[0:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=mono,asplit=${splits}${Array.from({ length: splits }, (_, k) => `[s${k}]`).join("")}`);
  for (let k = 0; k < splits; k++) {
    const a = bounds[k]!;
    const b = bounds[k + 1];
    const trim = b == null ? `atrim=start=${a}` : `atrim=start=${a}:end=${b}`;
    const fades = [k > 0 ? `afade=t=in:d=${F}` : null, b != null ? `afade=t=out:st=${(b - a - F).toFixed(4)}:d=${F}` : null]
      .filter(Boolean)
      .join(",");
    parts.push(`[s${k}]${trim},asetpts=PTS-STARTPTS${fades ? "," + fades : ""}[p${k}]`);
    labels.push(`[p${k}]`);
    if (k < cuts.length) {
      parts.push(`anullsrc=r=44100:cl=mono,atrim=duration=${cuts[k].pause},aformat=sample_fmts=fltp[z${k}]`);
      labels.push(`[z${k}]`);
    }
  }
  parts.push(`${labels.join("")}concat=n=${labels.length}:v=0:a=1[out]`);
  mkdirSync("public/audio", { recursive: true });
  const wav = `public/${target.audio}`;
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-i", TAKE_MP3,
    "-filter_complex", parts.join(";"),
    "-map", "[out]", "-c:a", "pcm_s16le", wav,
  ]);

  const tokens = take.tokens.map((t) => {
    const shift = cuts.filter((c) => t.start >= c.at).reduce((s, c) => s + c.pause, 0);
    return { start: Math.round((t.start + shift) * 1000) / 1000, end: Math.round((t.end + shift) * 1000) / 1000 };
  });
  const durationSec = Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav])
      .toString()
      .trim(),
  );
  writeFileSync(
    target.timing,
    JSON.stringify({ audio: target.audio, voiceId: take.voiceId, model: take.model, speed: take.speed, durationSec, tokens }, null, 1),
  );
  console.log(`${target.audio} ${durationSec.toFixed(2)}s (+${cuts.reduce((s, c) => s + c.pause, 0).toFixed(2)}s pauses), last word ends ${tokens[tokens.length - 1].end}s`);
}
