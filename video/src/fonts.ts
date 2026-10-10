import { continueRender, delayRender, staticFile } from "remotion";

/*
 * The app's own font files (next/font output, latin + latin-ext subsets),
 * so the video sets type exactly like nafkah.adenaufal.com.
 */
const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const LATIN_EXT =
  "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF";

const FACES = [
  { family: "Plus Jakarta Sans", file: "jakarta", weight: "200 800" },
  { family: "Fraunces", file: "fraunces", weight: "100 900" },
  { family: "JetBrains Mono", file: "mono", weight: "100 800" },
];

let loaded = false;

export function loadFonts(): void {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("Loading fonts");
  const faces = FACES.flatMap(({ family, file, weight }) => [
    new FontFace(family, `url(${staticFile(`fonts/${file}-latin.woff2`)}) format("woff2")`, {
      weight,
      unicodeRange: LATIN,
    }),
    new FontFace(family, `url(${staticFile(`fonts/${file}-latin-ext.woff2`)}) format("woff2")`, {
      weight,
      unicodeRange: LATIN_EXT,
    }),
  ]);
  Promise.all(faces.map((f) => f.load()))
    .then((ready) => {
      ready.forEach((f) => document.fonts.add(f));
      continueRender(handle);
    })
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}
