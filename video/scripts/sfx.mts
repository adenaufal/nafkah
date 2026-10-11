/**
 * Sound effects (and an optional music bed) from ElevenLabs.
 *
 *   npm run sfx                       effects that are missing
 *   npm run sfx -- --only tap,cash    regenerate some
 *   npm run sfx -- --music            also compose the music bed
 *   npm run sfx -- --finish           re-process the saved downloads only
 *
 * Raw downloads go to assets/sfx/*.mp3. Each is trimmed of leading silence
 * (so it hits on its cue frame) and peak-normalised into public/sfx/*.wav.
 * The music goes to public/audio/music.mp3; src/data/sounds.json lists all.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { el, usage } from "./elevenlabs.mts";

const args = process.argv.slice(2);
const only = (() => {
  const i = args.indexOf("--only");
  return i >= 0 ? new Set(args[i + 1].split(",")) : null;
})();

const EFFECTS: Record<string, { prompt: string; seconds: number }> = {
  pop: { prompt: "Soft bubbly UI pop, a chat bubble appearing on a phone, short, clean, no reverb", seconds: 0.5 },
  whoosh: { prompt: "Fast smooth airy whoosh transition, short, modern app promo", seconds: 0.8 },
  swoosh: { prompt: "Quick soft swoosh of a card sliding across a phone screen, subtle", seconds: 0.5 },
  tick: { prompt: "Tiny crisp single UI tick, one detent click of a slider, very short and dry", seconds: 0.5 },
  tap: {
    prompt: "Crisp short click of a finger tapping a phone screen button, clearly audible, dry, close-mic",
    seconds: 0.5,
  },
  print: {
    prompt: "Small thermal receipt printer printing a short receipt, steady buzzing paper feed, then a tear",
    seconds: 1.8,
  },
  hit: { prompt: "Deep cinematic low boom hit, dramatic but short, soft tail", seconds: 1.2 },
  chime: { prompt: "Bright friendly two-note UI success chime, soft marimba, short", seconds: 0.9 },
  cash: { prompt: "Cash register ka-ching with a little coin jingle, cheerful, short", seconds: 1.0 },
  type: { prompt: "Fast light typing on a phone touch keyboard, soft clicks, about one second", seconds: 1.3 },
};

const MUSIC_PROMPT =
  "Upbeat warm indie-pop instrumental for a 30-second social media app teaser. Plucky acoustic guitar, " +
  "light hand claps, soft punchy kick, bright marimba hook, playful and optimistic, curious mood, about " +
  "112 BPM. No vocals. Clean, uncluttered mix that sits under a voice-over. Clear start and a short " +
  "satisfying ending button.";

const manifestPath = "src/data/sounds.json";
const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
  music: string | null;
  musicVolume?: number;
  sfx: Record<string, string>;
};

/** Trim leading silence, then bring the peak to -1 dBFS. */
function finish(name: string) {
  const raw = `assets/sfx/${name}.mp3`;
  const trimmed = `out/sfx-${name}-trim.wav`;
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-i", raw,
    "-af", "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.004",
    trimmed,
  ]);
  const { stderr } = spawnSync("ffmpeg", ["-hide_banner", "-i", trimmed, "-af", "volumedetect", "-f", "null", "-"], {
    encoding: "utf8",
  });
  const max = Number(/max_volume: (-?[\d.]+) dB/.exec(stderr)?.[1] ?? 0);
  const gain = -1 - max;
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", trimmed, "-af", `volume=${gain.toFixed(2)}dB`, `public/sfx/${name}.wav`]);
  manifest.sfx[name] = `sfx/${name}.wav`;
  console.log(`  ${name}: peak ${max} dB, gain ${gain.toFixed(1)} dB`);
}

mkdirSync("public/sfx", { recursive: true });
mkdirSync("assets/sfx", { recursive: true });
mkdirSync("out", { recursive: true });
const before = await usage().catch(() => null);

if (!args.includes("--finish")) {
  for (const [name, fx] of Object.entries(EFFECTS)) {
    const raw = `assets/sfx/${name}.mp3`;
    if (only ? !only.has(name) : existsSync(raw)) continue;
    const res = await el("/v1/sound-generation?output_format=mp3_44100_128", {
      method: "POST",
      json: { text: fx.prompt, duration_seconds: fx.seconds, prompt_influence: 0.6 },
    });
    writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
    console.log("sfx", name);
  }
}
for (const name of Object.keys(EFFECTS)) {
  if (existsSync(`assets/sfx/${name}.mp3`)) finish(name);
}

if (args.includes("--music")) {
  try {
    const res = await el("/v1/music?output_format=mp3_44100_128", {
      method: "POST",
      json: { prompt: MUSIC_PROMPT, music_length_ms: 34000 },
    });
    mkdirSync("public/audio", { recursive: true });
    writeFileSync("public/audio/music.mp3", Buffer.from(await res.arrayBuffer()));
    manifest.music = "audio/music.mp3";
    console.log("music ok");
  } catch (err) {
    console.warn("music skipped:", String(err).slice(0, 400));
  }
}
manifest.musicVolume = manifest.musicVolume ?? 0.16;

writeFileSync(manifestPath, JSON.stringify(manifest, null, 1) + "\n");
const after = await usage().catch(() => null);
if (before && after) console.log(`credits used: ${after.used - before.used} (now ${after.used}/${after.limit})`);
