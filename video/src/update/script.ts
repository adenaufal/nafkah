import { page, type Segment } from "../script";

/**
 * Update v0.4.0: "kemarin kalian minta, sekarang sudah ada". Same rules as
 * the teaser's script: `show` is the caption, `say` what ElevenLabs reads,
 * `cue` a word the picture syncs to.
 */

export type UpdateSceneId = "hook" | "home" | "support" | "more" | "share" | "about" | "cta";

export const UPDATE_SCRIPT: Segment<UpdateSceneId>[] = [
  {
    id: "hook",
    pauseAfter: 0.3,
    pages: [
      page("Kemarin", "kalian", { show: "minta.", cue: "asked" }),
      page({ show: "Sekarang", cue: "now" }, "sudah", { show: "ada.", em: "accent", cue: "done" }),
    ],
  },
  {
    id: "home",
    pauseAfter: 0.3,
    pages: [
      page("Tinggal", "di", { show: "rumah", cue: "owner" }, "sendiri"),
      page("atau", "ikut", "orang", "tua?"),
      page({ show: "Biaya", cue: "zero" }, "huniannya", { show: "Rp0.", say: "nol.", em: "green" }),
    ],
  },
  {
    id: "support",
    pauseAfter: 0.3,
    pages: [
      page("Tapi", "rutin", { show: "kirim", cue: "send" }, "ke", "orang", "tua?"),
      page("Isi", { show: "tanggungan", cue: "support" }, "keluarga."),
      page(
        { show: "Yang", cue: "drop" },
        "cukup",
        "tinggal",
        { show: "53", say: "lima puluh tiga", em: "red" },
        "daerah.",
      ),
    ],
  },
  {
    id: "more",
    pauseAfter: 0.25,
    pages: [
      page("Ada", "juga", { show: "mobil,", cue: "car" }),
      page({ show: "jalan", cue: "walk" }, "kaki", "atau", "sepeda,"),
      page("dan", { show: "gaji", cue: "partner" }, "pasangan", "yang", "beda."),
    ],
  },
  {
    id: "share",
    pauseAfter: 0.3,
    pages: [
      page({ show: "Struknya", cue: "share" }, "bisa", "dibagikan"),
      page("jadi", { show: "gambar.", cue: "png", em: "accent" }),
      page({ show: "Nominalnya", cue: "hide" }, "bisa", "disembunyikan,"),
      page("atau", { show: "salin", cue: "copy" }, "jadi", "teks."),
    ],
  },
  {
    id: "about",
    pauseAfter: 0.3,
    pages: [
      page("Angkanya", "dari", "mana,"),
      page({ show: "bikinnya", cue: "made" }, "pakai", "apa?"),
      page("Ada", "di", "halaman", { show: "Tentang.", em: "accent" }),
    ],
  },
  {
    id: "cta",
    pages: [
      page({ show: "Cek", cue: "url" }, "di"),
      page({
        show: "nafkah.adenaufal.com",
        say: "nafkah dot ade naufal dot com.",
        em: "accent",
      }),
      page({ show: "Apa", cue: "ask" }, "lagi", "yang", "kurang?"),
    ],
  },
];
