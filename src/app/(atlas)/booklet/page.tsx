import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { bookletFacts, type BookletFacts } from "@/data/bookletFacts";
import { methodFacts, type MethodFacts } from "@/data/buildTime";
import { BookletChrome, PrintButton } from "@/components/booklet/BookletChrome";
import { BOOKLET_PAGES, type BookletPageId } from "@/components/booklet/pages";
import { BackCover } from "@/components/booklet/sheets/BackCover";
import { Cities } from "@/components/booklet/sheets/Cities";
import { Contents } from "@/components/booklet/sheets/Contents";
import { Cover } from "@/components/booklet/sheets/Cover";
import { DataSources } from "@/components/booklet/sheets/DataSources";
import { Households } from "@/components/booklet/sheets/Households";
import { Maps } from "@/components/booklet/sheets/Maps";
import { Method } from "@/components/booklet/sheets/Method";
import { Provinces } from "@/components/booklet/sheets/Provinces";
import { Rankings } from "@/components/booklet/sheets/Rankings";
import { Summary } from "@/components/booklet/sheets/Summary";
import { UsingApp } from "@/components/booklet/sheets/UsingApp";
import { formatDate } from "@/lib/format";

/** One renderer per page; the order comes from BOOKLET_PAGES. */
const SHEETS: Record<
  BookletPageId,
  (f: BookletFacts, m: MethodFacts) => ReactNode
> = {
  sampul: (f) => <Cover f={f} />,
  isi: (f, m) => <Contents f={f} m={m} />,
  ringkasan: (f) => <Summary f={f} />,
  peta: (f) => <Maps f={f} />,
  rumus: (f) => <Method f={f} />,
  profil: (f) => <Households f={f} />,
  provinsi: (f) => <Provinces f={f} />,
  peringkat: (f) => <Rankings f={f} />,
  kota: (f) => <Cities f={f} />,
  aplikasi: (f) => <UsingApp f={f} />,
  data: (f, m) => <DataSources f={f} m={m} />,
  penutup: (f) => <BackCover f={f} />,
};

export function generateMetadata(): Metadata {
  const f = bookletFacts();
  const description = `Di ${f.national.below} dari ${f.regionCount} kabupaten/kota, upah minimum ${f.wageYear} belum menutup biaya hidup ${f.noun}. Booklet ${BOOKLET_PAGES.length} halaman A4 siap cetak: peta per wilayah, cara menghitung, profil rumah tangga, provinsi, kota besar, dan sumber datanya.`;
  return {
    title: "Booklet siap cetak",
    description,
    alternates: { canonical: "/booklet" },
    openGraph: {
      type: "article",
      url: "/booklet",
      title: "Booklet Nafkah — peta kecukupan upah minimum",
      description,
    },
  };
}

export default function BookletPage() {
  const f = bookletFacts();
  const m = methodFacts();
  return (
    <BookletChrome>
      {/* Each sheet carries its own margins: one sheet is one A4 page. */}
      <style>{"@page { size: A4 portrait; margin: 0; }"}</style>
      <main className="min-w-0 pb-16 print:p-0">
        <div className="no-print flex flex-wrap items-end justify-between gap-4 pt-8 paper:mx-auto paper:w-[210mm]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Booklet · {BOOKLET_PAGES.length} halaman A4 · data{" "}
              {f.datasetVersion}
            </p>
            <p className="text-pretty mt-2 max-w-[62ch] text-[14px] leading-[1.55] text-ink-2">
              Dihitung dari dataset yang dirilis {formatDate(f.generatedAt)}.
              Untuk PDF, pilih “Simpan sebagai PDF” dengan kertas A4, margin
              default, dan skala 100%.
            </p>
          </div>
          <PrintButton />
        </div>
        <div className="-mx-5 mt-6 paper:mx-0 paper:mt-0">
          {BOOKLET_PAGES.map((p) => (
            <Fragment key={p.id}>{SHEETS[p.id](f, m)}</Fragment>
          ))}
        </div>
      </main>
    </BookletChrome>
  );
}
