import type { BookletFacts } from "@/data/bookletFacts";
import { EXPENSE_CATEGORIES } from "@/data/costs";
import { BAND_MEANING, BAND_ORDER } from "@/lib/bands";
import { AFFORDABILITY_BANDS } from "@/lib/calculations";
import { digits, pct, rp } from "@/lib/format";
import { BAND } from "../figures";
import { Sheet, SheetHead, T } from "../Sheet";

/** The worked example as the app's monthly receipt, drawn for print. */
function Receipt({ f }: { f: BookletFacts }) {
  const { region, wageText, lines } = f.example;
  const surplus = region.surplus >= 0;
  const line = "flex items-baseline gap-2 py-[3px]";
  const dots = (
    <span
      aria-hidden="true"
      className="mb-[3px] min-w-3 flex-1 border-b border-dotted border-rule-2"
    />
  );
  return (
    <figure aria-label={`Struk bulanan ${region.label}`}>
      <div className="rounded-t-[10px] bg-paper-2 px-4 pb-4 pt-3.5 text-[13px] paper:text-[11.5px]">
        <div className="f-mono flex justify-between text-[11px] uppercase tracking-[0.14em] text-muted paper:text-[9px]">
          <span>Struk bulanan</span>
          <span>rupiah / bulan</span>
        </div>
        <div className="my-2.5 border-t border-dashed border-rule-2" />
        <div className={line}>
          <span className="font-bold text-ink">{wageText} {f.wageYear}</span>
          {dots}
          <span className="f-mono tnum font-bold">{digits(region.wage)}</span>
          <span className="w-8 shrink-0" />
        </div>
        <div className="my-2.5 border-t border-dashed border-rule-2" />
        <ul>
          {lines.map((l) => (
            <li key={l.key} className={line}>
              <span className="min-w-0 truncate text-ink-2">{l.label}</span>
              {dots}
              <span className="f-mono tnum">{digits(l.amount)}</span>
              <span className="tnum w-8 shrink-0 text-right text-muted">
                {pct(l.share * 100)}
              </span>
            </li>
          ))}
        </ul>
        <div className="my-2.5 border-t border-dashed border-rule-2" />
        <div className={line}>
          <span className="font-bold text-ink">Total pengeluaran</span>
          {dots}
          <span className="f-mono tnum font-bold">{digits(region.cost)}</span>
          <span className="w-8 shrink-0" />
        </div>
        <div className="my-2.5 h-[3px] border-y border-ink" aria-hidden="true" />
        <div className="flex items-end justify-between gap-3">
          <p>
            <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-muted paper:text-[9px]">
              {surplus ? "Sisa" : "Kurang"}
            </span>
            <span className="mt-1 flex items-center gap-1.5 font-semibold text-ink-2">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: BAND[region.band].fill }}
              />
              {BAND[region.band].label} · tertutup {pct(region.coverage)}
            </span>
          </p>
          <p
            className={`f-mono tnum text-[24px] font-bold leading-none tracking-[-0.03em] paper:text-[20px] ${surplus ? "text-ok" : "text-danger"}`}
          >
            {surplus ? "+" : "−"}
            {digits(region.surplus)}
          </p>
        </div>
      </div>
      <div className="receipt-edge" aria-hidden="true" />
    </figure>
  );
}

export function Method({ f }: { f: BookletFacts }) {
  const { region, targets } = f.example;
  const rank = f.ranked.findIndex((r) => r.code === region.code) + 1;
  return (
    <Sheet id="rumus">
      <SheetHead
        id="rumus"
        title="Satu pembagian menentukan setiap warna."
        lead="Pendapatan dibagi biaya hidup bulanan. Warna peta, band, dan setiap peringkat di booklet ini hanya membaca angka itu."
      />

      <div className="mt-6 rounded-[12px] border border-rule bg-paper px-5 py-4 paper:mt-[7mm]">
        <p className="f-display text-[20px] leading-[1.45] text-ink paper:text-[19px]">
          Cakupan = <span className="text-accent-ink">Pendapatan</span> ÷{" "}
          <span className="text-accent-ink">Biaya hidup bulanan</span> × 100%
        </p>
        <p className="f-display mt-1 text-[16px] leading-[1.45] text-ink-2 paper:text-[15px]">
          Sisa (atau kurang) = Pendapatan − Biaya hidup bulanan
        </p>
      </div>
      <div className={`${T.body} mt-4 grid gap-4 paper:grid-cols-2 paper:gap-[8mm]`}>
        <p>
          <b>Pendapatan</b> adalah upah minimum daerah itu: UMK, atau UMP bila
          daerahnya tidak menetapkan UMK sendiri. Di peta interaktif kamu bisa
          menggantinya dengan gajimu sendiri.
        </p>
        <p>
          <b>Biaya hidup bulanan</b> adalah jumlah {EXPENSE_CATEGORIES.length}{" "}
          kategori pengeluaran daerah itu, setelah dikalikan faktor profil rumah
          tangga (halaman berikutnya).
        </p>
      </div>

      <div className="mt-7 grid gap-8 paper:mt-[7mm] paper:grid-cols-[1.08fr_1fr] paper:gap-[8mm]">
        <section aria-labelledby="rumus-contoh">
          <p id="rumus-contoh" className={T.label}>
            Contoh: daerah di tengah urutan
          </p>
          <p className="mt-1.5 text-[17px] font-bold leading-tight text-ink paper:text-[14.5px]">
            {region.label}
          </p>
          <p className="mt-0.5 text-[13px] text-muted paper:text-[11px]">
            Provinsi {region.province} · peringkat {rank} dari{" "}
            {f.ranked.length}
          </p>
          <div className="mt-3">
            <Receipt f={f} />
          </div>
          <p className={`${T.small} mt-3`}>
            {pct(region.coverage, 1)} = {rp(region.wage)} ÷ {rp(region.cost)} ×
            100%.{" "}
            {`Agar cukup (${AFFORDABILITY_BANDS.manageableAt}%) perlu ${rp(targets.enough)}; agar nyaman (${AFFORDABILITY_BANDS.comfortableAt}%) ${rp(targets.comfortable)}.`}
          </p>
        </section>

        <section aria-labelledby="rumus-band">
          <p id="rumus-band" className={T.label}>
            Empat band
          </p>
          <table className="mt-2 w-full border-t border-ink text-left">
            <caption className="sr-only">
              Band keterjangkauan, rentang cakupan, dan artinya
            </caption>
            <tbody>
              {BAND_ORDER.map((band) => (
                <tr key={band} className="border-b border-rule align-top">
                  <th
                    scope="row"
                    className="w-[34%] py-2.5 pr-3 font-normal paper:py-2"
                  >
                    <span className="flex items-center gap-2 text-[14px] font-semibold text-ink paper:text-[12px]">
                      <span
                        aria-hidden="true"
                        className="h-3 w-3 shrink-0 rounded-[3px]"
                        style={{ background: BAND[band].fill }}
                      />
                      {BAND[band].label}
                    </span>
                    <span className="tnum mt-0.5 block pl-5 text-[12.5px] text-muted paper:text-[10.5px]">
                      {BAND[band].range}
                    </span>
                  </th>
                  <td className="py-2.5 text-[13.5px] leading-[1.5] text-ink-2 paper:py-2 paper:text-[11.5px]">
                    {BAND_MEANING[band]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={`${T.small} mt-3`}>
            Ambang band adalah konstanta di kode, bukan hasil penyesuaian agar
            peta tampak lebih hijau atau lebih merah. Warna selalu disertai
            nama dan angkanya, jadi tidak ada informasi yang hanya bergantung
            pada warna.
          </p>

          <div className="mt-6 border-l-[3px] border-accent bg-accent-soft/50 px-4 py-3 paper:mt-[6mm]">
            <p className="text-[14px] font-bold text-ink paper:text-[12px]">
              UMK itu lantai, bukan gaji nyata.
            </p>
            <p className="mt-1 text-[13.5px] leading-[1.55] text-ink-2 paper:text-[11.5px]">
              Upah minimum adalah batas bawah yang ditetapkan pemerintah, bukan
              potret gaji yang benar-benar dibayar. Baca warnanya sebagai
              “apakah lantai upah resmi cukup di sini”.
            </p>
          </div>
        </section>
      </div>
    </Sheet>
  );
}
