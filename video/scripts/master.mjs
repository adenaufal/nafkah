// Loudness-master a rendered teaser for social upload: two-pass EBU R128 to
// -14 LUFS / -1 dBTP (what TikTok, Reels and Threads play back at), AAC 48 kHz,
// video stream copied untouched, moov atom up front.
//
//   node scripts/master.mjs out/nafkah-teaser-raw.mp4 out/nafkah-teaser.mp4
//
// --gain-from <raw.mp4> applies the gain that would master that render
// instead, so a cut without the music bed keeps the voice and effects at the
// same level as the full mix (a trending sound goes under it on the platform).
import { execFileSync, spawnSync } from "node:child_process";

const argv = process.argv.slice(2);
const refAt = argv.indexOf("--gain-from");
const reference = refAt >= 0 ? argv[refAt + 1] : null;
const [input, output] = argv.filter((_, i) => refAt < 0 || (i !== refAt && i !== refAt + 1));
if (!input || !output) throw new Error("usage: node scripts/master.mjs <in.mp4> <out.mp4> [--gain-from <raw.mp4>]");

const TARGET = "I=-14:TP=-1.0:LRA=11";

function measure(file) {
  const { stderr } = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-i", file, "-af", `loudnorm=${TARGET}:print_format=json`, "-f", "null", "-"],
    { encoding: "utf8" },
  );
  return JSON.parse(stderr.slice(stderr.lastIndexOf("{"), stderr.lastIndexOf("}") + 1));
}

// Sample peaks held at -1.5 dBFS after the gain, so resampling and the AAC
// encoder cannot push true peaks over -1 dBTP.
const LIMIT = "aresample=48000,alimiter=limit=0.84:level=0";

const json = measure(input);
let filter;
if (reference) {
  const gain = -14 - Number(measure(reference).input_i);
  filter = `volume=${gain.toFixed(2)}dB,${LIMIT}`;
} else {
  filter =
    `loudnorm=${TARGET}:measured_I=${json.input_i}:measured_TP=${json.input_tp}` +
    `:measured_LRA=${json.input_lra}:measured_thresh=${json.input_thresh}:offset=${json.target_offset}:linear=true,${LIMIT}`;
}

execFileSync("ffmpeg", [
  "-v", "error", "-y", "-i", input,
  "-c:v", "copy",
  "-af", filter, "-ar", "48000", "-c:a", "aac", "-b:a", "256k",
  "-movflags", "+faststart",
  output,
]);

const after = measure(output);
console.log(`${output}: ${json.input_i} LUFS -> ${after.input_i} LUFS, true peak ${after.input_tp} dBTP`);
