import type { BookletFacts } from "@/data/bookletFacts";
import { BAND_ORDER } from "@/lib/bands";
import { AFFORDABILITY_BANDS } from "@/lib/calculations";
import { pct, rp, rpShort } from "@/lib/format";
import { BAND, BandBar, DotPlot } from "../figures";
import { Sheet, SheetHead, T } from "../Sheet";

/** "Aceh, Bali dan Jambi" */
function list(names: string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} dan ${names[names.length - 1]}`;
}

export function Summary({ f }: { f: BookletFacts }) {
  const n = f.national;
  const top = f.ranked[0];
  const bottom = f.ranked[f.ranked.length - 1];
  const { kota, kabupaten } = f.tiers;
  const kotaShare = kota.total ? (kota.below / kota.total) * 100 : 0;
  const kabShare = kabupaten.total ? (kabupaten.below / kabupaten.total) * 100 : 0;
  const allBelow = f.provinces.filter((p) => p.below === p.total);

  const findings: [string, string][] = [
    [
      "Rentangnya lebar.",
      `Dari ${top.label} (${pct(top.coverage)}) sampai ${bottom.label} (${pct(bottom.coverage)}) — selisih ${Math.round(top.coverage - bottom.coverage)} poin.`,
    ],
    [
      kotaShare > kabShare
        ? "Kota lebih berat daripada kabupaten."
        : kotaShare < kabShare
          ? "Kabupaten lebih berat daripada kota."
          : "Kota dan kabupaten sama beratnya.",
      `${kota.below} dari ${kota.total} kota (${pct(kotaShare)}) ada di bawah 100%, dibanding ${kabupaten.below} dari ${kabupaten.total} kabupaten (${pct(kabShare)}).`,
    ],
    allBelow.length > 0
      ? [
          `${allBelow.length} provinsi tanpa satu pun daerah yang mencapai 100%.`,
          `${list(allBelow.map((p) => p.province))}.`,
        ]
      : [
          "Setiap provinsi punya daerah yang mencapai 100%.",
          "Tidak ada provinsi yang seluruh daerahnya di bawah garis.",
        ],
    [
      "Tabungan ikut dihitung.",
      `Biaya hidup sudah termasuk tabungan ±10%. Tanpa tabungan, daerah di bawah 100% menjadi ${f.belowWithoutSavings}, bukan ${n.below}.`,
    ],
    [
      "Biaya hidup berbeda jauh.",
      `Untuk ${f.noun}, dari ${rp(f.cheapest.cost)} di ${f.cheapest.label} sampai ${rp(f.priciest.cost)} di ${f.priciest.label} per bulan.`,
    ],
    [
      "Kekurangannya sering tipis.",
      `Di separuh dari ${n.below} daerah di bawah 100%, upah kurang ${rpShort(f.medianShortfall)} per bulan atau lebih sedikit.`,
    ],
  ];

  const stats: [string, string][] = [
    [`${n.below}`, `dari ${n.total} daerah di bawah 100%`],
    [pct(n.medianCoverage, 1), "median cakupan nasional"],
    [rpShort(f.medianWage), "median upah minimum per bulan"],
    [rpShort(f.medianCost), `median biaya hidup ${f.noun} per bulan`],
  ];

  return (
    <Sheet id="ringkasan">
      <SheetHead
        id="ringkasan"
        title={`Median cakupan nasional: ${pct(n.medianCoverage, 1)}.`}
        lead={`Separuh dari ${n.total} daerah ada di bawah angka itu, separuh di atasnya. Di ${n.below} daerah upah minimum belum menutup biaya hidup ${f.noun}; di ${n.covered} daerah sudah.`}
      />

      <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-ink py-4 paper:mt-[8mm] paper:grid-cols-4 paper:gap-4">
        {stats.map(([v, k]) => (
          <div key={k} className="flex flex-col-reverse justify-end">
            <dt className="mt-1 text-[13px] leading-snug text-ink-2 paper:text-[10.5px]">
              {k}
            </dt>
            <dd className="f-display tnum text-[34px] font-[560] leading-none tracking-[-0.02em] text-ink paper:text-[30px]">
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="ringkasan-band" className="mt-8 paper:mt-[8mm]">
        <p id="ringkasan-band" className={T.label}>
          Sebaran {n.total} daerah per band
        </p>
        <BandBar counts={n.counts} className="mt-3 h-4 rounded-[3px]" />
        <ul className="mt-3 grid grid-cols-2 gap-4 paper:grid-cols-4">
          {BAND_ORDER.map((band) => (
            <li key={band} className="border-l-[3px] pl-2.5" style={{ borderColor: BAND[band].fill }}>
              <p className="f-display tnum text-[26px] leading-none text-ink paper:text-[22px]">
                {n.counts[band]}
              </p>
              <p className="mt-1 text-[13px] font-semibold text-ink paper:text-[11px]">
                {BAND[band].label}{" "}
                <span className="font-normal text-muted">{BAND[band].range}</span>
              </p>
              <p className="text-[12px] text-muted paper:text-[10px]">
                {pct((n.counts[band] / n.total) * 100)} dari semua daerah
              </p>
            </li>
          ))}
        </ul>
      </section>

      <figure className="mt-8 paper:mt-[8mm]">
        <figcaption className={T.label}>Setiap titik satu daerah</figcaption>
        <div className="relative mt-2 overflow-x-auto paper:overflow-visible">
          <div className="min-w-[560px] paper:min-w-0">
            <DotPlot regions={f.ranked} median={n.medianCoverage} />
          </div>
        </div>
        <p className={`${T.small} mt-1`}>
          Garis tegas: 100%, titik ketika upah pas menutup biaya hidup. Garis
          putus-putus: batas band di {AFFORDABILITY_BANDS.tightAt}% dan{" "}
          {AFFORDABILITY_BANDS.comfortableAt}%.
        </p>
      </figure>

      <section aria-labelledby="ringkasan-temuan" className="mt-8 paper:mt-[8mm]">
        <p id="ringkasan-temuan" className={T.label}>
          Temuan
        </p>
        <ul className="mt-2 grid gap-x-8 border-t border-ink paper:grid-cols-2">
          {findings.map(([t, d]) => (
            <li
              key={t}
              className="border-b border-rule py-2.5 text-[14px] leading-[1.5] text-ink-2 paper:py-[7px] paper:text-[11.5px]"
            >
              <b className="font-semibold text-ink">{t}</b> {d}
            </li>
          ))}
        </ul>
      </section>
    </Sheet>
  );
}
