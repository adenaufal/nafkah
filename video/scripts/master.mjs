// Loudness-master a rendered teaser for social upload: two-pass EBU R128 to
// -14 LUFS / -1 dBTP (what TikTok, Reels and Threads play back at), AAC 48 kHz,
// video stream copied untouched, moov atom up front.
//
//   node scripts/master.mjs out/nafkah-teaser-raw.mp4 out/nafkah-teaser.mp4
import { execFileSync, spawnSync } from "node:child_process";

const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error("usage: node scripts/master.mjs <in.mp4> <out.mp4>");

const TARGET = "I=-14:TP=-1.0:LRA=11";
const pass1 = spawnSync(
  "ffmpeg",
  ["-hide_banner", "-i", input, "-af", `loudnorm=${TARGET}:print_format=json`, "-f", "null", "-"],
  { encoding: "utf8" },
);
const json = JSON.parse(pass1.stderr.slice(pass1.stderr.lastIndexOf("{"), pass1.stderr.lastIndexOf("}") + 1));
const filter =
  `loudnorm=${TARGET}:measured_I=${json.input_i}:measured_TP=${json.input_tp}` +
  `:measured_LRA=${json.input_lra}:measured_thresh=${json.input_thresh}:offset=${json.target_offset}:linear=true`;

execFileSync("ffmpeg", [
  "-v", "error", "-y", "-i", input,
  "-c:v", "copy",
  "-af", filter, "-ar", "48000", "-c:a", "aac", "-b:a", "256k",
  "-movflags", "+faststart",
  output,
]);

const check = spawnSync(
  "ffmpeg",
  ["-hide_banner", "-i", output, "-af", `loudnorm=${TARGET}:print_format=json`, "-f", "null", "-"],
  { encoding: "utf8" },
);
const after = JSON.parse(check.stderr.slice(check.stderr.lastIndexOf("{"), check.stderr.lastIndexOf("}") + 1));
console.log(`${output}: ${json.input_i} LUFS -> ${after.input_i} LUFS, true peak ${after.input_tp} dBTP`);
