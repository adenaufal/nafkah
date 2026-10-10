import type { BookletFacts } from "@/data/bookletFacts";
import type { MethodFacts } from "@/data/buildTime";
import { EXPENSE_CATEGORIES } from "@/data/costs";
import { formatDate } from "@/lib/format";
import { BOOKLET_PAGES, pageNumber } from "../pages";
import { Sheet, SheetHead, T } from "../Sheet";

export function Contents({ f, m }: { f: BookletFacts; m: MethodFacts }) {
  const about: [string, string][] = [
    [
      "Dataset",
      `${f.datasetVersion}, dirilis ${formatDate(f.generatedAt)}`,
    ],
    [
      "Cakupan",
      `${f.regionCount} kabupaten/kota (${f.kabupatenCount} kabupaten, ${f.kotaCount} kota) di ${f.provinceCount} provinsi`,
    ],
    [
      "Upah",
      `UMP/UMK ${f.wageYear}${m.wage.allOfficial ? ", semuanya dari penetapan resmi" : ""}`,
    ],
    [
      "Biaya hidup",
      `Estimasi ${EXPENSE_CATEGORIES.length} kategori pengeluaran per daerah`,
    ],
    ["Profil", `${f.profile}, upah kotor`],
    ["Pembulatan", "Rupiah ditampilkan ke ribuan terdekat"],
  ];
  const caveats: [string, string][] = [
    [
      "UMK itu lantai, bukan gaji nyata.",
      "Upah minimum adalah batas bawah yang ditetapkan pemerintah. Peta menjawab: apakah lantai upah resmi cukup di daerah ini?",
    ],
    [
      "Biaya hidup adalah estimasi.",
      `Pengeluaran ${EXPENSE_CATEGORIES.length} kategori dimodelkan dari agregat Susenas, IHK BPS, dan harga lokal — bukan survei langsung di tiap kota.`,
    ],
    [
      "Warnanya bergantung pada profil.",
      `Lajang atau keluarga, kost atau KPR: satu pilihan bisa memindahkan ratusan daerah ke band lain (halaman ${pageNumber("profil")}).`,
    ],
  ];

  return (
    <Sheet id="isi">
      <SheetHead
        id="isi"
        title="Setiap angka di sini dihitung dari dataset yang sama dengan peta."
        lead="Booklet ini disusun ulang setiap kali situs dibangun: data terbaru, rumus yang sama dengan peta interaktif, dan tidak ada angka yang diketik tangan. Kalau datanya berubah, booklet ikut berubah."
      />

      <div className="mt-8 grid gap-8 paper:mt-[9mm] paper:grid-cols-[1.35fr_1fr] paper:gap-[10mm]">
        <nav aria-label="Isi booklet">
          <p className={T.label}>Isi</p>
          <ol className="mt-2 border-t border-ink">
            {BOOKLET_PAGES.map((p, i) => (
              <li key={p.id} className="border-b border-rule">
                <a
                  href={`#${p.id}`}
                  className="flex items-baseline gap-3 py-2 paper:py-[6px]"
                >
                  <span className="f-display tnum w-6 shrink-0 text-[17px] text-accent-ink paper:text-[15px]">
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold text-ink paper:text-[12.5px]">
                      {p.label}
                    </span>
                    <span className="block text-[13px] text-muted paper:text-[10.5px]">
                      {p.blurb}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-6">
          <section aria-labelledby="isi-tentang">
            <p id="isi-tentang" className={T.label}>
              Tentang booklet ini
            </p>
            <dl className="mt-2 border-t border-ink text-[13.5px] leading-[1.45] paper:text-[11px]">
              {about.map(([k, v]) => (
                <div key={k} className="border-b border-rule py-2 paper:py-[5px]">
                  <dt className="font-semibold text-ink">{k}</dt>
                  <dd className="text-ink-2">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section aria-labelledby="isi-siapa">
            <p id="isi-siapa" className={T.label}>
              Untuk siapa
            </p>
            <ul className="mt-2 space-y-2 text-[13.5px] leading-[1.45] text-ink-2 paper:text-[11px]">
              <li>
                <b className="font-semibold text-ink">Pekerja & perantau</b> —
                apakah upah cukup di kota tujuan.
              </li>
              <li>
                <b className="font-semibold text-ink">HR & pemberi kerja</b> —
                biaya hidup antardaerah sebelum menawarkan gaji.
              </li>
              <li>
                <b className="font-semibold text-ink">Jurnalis & peneliti</b> —
                sebaran nasional dan metode yang bisa diperiksa ulang.
              </li>
            </ul>
          </section>
        </div>
      </div>

      <section
        aria-labelledby="isi-tiga"
        className="mt-10 paper:mt-auto paper:pt-[8mm]"
      >
        <p id="isi-tiga" className={T.label}>
          Tiga hal sebelum membaca
        </p>
        <ol className="mt-3 grid gap-5 paper:grid-cols-3 paper:gap-[7mm]">
          {caveats.map(([t, d], i) => (
            <li key={t} className="border-t-2 border-accent pt-3">
              <span className="f-display tnum text-[26px] leading-none text-accent-ink paper:text-[22px]">
                {i + 1}
              </span>
              <p className="mt-2 text-[15px] font-bold leading-snug text-ink paper:text-[12.5px]">
                {t}
              </p>
              <p className="mt-1 text-[14px] leading-[1.55] text-ink-2 paper:text-[11px]">
                {d}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </Sheet>
  );
}
