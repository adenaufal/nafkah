import type { BookletFacts, BookletRegion } from "@/data/bookletFacts";
import { pct, rp, rpSigned } from "@/lib/format";
import { BAND } from "../figures";
import { Sheet, SheetHead, T } from "../Sheet";

/** Rows at each end of the ranking. */
const N = 15;

function RankTable({
  id,
  title,
  rows,
  rankOf,
}: {
  id: string;
  title: string;
  rows: BookletRegion[];
  rankOf: (r: BookletRegion) => number;
}) {
  const td =
    "truncate py-[5px] text-[13px] text-ink-2 paper:py-[2.5px] paper:text-[10px]";
  return (
    <section aria-labelledby={id}>
      <p id={id} className={T.label}>
        {title}
      </p>
      <div className="thin-scroll relative mt-2 overflow-x-auto paper:overflow-visible">
        <table className="tnum w-full min-w-[600px] table-fixed border-t border-ink text-left paper:min-w-0">
          <caption className="sr-only">{title}</caption>
          {/* Fixed widths: both tables line up column for column. */}
          <colgroup>
            {[4, 28, 23, 15, 12, 9, 9].map((w, i) => (
              <col key={i} style={{ width: `${w}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-rule">
              <th scope="col" className={`${T.th} w-8 pr-2 text-right`}>
                #
              </th>
              <th scope="col" className={`${T.th} pr-3`}>
                Daerah
              </th>
              <th scope="col" className={`${T.th} pr-3`}>
                Provinsi
              </th>
              <th scope="col" className={`${T.th} pr-3 text-right`}>
                Upah minimum
              </th>
              <th scope="col" className={`${T.th} pr-3 text-right`}>
                Biaya hidup
              </th>
              <th scope="col" className={`${T.th} pr-3 text-right`}>
                Cakupan
              </th>
              <th scope="col" className={`${T.th} text-right`}>
                Sisa / kurang
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.code} className="border-b border-rule">
                <td className={`${td} pr-2 text-right text-muted`}>
                  {rankOf(r)}
                </td>
                <th scope="row" className={`${td} pr-3 font-semibold text-ink`}>
                  {r.label}
                </th>
                <td className={`${td} pr-3`}>{r.province}</td>
                <td className={`${td} pr-3 text-right`}>
                  {rp(r.wage)}{" "}
                  <span className="text-[10px] text-muted paper:text-[8.5px]">
                    {r.wageKind}
                  </span>
                </td>
                <td className={`${td} pr-3 text-right`}>{rp(r.cost)}</td>
                <td className={`${td} pr-3 text-right`}>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full"
                      style={{ background: BAND[r.band].fill }}
                    />
                    {pct(r.coverage)}
                  </span>
                  <span className="sr-only"> ({BAND[r.band].label})</span>
                </td>
                <td
                  className={`${td} text-right font-semibold ${r.surplus >= 0 ? "text-ok" : "text-danger"}`}
                >
                  {rpSigned(r.surplus)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function Rankings({ f }: { f: BookletFacts }) {
  const total = f.ranked.length;
  const top = f.ranked.slice(0, N);
  // Heaviest first: the last region in the ranking leads the table.
  const bottom = f.ranked.slice(-N).reverse();
  const rank = new Map(f.ranked.map((r, i) => [r.code, i + 1]));
  const rankOf = (r: BookletRegion) => rank.get(r.code) ?? 0;
  return (
    <Sheet id="peringkat">
      <SheetHead
        id="peringkat"
        title={`Dari ${top[0].label} (${pct(top[0].coverage)}) sampai ${bottom[0].label} (${pct(bottom[0].coverage)}).`}
        lead={`Peringkat dari ${total} daerah menurut cakupan, untuk profil ${f.noun}.`}
      />
      <div className="mt-6 space-y-7 paper:mt-[6mm] paper:space-y-[6mm]">
        <RankTable
          id="peringkat-lega"
          title={`${N} paling lega`}
          rows={top}
          rankOf={rankOf}
        />
        <RankTable
          id="peringkat-berat"
          title={`${N} paling berat`}
          rows={bottom}
          rankOf={rankOf}
        />
      </div>
      <p className={`${T.small} mt-4 paper:mt-auto paper:pt-3`}>
        Upah minimum: UMK, atau UMP bila daerahnya tidak menetapkan UMK
        sendiri. Semua angka per bulan.
      </p>
    </Sheet>
  );
}
