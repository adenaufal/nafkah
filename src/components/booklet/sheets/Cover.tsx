import type { BookletFacts } from "@/data/bookletFacts";
import { formatDate } from "@/lib/format";
import { BAND, BandBar, BandKey, IndonesiaMap } from "../figures";
import { Sheet, T } from "../Sheet";

export function Cover({ f }: { f: BookletFacts }) {
  const n = f.national;
  return (
    <Sheet id="sampul" bare>
      <div className="flex items-center justify-between gap-4 border-b-2 border-ink pb-3">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-[9px] bg-accent text-[15px] font-extrabold text-on-accent"
          >
            N
          </span>
          <span className="f-display text-[24px] font-[620] leading-none tracking-[-0.01em]">
            Nafkah
          </span>
        </div>
        <p className={T.label}>Booklet · data {f.datasetVersion}</p>
      </div>

      <h1
        id="sampul-h"
        className="mt-10 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-ink paper:mt-[20mm] paper:text-[10.5px]"
      >
        Peta kecukupan upah minimum {f.wageYear}
      </h1>
      <p className="f-display text-balance mt-4 text-[38px] font-[560] leading-[1.03] tracking-[-0.02em] text-ink paper:mt-5 paper:text-[56px]">
        {n.below > 0 ? (
          <>
            Di <span className="tnum text-accent">{n.below}</span> dari{" "}
            <span className="tnum">{f.regionCount}</span> kabupaten/kota, upah
            minimum belum menutup biaya hidup {f.noun}.
          </>
        ) : (
          <>
            Upah minimum menutup biaya hidup {f.noun} di seluruh{" "}
            <span className="tnum">{f.regionCount}</span> kabupaten/kota.
          </>
        )}
      </p>
      <p className="text-pretty mt-5 text-[16px] leading-[1.55] text-ink-2 paper:mt-7 paper:max-w-[60ch] paper:text-[14.5px]">
        Upah minimum resmi {f.wageYear} dibandingkan dengan estimasi biaya
        hidup bulanan di setiap kabupaten/kota. Booklet ini merangkum petanya:
        hasil nasional, peta per wilayah, cara menghitung, dan apa yang berubah
        bila rumah tangganya berubah.
      </p>

      {/* 8 mm from the paper edge: home printers cannot print to the edge. */}
      <figure className="-mx-5 mt-10 paper:-mx-[8mm] paper:mt-auto">
        <IndonesiaMap
          facts={f}
          counts={n.counts}
          label={`Peta Indonesia per kabupaten/kota: ${n.counts.comfortable} ${BAND.comfortable.label}, ${n.counts.manageable} ${BAND.manageable.label}, ${n.counts.tight} ${BAND.tight.label}, ${n.counts.insufficient} ${BAND.insufficient.label}.`}
        />
        <figcaption className="mx-5 mt-5 paper:mx-[8mm]">
          <BandBar counts={n.counts} className="h-2" />
          <BandKey counts={n.counts} className="mt-2.5" />
        </figcaption>
      </figure>

      <footer className="mt-10 grid gap-3 border-t border-rule pt-3 text-[12.5px] leading-[1.5] text-ink-2 paper:mt-[10mm] paper:grid-cols-[1.4fr_1fr_auto] paper:gap-6 paper:text-[10.5px]">
        <p>
          <span className={`${T.label} block`}>Profil</span>
          {f.profile}, upah kotor
        </p>
        <p>
          <span className={`${T.label} block`}>Data</span>
          Dataset {f.datasetVersion}, dirilis {formatDate(f.generatedAt)}
        </p>
        <p className="paper:text-right">
          <span className={`${T.label} block`}>Peta interaktif</span>
          <a
            href="https://nafkah.adenaufal.com"
            className="font-semibold text-ink"
          >
            nafkah.adenaufal.com
          </a>
        </p>
      </footer>
    </Sheet>
  );
}
