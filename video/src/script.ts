/**
 * Voice-over and on-screen captions, one source for both.
 *
 * `show` is what the caption prints; `say` is what ElevenLabs reads when the
 * two differ (numbers, the URL). `cue` names a moment the visuals sync to:
 * the frame where that word starts in the generated voice.
 */

export type SceneId =
  | "hook"
  | "slider"
  | "profile"
  | "receipt"
  | "move"
  | "app"
  | "cta";

export type Emphasis = "accent" | "green" | "red" | "blue";

export interface Token {
  show: string;
  say?: string;
  em?: Emphasis;
  cue?: string;
}

export interface Segment<Id extends string = SceneId> {
  id: Id;
  /** Caption pages: each array is shown together, word by word. */
  pages: Token[][];
  /**
   * Silence (seconds) inserted after this segment in the final voice track,
   * so a visual beat can land before the next line starts.
   */
  pauseAfter?: number;
}

type Word = string | Token;
export const page = (...words: Word[]): Token[] =>
  words.map((w) => (typeof w === "string" ? { show: w } : w));

export const SCRIPT: Segment[] = [
  {
    id: "hook",
    pauseAfter: 0.3,
    pages: [
      page("Kemarin", "kalian", "nanya:"),
      page({ show: "“Mana", cue: "ijoQ" }, "yang", { show: "ijo?”", em: "green" }),
    ],
  },
  {
    id: "slider",
    pauseAfter: 0.25,
    pages: [
      page({ show: "Sekarang,", cue: "now" }, "pakai"),
      page({ show: "gajimu", em: "accent" }, "sendiri."),
      page({ show: "Geser,", cue: "drag" }),
      page({ show: "514", say: "lima ratus empat belas", em: "accent" }, "daerah"),
      page("langsung", "dihitung", { show: "ulang.", cue: "recount" }),
    ],
  },
  {
    id: "profile",
    pauseAfter: 0.4,
    pages: [
      page({ show: "Udah", cue: "married" }, "nikah,"),
      page("punya", { show: "dua", cue: "kids" }, "anak?"),
      page({ show: "Merah", em: "red", cue: "red" }, "lagi."),
      page({ show: "Pasangan", cue: "dual" }, "ikut", "kerja?"),
      page("Mulai", { show: "biru.", em: "blue", cue: "blue" }),
    ],
  },
  {
    id: "receipt",
    pauseAfter: 0.25,
    pages: [
      page({ show: "Klik", cue: "tap" }, "daerahnya,"),
      page({ show: "keluar", cue: "print" }, "struk", "bulanan."),
      page({ show: "Jogja?", cue: "jogja" }),
      page("UMK-nya", { show: "kurang", cue: "short" }),
      page({
        show: "Rp832 ribu",
        say: "delapan ratus tiga puluh dua ribu",
        em: "red",
      }),
      page("sebulan."),
    ],
  },
  {
    id: "move",
    pauseAfter: 0.3,
    pages: [
      // Jakarta has a provincial minimum (UMP), not a UMK.
      page("Gaji", { show: "minimum", cue: "wage" }, "Jakarta,"),
      page("tapi", "tinggal", "di", { show: "Jogja?", cue: "live" }),
      page({ show: "Sisa", cue: "surplus" }, { show: "Rp2 juta.", say: "dua juta.", em: "green" }),
    ],
  },
  {
    id: "app",
    pauseAfter: 0.2,
    pages: [
      page({ show: "Tampilannya", cue: "phones" }, { show: "baru,", em: "accent" }),
      page("lebih", "enak", "di", "HP."),
      page({ show: "Gratis,", cue: "free" }, "tanpa", "login."),
    ],
  },
  {
    id: "cta",
    pages: [
      page({ show: "Cek", cue: "url" }, "daerahmu", "di"),
      page({
        show: "nafkah.adenaufal.com",
        say: "nafkah dot ade naufal dot com.",
        em: "accent",
      }),
      page({ show: "Daerahmu", cue: "ask" }, "warna", "apa?"),
    ],
  },
];

export const spoken = (t: Token): string =>
  t.say ?? t.show.replace(/[“”"]/g, "");

/** Flatten to the exact TTS input and each token's character range in it. */
export function ttsText(script: Segment<string>[] = SCRIPT) {
  let text = "";
  const ranges: { start: number; end: number }[] = [];
  for (const seg of script) {
    for (const p of seg.pages) {
      for (const tok of p) {
        if (text) text += " ";
        const s = spoken(tok);
        ranges.push({ start: text.length, end: text.length + s.length });
        text += s;
      }
    }
  }
  return { text, ranges };
}
