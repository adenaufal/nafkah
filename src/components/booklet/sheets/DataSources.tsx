import type { BookletFacts } from "@/data/bookletFacts";
import type { MethodFacts } from "@/data/buildTime";
import { formatDate, formatMonth, rpShort } from "@/lib/format";
import { confidenceLabel } from "@/lib/labels";
import { limitations } from "@/lib/limitations";
import { CORRECTION_FORM_URL } from "@/lib/links";
import { Sheet, SheetHead, T } from "../Sheet";

export function DataSources({ f, m }: { f: BookletFacts; m: MethodFacts }) {
  const wageFrom = m.wage.asOf[0] ?? `${f.wageYear}-01-01`;
  const sources: [string, string][] = [
    [
      "Upah",
      `UMP/UMK ${f.wageYear}${m.wage.allOfficial ? " resmi" : ""}, berlaku sejak ${formatDate(wageFrom)} (PP No. 49 Tahun 2025). ${m.wage.umk} daerah memakai UMK sendiri, ${m.wage.ump} mengikuti UMP provinsi. Rentang ${rpShort(m.wage.min)}–${rpShort(m.wage.max)}, median ${rpShort(m.wage.median)}. Dasar hukum tiap provinsi ada di halaman Metode.`,
    ],
    [
      "Biaya hidup",
      `Nilai ${m.categories.length} kategori per daerah disimpan untuk satu profil acuan, lalu dikalikan faktor profil. Setiap nilai membawa sumber, tanggal, dan status keyakinannya sendiri.`,
    ],
    [
      "Batas wilayah",
      `${f.regionCount} kabupaten/kota sesuai Kepmendagri 100.1.1-6117, dari batas administratif HDX COD-AB yang disederhanakan untuk web. Danau, waduk, dan hutan lindung di data sumber tidak dihitung sebagai daerah.`,
    ],
  ];

  return (
    <Sheet id="data">
      <SheetHead
        id="data"
        title="Dari mana angkanya, dan seberapa jauh bisa dipegang."
      />

      <dl className="mt-6 grid gap-5 border-t border-ink pt-3 paper:mt-[6mm] paper:grid-cols-3 paper:gap-[6mm]">
        {sources.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[15px] font-bold text-ink paper:text-[12.5px]">
              {k}
            </dt>
            <dd className="mt-1 text-[13.5px] leading-[1.5] text-ink-2 paper:text-[10.5px]">
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="data-kategori" className="mt-7 paper:mt-[7mm]">
        <p id="data-kategori" className={T.label}>
          Cara tiap kategori biaya disusun
        </p>
        <div className="thin-scroll relative mt-2 overflow-x-auto paper:overflow-visible">
          <table className="w-full min-w-[560px] border-t border-ink text-left paper:min-w-0">
            <caption className="sr-only">
              Sumber dan status tiap kategori biaya hidup
            </caption>
            <thead>
              <tr className="border-b border-rule">
                <th scope="col" className={`${T.th} pr-3`}>
                  Kategori
                </th>
                <th scope="col" className={`${T.th} pr-3`}>
                  Sumber
                </th>
                <th scope="col" className={`${T.th} text-right`}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {m.categories.map((c) => (
                <tr key={c.key} className="border-b border-rule align-top">
                  <th
                    scope="row"
                    className="w-[24%] py-1.5 pr-3 text-[13px] font-semibold text-ink paper:py-[4px] paper:text-[10.5px]"
                  >
                    {c.label}
                  </th>
                  <td className="py-1.5 pr-3 text-[12.5px] leading-[1.4] text-ink-2 paper:py-[4px] paper:text-[9.5px]">
                    {c.sources.length === 1
                      ? c.sources[0].source
                      : `${c.sources.length} sumber berbeda — lihat detail tiap daerah di peta.`}
                  </td>
                  <td className="whitespace-nowrap py-1.5 text-right text-[12.5px] text-ink-2 paper:py-[4px] paper:text-[9.5px]">
                    {c.sources.length === 1 ? (
                      <>
                        {confidenceLabel(c.sources[0].confidence)}
                        <span className="block text-muted">
                          {formatMonth(c.sources[0].asOf)}
                        </span>
                      </>
                    ) : (
                      "Beragam"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="data-batas" className="mt-7 paper:mt-[7mm]">
        <p id="data-batas" className={T.label}>
          Batasan yang perlu kamu tahu
        </p>
        <ul className="mt-2 grid gap-x-[7mm] border-t border-ink paper:grid-cols-2">
          {limitations(wageFrom).map(([t, d]) => (
            <li
              key={t}
              className="border-b border-rule py-2 text-[13.5px] leading-[1.45] text-ink-2 paper:py-[4px] paper:text-[10.5px]"
            >
              <b className="font-semibold text-ink">{t}</b> {d}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 rounded-[12px] border border-rule px-5 py-4 paper:mt-auto">
        <p className="text-[14px] leading-[1.5] text-ink-2 paper:text-[11px]">
          <b className="font-semibold text-ink">Menemukan angka yang meleset?</b>{" "}
          Sertakan daerah, kategori, nilai lama dan usulan, periode, dan
          sumbernya lewat{" "}
          <a
            href={CORRECTION_FORM_URL}
            className="font-semibold text-accent-ink underline decoration-rule-2 underline-offset-2"
          >
            formulir koreksi
          </a>{" "}
          atau GitHub. Laporan diperiksa manual terhadap penetapan resmi dan
          tidak mengubah data secara otomatis. Setiap perubahan data dicatat di{" "}
          <a
            href="https://nafkah.adenaufal.com/data/CHANGELOG.md"
            className="font-semibold text-accent-ink underline decoration-rule-2 underline-offset-2"
          >
            catatan perubahan dataset
          </a>
          .
        </p>
      </div>
    </Sheet>
  );
}
