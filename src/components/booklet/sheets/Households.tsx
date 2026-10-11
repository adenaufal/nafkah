import type { BookletFacts } from "@/data/bookletFacts";
import { BAND_ORDER } from "@/lib/bands";
import { pct, pctFixed, rpShort } from "@/lib/format";
import { BAND, BandBar, IndonesiaMap } from "../figures";
import { Sheet, SheetHead, T } from "../Sheet";

export function Households({ f }: { f: BookletFacts }) {
  const total = f.regionCount;
  const family = f.households.find((h) => h.id === "keluarga-satu-upah");
  return (
    <Sheet id="profil">
      <SheetHead
        id="profil"
        title="Siapa yang dihitung mengubah seluruh peta."
        lead={
          family
            ? `Peta yang sama untuk empat rumah tangga. Dengan ${family.earners} upah minimum, ${family.noun} berada di bawah 100% di ${family.summary.below === total ? `seluruh ${total} daerah` : `${family.summary.below} dari ${total} daerah`}.`
            : "Peta yang sama untuk empat rumah tangga."
        }
      />

      <ul className="mt-6 grid gap-x-[7mm] gap-y-8 paper:mt-[6mm] paper:grid-cols-2 paper:gap-y-[6mm]">
        {f.households.map((h) => {
          const s = h.summary;
          return (
            <li key={h.id}>
              <p className="text-[15px] font-bold leading-tight text-ink paper:text-[12.5px]">
                {h.title}
              </p>
              <p className="mt-0.5 text-[13px] text-muted paper:text-[10.5px]">
                {h.note}
              </p>
              <div className="mt-2">
                <IndonesiaMap
                  facts={f}
                  set={h.id}
                  counts={s.counts}
                  borders="provinces"
                  label={`${h.title}: ${s.below} dari ${s.total} daerah di bawah 100%, median ${pct(s.medianCoverage, 1)}.`}
                />
              </div>
              <BandBar counts={s.counts} className="mt-2 h-2" />
              <p className="tnum mt-1.5 flex items-baseline justify-between gap-3 text-[13px] text-ink-2 paper:text-[10.5px]">
                <span>
                  <b className="f-display text-[18px] font-[560] text-ink paper:text-[15px]">
                    {s.below}
                  </b>{" "}
                  dari {s.total} di bawah 100%
                </span>
                <span>median {pctFixed(s.medianCoverage)}</span>
              </p>
              <p className="tnum mt-0.5 text-[12.5px] text-muted paper:text-[10px]">
                Median biaya hidup {rpShort(h.medianCost)} · pendapatan{" "}
                {rpShort(h.medianIncome)} per bulan
              </p>
            </li>
          );
        })}
      </ul>
      <p className={`${T.small} mt-3`}>
        Keempatnya memakai gaya hidup standar, rusun/kost, motor, dan tabungan.
        Pasangan diasumsikan bekerja dengan upah minimum daerah yang sama.
      </p>

      <section
        aria-labelledby="profil-lajang"
        className="mt-8 paper:mt-[9mm]"
      >
        <p id="profil-lajang" className={T.label}>
          Untuk lajang pun, asumsi menggeser hasil
        </p>
        <table className="tnum mt-2 w-full border-t border-ink text-left">
          <caption className="sr-only">
            Jumlah daerah per band dan median cakupan untuk beberapa profil
            lajang
          </caption>
          <thead>
            <tr className="border-b border-rule">
              <th scope="col" className={`${T.th} pr-3`}>
                Profil lajang
              </th>
              {BAND_ORDER.map((band) => (
                <th key={band} scope="col" className={`${T.th} px-1.5 text-right`}>
                  {BAND[band].label}
                </th>
              ))}
              <th scope="col" className={`${T.th} pl-1.5 text-right`}>
                Median
              </th>
            </tr>
          </thead>
          <tbody>
            {f.sensitivity.map((row) => (
              <tr key={row.id} className="border-b border-rule align-top">
                <th scope="row" className="py-1.5 pr-3 text-left font-normal">
                  <span className="block text-[13px] font-semibold text-ink paper:text-[11px]">
                    {row.label}
                  </span>
                  <span className="block text-[12px] text-muted paper:text-[9.5px]">
                    {row.note}
                  </span>
                </th>
                {BAND_ORDER.map((band) => (
                  <td
                    key={band}
                    className="px-1.5 py-1.5 text-right text-[13px] text-ink-2 paper:text-[11px]"
                  >
                    {row.distribution.counts[band]}
                  </td>
                ))}
                <td className="py-1.5 pl-1.5 text-right text-[13px] font-semibold text-ink paper:text-[11px]">
                  {pctFixed(row.distribution.medianCoverage)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={`${T.small} mt-2`}>
          Baca warna peta sebagai rentang, bukan vonis: jarak antara baris
          pertama dan baris “hemat” adalah ukuran ketidakpastian model.
        </p>
      </section>
    </Sheet>
  );
}
