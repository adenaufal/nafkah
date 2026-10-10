import type { BookletFacts } from "@/data/bookletFacts";
import { pct, pctFixed } from "@/lib/format";
import { BandBar } from "../figures";
import { Sheet, SheetHead, T } from "../Sheet";

export function Provinces({ f }: { f: BookletFacts }) {
  const first = f.provinces[0];
  const td = "py-[5px] text-[13px] text-ink-2 paper:py-[2.5px] paper:text-[10px]";
  return (
    <Sheet id="provinsi">
      <SheetHead
        id="provinsi"
        title={
          first.below === first.total
            ? `${first.province}: seluruh ${first.total} daerahnya di bawah 100%.`
            : `${first.province}: ${first.below} dari ${first.total} daerahnya di bawah 100%.`
        }
        lead="Provinsi diurutkan dari bagian daerah di bawah 100% yang terbesar. Median adalah cakupan daerah di tengah urutan provinsi itu."
      />
      <div className="thin-scroll relative mt-6 overflow-x-auto paper:mt-[6mm] paper:overflow-visible">
        <table className="tnum w-full min-w-[540px] border-t border-ink text-left paper:min-w-0">
          <caption className="sr-only">
            Provinsi menurut jumlah daerah di bawah 100%
          </caption>
          <thead>
            <tr className="border-b border-rule">
              <th scope="col" className={`${T.th} w-6 pr-2 text-right`}>
                #
              </th>
              <th scope="col" className={`${T.th} pr-3`}>
                Provinsi
              </th>
              <th scope="col" className={`${T.th} pr-3 text-right`}>
                Daerah
              </th>
              <th scope="col" className={`${T.th} pr-3 text-right`}>
                Di bawah 100%
              </th>
              <th scope="col" className={`${T.th} w-[30%] pr-3`}>
                Sebaran band
              </th>
              <th scope="col" className={`${T.th} text-right`}>
                Median
              </th>
            </tr>
          </thead>
          <tbody>
            {f.provinces.map((p, i) => (
              <tr key={p.provinceCode} className="border-b border-rule">
                <td className={`${td} pr-2 text-right text-muted`}>{i + 1}</td>
                <th scope="row" className={`${td} pr-3 font-semibold text-ink`}>
                  {p.province}
                </th>
                <td className={`${td} pr-3 text-right`}>{p.total}</td>
                <td className={`${td} pr-3 text-right`}>
                  <b className="font-semibold text-ink">{p.below}</b>{" "}
                  <span className="ml-1 inline-block w-9 text-muted">
                    {pct(p.shareBelow * 100)}
                  </span>
                </td>
                <td className={`${td} pr-3`}>
                  <BandBar counts={p.counts} className="h-2" spoken />
                </td>
                <td className={`${td} text-right font-semibold text-ink`}>
                  {pctFixed(p.medianCoverage)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Sheet>
  );
}
