import type { ReactNode } from "react";
import type { BookletFacts } from "@/data/bookletFacts";
import { formatDate } from "@/lib/format";
import { pageLabel } from "../pages";
import { SITE_QR } from "../qr";
import { Sheet, T } from "../Sheet";

const REPO = "https://github.com/adenaufal/nafkah";

export function BackCover({ f }: { f: BookletFacts }) {
  const cite = `Nafkah, dataset ${f.datasetVersion} (${formatDate(f.generatedAt)}). nafkah.adenaufal.com — data CC BY 4.0, kode MIT.`;
  const notes: [string, ReactNode][] = [
    ["Cara mengutip", cite],
    [
      "Lisensi & atribusi",
      "Kode berlisensi MIT, data CC BY 4.0. Cantumkan atribusi, termasuk sumber asalnya: SK gubernur dan Kemnaker (upah), BPS (agregat biaya), HDX (batas wilayah). Peta dasar di aplikasi: CARTO dan Esri.",
    ],
    [
      "Kode & data terbuka",
      <>
        Semua kode dan dataset ada di{" "}
        <a href={REPO} className="font-semibold text-ink underline decoration-rule-2 underline-offset-2">
          github.com/adenaufal/nafkah
        </a>
        . Koreksi data dan saran fitur diterima di sana.
      </>,
    ],
    [
      "Kolofon",
      `Disusun otomatis dari dataset ${f.datasetVersion} oleh aplikasi Nafkah v${f.appVersion}. Huruf: Fraunces, Plus Jakarta Sans, JetBrains Mono. Dibuat dan dirawat oleh Ade Naufal.`,
    ],
  ];

  return (
    <Sheet id="penutup" bare>
      <h2 id="penutup-h" className="sr-only">
        {pageLabel("penutup")}
      </h2>
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

      <div className="mt-12 paper:mt-[40mm]">
        <p className="f-display text-balance text-[40px] font-[560] leading-[1.04] tracking-[-0.02em] text-ink paper:text-[54px]">
          Coba dengan angkamu.
        </p>
        <p className="text-pretty mt-4 text-[16px] leading-[1.55] text-ink-2 paper:max-w-[46ch] paper:text-[14px]">
          Ganti gaji, rumah tangga, hunian, atau kota asal — peta menghitung
          ulang {f.regionCount} kabupaten/kota seketika, di perangkatmu sendiri.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6 paper:mt-[12mm]">
          <svg
            viewBox={`-4 -4 ${SITE_QR.size + 8} ${SITE_QR.size + 8}`}
            role="img"
            aria-label={`Kode QR menuju ${SITE_QR.url}`}
            className="h-[34mm] w-[34mm] shrink-0"
          >
            <rect x={-4} y={-4} width={SITE_QR.size + 8} height={SITE_QR.size + 8} fill="#fff" />
            <path d={SITE_QR.path} fill="#1e1b18" shapeRendering="crispEdges" />
          </svg>
          <p>
            <span className={`${T.label} block`}>Peta interaktif</span>
            <a
              href={SITE_QR.url}
              className="f-display mt-1 block text-[26px] font-[560] text-ink underline decoration-accent decoration-2 underline-offset-[6px] paper:text-[28px]"
            >
              nafkah.adenaufal.com
            </a>
            <span className="mt-2 block text-[13px] text-muted paper:text-[11px]">
              Pindai kodenya, atau ketik alamatnya di browser.
            </span>
          </p>
        </div>
      </div>

      <dl className="mt-12 grid gap-5 border-t border-ink pt-4 paper:mt-auto paper:grid-cols-2 paper:gap-x-[8mm] paper:gap-y-[5mm]">
        {notes.map(([k, v]) => (
          <div key={k}>
            <dt className={T.label}>{k}</dt>
            <dd className="mt-1 text-[13.5px] leading-[1.5] text-ink-2 paper:text-[10.5px]">
              {v}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 border-t border-rule pt-3 text-[13px] font-semibold text-ink paper:mt-[6mm] paper:text-[11px]">
        Semua angka adalah estimasi, bukan nasihat keuangan.
      </p>
    </Sheet>
  );
}
