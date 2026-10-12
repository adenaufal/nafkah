import type { BookletFacts } from "@/data/bookletFacts";
import { MAX_PINS } from "@/state/persist";
import { AppSketch } from "../AppSketch";
import { Sheet, SheetHead, T } from "../Sheet";

/* Labels in quotes are the app's own, so readers can find them on screen. */
const STEPS: [string, string][] = [
  [
    "Pilih daerah",
    "Klik di peta, ketik namanya di kolom cari (pintasan: tombol / atau Ctrl/⌘ K), atau pilih “Daerah di lokasiku”. Panel daerah berisi struk bulanan, pendapatan yang dibutuhkan agar cukup, perbandingan dengan median nasional, dan posisinya di provinsi.",
  ],
  [
    "Hitung dengan angkamu",
    "Di “Hitung dengan”, pilih “Upah daerah” (UMK/UMP tiap daerah), “Gajiku” (satu gaji untuk semua daerah, bisa digeser), atau “Upah kotaku” (upah minimum kotamu, dengan biaya hidup daerah tujuan) untuk simulasi pindah kota.",
  ],
  [
    "Ubah profil",
    "Rumah tangga dan jumlah anak; gaya hidup Hemat, Standar, atau Longgar; hunian Rusun/kost, Rumah KPR, Apartemen, atau Rumah sendiri; Motor, Kend. umum, Ojol, Mobil, atau Jalan kaki; cicilan rumah sendiri; tanggungan keluarga; tabungan; upah kotor atau setelah potongan. Peta menghitung ulang seketika.",
  ],
];

const MORE: [string, string][] = [
  ["Mode warna", "Cakupan, Biaya hidup, atau Upah."],
  ["Peta dasar", "Kertas, Satelit, atau Tanpa peta dasar."],
  [
    "Offline",
    "Setelah kunjungan pertama, aplikasi dan data tersimpan di browser; pilih “Tanpa peta dasar” untuk memakainya tanpa internet.",
  ],
  ["Metode", "Rumus, sumber per kategori, dasar hukum upah per provinsi."],
];

const PRIVACY: [string, string][] = [
  [
    "Tanpa akun, tanpa analitik pihak ketiga.",
    "Aplikasi hanya menyimpan hitungan event agregat di browser ini.",
  ],
  [
    "Gaji dan cicilanmu tetap di perangkatmu.",
    "Angka itu baru ikut ke tautan kalau kamu sendiri memilih Bagikan.",
  ],
  [
    "Lokasi hanya dipakai sekali.",
    "“Daerah di lokasiku” mencocokkan posisimu dengan batas wilayah di perangkatmu, lalu membuangnya.",
  ],
];

export function UsingApp({ f }: { f: BookletFacts }) {
  const steps: [string, string][] = [
    ...STEPS,
    [
      "Bandingkan & bagikan",
      `Sematkan sampai ${MAX_PINS} daerah untuk dibandingkan berdampingan, ekspor CSV lengkap dengan sumber tiap angka, bagikan struk daerah sebagai gambar, atau salin tautan yang memulihkan tampilan yang sama.`,
    ],
  ];
  return (
    <Sheet id="aplikasi">
      <SheetHead
        id="aplikasi"
        title="Peta yang sama, dengan angkamu."
        lead={`Booklet ini memakai satu profil: ${f.noun} dengan upah minimum. Di nafkah.adenaufal.com setiap asumsi bisa diganti, dan ${f.regionCount} daerah dihitung ulang seketika.`}
      />

      <figure className="mt-6 paper:mt-[6mm]">
        <AppSketch f={f} />
      </figure>

      <ol className="mt-7 grid gap-x-[8mm] gap-y-6 paper:mt-[6mm] paper:grid-cols-2 paper:gap-y-[5mm]">
        {steps.map(([t, d], i) => (
          <li key={t} className="flex gap-3.5">
            <span
              aria-hidden="true"
              className="tnum grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-[14px] font-bold text-on-accent paper:h-[22px] paper:w-[22px] paper:text-[11.5px]"
            >
              {i + 1}
            </span>
            <span>
              <span className="block text-[15.5px] font-bold text-ink paper:text-[13px]">
                {t}
              </span>
              <span className="mt-1 block text-[14px] leading-[1.55] text-ink-2 paper:text-[11.5px]">
                {d}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-8 paper:mt-[6mm] paper:grid-cols-2 paper:gap-[8mm]">
        <section aria-labelledby="aplikasi-lain">
          <p id="aplikasi-lain" className={T.label}>
            Yang juga ada
          </p>
          <dl className="mt-2 border-t border-ink">
            {MORE.map(([k, v]) => (
              <div
                key={k}
                className="flex gap-3 border-b border-rule py-2 text-[13.5px] leading-[1.45] paper:py-[5px] paper:text-[11px]"
              >
                <dt className="w-24 shrink-0 font-semibold text-ink paper:w-20">
                  {k}
                </dt>
                <dd className="text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="aplikasi-privasi">
          <p id="aplikasi-privasi" className={T.label}>
            Privasi
          </p>
          <ul className="mt-2 space-y-2.5 border-t border-ink pt-2.5">
            {PRIVACY.map(([t, d]) => (
              <li
                key={t}
                className="text-[13.5px] leading-[1.5] text-ink-2 paper:text-[11px]"
              >
                <b className="font-semibold text-ink">{t}</b> {d}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Sheet>
  );
}
